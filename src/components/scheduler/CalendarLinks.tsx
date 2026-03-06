interface CalendarLinksProps {
  title: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
}

function formatICSDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function buildGoogleCalUrl(props: CalendarLinksProps): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: props.title,
    dates: `${formatICSDate(new Date(props.start))}/${formatICSDate(new Date(props.end))}`,
    location: props.location || "",
    details: props.description || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildICSBlob(props: CalendarLinksProps): string {
  const now = formatICSDate(new Date());
  const uid = `booking-${Date.now()}@duckbillroofing.ca`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Duckbill Roofing//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatICSDate(new Date(props.start))}`,
    `DTEND:${formatICSDate(new Date(props.end))}`,
    `SUMMARY:${props.title}`,
    props.description ? `DESCRIPTION:${props.description.replace(/\n/g, "\\n")}` : "",
    props.location ? `LOCATION:${props.location}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\r\n");
}

export default function CalendarLinks(props: CalendarLinksProps) {
  const googleUrl = buildGoogleCalUrl(props);

  const downloadICS = () => {
    const content = buildICSBlob(props);
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roofing-appointment.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-border px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M19.5 22h-15A2.5 2.5 0 0 1 2 19.5v-15A2.5 2.5 0 0 1 4.5 2H8v2H4.5a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5V16h2v3.5a2.5 2.5 0 0 1-2.5 2.5zM18 2h-4V0h4a4 4 0 0 1 4 4v4h-2V4a2 2 0 0 0-2-2z" />
          <path d="M8 10h8v2H8zm0 4h5v2H8z" />
        </svg>
        Google Calendar
      </a>

      <button
        onClick={downloadICS}
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-border px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M12 16l-5-5 1.41-1.41L11 12.17V4h2v8.17l2.59-2.58L17 11l-5 5z" />
          <path d="M20 18H4v-2h16v2z" />
        </svg>
        Download .ics
      </button>
    </div>
  );
}
