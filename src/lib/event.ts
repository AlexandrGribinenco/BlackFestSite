// Event data from the client (30.10.2026): 15 June 2028, 12:00, Hobart, Tasmania, Australia.
// TODO: the venue name and street address, once the client has them
export const EVENT = {
  name: "Black Out Fest 2027",
  /** Festival start in Hobart time (AEST, UTC+10 in June), used by countdowns and calendar files */
  start: "2028-06-15T12:00:00+10:00",
  /** Calendar event length, hours */
  durationHours: 8,
  date: "15 June 2028",
  time: "12:00",
  /** Short place for one-line event details */
  venue: "Hobart, Tasmania",
  venueName: "[VENUE NAME]",
  /** Full address, on the e-tickets and in the confirmation e-mail */
  address: "Hobart, Tasmania, Australia",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Hobart%2C%20Tasmania%2C%20Australia",
};
