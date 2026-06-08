import { Link } from "react-router-dom";
import Button from "./ui/Button";

const ACTIVITIES = [
  { label: "Run Club",          tag: "Every Tue & Sat",    img: "/community/run-club.png"     },
  { label: "Ice Bath Recovery", tag: "Every Thursday",     img: "/community/ice-bath.png"     },
  { label: "Coffee Social",     tag: "Every Sunday",       img: "/community/coffee-social.png"},
];

export default function Community() {
  return (
    <section id="community" className="py-12 lg:py-16 bg-dark-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <span className="text-neon text-xs font-semibold tracking-widest uppercase">Community</span>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
            JOIN THE<br />COMMUNITY
          </h2>
          <p className="mt-3 text-white/40 text-sm">Built for athletes. Backed by community.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {ACTIVITIES.map(({ label, tag, img }) => (
            <div key={label}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              <img src={img} alt={label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-1"
                  style={{ color: "#C3FF51" }}>{tag}</p>
                <p className="text-white font-bold text-sm">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <Button to="/community" size="md">
          View Community →
        </Button>

      </div>
    </section>
  );
}
