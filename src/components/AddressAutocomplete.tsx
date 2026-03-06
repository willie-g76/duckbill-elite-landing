import { useEffect, useRef, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { cn } from "@/lib/utils";

// Load the Google Maps script once globally
let scriptLoadPromise: Promise<void> | null = null;

function loadGoogleMapsScript(): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise;
  if (window.google?.maps?.places) return Promise.resolve();

  scriptLoadPromise = new Promise((resolve, reject) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn("VITE_GOOGLE_MAPS_API_KEY not set — address autocomplete disabled");
      reject(new Error("No API key"));
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

export interface AddressComponents {
  fullAddress: string;
  streetAddress: string;
  city: string;
  province: string;
  postalCode: string;
}

interface AddressAutocompleteProps {
  id?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  defaultValue?: string;
  onAddressSelect?: (address: string) => void;
  onAddressParsed?: (components: AddressComponents) => void;
}

export default function AddressAutocomplete({
  id,
  name = "address",
  placeholder = "Start typing your address…",
  required,
  className,
  defaultValue,
  onAddressSelect,
  onAddressParsed,
}: AddressAutocompleteProps) {
  const [scriptLoaded, setScriptLoaded] = useState(
    !!window.google?.maps?.places
  );
  const listboxRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => setScriptLoaded(true))
      .catch(() => {});
  }, []);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    initOnMount: scriptLoaded,
    requestOptions: {
      componentRestrictions: { country: "ca" },
    },
    defaultValue: defaultValue || "",
    debounce: 250,
  });

  const handleSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();
    onAddressSelect?.(description);

    if (onAddressParsed) {
      try {
        const results = await getGeocode({ address: description });
        const place = results[0];
        const get = (type: string) =>
          place.address_components.find((c: any) => c.types.includes(type))?.long_name || "";
        const getShort = (type: string) =>
          place.address_components.find((c: any) => c.types.includes(type))?.short_name || "";

        onAddressParsed({
          fullAddress: place.formatted_address,
          streetAddress: `${get("street_number")} ${get("route")}`.trim(),
          city: get("locality") || get("sublocality") || get("administrative_area_level_3") || "",
          province: getShort("administrative_area_level_1"),
          postalCode: get("postal_code"),
        });
      } catch (err) {
        console.error("Failed to parse address components:", err);
      }
    }
  };

  // Fallback to plain input if script fails to load
  if (!scriptLoaded) {
    return (
      <input
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        autoComplete="street-address"
        defaultValue={defaultValue}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
      />
    );
  }

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        disabled={!ready}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
      />

      {status === "OK" && data.length > 0 && (
        <ul
          ref={listboxRef}
          className="absolute z-50 mt-1 w-full rounded-md border border-input bg-background shadow-lg max-h-60 overflow-auto"
        >
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              className="cursor-pointer px-3 py-2.5 text-sm hover:bg-secondary transition-colors"
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
