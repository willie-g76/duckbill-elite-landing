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
  // === Surrounding Areas (1-hour radius) ===
  okotoks: {
    community: "Okotoks",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "August 7, 2014",
    description: "Southern Alberta hailstorm caused damage in Okotoks and surrounding foothills.",
  },
  chestermere: {
    community: "Chestermere",
    maxHailSize: "Tennis ball (6.4 cm)",
    date: "June 13, 2020",
    description: "Eastern edge of the 2020 NE Calgary supercell impacted Chestermere.",
  },
  drumheller: {
    community: "Drumheller",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "July 12, 2018",
    description: "Summer severe weather brought damaging hail to the Drumheller valley.",
  },
  bearspaw: {
    community: "Bearspaw",
    maxHailSize: "Ping pong ball (4.0 cm)",
    date: "August 7, 2014",
    description: "Rural NW community affected by the 2014 hailstorm.",
  },
  // === NW Calgary ===
  "silver-springs": {
    community: "Silver Springs",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "August 4, 2012",
    description: "NW Calgary hit hard during the 2012 hailstorm.",
  },
  dalhousie: {
    community: "Dalhousie",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "August 4, 2012",
    description: "Widespread roof damage in the 2012 event.",
  },
  brentwood: {
    community: "Brentwood",
    maxHailSize: "Walnut (3.8 cm)",
    date: "August 4, 2012",
    description: "Inner NW community impacted by the 2012 hailstorm.",
  },
  "royal-oak": {
    community: "Royal Oak",
    maxHailSize: "Ping pong ball (4.0 cm)",
    date: "August 7, 2014",
    description: "NW community affected by severe summer storms.",
  },
  "rocky-ridge": {
    community: "Rocky Ridge",
    maxHailSize: "Ping pong ball (4.0 cm)",
    date: "August 7, 2014",
    description: "NW Calgary community impacted by 2014 hailstorm.",
  },
  hamptons: {
    community: "Hamptons",
    maxHailSize: "Loonie (2.6 cm)",
    date: "July 30, 2016",
    description: "Part of the NW Calgary hail corridor in 2016.",
  },
  edgemont: {
    community: "Edgemont",
    maxHailSize: "Loonie (2.6 cm)",
    date: "July 30, 2016",
    description: "NW community affected by widespread hail event.",
  },
  "country-hills": {
    community: "Country Hills",
    maxHailSize: "Ping pong ball (4.0 cm)",
    date: "August 7, 2014",
    description: "Northern Calgary community hit by the 2014 storm.",
  },
  // === NE Calgary ===
  "martindale": {
    community: "Martindale",
    maxHailSize: "Tennis ball (6.4 cm)",
    date: "June 13, 2020",
    description: "One of the hardest-hit NE communities in the 2020 hailstorm.",
  },
  taradale: {
    community: "Taradale",
    maxHailSize: "Tennis ball (6.4 cm)",
    date: "June 13, 2020",
    description: "NE Calgary community with severe 2020 hail damage.",
  },
  falconridge: {
    community: "Falconridge",
    maxHailSize: "Tennis ball (6.4 cm)",
    date: "June 13, 2020",
    description: "Extensive roof and siding damage from the 2020 supercell.",
  },
  "coral-springs": {
    community: "Coral Springs",
    maxHailSize: "Tennis ball (6.4 cm)",
    date: "June 13, 2020",
    description: "NE Calgary neighbourhood severely damaged in 2020.",
  },
  castleridge: {
    community: "Castleridge",
    maxHailSize: "Tennis ball (6.4 cm)",
    date: "June 13, 2020",
    description: "Part of the NE Calgary hailstorm damage zone.",
  },
  monterey: {
    community: "Monterey Park",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "June 13, 2020",
    description: "NE community impacted by the 2020 hailstorm.",
  },
  "monterey-park": {
    community: "Monterey Park",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "June 13, 2020",
    description: "NE community impacted by the 2020 hailstorm.",
  },
  // === SE Calgary ===
  "new-brighton": {
    community: "New Brighton",
    maxHailSize: "Tennis ball (6.4 cm)",
    date: "June 13, 2020",
    description: "SE community severely impacted by the 2020 hailstorm.",
  },
  "mckenzie-lake": {
    community: "McKenzie Lake",
    maxHailSize: "Tennis ball (6.4 cm)",
    date: "June 13, 2020",
    description: "Significant roof damage in the 2020 storm.",
  },
  douglasdale: {
    community: "Douglasdale",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "June 13, 2020",
    description: "SE Calgary community hit by the 2020 hailstorm.",
  },
  "lake-bonavista": {
    community: "Lake Bonavista",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "June 13, 2020",
    description: "Established SE community with extensive 2020 damage.",
  },
  mahogany: {
    community: "Mahogany",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "June 13, 2020",
    description: "SE lake community affected by the 2020 hailstorm.",
  },
  walden: {
    community: "Walden",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "June 13, 2020",
    description: "SE community within the 2020 hailstorm path.",
  },
  chaparral: {
    community: "Chaparral",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "June 13, 2020",
    description: "SE Calgary lake community damaged in 2020.",
  },
  // === SW Calgary ===
  "aspen-woods": {
    community: "Aspen Woods",
    maxHailSize: "Ping pong ball (4.0 cm)",
    date: "September 7, 2019",
    description: "SW community impacted by late-season hailstorm.",
  },
  "springbank-hill": {
    community: "Springbank Hill",
    maxHailSize: "Ping pong ball (4.0 cm)",
    date: "September 7, 2019",
    description: "SW Calgary community affected by the 2019 storm.",
  },
  "west-springs": {
    community: "West Springs",
    maxHailSize: "Ping pong ball (4.0 cm)",
    date: "September 7, 2019",
    description: "SW hailstorm caused roof damage across the area.",
  },
  "coach-hill": {
    community: "Coach Hill",
    maxHailSize: "Quarter (2.4 cm)",
    date: "September 7, 2019",
    description: "SW community affected by the late-season storm.",
  },
  lakeview: {
    community: "Lakeview",
    maxHailSize: "Walnut (3.8 cm)",
    date: "August 4, 2012",
    description: "Inner SW community hit during the 2012 hailstorm.",
  },
  // === Inner City ===
  "mission": {
    community: "Mission",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "August 5, 2012",
    description: "Inner-city hailstorm caused condo and vehicle damage.",
  },
  "eau-claire": {
    community: "Eau Claire",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "August 5, 2012",
    description: "Downtown-adjacent community hit in the 2012 storm.",
  },
  inglewood: {
    community: "Inglewood",
    maxHailSize: "Walnut (3.8 cm)",
    date: "August 4, 2012",
    description: "Historic inner-city neighbourhood affected by 2012 hail.",
  },
  ramsay: {
    community: "Ramsay",
    maxHailSize: "Walnut (3.8 cm)",
    date: "August 4, 2012",
    description: "Heritage homes suffered hail damage in the 2012 storm.",
  },
  sunnyside: {
    community: "Sunnyside",
    maxHailSize: "Walnut (3.8 cm)",
    date: "August 4, 2012",
    description: "Inner-city community impacted by the 2012 hailstorm.",
  },
  hillhurst: {
    community: "Hillhurst",
    maxHailSize: "Walnut (3.8 cm)",
    date: "August 4, 2012",
    description: "Adjacent to Kensington, affected by the 2012 storm.",
  },
  "mount-pleasant": {
    community: "Mount Pleasant",
    maxHailSize: "Walnut (3.8 cm)",
    date: "August 4, 2012",
    description: "Inner NW community affected by the 2012 hailstorm.",
  },
  // === South Calgary ===
  "shawnessy": {
    community: "Shawnessy",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "June 13, 2020",
    description: "South Calgary community within the 2020 hailstorm path.",
  },
  "sundance": {
    community: "Sundance",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "June 13, 2020",
    description: "South Calgary lake community damaged in 2020.",
  },
  midnapore: {
    community: "Midnapore",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "June 13, 2020",
    description: "Established south community impacted by the 2020 storm.",
  },
  "evergreen": {
    community: "Evergreen",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "June 13, 2020",
    description: "SW community affected by the 2020 hailstorm.",
  },
  "somerset": {
    community: "Somerset",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "June 13, 2020",
    description: "South Calgary community hit by 2020 hail.",
  },
  "bridlewood": {
    community: "Bridlewood",
    maxHailSize: "Golf ball (4.4 cm)",
    date: "June 13, 2020",
    description: "SW community impacted by the 2020 hailstorm.",
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
