import { useState } from "react";

const BRANDS      = ['Nike', 'Adidas', 'Hoka', 'ASICS', 'New Balance', 'Saucony', 'On Running', 'Puma', 'Under Armour', 'Mizuno'];
const SIZES       = Array.from({ length: 10 }, (_, i) => `EU ${36 + i}`);
const PRICE_RANGES = ['1,000 - 2,000 THB', '2,001 - 3,000 THB', '3,001 - 4,000 THB', '>= 5,000 THB'];
const SORT_OPTIONS = ['Newest', 'Price: Low–High', 'Price: High–Low', 'Top Rated'];

function Dropdown({ label, options, value, onChange, minWidth = 120 }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 border rounded-lg px-3 py-1.5 text-[11px] transition-all ${
          value ? 'border-[#C3FF51]/40 text-[#C3FF51]' : 'border-[#1e1e20] text-white/55 hover:border-[#C3FF51]/40 hover:text-white'
        }`}
      >
        {value ?? label}
        <svg className="w-2.5 h-2.5 ml-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-[#141415] border border-[#1e1e20] rounded-lg overflow-hidden z-20" style={{ minWidth }}>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt === value ? null : opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-[11px] hover:bg-[#1e1e20] transition-colors ${value === opt ? 'text-[#C3FF51]' : 'text-white/60'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CatalogFilters() {
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedBrand,  setSelectedBrand]  = useState(null);
  const [selectedSize,   setSelectedSize]   = useState(null);
  const [selectedPrice,  setSelectedPrice]  = useState(null);
  const [sortBy,         setSortBy]         = useState('Newest');
  const [sortOpen,       setSortOpen]       = useState(false);

  const activeFilters = [
    selectedGender && { label: selectedGender, clear: () => setSelectedGender(null) },
    selectedBrand  && { label: selectedBrand,  clear: () => setSelectedBrand(null)  },
    selectedSize   && { label: selectedSize,   clear: () => setSelectedSize(null)   },
    selectedPrice  && { label: selectedPrice,  clear: () => setSelectedPrice(null)  },
  ].filter(Boolean);

  const clearAll = () => { setSelectedGender(null); setSelectedBrand(null); setSelectedSize(null); setSelectedPrice(null); };

  return (
    <div className="bg-[#080809] border-b border-[#1e1e20] sticky top-14 z-40">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-1.5 border border-[#1e1e20] rounded-lg px-3 py-1.5 text-[11px] font-bold text-white/70 hover:border-[#C3FF51]/40 hover:text-white transition-all tracking-wider">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            FILTERS
          </button>

          <Dropdown label="Category" options={['Men', 'Women']}   value={selectedGender} onChange={setSelectedGender} minWidth={100} />
          <Dropdown label="Brand"    options={BRANDS}              value={selectedBrand}  onChange={setSelectedBrand}  minWidth={140} />
          <Dropdown label="Size"     options={SIZES}               value={selectedSize}   onChange={setSelectedSize}   minWidth={110} />
          <Dropdown label="Price"    options={PRICE_RANGES}        value={selectedPrice}  onChange={setSelectedPrice}  minWidth={160} />

          {/* Sort by */}
          <div className="flex items-center gap-1.5 ml-auto relative">
            <span className="text-[11px] text-white/35">Sort by:</span>
            <button onClick={() => setSortOpen(!sortOpen)} className="flex items-center gap-1 border border-[#1e1e20] rounded-lg px-3 py-1.5 text-[11px] text-white/60 hover:border-[#C3FF51]/40 transition-all">
              {sortBy}
              <svg className="w-2.5 h-2.5 ml-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 bg-[#141415] border border-[#1e1e20] rounded-xl shadow-xl overflow-hidden z-50 min-w-[130px]">
                {SORT_OPTIONS.map((opt) => (
                  <button key={opt} onClick={() => { setSortBy(opt); setSortOpen(false); }} className={`w-full text-left px-4 py-2.5 text-[11px] hover:bg-[#1e1e20] transition-colors ${sortBy === opt ? 'text-[#C3FF51]' : 'text-white/60'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {activeFilters.length > 0 && (
            <button onClick={clearAll} className="text-[11px] text-[#C3FF51]/60 hover:text-[#C3FF51] transition-colors ml-1">
              Clear all
            </button>
          )}
        </div>

        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[10px] text-white/25">Active filters:</span>
            {activeFilters.map((f) => (
              <button key={f.label} onClick={f.clear} className="flex items-center gap-1 bg-[#141415] border border-[#1e1e20] rounded-full px-2.5 py-0.5 text-[10px] text-white/55 hover:border-[#C3FF51]/40 hover:text-white transition-all">
                {f.label}
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
