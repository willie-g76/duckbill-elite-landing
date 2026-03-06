/**
 * Calgary zone groupings based on Forward Sortation Areas (first 3 chars of postal code).
 *
 * Calgary postal codes are T1Y, T1Z, T2A–T2Z, T3A–T3R.
 * This is a rough mapping — good enough for clustering estimates.
 */

export type CalgaryZone = "NW" | "NE" | "SW" | "SE" | "South" | "Central";

// FSA → Zone lookup
const fsaZoneMap: Record<string, CalgaryZone> = {
  // Northwest
  T2K: "NW", T2L: "NW", T2M: "NW", T2N: "NW",
  T3A: "NW", T3B: "NW", T3G: "NW", T3L: "NW", T3R: "NW",

  // Northeast
  T1Y: "NE", T1Z: "NE",
  T2A: "NE", T2E: "NE",
  T3J: "NE", T3K: "NE", T3N: "NE",

  // Southwest
  T2S: "SW", T2T: "SW", T2V: "SW", T2W: "SW",
  T3C: "SW", T3E: "SW",

  // Southeast
  T2B: "SE", T2C: "SE", T2G: "SE", T2H: "SE", T2J: "SE",
  T2Z: "SE",

  // South (Airdrie, Okotoks, etc.)
  T3H: "South", T3M: "South",
  T2X: "South", T2Y: "South",

  // Central / Downtown
  T2P: "Central", T2R: "Central",
};

/**
 * Get the Calgary zone for a postal code.
 * Returns null if the postal code is outside Calgary.
 */
export function getZone(postalCode: string | null | undefined): CalgaryZone | null {
  if (!postalCode) return null;
  const fsa = postalCode.replace(/\s/g, "").substring(0, 3).toUpperCase();
  return fsaZoneMap[fsa] || null;
}

/**
 * Check if two postal codes are in the same zone (good for clustering).
 */
export function isSameZone(a: string | null | undefined, b: string | null | undefined): boolean {
  const za = getZone(a);
  const zb = getZone(b);
  if (!za || !zb) return false;
  return za === zb;
}

/**
 * Check if two postal codes share the same FSA prefix (very close together).
 */
export function isSameFSA(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  const fa = a.replace(/\s/g, "").substring(0, 3).toUpperCase();
  const fb = b.replace(/\s/g, "").substring(0, 3).toUpperCase();
  return fa === fb;
}
