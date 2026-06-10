// api/shoesApi.js
import API from "./axios";

// ============ READ OPERATIONS ============

// Get all shoes/products
export const getAllShoes = async () => {
  try {
    const response = await API.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching all shoes:", error);
    throw error;
  }
};

export const getAllProducts = getAllShoes;

// Get single shoe by ID
export const getShoeById = async (id) => {
  try {
    const response = await API.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching shoe with ID ${id}:`, error);
    throw error;
  }
};

// Get shoes by brand
export const getShoesByBrand = async (brand) => {
  try {
    const response = await API.get(`/products/brand/${brand}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching shoes by brand ${brand}:`, error);
    throw error;
  }
};

// Get shoes by category
export const getShoesByCategory = async (category) => {
  try {
    const response = await API.get(`/products/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching shoes by category ${category}:`, error);
    throw error;
  }
};

// Get all brands
export const getAllBrands = async () => {
  try {
    const response = await API.get("/brands");
    return response.data;
  } catch (error) {
    console.error("Error fetching all brands:", error);
    throw error;
  }
};

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await API.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching all categories:", error);
    throw error;
  }
};

// ============ CREATE OPERATIONS ============

// Create new brand (Admin only)
export const createBrand = async (brandData) => {
  try {
    const response = await API.post("/brands", brandData);
    return response.data;
  } catch (error) {
    console.error("Error creating brand:", error);
    throw error;
  }
};

// Create new product/shoe (Admin only)
export const createProduct = async (productData) => {
  try {
    const response = await API.post("/products", productData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// ============ UPDATE OPERATIONS ============

// Update product by ID (Admin only)
export const updateProduct = async (id, productData) => {
  try {
    const response = await API.patch(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

// Update shoe stock
export const updateShoeStock = async (id, stockData) => {
  try {
    const response = await API.patch(`/products/${id}/stock`, stockData);
    return response.data;
  } catch (error) {
    console.error(`Error updating stock for product ${id}:`, error);
    throw error;
  }
};

// ============ DELETE OPERATIONS ============

// Delete product by ID (Admin only) - Soft delete (sets isActive to false)
export const deleteProduct = async (id) => {
  try {
    const response = await API.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};

// Hard delete (permanent removal) - Admin only
export const hardDeleteProduct = async (id) => {
  try {
    const response = await API.delete(`/products/${id}/permanent`);
    return response.data;
  } catch (error) {
    console.error(`Error permanently deleting product ${id}:`, error);
    throw error;
  }
};

// ============ INVENTORY MANAGEMENT ============

// Get low stock items (Admin only)
export const getLowStockItems = async (threshold = 5) => {
  try {
    const response = await API.get(`/products/low-stock?threshold=${threshold}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    throw error;
  }
};

// Bulk update prices (Admin only)
export const bulkUpdatePrices = async (updates) => {
  try {
    const response = await API.post("/products/bulk-update", updates);
    return response.data;
  } catch (error) {
    console.error("Error bulk updating prices:", error);
    throw error;
  }
};

// ============ HELPER FUNCTIONS ============

// Format shoe data for display
export const formatShoeData = (shoe) => {
  return {
    id: shoe._id || shoe.id,
    name: shoe.modelName || shoe.name,
    brand: shoe.brandId?.brandName || shoe.brand,
    category: shoe.category,
    gender: shoe.gender,
    price: shoe.rentalPlan?.[0]?.["1day"] || shoe.price,
    stock: shoe.variants?.reduce((total, v) => {
      return total + (v.size?.reduce((sum, s) => sum + (s.stock || 0), 0) || 0);
    }, 0) || shoe.stock,
    isActive: shoe.isActive !== false,
    images: shoe.variants?.[0]?.images || [],
    variants: shoe.variants,
    rentalPlan: shoe.rentalPlan,
  };
};

// Get available sizes for a shoe
export const getAvailableSizes = (shoe) => {
  if (!shoe.variants) return [];

  const sizes = [];
  shoe.variants.forEach(variant => {
    variant.size?.forEach(size => {
      if (size.stock > 0) {
        sizes.push(size.size);
      }
    });
  });
  return [...new Set(sizes)].sort((a, b) => a - b);
};