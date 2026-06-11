import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./ui/Button";
import CartDrawer from "./CartDrawer";
import { useCart } from "../context/CartContext";
import { useNotifications } from "../context/NotificationContext";
import { useLanguage } from "../context/useLanguage";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { pathname } = useLocation();
  const isLight = pathname === "/userdashboard";

  const { user } = useAuth();
  const { cartCount, isCartOpen, openCart, closeCart } = useCart();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
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
                  onOpenCart={openCart}
                  cartCount={cartCount}
                  isLight={isLight}
                  isAdmin={isAdmin}
                  notifications={notifications}
                  unreadCount={unreadCount}
                  markAsRead={markAsRead}
                  markAllAsRead={markAllAsRead}
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
                  <Button variant="primary" size="sm" onClick={() => { openCart(); setMenuOpen(false); }}>
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

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
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

function UserActions({ onOpenCart, cartCount, isLight, isAdmin, notifications, unreadCount, markAsRead, markAllAsRead }) {
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

      <NotificationBell
        iconCls={iconCls}
        notifications={notifications}
        unreadCount={unreadCount}
        markAsRead={markAsRead}
        markAllAsRead={markAllAsRead}
      />


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

function NotificationBell({ iconCls, notifications, unreadCount, markAsRead, markAllAsRead }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`relative ${iconCls}`}
        aria-label="Notifications"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C3FF51] text-[#080809] text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-[#0f0f10] border border-[#1e1e20] rounded-xl shadow-xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e20]">
            <span className="text-white text-sm font-bold">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[#C3FF51] text-xs hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-8">No notifications</p>
          ) : (
            notifications.map((n) => (
              <button
                key={n._id}
                onClick={() => markAsRead(n._id)}
                className={`block w-full text-left px-4 py-3 border-b border-[#1e1e20] last:border-0 transition-colors hover:bg-white/5 ${n.isRead ? "" : "bg-[#C3FF51]/5"}`}
              >
                <p className="text-white text-xs font-semibold">{n.title}</p>
                <p className="text-zinc-400 text-xs mt-1">{n.message}</p>
                <p className="text-zinc-600 text-[10px] mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
