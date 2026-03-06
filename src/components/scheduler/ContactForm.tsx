import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AddressAutocomplete, { type AddressComponents } from "@/components/AddressAutocomplete";
import type { ContactInfo } from "@/hooks/use-scheduler";

interface ContactFormProps {
  onSubmit: (info: ContactInfo) => void;
  defaultValues?: ContactInfo | null;
}

export default function ContactForm({ onSubmit, defaultValues }: ContactFormProps) {
  const [addressComponents, setAddressComponents] = useState<AddressComponents | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const fullName = (fd.get("name") as string).trim();
    const nameParts = fullName.split(/\s+/);

    onSubmit({
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      email: (fd.get("email") as string) || "",
      phone: (fd.get("phone") as string) || "",
      address: addressComponents?.fullAddress || (fd.get("address") as string) || "",
      postalCode: addressComponents?.postalCode || "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="John Smith"
          autoComplete="name"
          required
          defaultValue={defaultValues ? `${defaultValues.firstName} ${defaultValues.lastName}`.trim() : ""}
          className="h-12 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone *</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          placeholder="(403) 555-1234"
          autoComplete="tel"
          required
          defaultValue={defaultValues?.phone}
          className="h-12 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          placeholder="john@example.com"
          autoComplete="email"
          defaultValue={defaultValues?.email}
          className="h-12 text-base"
        />
        <p className="text-xs text-muted-foreground">For booking confirmation and calendar invite</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <AddressAutocomplete
          id="address"
          name="address"
          placeholder="Start typing your address..."
          required
          className="h-12 text-base"
          defaultValue={defaultValues?.address}
          onAddressParsed={setAddressComponents}
        />
        <p className="text-xs text-muted-foreground">We use this to find available times in your area</p>
      </div>

      <Button type="submit" variant="cta" size="xl" className="w-full">
        FIND AVAILABLE TIMES
      </Button>
    </form>
  );
}
