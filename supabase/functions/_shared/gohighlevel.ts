const GHL_BASE_URL = "https://services.leadconnectorhq.com";
const GHL_API_KEY = Deno.env.get("GHL_API_KEY") || "";
const GHL_LOCATION_ID = Deno.env.get("GHL_LOCATION_ID") || "";

const headers = {
  Authorization: `Bearer ${GHL_API_KEY}`,
  Version: "2021-07-28",
  "Content-Type": "application/json",
  Accept: "application/json",
};

export interface GHLContactPayload {
  firstName: string;
  lastName?: string;
  email?: string;
  phone: string;
  address1?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  source?: string;
  tags?: string[];
}

export interface GHLContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tags: string[];
}

export interface GHLOpportunityPayload {
  pipelineId: string;
  pipelineStageId: string;
  contactId: string;
  name: string;
  status: "open" | "won" | "lost" | "abandoned";
  source?: string;
}

/**
 * Create or update a contact in GoHighLevel.
 * GHL deduplicates by email/phone, so upsert is safe.
 */
export async function createContact(
  contact: GHLContactPayload
): Promise<GHLContact> {
  const res = await fetch(`${GHL_BASE_URL}/contacts/`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      locationId: GHL_LOCATION_ID,
      ...contact,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GHL create contact failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.contact;
}

/**
 * Create an opportunity (deal) in a GHL pipeline.
 */
export async function createOpportunity(
  opp: GHLOpportunityPayload
): Promise<{ id: string }> {
  const res = await fetch(`${GHL_BASE_URL}/opportunities/`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      locationId: GHL_LOCATION_ID,
      ...opp,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GHL create opportunity failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.opportunity || data;
}

/**
 * Build the community tag name from a community string.
 * e.g. "North Haven" -> "community - north haven"
 */
export function communityTag(community: string): string {
  return `community - ${community.toLowerCase()}`;
}

export { GHL_LOCATION_ID };
