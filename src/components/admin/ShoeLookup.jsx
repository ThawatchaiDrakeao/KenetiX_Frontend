import { useState } from "react";
import {
  getAllShoes,
  getShoeById,
  getShoesByBrand,
  getShoesByCategory,
} from "../../api/shoesApi";

const SEARCH_FIELDS = [
  { key: "all", label: "All" },
  { key: "id", label: "ID" },
  { key: "brand", label: "Brand" },
  { key: "category", label: "Category" },
];

const placeholder = {
  all: "Click Search to get all shoes...",
  id: "Enter Shoe ID...",
  brand: "Example: Nike, Adidas, Asics...",
  category: "Example: Road, Trail, Daily trainer...",
};

const card = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};
const inner = { background: "#F8FAFC", border: "1px solid #E2E8F0" };
const activeFilter = {
  background: "rgba(195,255,81,0.10)",
  color: "#4D7C0F",
  border: "1px solid rgba(195,255,81,0.30)",
};
const idleFilter = {
  background: "transparent",
  color: "#64748B",
  border: "1px solid #E2E8F0",
};

function normalizeShoes(data) {
  // Handle different response formats from your API
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.products)) return data.products;
  if (data && typeof data === "object" && !Array.isArray(data)) return [data];
  return [];
}

function formatPrice(price) {
  if (price === null || price === undefined || price === "") return "-";
  return `฿${Number(price).toLocaleString()}`;
}

function getStatusLabel(isActive) {
  if (isActive === true) return "Active";
  if (isActive === false) return "Inactive";
  return "Unknown";
}

function getStatusClass(isActive) {
  if (isActive === true) {
    return "text-[#4D7C0F] bg-[rgba(195,255,81,0.12)] border-[rgba(195,255,81,0.35)]";
  }
  if (isActive === false) {
    return "text-[#DC2626] bg-[#FEE2E2] border-[#FECACA]";
  }
  return "text-[#64748B] bg-[#F8FAFC] border-[#E2E8F0]";
}

export default function ShoeLookup() {
  const [searchBy, setSearchBy] = useState("all");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const q = query.trim();
    if (loading) return;
    if (searchBy !== "all" && !q) return;

    setLoading(true);
    setError("");

    try {
      let response;
      let data;

      if (searchBy === "all") {
        response = await getAllShoes();
        data = normalizeShoes(response);
      } else if (searchBy === "id") {
        response = await getShoeById(q);
        data = normalizeShoes(response);
      } else if (searchBy === "brand") {
        response = await getShoesByBrand(q);
        data = normalizeShoes(response);
      } else {
        response = await getShoesByCategory(q);
        data = normalizeShoes(response);
      }

      setResults(data);
      setSearched(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch shoes. Please try again.");
      setResults([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl p-5" style={card}>
      <h3 className="font-semibold font-sora text-[14px] mb-4" style={{ color: "#0F172A" }}>
        Shoe Lookup
      </h3>

      <div className="flex gap-2 mb-3 flex-wrap">
        {SEARCH_FIELDS.map((field) => (
          <button
            key={field.key}
            onClick={() => {
              setSearchBy(field.key);
              setQuery("");
              setResults([]);
              setError("");
              setSearched(false);
            }}
            className="text-xs px-3 py-1.5 rounded-lg font-sora transition-colors"
            style={searchBy === field.key ? activeFilter : idleFilter}
          >
            {field.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={placeholder[searchBy]}
          disabled={searchBy === "all"}
          className="flex-1 text-sm rounded-lg px-3 py-2 font-sora focus:outline-none"
          style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            color: searchBy === "all" ? "#94A3B8" : "#0F172A",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#C3FF51"; }}
          onBlur={(e) => { e.target.style.borderColor = "#E2E8F0"; }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="text-sm px-4 py-2 rounded-lg font-semibold font-sora disabled:cursor-not-allowed"
          style={{ background: loading ? "#E2E8F0" : "#C3FF51", color: "#0F172A" }}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {error && (
        <p className="text-sm font-sora mb-3" style={{ color: "#DC2626" }}>
          {error}
        </p>
      )}

      {loading && (
        <div className="rounded-xl p-4" style={inner}>
          <p className="text-sm font-sora" style={{ color: "#64748B" }}>Loading shoes...</p>
        </div>
      )}

      {searched && !loading && !error && results.length === 0 && (
        <p className="text-sm font-sora" style={{ color: "#DC2626" }}>No matching shoes found.</p>
      )}

      {!loading && results.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-sora" style={{ color: "#94A3B8" }}>
            Found {results.length} item{results.length === 1 ? "" : "s"}
          </p>
          {results.map((shoe) => (
            <div key={shoe._id || shoe.id || shoe.modelName} className="rounded-xl p-4" style={{ border: "1px solid #E2E8F0" }}>
              <div className="flex items-center justify-between mb-3 gap-3">
                <p className="font-semibold font-sora" style={{ color: "#0F172A" }}>
                  {shoe.modelName || shoe.name || "Unnamed shoe"}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-sora ${getStatusClass(shoe.isActive)}`}>
                  {getStatusLabel(shoe.isActive)}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {[
                  { label: "Brand", value: shoe.brandId?.brandName || shoe.brand || "-" },
                  { label: "Category", value: shoe.category || "-" },
                  { label: "Gender", value: shoe.gender || "-" },
                  { label: "Price (1 day)", value: formatPrice(shoe.rentalPlan?.[0]?.["1day"] || shoe.price) },
                  { label: "Stock", value: shoe.stock ?? "-" },
                  { label: "Description", value: shoe.description?.substring(0, 50) || "-" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg p-2" style={inner}>
                    <p className="text-xs font-sora" style={{ color: "#94A3B8" }}>{item.label}</p>
                    <p className="text-sm font-medium font-sora" style={{ color: "#0F172A" }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!searched && !loading && (
        <p className="text-xs font-sora" style={{ color: "#CBD5E1" }}>
          Choose All to load every shoe, or choose another search type and enter a query.
        </p>
      )}
    </div>
  );
}