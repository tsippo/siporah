// Layout of the photo album, in "stage" units: a 1536 × 1140 canvas.
// The Europe map sits at y = 60 inside it, so stop y = map y + 60.
export const STAGE_W = 1536;
export const STAGE_H = 1140;
export const MAP_TOP = 60;

/** The places on Tsippo's route, in travel order. */
export type StopId =
  | "norway"
  | "denmark"
  | "amsterdam"
  | "london"
  | "berlin"
  | "vienna"
  | "budapest"
  | "greece"
  | "rome"
  | "switzerland"
  | "paris"
  | "portugal"
  | "sevilla"
  | "tarifa"
  | "merjaZerga";

export type Stop = { id: StopId; x: number; y: number };

// Tsippo's flight, in order. Positions are the landmarks drawn on the map
// (stage units; map y + 60). Names per language: dictionary friends.stops.
export const stops: Stop[] = [
  { id: "norway", x: 713, y: 275 }, // Oslo opera house
  { id: "denmark", x: 797, y: 322 }, // Copenhagen tower
  { id: "amsterdam", x: 650, y: 372 },
  { id: "london", x: 500, y: 350 }, // Big Ben
  { id: "berlin", x: 832, y: 405 }, // Brandenburg Gate
  { id: "vienna", x: 897, y: 507 },
  { id: "budapest", x: 1025, y: 538 }, // Chain Bridge
  { id: "greece", x: 1120, y: 785 }, // Parthenon
  { id: "rome", x: 813, y: 673 }, // Colosseum
  { id: "switzerland", x: 715, y: 560 }, // Alps chalet
  { id: "paris", x: 570, y: 510 }, // Eiffel Tower
  { id: "portugal", x: 262, y: 700 }, // Belém tower, Lisbon
  { id: "sevilla", x: 365, y: 750 }, // Giralda
  { id: "tarifa", x: 348, y: 803 }, // southern tip of Spain
  { id: "merjaZerga", x: 290, y: 862 }, // Merja Zerga lagoon, Morocco
];

/** 1-based number of a stop on the route (shown on its pin and photo). */
export const stopNumber = (id: StopId) => stops.findIndex((s) => s.id === id) + 1;

export type FriendId =
  | "london"
  | "amsterdam"
  | "norway"
  | "vienna"
  | "rome"
  | "spain"
  | "skater";

export type Friend = {
  id: FriendId;
  image: string;
  width: number;
  height: number;
  /** The stop on the route where Tsippo met this friend. Omit for friends without a place. */
  stop?: StopId;
  /** Top-left corner of the polaroid, plus a tilt in degrees. */
  photo: { x: number; y: number; tilt: number };
  /** Background tint behind the illustration. */
  tint: string;
};

// The album's photos. Their numbers come from their stop on the route.
export const friends: Friend[] = [
  {
    id: "norway",
    image: "/images/friends/viking.png",
    width: 900,
    height: 610,
    stop: "norway",
    photo: { x: 900, y: 10, tilt: -3 },
    tint: "#dcefee",
  },
  {
    id: "amsterdam",
    image: "/images/friends/mike.png",
    width: 900,
    height: 624,
    stop: "amsterdam",
    photo: { x: 340, y: 0, tilt: 4 },
    tint: "#fbe6d4",
  },
  {
    id: "london",
    image: "/images/friends/london-bus.png",
    width: 900,
    height: 609,
    stop: "london",
    photo: { x: 40, y: 150, tilt: -6 },
    tint: "#dfe9f7",
  },
  {
    id: "vienna",
    image: "/images/friends/leopold.png",
    width: 900,
    height: 461,
    stop: "vienna",
    photo: { x: 1250, y: 300, tilt: 5 },
    tint: "#efe4f4",
  },
  {
    id: "rome",
    image: "/images/friends/matteo.png",
    width: 900,
    height: 682,
    stop: "rome",
    photo: { x: 900, y: 850, tilt: -5 },
    tint: "#fdf0cf",
  },
  {
    id: "spain",
    image: "/images/friends/carmen.png",
    width: 597,
    height: 900,
    stop: "sevilla",
    photo: { x: 10, y: 860, tilt: 4 },
    tint: "#fde0de",
  },
  {
    id: "skater",
    image: "/images/friends/skater.png",
    width: 900,
    height: 586,
    photo: { x: 560, y: 865, tilt: -2 },
    tint: "#e4f2dc",
  },
];

export const PHOTO_W = 250;

/** A gently curving dashed route through all stops, in travel order. */
export function flightPath() {
  const pts = stops;
  return pts
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const a = pts[i - 1];
      const mx = (a.x + p.x) / 2;
      const my = (a.y + p.y) / 2;
      // bend each hop sideways so the route looks like a flight arc
      const dx = p.x - a.x;
      const dy = p.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const bend = 0.28 * len;
      return `Q ${mx + (dy / len) * bend} ${my - (dx / len) * bend} ${p.x} ${p.y}`;
    })
    .join(" ");
}
