import { HOTEL_TYPE_LABELS, type Hotel } from "@/lib/hotels";
import { externalLinkProps } from "@/lib/links";
import { ComingSoonImage } from "../ComingSoonImage";

// Hotel card (Figma: D15 "Grid · Hotels" 347:6613). Booking happens on the hotel's own website.
export function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <article className="hotel-card">
      <div className="placeholder hotel-card__photo">
        <ComingSoonImage alt={`${hotel.name} — photo coming soon`} />
        {hotel.deal ? (
          <span className="badge badge--accent hotel-card__badge">{hotel.deal}</span>
        ) : (
          hotel.partner && <span className="badge badge--violet hotel-card__badge">Partner</span>
        )}
      </div>

      <div className="hotel-card__body">
        <div className="hotel-card__meta">
          {hotel.stars ? (
            <span className="hotel-card__stars" role="img" aria-label={`${hotel.stars}-star hotel`}>
              {"★".repeat(hotel.stars)}
            </span>
          ) : (
            <span className="hotel-card__type">{HOTEL_TYPE_LABELS[hotel.type].one}</span>
          )}
          <span className="hotel-card__distance">{hotel.distanceKm} km to the festival</span>
        </div>

        <h3 className="hotel-card__name">{hotel.name}</h3>
        <p className="hotel-card__address">{hotel.address}</p>

        <ul className="hotel-card__amenities" aria-label="Amenities">
          {hotel.amenities.map((amenity) => (
            <li key={amenity}>{amenity}</li>
          ))}
        </ul>

        <p className="hotel-card__price">
          from <strong>{hotel.price}</strong> / night
        </p>
        <a className="btn btn-primary btn-block" href={hotel.url} {...externalLinkProps(hotel.url)}>
          Book on hotel website
        </a>
        <p className="hotel-card__note">Opens the hotel’s website</p>
      </div>
    </article>
  );
}
