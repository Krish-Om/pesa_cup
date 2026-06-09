import './Pages.css';

export default function Gallery() {
  const galleryItems = [
    { id: 1, title: 'Tournament Opening' },
    { id: 2, title: 'Group Match' },
    { id: 3, title: 'Final Match' },
    { id: 4, title: 'Team Celebration' },
    { id: 5, title: 'Award Ceremony' },
    { id: 6, title: 'Group Photo' },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Gallery</h1>
        <p>Tournament moments and highlights</p>
      </div>

      <div className="container">
        <div className="gallery-grid">
          {galleryItems.map(item => (
            <div key={item.id} className="gallery-item">
              <div className="gallery-placeholder">
                <span>{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
