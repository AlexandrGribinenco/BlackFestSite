import type { Metadata } from "next";
import { AdaptiveText } from "@/components/AdaptiveText";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ComingSoonImage } from "@/components/ComingSoonImage";
import { EventMap, type MapZone } from "@/components/gallery/EventMap";
import { VenueGallery, type VenuePhoto } from "@/components/gallery/VenueGallery";
import { ZoomableMedia } from "@/components/gallery/ZoomableMedia";
import { SectionNav, type NavSection } from "@/components/SectionNav";
import { Skeleton } from "@/components/Skeleton";
import "./gallery.css";

// Figma: Desktop / D4 · Gallery 347:2778, Mobile / M5 · Gallery 3:10546

export const metadata: Metadata = {
  title: "Gallery — Black Out Fest 2027",
  description: "The venue before the crowd: photos of the space, the 3D stage, the sound system and the event map of Black Out Fest 2027.",
};

const sections: NavSection[] = [
  { id: "venue", label: "Venue" },
  { id: "stage", label: "3D stage" },
  { id: "sound", label: "Sound system", short: "Sound" },
  { id: "event-map", label: "Event map" },
];

const venuePhotos: VenuePhoto[] = [
  { label: "Venue — wide shot, empty", layout: "tall" },
  { label: "Entrance" },
  { label: "Main hall" },
  { label: "Panorama", layout: "wide", extra: true },
  { label: "Bar area" },
  { label: "VIP zone" },
  { label: "Outdoor / camping", extra: true },
];

const stageSpecs = [
  { label: "Size", value: "[W × D × H] m" },
  { label: "LED screens", value: "[N] panels, [size]" },
  { label: "Lighting", value: "[spec]" },
];

const soundSystem = ["Main PA", "Subwoofers", "DJ booth", "Monitors"];

const mapZones: MapZone[] = [
  { name: "Main stage" },
  { name: "LED screens" },
  { name: "Bar" },
  { name: "Restaurant" },
  { name: "Entrance & box office", short: "Entrance" },
  { name: "VIP zone" },
  { name: "Camping" },
  { name: "Parking" },
  { name: "WC & first aid" },
];

export default function GalleryPage() {
  return (
    <main>
      <div className="container page-head">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gallery" }]} />
        <h1 className="page-head__title">Gallery</h1>
        <p className="page-head__intro">
          <AdaptiveText full="The venue before the crowd — the space, the stage, the sound and the event map." short="The venue before the crowd." />
        </p>
        <SectionNav className="gallery-nav" sections={sections} label="Gallery sections" variant="chips" />
      </div>

      <section className="container gallery-section gallery-section--first" id="venue" aria-labelledby="venue-title">
        <h2 className="gallery-title" id="venue-title">
          Venue
        </h2>
        <VenueGallery photos={venuePhotos} />
      </section>

      <section className="gallery-band" id="stage" aria-labelledby="stage-title">
        <div className="container stage">
          <ZoomableMedia className="stage__viewer" label="3D stage model — coming soon" controls={["reset", "zoom", "fullscreen"]} />
          <h2 className="gallery-title stage__title" id="stage-title">
            The stage
          </h2>
          <div className="stage__details">
            <Skeleton size="sm" widths={[undefined, undefined, "60%"]} />
            <dl className="stage__specs">
              {stageSpecs.map((spec) => (
                <div key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="container gallery-section" id="sound" aria-labelledby="sound-title">
        <h2 className="gallery-title" id="sound-title">
          Sound system
        </h2>
        <ul className="sound-grid">
          {soundSystem.map((name) => (
            <li key={name}>
              <div className="placeholder sound-grid__photo">
                <ComingSoonImage alt={`${name} — photo coming soon`} />
              </div>
              <p className="sound-grid__name">{name}</p>
              <Skeleton size="sm" widths={["75%"]} />
            </li>
          ))}
        </ul>
      </section>

      <section className="gallery-band" id="event-map" aria-labelledby="event-map-title">
        <div className="container">
          <EventMap zones={mapZones} />
        </div>
      </section>
    </main>
  );
}
