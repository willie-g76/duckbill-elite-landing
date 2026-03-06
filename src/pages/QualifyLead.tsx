import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, Loader2 } from "lucide-react";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import type { AddressComponents } from "@/components/AddressAutocomplete";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const ROOF_TYPES = [
  { value: "", label: "Select roof type..." },
  { value: "asphalt", label: "Asphalt Shingles" },
  { value: "flat", label: "Flat Roof" },
  { value: "metal", label: "Metal Roof" },
  { value: "shake", label: "Shake" },
  { value: "other", label: "Other" },
];

const PROJECT_TYPES = [
  { value: "", label: "Select project type..." },
  { value: "reroof", label: "Re-Roof" },
  { value: "repair", label: "Repair" },
  { value: "other", label: "Other" },
];

// Generate month + week options for the "hoped completion" scroller
const WEEKS = [
  { suffix: "-w1", label: "1st week" },
  { suffix: "-w2", label: "2nd week" },
  { suffix: "-w3", label: "3rd week" },
  { suffix: "-w4", label: "Last week" },
];

function getCompletionOptions() {
  const options: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 18; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const monthLabel = d.toLocaleDateString("en-CA", { month: "long", year: "numeric" });
    for (const w of WEEKS) {
      options.push({
        value: `${monthKey}${w.suffix}`,
        label: `${w.label} of ${monthLabel}`,
      });
    }
  }
  return options;
}

const COMPLETION_OPTIONS = getCompletionOptions();

const WEEK_SHADES = ["bg-white", "bg-gray-50", "bg-gray-100", "bg-gray-200"];

function CompletionPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel = value === "asap"
    ? "ASAP"
    : COMPLETION_OPTIONS.find((o) => o.value === value)?.label || "Select timeframe...";

  // Group options by month for headers
  let lastMonth = "";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>{selectedLabel}</span>
        <span className="text-muted-foreground text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-72 overflow-auto rounded-lg border border-input bg-white shadow-lg">
          {/* ASAP */}
          <div
            onClick={() => { onChange("asap"); setOpen(false); }}
            className={`px-3 py-3 text-sm font-bold cursor-pointer hover:bg-[#f5a623]/20 border-b border-gray-200 ${value === "asap" ? "bg-[#f5a623]/10 text-[#1a1a2e]" : ""}`}
          >
            ⚡ ASAP
          </div>

          {COMPLETION_OPTIONS.map((opt) => {
            const monthKey = opt.value.substring(0, 7);
            const weekNum = parseInt(opt.value.slice(-1)) - 1;
            const shade = WEEK_SHADES[weekNum] || "bg-white";
            const showHeader = monthKey !== lastMonth;
            if (showHeader) lastMonth = monthKey;

            const d = new Date(parseInt(monthKey.split("-")[0]), parseInt(monthKey.split("-")[1]) - 1, 1);
            const monthLabel = d.toLocaleDateString("en-CA", { month: "long", year: "numeric" });

            return (
              <div key={opt.value}>
                {showHeader && (
                  <div className="px-3 py-2 text-xs font-bold text-[#1a1a2e] bg-gray-300/50 uppercase tracking-wider sticky top-0">
                    {monthLabel}
                  </div>
                )}
                <div
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-[#f5a623]/20 transition-colors ${shade} ${value === opt.value ? "!bg-[#f5a623]/20 font-semibold" : ""}`}
                >
                  {WEEKS[weekNum].label}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const QualifyLead = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    street_address: "",
    city: "Calgary",
    province: "AB",
    postal_code: "",
    phone: "",
    email: "",
    preferred_date: "",
    preferred_time: "",
    roof_type: "",
    roof_type_other: "",
    project_type: "",
    project_type_other: "",
    target_completion: "",
  });

  useEffect(() => {
    if (!id) return;
    fetch(`${SUPABASE_URL}/functions/v1/get-lead?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setForm((prev) => ({
          ...prev,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          street_address: data.street_address || data.address || "",
          city: data.city || "Calgary",
          province: data.province || "AB",
          postal_code: data.postal_code || "",
          phone: data.phone || "",
          email: data.email || "",
          preferred_date: data.preferred_date || "",
          preferred_time: data.preferred_time || "",
          roof_type: data.roof_type || "",
          roof_type_other: data.roof_type_other || "",
          project_type: data.project_type || "",
          project_type_other: data.project_type_other || "",
          target_completion: data.target_completion || "",
        }));
        if (data.qualified_at) setSaved(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleAddressParsed = (components: AddressComponents) => {
    setForm((prev) => ({
      ...prev,
      street_address: components.streetAddress,
      city: components.city || prev.city,
      province: components.province || prev.province,
      postal_code: components.postalCode || prev.postal_code,
    }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/update-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSaved(true);
      toast({ title: "Lead qualified!", description: "Details saved successfully." });
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Lead not found.</p>
      </div>
    );
  }

  const selectClass = "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <>
      <Helmet>
        <title>Qualify Lead | Duckbill Roofing</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-[#1a1a2e] text-white px-4 py-4 sticky top-0 z-10">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-[#f5a623]">Duckbill Roofing</h1>
              <p className="text-sm text-gray-300">Lead Qualification</p>
            </div>
            {saved && (
              <span className="flex items-center gap-1 text-green-400 text-sm font-medium">
                <Check className="h-4 w-4" /> Saved
              </span>
            )}
          </div>
        </div>

        {/* Lead name banner */}
        <div className="bg-white border-b px-4 py-3">
          <div className="max-w-lg mx-auto">
            <p className="text-xl font-bold text-[#1a1a2e]">
              {form.first_name} {form.last_name}
            </p>
            <p className="text-sm text-gray-500">{form.phone}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-lg mx-auto px-4 py-6 space-y-5">
          {/* Contact Info */}
          <fieldset className="bg-white rounded-xl p-5 shadow-sm space-y-4">
            <legend className="text-xs font-semibold text-[#1a1a2e] uppercase tracking-wider">Contact</legend>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="first_name" className="text-xs text-gray-500">First Name</Label>
                <Input id="first_name" value={form.first_name} onChange={(e) => update("first_name", e.target.value)} className="h-11" />
              </div>
              <div>
                <Label htmlFor="last_name" className="text-xs text-gray-500">Last Name</Label>
                <Input id="last_name" value={form.last_name} onChange={(e) => update("last_name", e.target.value)} className="h-11" />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-xs text-gray-500">Phone</Label>
              <Input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="h-11" />
            </div>

            <div>
              <Label htmlFor="email" className="text-xs text-gray-500">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="h-11" />
            </div>
          </fieldset>

          {/* Address */}
          <fieldset className="bg-white rounded-xl p-5 shadow-sm space-y-4">
            <legend className="text-xs font-semibold text-[#1a1a2e] uppercase tracking-wider">Address</legend>

            <div>
              <Label htmlFor="street_address" className="text-xs text-gray-500">Street Address</Label>
              <AddressAutocomplete
                id="street_address"
                name="street_address"
                placeholder="Start typing address..."
                defaultValue={form.street_address}
                onAddressParsed={handleAddressParsed}
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="city" className="text-xs text-gray-500">City</Label>
                <Input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} className="h-11" />
              </div>
              <div>
                <Label htmlFor="province" className="text-xs text-gray-500">Province</Label>
                <Input id="province" value={form.province} onChange={(e) => update("province", e.target.value)} className="h-11" />
              </div>
              <div>
                <Label htmlFor="postal_code" className="text-xs text-gray-500">Postal Code</Label>
                <Input id="postal_code" value={form.postal_code} onChange={(e) => update("postal_code", e.target.value)} placeholder="T2X 1A1" className="h-11" />
              </div>
            </div>
          </fieldset>

          {/* Project Details */}
          <fieldset className="bg-white rounded-xl p-5 shadow-sm space-y-4">
            <legend className="text-xs font-semibold text-[#1a1a2e] uppercase tracking-wider">Project Details</legend>

            <div>
              <Label htmlFor="project_type" className="text-xs text-gray-500">Type of Project</Label>
              <select id="project_type" value={form.project_type} onChange={(e) => update("project_type", e.target.value)} className={selectClass}>
                {PROJECT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            {form.project_type === "other" && (
              <div>
                <Label htmlFor="project_type_other" className="text-xs text-gray-500">Please specify</Label>
                <Input id="project_type_other" value={form.project_type_other} onChange={(e) => update("project_type_other", e.target.value)} placeholder="Describe the project..." className="h-11" />
              </div>
            )}

            <div>
              <Label htmlFor="roof_type" className="text-xs text-gray-500">Type of Roof</Label>
              <select id="roof_type" value={form.roof_type} onChange={(e) => update("roof_type", e.target.value)} className={selectClass}>
                {ROOF_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            {form.roof_type === "other" && (
              <div>
                <Label htmlFor="roof_type_other" className="text-xs text-gray-500">Please specify</Label>
                <Input id="roof_type_other" value={form.roof_type_other} onChange={(e) => update("roof_type_other", e.target.value)} placeholder="Describe the roof type..." className="h-11" />
              </div>
            )}

            <div>
              <Label htmlFor="target_completion" className="text-xs text-gray-500">When does the client want the work done?</Label>
              <CompletionPicker value={form.target_completion} onChange={(v) => update("target_completion", v)} />
            </div>
          </fieldset>

          {/* Scheduling */}
          <fieldset className="bg-white rounded-xl p-5 shadow-sm space-y-4">
            <legend className="text-xs font-semibold text-[#1a1a2e] uppercase tracking-wider">Quote Appointment</legend>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="preferred_date" className="text-xs text-gray-500">Preferred Date</Label>
                <Input id="preferred_date" type="date" value={form.preferred_date} onChange={(e) => update("preferred_date", e.target.value)} className="h-11" />
              </div>
              <div>
                <Label htmlFor="preferred_time" className="text-xs text-gray-500">Preferred Time</Label>
                <Input id="preferred_time" type="time" value={form.preferred_time} onChange={(e) => update("preferred_time", e.target.value)} className="h-11" />
              </div>
            </div>
          </fieldset>

          {/* Submit */}
          <Button
            type="submit"
            disabled={saving}
            className="w-full h-14 text-base font-bold bg-[#f5a623] hover:bg-[#e09510] text-[#1a1a2e] rounded-xl shadow-md"
          >
            {saving ? (
              <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Saving...</>
            ) : saved ? (
              <><Check className="h-5 w-5 mr-2" /> Saved — Update Again</>
            ) : (
              "Save Lead Details"
            )}
          </Button>

          <div className="h-8" />
        </form>
      </div>
    </>
  );
};

export default QualifyLead;
