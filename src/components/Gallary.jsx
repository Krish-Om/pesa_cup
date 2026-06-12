import { useState } from "react";
import "../css/Gallery.css";

import photo1 from "../assets/Gallary/1.jpg";
import photo2 from "../assets/Gallary/2.jpg";
import photo3 from "../assets/Gallary/3.jpg";
import photo4 from "../assets/Gallary/4.jpg";
import photo5 from "../assets/Gallary/5.jpg";
import photo6 from "../assets/Gallary/6.jpg";
import photoBack from "../assets/Gallary/back.jpg";
import photoTeam from "../assets/Gallary/team.jpg";

const categories = [
    {
    id: "match",
    label: "Match Photos",
    cover: photoBack,
    discription: "Action shots from the tournament",

    photos:[
         { id: 1, src: photo1, caption: "Match Highlights" },
      { id: 2, src: photo2, caption: "Match Highlights" },
      { id: 3, src: photo3, caption: "Match Highlights" },
      { id: 4, src: photo4, caption: "Match Highlights" },
      { id: 5, src: photo5, caption: "Match Highlights" },
      { id: 6, src: photo6, caption: "Match Highlights" },
    ],
},

{
    id: "team",
    label: "Team Photos",
    cover: photoTeam,
    description: "Participated team photos only",

    photos: [
        {id: 8, src: photoTeam, caption: "Meet our participated Teams"},
    ],
},
];

export default function Gallery(){
    const [activeCategory, setActiveCategory] = useState(null);
    const [lightbox, setLightbox] = useState(null);

    const currentPhotos = activeCategory
    ? categories.find(c => c.id === activeCategory)?.photos || [] : [];

    const lightboxIndex = currentPhotos.findIndex(p=>p.id === lightbox?.id);

    const goPrev = (e) => {
        e.stopPropagation();
        const prev = (lightboxIndex - 1 + currentPhotos.length) % currentPhotos.length;
    setLightbox(currentPhotos[prev]);
    };

    const goNext  = (e) => {
    e.stopPropagation();
    const next = (lightboxIndex + 1) % currentPhotos.length;
    setLightbox(currentPhotos[next]);
  };

   const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setTimeout(() => {
      document.getElementById("gallery-photos")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <section className="gallery-section" id="gallery">
        <h2 className="gallery-heading">Gallery</h2>
        <p className="gallery-subheading">Moments from the tournament.</p>

        {/* Category card */}
       <div className="category-grid">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`category-card ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => handleCategoryClick(cat.id)}
          >
            <img src={cat.cover} alt={cat.label} className="category-cover" />
            <div className="category-overlay">
              <p className="category-label">{cat.label}</p>
              <p className="category-count">{cat.photos.length} photos</p>
            </div>
          </div>
        ))}
      </div>
     {/* Photo Grid — shown only when a category is selected */}
      {activeCategory && (
        <div id="gallery-photos" className="gallery-photos-section">

          {/* Header */}
          <div className="gallery-photos-header">
            <div>
              <h3 className="gallery-photos-title">
                {categories.find(c => c.id === activeCategory)?.label}
              </h3>
              <p className="gallery-photos-desc">
                {categories.find(c => c.id === activeCategory)?.description}
              </p>
            </div>
            <button className="gallery-back-btn" onClick={() => setActiveCategory(null)}>
              ← Back to Gallery
            </button>
          </div>

          {/* Photos */}
          <div className="gallery-grid">
            {currentPhotos.map((photo) => (
              <div
                className="gallery-item"
                key={photo.id}
                onClick={() => setLightbox(photo)}
              >
                <img src={photo.src} alt={photo.caption} className="gallery-img" />
                <div className="gallery-caption">{photo.caption}</div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            <button className="lightbox-nav prev" onClick={goPrev}>&#8592;</button>
            <img src={lightbox.src} alt={lightbox.caption} className="lightbox-img" />
            <button className="lightbox-nav next" onClick={goNext}>&#8594;</button>
            <p className="lightbox-caption">
              {lightbox.caption}
              <span className="lightbox-counter"> {lightboxIndex + 1} / {currentPhotos.length}</span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
