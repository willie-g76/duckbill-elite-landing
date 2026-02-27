export interface NeighbourhoodData {
  name: string;
  slug: string;
  description: string;
  highlights: string[];
  quadrant: string;
  lat: number;
  lng: number;
}

const neighbourhoods: NeighbourhoodData[] = [
  {
    name: "North Haven",
    slug: "north-haven",
    description:
      "North Haven is a well-established neighbourhood in Calgary's north end, known for its mature trees and mid-century homes. Many roofs in this community are reaching the end of their lifespan, making proactive inspection and replacement essential to protect your home from Alberta's severe weather.",
    highlights: [
      "Experienced with re-roofing older North Haven homes built in the 1950s–70s",
      "Hail damage inspections and insurance claim support",
      "Close proximity — fast response times from our Calgary base",
      "Free on-site estimates for North Haven homeowners",
    ],
    quadrant: "N",
    lat: 51.1085,
    lng: -114.1004,
  },
  {
    name: "Thorncliffe",
    slug: "thorncliffe",
    description:
      "Thorncliffe is a mature NE Calgary community nestled along Nose Hill Park, with homes dating back to the 1950s and 60s. The neighbourhood's aging rooflines and exposure to Calgary's hail corridor make regular roof maintenance and timely replacement critical for homeowners here.",
    highlights: [
      "Specialists in replacing aging roofs on Thorncliffe's mid-century homes",
      "NE Calgary hail damage repair and insurance claims",
      "Serving Thorncliffe, Highland Park, and surrounding communities",
      "Red Seal certified crew with 5-year workmanship warranty",
    ],
    quadrant: "NE",
    lat: 51.1000,
    lng: -114.0780,
  },
  {
    name: "MacEwan Glen",
    slug: "macewan-glen",
    description:
      "MacEwan Glen is a family-friendly NE Calgary community developed in the 1980s and 90s. With many original roofs now decades old, homeowners are proactively upgrading to modern impact-resistant shingles to guard against Calgary's increasingly frequent hailstorms.",
    highlights: [
      "Roof replacement specialists for 1980s–90s era MacEwan Glen homes",
      "Upgrade to impact-resistant shingles rated for Calgary hail",
      "Thorough inspections with detailed photo reports",
      "Trusted by NE Calgary homeowners — BBB A rated",
    ],
    quadrant: "NE",
    lat: 51.1195,
    lng: -114.0415,
  },
  {
    name: "McKenzie Towne",
    slug: "mckenzie-towne",
    description:
      "McKenzie Towne is one of SE Calgary's most popular master-planned communities, known for its charming streetscapes and active town centre. Hit hard by the June 2020 hailstorm, many homes here required full roof replacements — and Duckbill has been a trusted partner throughout the recovery.",
    highlights: [
      "Proven track record repairing 2020 hailstorm damage in McKenzie Towne",
      "Insurance claim specialists — we handle the paperwork",
      "Premium shingle options that complement McKenzie Towne's architectural style",
      "Fast, reliable service with a 5-year workmanship guarantee",
    ],
    quadrant: "SE",
    lat: 50.9125,
    lng: -113.9575,
  },
  {
    name: "Cranston",
    slug: "cranston",
    description:
      "Cranston is a vibrant SE Calgary community along the banks of the Bow River, featuring a mix of single-family homes and townhouses. The 2020 hailstorm caused widespread roof damage across Cranston, and many homeowners continue to discover hidden damage during routine inspections.",
    highlights: [
      "Cranston hail damage experts — fully equipped for insurance restorations",
      "Experienced with all Cranston home styles, from townhomes to estate lots",
      "Free hail damage inspections for Cranston residents",
      "24/7 emergency storm response in SE Calgary",
    ],
    quadrant: "SE",
    lat: 50.9000,
    lng: -114.0125,
  },
  {
    name: "Auburn Bay",
    slug: "auburn-bay",
    description:
      "Auburn Bay is a sought-after lake community in SE Calgary where families enjoy resort-style living year-round. Impacted by the 2020 hailstorm, Auburn Bay homeowners understand the importance of a strong, well-maintained roof to protect their investment.",
    highlights: [
      "Auburn Bay hailstorm recovery and roof replacement specialists",
      "Waterproofing solutions for lakeside climate exposure",
      "Impact-resistant shingle upgrades to protect your home",
      "Serving Auburn Bay, Mahogany, and surrounding SE communities",
    ],
    quadrant: "SE",
    lat: 50.8925,
    lng: -113.9850,
  },
  {
    name: "Tuscany",
    slug: "tuscany",
    description:
      "Tucked against the rolling foothills in NW Calgary, Tuscany is a thriving community that blends suburban convenience with natural beauty. The neighbourhood's elevation and exposure to westerly weather systems make durable, professionally installed roofing a top priority for homeowners.",
    highlights: [
      "NW Calgary roofing experts serving Tuscany since our founding",
      "Wind-resistant installations designed for foothill exposure",
      "Hail damage repair and insurance claim assistance",
      "Comprehensive roof inspections with honest, no-pressure quotes",
    ],
    quadrant: "NW",
    lat: 51.1280,
    lng: -114.2400,
  },
  {
    name: "Royal Oak",
    slug: "royal-oak",
    description:
      "Royal Oak is a popular NW Calgary community offering easy access to Stoney Trail and the Rocky Mountains. With homes ranging from the early 2000s to new builds, Royal Oak residents benefit from proactive roof maintenance to stay ahead of Alberta's punishing hail and wind seasons.",
    highlights: [
      "Experienced with Royal Oak's diverse home styles and roof types",
      "Hail and wind damage repair — insurance claims handled end-to-end",
      "Close to our service base for fast NW Calgary response",
      "Premium materials backed by a 5-year workmanship warranty",
    ],
    quadrant: "NW",
    lat: 51.1320,
    lng: -114.2250,
  },
  {
    name: "Copperfield",
    slug: "copperfield",
    description:
      "Copperfield is a newer SE Calgary community that was among the hardest hit during the devastating June 2020 hailstorm. Tennis-ball-sized hail caused widespread roof damage, and many Copperfield homeowners have trusted Duckbill to restore their roofs to better-than-new condition.",
    highlights: [
      "Copperfield's go-to roofer for 2020 hailstorm recovery",
      "Full insurance restoration — from inspection to final walkthrough",
      "Upgrades to Class 4 impact-resistant shingles available",
      "Serving Copperfield, New Brighton, and McKenzie Towne",
    ],
    quadrant: "SE",
    lat: 50.9005,
    lng: -113.9470,
  },
  {
    name: "New Brighton",
    slug: "new-brighton",
    description:
      "New Brighton is a family-oriented SE Calgary community with its own lake and recreation centre. Severely impacted by the 2020 hailstorm, New Brighton homeowners know first-hand how important a resilient roof is. Duckbill provides expert repair, replacement, and storm damage restoration throughout the community.",
    highlights: [
      "New Brighton hailstorm damage specialists — hundreds of roofs restored",
      "Insurance claim experts who maximize your coverage",
      "Durable, impact-resistant roofing systems for SE Calgary weather",
      "Free no-obligation inspections for New Brighton homeowners",
    ],
    quadrant: "SE",
    lat: 50.8950,
    lng: -113.9625,
  },
];

export const getNeighbourhoodBySlug = (
  slug: string
): NeighbourhoodData | undefined => {
  return neighbourhoods.find((n) => n.slug === slug);
};

export default neighbourhoods;
