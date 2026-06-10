import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./ui/Button";
import CartDrawer from "./CartDrawer";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useLanguage } from "../context/useLanguage";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { pathname } = useLocation();
  const isLight = pathname === "/userdashboard";

  const { user } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { language, setLanguage, t } = useLanguage();
  const isLoggedIn = !!user;
  const isAdmin = user && (
    user.role === "ADMIN" ||
    user.role === "admin" ||
    user.userRank === "admin"
  );

  const NAV_LINKS = [
    { id: "catalog",   label: t("nav.catalog"),   to: "/catalog"        },
    { id: "how",       label: t("nav.howItWorks"), to: "/howitworkspage" },
    { id: "community", label: t("nav.community"),  to: "/community"      },
    { id: "contact",   label: t("nav.contactUs"),  to: "/contact"        },
  ];

  useEffect(() => {
    if (isLight) { setScrolled(false); return; }
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLight]);

  const headerCls = isLight
    ? "bg-white border-b border-gray-200 shadow-sm"
    : scrolled
      ? "bg-dark/90 backdrop-blur-md border-b border-dark-border"
      : "bg-transparent";

  const logoCls   = isLight ? "text-black" : "text-white";
  const linkCls   = isLight ? "text-gray-500 hover:text-gray-900" : "text-white/60 hover:text-neon";
  const sepCls    = isLight ? "text-gray-300" : "text-white/20";
  const hamCls    = isLight ? "bg-black" : "bg-white";
  const langActive = isLight ? "text-[#4D7C0F]" : "text-neon";
  const langOff    = isLight ? "text-gray-400 hover:text-gray-700" : "text-white/30 hover:text-white";

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerCls}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="shrink-0">
              <span className={`text-[24px] font-extrabold tracking-widest transition-colors duration-300 ${logoCls}`}>
                KINETI<span className="text-[#C3FF51]">X</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.id}
                  to={link.to}
                  className={`text-sm font-medium transition-colors duration-200 ${linkCls}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop User Actions + Language Switcher */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLanguage('th')}
                  className={`text-xs font-semibold px-2 py-0.5 rounded transition-colors ${language === 'th' ? langActive : langOff}`}
                >
                  TH
                </button>
                <span className={`text-xs ${sepCls}`}>|</span>
                <button
                  onClick={() => setLanguage('en')}
                  className={`text-xs font-semibold px-2 py-0.5 rounded transition-colors ${language === 'en' ? langActive : langOff}`}
                >
                  EN
                </button>
              </div>

              {isLoggedIn ? (
                <UserActions
                  onOpenCart={() => setCartOpen(true)}
                  cartCount={cartCount}
                  wishlistCount={wishlistCount}
                  isLight={isLight}
                  isAdmin={isAdmin}
                />
              ) : (
                <GuestActions t={t} />
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block h-0.5 w-6 transition-all duration-300 ${hamCls} ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 w-6 transition-all duration-300 ${hamCls} ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 transition-all duration-300 ${hamCls} ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen
            ? "max-h-96 border-b border-dark-border"
            : "max-h-0"
            } bg-dark/95 backdrop-blur-md`}
        >
          <nav className="flex flex-col px-4 py-4 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.id}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="py-3 text-sm text-white/70 hover:text-neon transition-colors duration-200 border-b border-dark-border/50 last:border-0"
              >
                {link.label}
              </Link>
            ))}

            <div className="flex flex-col gap-2 pt-4">
              {isLoggedIn ? (
                <>
                  <Button variant="outline" size="sm" to="/profile" onClick={() => setMenuOpen(false)}>
                    {t('nav.profile')}
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => { setCartOpen(true); setMenuOpen(false); }}>
                    {t('nav.cart')}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" to="/login" onClick={() => setMenuOpen(false)}>
                    {t('nav.login')}
                  </Button>
                  <Button variant="primary" size="sm" to="/signup" onClick={() => setMenuOpen(false)}>
                    {t('nav.signup')}
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

function GuestActions({ t }) {
  return (
    <>
      <Button variant="primary" size="sm" to="/login">{t('nav.login')}</Button>
      <Button variant="primary" size="sm" to="/signup">{t('nav.signup')}</Button>
    </>
  );
}

function UserActions({ onOpenCart, cartCount, wishlistCount, isLight, isAdmin }) {
  const iconCls = `w-8 h-8 flex items-center justify-center transition-colors ${isLight ? "text-gray-500 hover:text-[#C3FF51]" : "text-white/35 hover:text-[#C3FF51]"}`;
  return (
    <>
      {isAdmin && (
        <Link
          to="/admin"
          className="text-xs text-neon border border-neon/30 px-3 py-1.5 rounded-lg hover:bg-neon/10 transition-colors font-medium"
        >
          Admin
        </Link>
      )}

      <Link to="/userdashboard#favourites" className={`relative ${iconCls}`} aria-label="Favourites">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        {wishlistCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C3FF51] text-[#080809] text-[9px] font-bold rounded-full flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
      </Link>

      <button onClick={onOpenCart} className={`relative ${iconCls}`} aria-label="Cart">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C3FF51] text-[#080809] text-[9px] font-bold rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      <Link to="/userdashboard" className={iconCls} aria-label="Account">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </Link>
    </>
  );
}
