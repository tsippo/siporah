// Layout of the photo album, in "stage" units: a 1536 × 1140 canvas.
// The Europe map sits at y = 60 inside it, so pin y = map y + 60.
export const STAGE_W = 1536;
export const STAGE_H = 1140;
export const MAP_TOP = 60;

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
  /** Where the city is on the map. Omit for friends without a place. */
  pin?: { x: number; y: number };
  /** Top-left corner of the polaroid, plus a tilt in degrees. */
  photo: { x: number; y: number; tilt: number };
  /** Background tint behind the illustration. */
  tint: string;
};

// Listed in travel order: the flight path connects the pins in this order.
export const friends: Friend[] = [
  {
    id: "london",
    image: "/images/friends/london-bus.png",
    width: 900,
    height: 609,
    pin: { x: 500, y: 350 },
    photo: { x: 40, y: 150, tilt: -6 },
    tint: "#dfe9f7",
  },
  {
    id: "amsterdam",
    image: "/images/friends/mike.png",
    width: 900,
    height: 624,
    pin: { x: 650, y: 372 },
    photo: { x: 340, y: 0, tilt: 4 },
    tint: "#fbe6d4",
  },
  {
    id: "norway",
    image: "/images/friends/viking.png",
    width: 900,
    height: 610,
    pin: { x: 713, y: 275 },
    photo: { x: 900, y: 10, tilt: -3 },
    tint: "#dcefee",
  },
  {
    id: "vienna",
    image: "/images/friends/leopold.png",
    width: 900,
    height: 461,
    pin: { x: 897, y: 507 },
    photo: { x: 1250, y: 300, tilt: 5 },
    tint: "#efe4f4",
  },
  {
    id: "rome",
    image: "/images/friends/matteo.png",
    width: 900,
    height: 682,
    pin: { x: 813, y: 673 },
    photo: { x: 1060, y: 730, tilt: -5 },
    tint: "#fdf0cf",
  },
  {
    id: "spain",
    image: "/images/friends/carmen.png",
    width: 597,
    height: 900,
    pin: { x: 365, y: 750 },
    photo: { x: 50, y: 640, tilt: 4 },
    tint: "#fde0de",
  },
  {
    id: "skater",
    image: "/images/friends/skater.png",
    width: 900,
    height: 586,
    photo: { x: 560, y: 830, tilt: -2 },
    tint: "#e4f2dc",
  },
];

export const PHOTO_W = 250;

/** A gently curving dashed route through the pins, in travel order. */
export function flightPath() {
  const pts = friends.flatMap((f) => (f.pin ? [f.pin] : []));
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
