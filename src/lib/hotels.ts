// Partner hotels (Figma: D15 "Grid · Hotels" 347:6613, M14 179:3738)
// TODO: replace the placeholders with the real hotels, prices and booking links

export type HotelType = "hotel" | "guesthouse" | "apartments";

export type Hotel = {
  name: string;
  address: string;
  type: HotelType;
  /** Hotels only; guesthouses and apartments show their type instead */
  stars?: number;
  distanceKm: number;
  amenities: string[];
  /** Discount for festival guests, shown as a badge on the photo */
  deal?: string;
  partner?: boolean;
  price: string;
  url: string;
};

export const HOTEL_TYPE_LABELS: Record<HotelType, { one: string; many: string }> = {
  hotel: { one: "Hotel", many: "Hotels" },
  guesthouse: { one: "Guesthouse", many: "Guesthouses" },
  apartments: { one: "Apartments", many: "Apartments" },
};

export const HOTELS: Hotel[] = [
  { name: "[HOTEL NAME 1]", address: "[ADDRESS], [CITY]", type: "hotel", stars: 4, distanceKm: 1.2, amenities: ["Breakfast", "Parking", "Shuttle"], deal: "−10% for festival guests", price: "[PRICE]", url: "#" },
  { name: "[HOTEL NAME 2]", address: "[ADDRESS], [CITY]", type: "hotel", stars: 3, distanceKm: 2.5, amenities: ["Breakfast", "Wi-Fi"], price: "[PRICE]", url: "#" },
  { name: "[HOTEL NAME 3]", address: "[ADDRESS], [CITY]", type: "hotel", stars: 5, distanceKm: 4, amenities: ["Spa", "Restaurant", "Parking"], partner: true, price: "[PRICE]", url: "#" },
  { name: "[HOTEL NAME 4]", address: "[ADDRESS], [CITY]", type: "guesthouse", distanceKm: 0.6, amenities: ["Kitchen", "Garden"], deal: "−10% for festival guests", price: "[PRICE]", url: "#" },
  { name: "[HOTEL NAME 5]", address: "[ADDRESS], [CITY]", type: "hotel", stars: 3, distanceKm: 3.1, amenities: ["Breakfast", "Parking"], price: "[PRICE]", url: "#" },
  { name: "[HOTEL NAME 6]", address: "[ADDRESS], [CITY]", type: "apartments", distanceKm: 1.9, amenities: ["Kitchen", "Self check-in"], partner: true, price: "[PRICE]", url: "#" },
];
