import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import API from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Fetch cart from backend
  const fetchUserCart = useCallback(async () => {
    if (!user?._id) return;

    try {
      const response = await API.get(`/api/cart/${user._id}`);
      if (response.data.success) {
        const items = response.data.data || [];
        setCart(items);
        const count = items.reduce(
          (sum, item) => sum + (item.quantity || 1),
          0,
        );
        setCartCount(count);
      }
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  }, [user]);

  useEffect(() => {
    if (!user?._id) {
      queueMicrotask(() => {
        setCart([]);
        setCartCount(0);
      });
      return;
    }

    const loadCart = async () => {
      await fetchUserCart();
    };

    loadCart();
  }, [user, fetchUserCart]);

  // Add item to cart
  const addToCart = async (productData) => {
    if (!user?._id) {
      alert("Please login to add items to cart");
      return false;
    }

    try {
      const response = await API.post(
        `/api/cart/addItem/${user._id}`,
        productData,
      );

      if (response.data.success) {
        await fetchUserCart();
        return true;
      }
    } catch (err) {
      console.error("Failed to add to cart", err);
      alert(err.response?.data?.message || "Cannot add to cart");
      return false;
    }
  };

  // Remove item from cart
  const removeFromCart = async (productData) => {
    if (!user?._id) return false;

    try {
      const response = await API.delete(`/api/cart/removeItem/${user._id}`, {
        data: productData,
      });

      if (response.data.success) {
        await fetchUserCart();
        return true;
      }
    } catch (err) {
      console.error("Failed to remove from cart", err);
      return false;
    }
  };

  const value = {
    cart,
    cartCount,
    addToCart,
    removeFromCart,
    fetchUserCart,
    isCartOpen,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined || context === null) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
