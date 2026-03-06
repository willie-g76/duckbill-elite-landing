import { SignJWT, importPKCS8 } from "https://deno.land/x/jose@v5.2.2/index.ts";

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
  token_uri: string;
}

interface FreeBusyTimeSlot {
  start: string;
  end: string;
}

interface FreeBusyResponse {
  calendars: Record<string, { busy: FreeBusyTimeSlot[]; errors?: unknown[] }>;
}

interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees?: { email: string; displayName?: string }[];
}

// Cache access tokens per impersonated user (they last 1 hour)
const tokenCache = new Map<string, { token: string; expiresAt: number }>();

function getServiceAccountKey(): ServiceAccountKey {
  const raw = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY not configured");
  return JSON.parse(raw);
}

/**
 * Get an OAuth2 access token by signing a JWT with the service account key,
 * then exchanging it via Google's token endpoint.
 * Uses domain-wide delegation to impersonate the given user.
 */
async function getAccessToken(impersonateEmail: string): Promise<string> {
  const cached = tokenCache.get(impersonateEmail);
  if (cached && cached.expiresAt > Date.now() + 60_000) {
    return cached.token;
  }

  const sa = getServiceAccountKey();
  const privateKey = await importPKCS8(sa.private_key, "RS256");

  const now = Math.floor(Date.now() / 1000);
  const jwt = await new SignJWT({
    iss: sa.client_email,
    sub: impersonateEmail,
    scope:
      "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events",
    aud: sa.token_uri,
    iat: now,
    exp: now + 3600,
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .sign(privateKey);

  const res = await fetch(sa.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google token exchange failed for ${impersonateEmail}: ${err}`);
  }

  const data = await res.json();
  tokenCache.set(impersonateEmail, {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  });

  return data.access_token;
}

/**
 * Query Google Calendar FreeBusy API for multiple calendars.
 */
export async function queryFreeBusy(
  calendarIds: string[],
  timeMin: string,
  timeMax: string,
  impersonateEmail: string
): Promise<FreeBusyResponse> {
  const token = await getAccessToken(impersonateEmail);

  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/freeBusy",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeMin,
        timeMax,
        timeZone: "America/Edmonton",
        items: calendarIds.map((id) => ({ id })),
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`FreeBusy query failed: ${err}`);
  }

  return res.json();
}

/**
 * Create a calendar event on a user's calendar via domain-wide delegation.
 */
export async function createCalendarEvent(
  calendarId: string,
  event: CalendarEvent
): Promise<CalendarEvent & { id: string; htmlLink: string }> {
  const token = await getAccessToken(calendarId);

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Create event failed: ${err}`);
  }

  return res.json();
}

/**
 * Delete a calendar event.
 */
export async function deleteCalendarEvent(
  calendarId: string,
  eventId: string
): Promise<void> {
  const token = await getAccessToken(calendarId);

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok && res.status !== 404) {
    const err = await res.text();
    throw new Error(`Delete event failed: ${err}`);
  }
}
