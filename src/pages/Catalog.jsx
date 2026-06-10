import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/useLanguage";
import ScrollArrow from "../components/ScrollArrow";
import Footer from "../components/Footer";
import Navbar from '../components/Navbar';
import CatalogHero from "../components/catalog/CatalogHero";
import CatalogFilters from "../components/catalog/CatalogFilters";
import ProductCard from "../components/catalog/ProductCard";

const fadeUp  = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

const PARTNER_LOGOS = { Nike: "/logo-nike.jpg", Adidas: "/logo-adidas.jpg", Hoka: "/logo-hoka.png", ASICS: "/logo-asics.png", "New Balance": "/logo-newbalance.png", Saucony: "/logo-saucony.png", "On Running": "/logo-onrunning.png", Puma: "/logo-puma.png", "Under Armour": "/logo-underarmour.png", Mizuno: "/logo-mizuno.png" };

const PARTNERS = [
  "Nike", "Adidas", "Hoka", "ASICS", "New Balance",
  "Saucony", "On Running", "Puma", "Under Armour", "Mizuno",
];

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [sortBy, setSortBy] = useState("Newest");

  const { fetchUserCart } = useCart() || {};
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      try {
        const res = await API.get("/api/products");
        if (res.data?.success) {
          setProducts(res.data.data || []);
        } else {
          setApiError("Failed to load products");
        }
      } catch (err) {
        setApiError(err.response?.data?.message || "Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    if (fetchUserCart) fetchUserCart();
  }, [fetchUserCart]);

  useEffect(() => {
    setVisibleCount(8);
  }, [selectedGender, selectedBrand, selectedSize, selectedPrice, sortBy]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedGender) {
      const gender = selectedGender.toLowerCase();
      list = list.filter((p) => p.gender === gender || p.gender === "unisex");
    }

    if (selectedBrand) {
      const brand = selectedBrand.toLowerCase();
      list = list.filter((p) => (p.brandId?.brandName || p.brand || "").toLowerCase() === brand);
    }

    if (selectedSize) {
      const size = parseInt(selectedSize.replace("EU ", ""), 10);
      list = list.filter((p) =>
        p.variants?.some((v) => v.size?.some((s) => s.size === size && s.stock > 0))
      );
    }

    if (selectedPrice) {
      const nums = selectedPrice.match(/[\d,]+/g).map((n) => parseInt(n.replace(/,/g, ""), 10));
      const [min, max] = selectedPrice.startsWith(">=") ? [nums[0], Infinity] : nums;
      list = list.filter((p) => {
        const price = p.rentalPlan?.[0]?.["1day"] || 0;
        return price >= min && price <= max;
      });
    }

    if (sortBy === "Price: Low–High") {
      list.sort((a, b) => (a.rentalPlan?.[0]?.["1day"] || 0) - (b.rentalPlan?.[0]?.["1day"] || 0));
    } else if (sortBy === "Price: High–Low") {
      list.sort((a, b) => (b.rentalPlan?.[0]?.["1day"] || 0) - (a.rentalPlan?.[0]?.["1day"] || 0));
    } else if (sortBy === "Newest") {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return list;
  }, [products, selectedGender, selectedBrand, selectedSize, selectedPrice, sortBy]);

  return (
    <div className="min-h-screen bg-[#080809] font-sora text-white">
      <Navbar />
      <div id="catalog-hero"><CatalogHero /></div>
      <CatalogFilters
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedPrice={selectedPrice}
        setSelectedPrice={setSelectedPrice}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <main id="catalog-products" className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8 pb-0">

        {/* Error Notification */}
        {apiError && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
            {apiError}
          </div>
        )}

        {/* Product Grid Layout */}
        {loading ? (
          <div className="text-center py-20 text-zinc-400">
            {t("catalog.loading")}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            {t("catalog.noProducts")}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {filteredProducts.slice(0, visibleCount).map((product) => (
              <motion.div
                key={product._id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Load more */}
        {visibleCount < filteredProducts.length && (
          <div className="flex justify-center mb-10">
            <button
              onClick={() => setVisibleCount((n) => n + 8)}
              className="px-8 py-3 rounded-full text-sm font-semibold text-neon border border-neon/30 hover:bg-neon hover:text-dark transition-all duration-200"
            >
              {t("catalog.loadMore")} ({filteredProducts.length - visibleCount} {t("catalog.remaining")})
            </button>
          </div>
        )}

        <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-40px" }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">

          {/* Banner 1: Strava */}
          <motion.div variants={fadeUp} className="relative bg-[#0f0f10] border border-[#1e1e20] rounded-lg overflow-hidden p-6 flex flex-col">
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #111 0%, #0a0a0a 100%)" }} />
            <div className="relative">
              <p className="text-[#C3FF51] text-[9px] font-bold tracking-[0.25em] uppercase mb-2">{t("catalog.banners.strava.badge")}</p>
              <h3 className="text-white text-xl font-extrabold leading-tight tracking-tight">STRAVA</h3>
              <p className="text-white/35 text-[11px] mt-2">{t("catalog.banners.strava.desc")}</p>
            </div>
            <div className="relative grid grid-cols-3 gap-1.5 my-4 flex-1">
              {["/strava-1.png", "/strava-2.png", "/strava-3.png"].map((src, i) => (
                <div key={i} className="rounded-lg bg-[#141415] border border-[#1e1e20] overflow-hidden h-full">
                  <img src={src} alt={`strava-${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="relative">
              <button className="border border-[#C3FF51]/60 text-[#C3FF51] text-[11px] font-bold px-5 py-2 rounded-full hover:bg-[#C3FF51]/10 transition-all tracking-wider">
                {t("catalog.banners.strava.cta")}
              </button>
            </div>
          </motion.div>

          {/* Banner 2: Leaderboard */}
          <motion.div variants={fadeUp} className="relative bg-[#0f0f10] border border-[#1e1e20] rounded-lg overflow-hidden p-6 flex flex-col">
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #111 100%)" }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(195,255,81,0.06) 0%, transparent 60%)" }} aria-hidden="true" />
            <div className="relative">
              <p className="text-white/30 text-[9px] font-semibold tracking-[0.25em] uppercase mb-1">{t("catalog.banners.leaderboard.badge")}</p>
              <h3 className="text-white text-2xl font-extrabold leading-tight tracking-tight">{t("catalog.banners.leaderboard.title")}</h3>
              <p className="text-white/35 text-[11px] mt-2">{t("catalog.banners.leaderboard.desc")}</p>
            </div>
            <div className="relative my-4 flex-1">
              <div className="rounded-lg bg-[#141415] border border-[#1e1e20] overflow-hidden h-full">
                <img src="/complete.avif" alt="Compete" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="relative">
              <button className="border border-[#C3FF51]/60 text-[#C3FF51] text-[11px] font-bold px-5 py-2 rounded-full hover:bg-[#C3FF51]/10 transition-all tracking-wider">
                {t("catalog.banners.leaderboard.cta")}
              </button>
            </div>
          </motion.div>

          {/* Banner 3: Community */}
          <motion.div variants={fadeUp} className="relative bg-[#0f0f10] border border-[#1e1e20] rounded-lg overflow-hidden p-6 flex flex-col">
            <div className="mb-3">
              <h3 className="text-white text-lg font-extrabold leading-snug tracking-tight">{t("catalog.banners.community.title")}</h3>
              <p className="text-white/35 text-[11px] mt-1.5">{t("catalog.banners.community.desc")}</p>
            </div>
            <div className="my-4 flex-1">
              <div className="rounded-lg bg-[#141415] border border-[#1e1e20] overflow-hidden h-full">
                <img src="/club.png" alt="Run Club" className="w-full h-full object-cover" />
              </div>
            </div>
            <Link to="/community" className="self-start border border-[#C3FF51]/60 text-[#C3FF51] text-[11px] font-bold px-5 py-2 rounded-full hover:bg-[#C3FF51]/10 transition-all tracking-wider">
              {t("catalog.banners.community.cta")}
            </Link>
          </motion.div>

        </motion.div>

        {/* Partners Animated Infinite Slider */}
        <motion.div id="partners" initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true, margin: "-40px" }} className="py-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#1e1e20]" />
            <button className="text-white text-xs font-bold tracking-[0.4em] uppercase border border-[#1e1e20] rounded-lg px-5 py-2 hover:border-[#C3FF51]/40 hover:text-[#C3FF51] transition-colors duration-200">
              {t("catalog.partners")}
            </button>
            <div className="flex-1 h-px bg-[#1e1e20]" />
          </div>

          <div className="overflow-hidden">
            <div className="flex gap-4 animate-marquee w-max">
              {[...PARTNERS, ...PARTNERS].map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex-shrink-0 w-[120px] h-[64px] border border-[#1e1e20] rounded-xl bg-white hover:border-[#C3FF51]/30 transition-colors duration-200 cursor-pointer flex items-center justify-center overflow-hidden"
                >
                  {PARTNER_LOGOS[item] ? (
                    <img src={PARTNER_LOGOS[item]} alt={item} className="w-full h-full object-contain p-2" />
                  ) : (
                    <span className="text-black/50 text-[11px] font-semibold tracking-wider">{item}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </main>

      <Footer />
      <ScrollArrow sections={["catalog-hero", "catalog-products", "partners"]} />
    </div>
  );
}
