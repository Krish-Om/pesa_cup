import {useState} from "react";

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
        <section className="gallary-section" id="gallary">
            <h2 className="gallary-heading">Gallary</h2>
            <p className="gallary-subheading">Moments from the tournament</p>
        </section>
    );
}