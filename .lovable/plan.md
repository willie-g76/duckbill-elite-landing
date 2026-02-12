

## Plan Overview

Three changes: add a Booking page, fix all phone/email links, and update the brand color palette.

---

## 1. Booking Page

Create a new **Book a Quote** page (`src/pages/Booking.tsx`) where clients can select a date and time to schedule an in-person quote visit.

**Features:**
- Date picker using the Shadcn Calendar/Popover component
- Time slot selection (morning, afternoon, evening options)
- Contact info fields (name, phone, email, address)
- Service type selector (same options as Estimate page)
- Confirmation state after submission
- Sidebar with contact info and trust badges (consistent with Estimate page)

**Routing:**
- Add `/booking` route in `App.tsx`
- Add "Book a Quote" link to the Header navigation and footer quick links

---

## 2. Fix All Phone Numbers and Emails

Update every `tel:` and `mailto:` link and displayed text across the site to use the correct contact info:

- **Phone:** `tel:+14032006621` / displayed as `(403) 200-6621`
- **Email:** `mailto:info@duckbillroofing.com` / displayed as `info@duckbillroofing.com`

**Files to update:**
- `src/components/Header.tsx` -- line 70: fix `tel:+14035551234` to `tel:+14032006621`
- `src/components/CTASection.tsx` -- line 35: fix `tel:+14035551234`
- `src/components/Footer.tsx` -- line 48: fix `.ca` to `.com` in email
- `src/pages/Estimate.tsx` -- line 184: fix `tel:+14035551234`; line 188-190: fix `.ca` to `.com`
- `src/pages/ServiceAreas.tsx` -- line 248: fix `tel:+14035551234`

---

## 3. Update Brand Color Palette

Update `src/index.css` CSS custom properties and `tailwind.config.ts` to incorporate the new Duckbill brand tokens:

| Token | Hex | Usage |
|---|---|---|
| `duckbill-background` | `#616161` | Medium gray |
| `duckbill-duck` | `#3E3C39` | Dark charcoal (replaces current charcoal) |
| `duckbill-accent` | `#B9B2A7` | Light taupe |
| `duckbill-textPrimary` | `#313131` | Heavy text |
| `duckbill-textSecondary` | `#4D4D4D` | Light text |

These will be added as extended Tailwind colors in `tailwind.config.ts` under a `duckbill` namespace, and the core CSS variables (`--charcoal`, `--foreground`, `--primary`, `--muted-foreground`) will be adjusted to align with the new palette values.

---

## Technical Details

### New file
- `src/pages/Booking.tsx` -- Calendar-based scheduling form using `Calendar`, `Popover`, `Select`, `Input`, `Button` components already in the project

### Modified files
- `src/App.tsx` -- Add `/booking` route
- `src/components/Header.tsx` -- Add nav link + fix phone href
- `src/components/Footer.tsx` -- Add quick link + fix email
- `src/components/CTASection.tsx` -- Fix phone href
- `src/pages/Estimate.tsx` -- Fix phone href + email
- `src/pages/ServiceAreas.tsx` -- Fix phone href
- `src/index.css` -- Update CSS variables for new palette
- `tailwind.config.ts` -- Add `duckbill` color namespace

