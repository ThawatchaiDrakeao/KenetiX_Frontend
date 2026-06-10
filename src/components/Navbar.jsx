import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { clearAuth } from "../api/axios";
import Button from "./ui/Button";
import CartDrawer from "./CartDrawer";
import { useCart } from "../context/CartContext";


const NAV_LINKS = [
  { id: "catalog", label: "Catalog", to: "/catalog" },
  { id: "how", label: "How it works", to: "/howitworkspage" },
  { id: "community", label: "Community", to: "/userdashboard" },
  { id: "contact", label: "Contact Us", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  const handleLogout = () => {
    clearAuth();
    logout();
    setCartOpen(false);
    setMenuOpen(false);
    navigate("/");
  };
  const isAdmin = user && (
    user.role === "ADMIN" ||
    user.role === "admin" ||
    user.userRank === "admin"
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-dark/90 backdrop-blur-md border-b border-dark-border"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="shrink-0">
              <span className="text-[24px] font-extrabold tracking-widest text-white">
                KINETI<span className="text-[#C3FF51]">X</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.id}
                  to={link.to}
                  className="text-sm text-white/60 hover:text-neon transition-colors duration-200 font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <UserActions
                  onOpenCart={() => setCartOpen(true)}
                  cartCount={cartCount}
                  isAdmin={isAdmin}
                  onLogout={handleLogout}
                />
              ) : (
                <GuestActions />
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
              />
              <span
                className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""
                  }`}
              />
              <span
                className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
              />
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
                  <Button
                    variant="outline"
                    size="sm"
                    to="/userdashboard"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setCartOpen(true);
                      setMenuOpen(false);
                    }}
                  >
                    Cart
                  </Button>

                  <button
                    onClick={handleLogout}
                    className="py-3 text-sm text-red-400 hover:text-red-300 transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                  >
                    Log in
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
}

function GuestActions() {
  return (
    <>
      <Button
        variant="primary"
        size="sm"
        to="/login"
      >
        Log in
      </Button>

      <Button
        variant="primary"
        size="sm"
        to="/signup"
      >
        Sign Up
      </Button>
    </>
  );
}

function UserActions({ onOpenCart, cartCount, isAdmin, onLogout }) {
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

      {/* Cart */}
      <button
        onClick={onOpenCart}
        className="relative w-8 h-8 flex items-center justify-center text-white/35 hover:text-[#C3FF51] transition-colors"
        aria-label="Cart"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C3FF51] text-[#080809] text-[9px] font-bold rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {/* Profile */}
      <Link to="/userdashboard" className="w-8 h-8 flex items-center justify-center text-white/35 hover:text-[#C3FF51] transition-colors" aria-label="Account">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 012 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </Link>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium ml-2"
      >
        Logout
      </button>
    </>
  );
}