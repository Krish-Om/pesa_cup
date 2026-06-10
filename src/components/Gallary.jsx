import {useState} from "react";
import "../css/Gallery.css";

const placeholderPhotos = [
  { id: 1, src: "https://placehold.co/600x400/0d2150/ffffff?text=Match+Day+1", caption: "Match Day 1" },
  { id: 2, src: "https://placehold.co/600x400/0d2150/ffffff?text=Goal+Celebration", caption: "Goal Celebration" },
  { id: 3, src: "https://placehold.co/600x400/0d2150/ffffff?text=Team+Photo", caption: "Team Photo" },
  { id: 4, src: "https://placehold.co/600x400/0d2150/ffffff?text=Finals+Action", caption: "Finals Action" },
  { id: 5, src: "https://placehold.co/600x400/0d2150/ffffff?text=Trophy+Ceremony", caption: "Trophy Ceremony" },
  { id: 6, src: "https://placehold.co/600x400/0d2150/ffffff?text=Opening+Match", caption: "Opening Match" },
];

export default function Gallary({photos = placeholderPhotos}) {
    const [selected, setselected] = useState(null);

    return (
        <section className="gallery-section" id="gallary">
            <h2 className="gallery-heading">Gallary</h2>
            <p className="gallery-subheading">Moments from the tournament</p>

              <div className="gallery-grid">
        {photos.map((photo) => (
          <div
            className="gallery-item"
            key={photo.id}
            onClick={() => setselected(photo)}
          >
            <img src={photo.src} alt={photo.caption} className="gallery-img" />
            <div className="gallery-caption">{photo.caption}</div>
          </div>
        ))}
      </div>
         {/* Lightbox */}
      {selected && (
        <div className="lightbox" onClick={() => setselected(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setselected(null)}>✕</button>
            <img src={selected.src} alt={selected.caption} className="lightbox-img" />
            <p className="lightbox-caption">{selected.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}