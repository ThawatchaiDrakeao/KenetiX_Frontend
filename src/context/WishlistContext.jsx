import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import API from "../api/axios";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  // Fetch wishlist from backend
  const fetchWishlist = useCallback(async () => {
    if (!user?._id) return;

    try {
      const response = await API.get("/api/wishlist");
      if (response.data.success) {
        setWishlist(response.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    }
  }, [user]);

  useEffect(() => {
    if (!user?._id) {
      queueMicrotask(() => setWishlist([]));
      return;
    }

    queueMicrotask(() => fetchWishlist());
  }, [user, fetchWishlist]);

  const getProductId = (item) =>
    item?.productId?._id || item?.productId || item?._id;

  const isWished = (productId) =>
    wishlist.some((item) => getProductId(item) === productId);

  // Add product to wishlist
  const addToWishlist = async (productId) => {
    if (!user?._id) {
      alert("Please login to save favourites");
      return false;
    }

    try {
      const response = await API.post(`/api/wishlist/${productId}`);
      if (response.data.success) {
        await fetchWishlist();
        return true;
      }
    } catch (err) {
      console.error("Failed to add to wishlist", err);
      return false;
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    if (!user?._id) return false;

    try {
      const response = await API.delete(`/api/wishlist/${productId}`);
      if (response.data.success) {
        await fetchWishlist();
        return true;
      }
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
      return false;
    }
  };

  const toggleWishlist = async (productId) =>
    isWished(productId)
      ? removeFromWishlist(productId)
      : addToWishlist(productId);

  const value = {
    wishlist,
    wishlistCount: wishlist.length,
    isWished,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined || context === null) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
