import { useState, useEffect } from "react";

const DEFAULT_SECTIONS = [
    "hero",
    "features",
    "how-it-works",
    "showcase",
    "reviews",
    "pricing",
    "community",
    "ourstory",
    "faq",
    "cta",
];

export default function ScrollArrow({ sections = DEFAULT_SECTIONS }) {
    const [activeSection, setActiveSection] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {

            setIsVisible(window.scrollY > 200);

            const scrollPosition = window.scrollY + window.innerHeight / 3;

            for (let i = sections.length - 1; i >= 0; i--) {
                const element = document.getElementById(sections[i]);
                if (element && element.offsetTop <= scrollPosition) {
                    setActiveSection(i);
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [sections]);

    const scrollToSection = (index) => {
        const element = document.getElementById(sections[index]);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const scrollToNext = () => {
        if (activeSection < sections.length - 1) {
            scrollToSection(activeSection + 1);
        }
    };

    const scrollToPrev = () => {
        if (activeSection > 0) {
            scrollToSection(activeSection - 1);
        }
    };


    return (
        <div
            className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-2 transition-all duration-500 ${isVisible ? "opacity-100 flex" : "opacity-0 hidden"
                }`}
        >
            {/* Up Arrow */}
            <button
                onClick={scrollToPrev}
                disabled={activeSection === 0}
                className="w-10 h-10 rounded-full bg-dark/80 backdrop-blur-sm border border-dark-border 
                   flex items-center justify-center text-white/40 hover:text-neon hover:border-neon/50
                   transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed
                   disabled:hover:text-white/40 disabled:hover:border-dark-border"
                aria-label="Scroll to previous section"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
            </button>

            {/* Section Indicators (dots) */}
            <div className="flex flex-col items-center gap-1.5 py-1">
                {sections.map((section, index) => (
                    <button
                        key={section}
                        onClick={() => scrollToSection(index)}
                        className={`transition-all duration-300 rounded-full ${index === activeSection
                            ? "w-2 h-2 bg-neon"
                            : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                            }`}
                        aria-label={`Scroll to ${section}`}
                    />
                ))}
            </div>

            {/* Down Arrow */}
            <button
                onClick={scrollToNext}
                disabled={activeSection === sections.length - 1}
                className="w-10 h-10 rounded-full bg-dark/80 backdrop-blur-sm border border-dark-border 
                   flex items-center justify-center text-white/40 hover:text-neon hover:border-neon/50
                   transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed
                   disabled:hover:text-white/40 disabled:hover:border-dark-border"
                aria-label="Scroll to next section"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
        </div>
    );
}