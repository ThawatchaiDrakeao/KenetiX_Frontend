/*
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CartDrawer from "../CartDrawer";


const NAV_LINKS = [
  { label: "Catalog", to: "/catalog" },
  { label: "How it works", to: "/howitworkspage" },
  { label: "Community", to: "/" },
  { label: "Contact Us", to: "/contact" },
];

export default function CatalogNavbar() {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <>

      <header className="sticky top-0 z-50 bg-[#080809]/95 backdrop-blur-md border-b border-[#1e1e20]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="relative flex items-center h-14">
            <Link to="/" className="shrink-0">
              <span className="text-[24px] font-extrabold tracking-widest text-white">
                KINETI<span className="text-[#C3FF51]">X</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {NAV_LINKS.map((link) => (
                <Link key={link.label} to={link.to} className="text-sm font-medium text-white/60 hover:text-[#C3FF51] transition-colors duration-200">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex flex-1 max-w-[280px] ml-2">
              <div className="relative w-full">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input type="text" placeholder="Search running shoes..." className="w-full bg-[#0f0f10] border border-[#1e1e20] rounded-full pl-9 pr-4 py-1.5 text-xs text-white/60 placeholder-white/20 focus:outline-none focus:border-[#C3FF51]/30 transition-colors" />
              </div>
            </div>

            <div className="ml-auto flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center text-white/35 hover:text-[#C3FF51] transition-colors" aria-label="Wishlist">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-white/35 hover:text-[#C3FF51] transition-colors" aria-label="Account">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="relative w-8 h-8 flex items-center justify-center text-white/35 hover:text-[#C3FF51] transition-colors"
                aria-label="Cart"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C3FF51] text-[#080809] text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)} />

    </>

  );
}
*/