export interface HailEvent {
  community: string;
  maxHailSize: string;
  date: string;
  description: string;
}

// Historical hail data for Calgary communities
// Sources: Environment Canada, Alberta Severe Weather Management Society
const hailHistory: Record<string, HailEvent> = {
  riverbend: {
    community: "Riverbend",
    maxHailSize: "Tennis ball (6.4 cm)",
    date: "June 13, 2020",
    description: "Severe hailstorm caused widespread roof and vehicle damage.",
  },
  varsity: {
    community: "Varsity",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "August 4, 2012",
    description: "Significant hail damage across NW Calgary.",
  },
  beltline: {
    community: "Beltline",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "August 5, 2012",
    description: "Inner-city hailstorm caused extensive property damage.",
  },
  "mckenzie-towne": {
    community: "McKenzie Towne",
    maxHailSize: "Tennis ball (6.4 cm)",
    date: "June 13, 2020",
    description: "SE Calgary was one of the hardest-hit areas in the 2020 hailstorm.",
  },
  kensington: {
    community: "Kensington",
    maxHailSize: "Ping pong ball (4.0 cm)",
    date: "July 30, 2016",
    description: "Significant hail and wind event affected the inner-city area.",
  },
  "signal-hill": {
    community: "Signal Hill",
    maxHailSize: "Ping pong ball (4.0 cm)",
    date: "September 7, 2019",
    description: "Late-season hailstorm hit SW Calgary communities.",
  },
  bridgeland: {
    community: "Bridgeland",
    maxHailSize: "Walnut (3.8 cm)",
    date: "August 4, 2012",
    description: "Part of the widespread 2012 hailstorm.",
  },
  "saddle-ridge": {
    community: "Saddle Ridge",
    maxHailSize: "Tennis ball (6.4 cm)",
    date: "June 13, 2020",
    description: "NE Calgary suffered extensive damage in the 2020 storm.",
  },
  skyview: {
    community: "Skyview Ranch",
    maxHailSize: "Tennis ball (6.4 cm)",
    date: "June 13, 2020",
    description: "New community severely impacted by the 2020 hailstorm.",
  },
  copperfield: {
    community: "Copperfield",
    maxHailSize: "Tennis ball (6.4 cm)",
    date: "June 13, 2020",
    description: "SE Calgary community with major hail damage in 2020.",
  },
  cranston: {
    community: "Cranston",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "June 13, 2020",
    description: "Residential roofing heavily impacted.",
  },
  auburn: {
    community: "Auburn Bay",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "June 13, 2020",
    description: "Part of the SE Calgary hailstorm zone.",
  },
  "auburn-bay": {
    community: "Auburn Bay",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "June 13, 2020",
    description: "Part of the SE Calgary hailstorm zone.",
  },
  tuscany: {
    community: "Tuscany",
    maxHailSize: "Ping pong ball (4.0 cm)",
    date: "August 7, 2014",
    description: "NW Calgary community affected by summer hailstorm.",
  },
  panorama: {
    community: "Panorama Hills",
    maxHailSize: "Ping pong ball (4.0 cm)",
    date: "August 7, 2014",
    description: "NW Calgary community affected by summer hailstorm.",
  },
  "panorama-hills": {
    community: "Panorama Hills",
    maxHailSize: "Ping pong ball (4.0 cm)",
    date: "August 7, 2014",
    description: "NW Calgary community affected by summer hailstorm.",
  },
  nolan: {
    community: "Nolan Hill",
    maxHailSize: "Loonie (2.6 cm)",
    date: "July 30, 2016",
    description: "Newer NW community hit by widespread hail event.",
  },
  "nolan-hill": {
    community: "Nolan Hill",
    maxHailSize: "Loonie (2.6 cm)",
    date: "July 30, 2016",
    description: "Newer NW community hit by widespread hail event.",
  },
  evanston: {
    community: "Evanston",
    maxHailSize: "Loonie (2.6 cm)",
    date: "July 30, 2016",
    description: "Hail and wind event across NW Calgary.",
  },
  legacy: {
    community: "Legacy",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "June 13, 2020",
    description: "SE community impacted by the major 2020 hailstorm.",
  },
  seton: {
    community: "Seton",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "June 13, 2020",
    description: "New SE development affected by 2020 hailstorm.",
  },
  "bowness": {
    community: "Bowness",
    maxHailSize: "Quarter (2.4 cm)",
    date: "September 7, 2019",
    description: "Late-season storm produced hail across NW.",
  },
  "dover": {
    community: "Dover",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "August 4, 2012",
    description: "Part of the 2012 city-wide hail event.",
  },
};

export const getHailHistory = (communitySlug: string): HailEvent | null => {
  return hailHistory[communitySlug.toLowerCase()] || null;
};

export const defaultHailInfo: HailEvent = {
  community: "Calgary",
  maxHailSize: "Tennis ball (6.4 cm)",
  date: "June 13, 2020",
  description: "The NE Calgary hailstorm was the costliest natural disaster in Canadian history at $1.2B in insured damage.",
};

export default hailHistory;
