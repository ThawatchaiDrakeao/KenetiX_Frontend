# 🚀 KenetiX Admin Dashboard Build Guide

> A newbie-friendly guide to building the admin dashboard with API integration

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [API Endpoints](#api-endpoints)
4. [Implementation Steps](#implementation-steps)
5. [File Guide](#file-guide)
6. [Code Examples](#code-examples)

---

## 🎯 Overview

**What is this?**

- KenetiX Admin Dashboard for managing shoe rental inventory
- Built with React + Vite + Tailwind CSS
- Uses Axios to connect with backend API

**What will we build?**

- Shoe lookup & search system
- Product management (Create, Read, Update, Delete)
- Brand management
- Category management

---

## 📁 Project Structure

```
src/
├── api/
│   ├── axios.js              ← Base axios configuration
│   └── shoesApi.js           ← [NEW] All shoe API functions
├── components/
│   └── admin/
│       ├── ShoeLookup.jsx    ← [MODIFY] Convert to use real API
│       ├── AdminSidebar.jsx
│       ├── OrderManagement.jsx
│       └── ... (other admin components)
└── ...
```

---

## 🔌 API Endpoints

### **Base URL:** `https://kinetix-qnx5.onrender.com`

### **READ Operations** (Fetch data)

| Method | Endpoint              | Purpose                     |
| ------ | --------------------- | --------------------------- |
| GET    | `/brand`              | Get all brands              |
| GET    | `/brand/:brand`       | Get shoes by specific brand |
| GET    | `/category/:category` | Get shoes by category       |
| GET    | `/:id`                | Get single shoe by ID       |

### **CREATE Operations** (Add new data)

| Method | Endpoint         | Purpose                 |
| ------ | ---------------- | ----------------------- |
| POST   | `/newBrand`      | Create new brand        |
| POST   | `/createProduct` | Create new shoe product |

### **UPDATE Operations** (Modify data)

| Method | Endpoint | Purpose                  |
| ------ | -------- | ------------------------ |
| PATCH  | `/:_id`  | Update/Edit shoe product |

### **DELETE Operations** (Remove data)

| Method | Endpoint | Purpose             |
| ------ | -------- | ------------------- |
| DELETE | `/:_id`  | Delete shoe product |

---

## 🛠️ Implementation Steps

### **Step 1: Create `shoesApi.js`** ✅

Create a new file: `src/api/shoesApi.js`

This file will contain all the API functions:

- `getShoeById(id)` - Fetch single shoe
- `getShoesByBrand(brand)` - Fetch shoes by brand
- `getAllBrands()` - Fetch all brands
- `getShoesByCategory(category)` - Fetch shoes by category
- `createBrand(brandData)` - Create new brand
- `createProduct(productData)` - Create new shoe
- `updateProduct(id, productData)` - Update shoe
- `deleteProduct(id)` - Delete shoe

### **Step 2: Modify `ShoeLookup.jsx`** ✅

Replace mock data with API calls:

- Remove `mockShoes` array
- Add loading state (show spinner while fetching)
- Add error state (show error message if API fails)
- Add `useEffect` hook to fetch data
- Connect search buttons to API functions

### **Step 3: Test the connection** ✅

- Run `npm run dev`
- Open browser DevTools → Network tab
- Perform searches to verify API calls
- Check console for any errors

---

## 📄 File Guide

### **1. `src/api/shoesApi.js` (NEW FILE)**

**Purpose:** Central place for all shoe-related API calls

**What's inside:**

- Import axios from `./axios.js`
- Export functions for each API endpoint
- Error handling for each function
- Comments explaining what each function does

**Why?**

- Keeps API logic separate from component logic
- Reusable - can be used in multiple components
- Easier to maintain and debug

---

### **2. `src/components/admin/ShoeLookup.jsx` (MODIFIED)**

**Old way:** Used hardcoded `mockShoes` array

**New way:** Will fetch data from API using functions from `shoesApi.js`

**Changes:**

- Remove `mockShoes` constant
- Add `import { getShoesByBrand, getShoesByCategory, ... } from "../../api/shoesApi"`
- Add `loading` state
- Add `error` state
- Add `useEffect` hook to call API functions
- Update search handler to use API functions instead of filtering local data

---

## 💻 Code Examples

### **Example 1: API Service Function**

```javascript
// src/api/shoesApi.js
import API from "./axios";

// Get shoes by brand
export const getShoesByBrand = async (brand) => {
  try {
    const response = await API.get(`/brand/${brand}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching shoes by brand:", error);
    throw error;
  }
};

// Get single shoe by ID
export const getShoeById = async (id) => {
  try {
    const response = await API.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching shoe by ID:", error);
    throw error;
  }
};
```

### **Example 2: Using API in Component**

```javascript
// src/components/admin/ShoeLookup.jsx
import { useState, useEffect } from "react";
import { getShoesByBrand } from "../../api/shoesApi";

export default function ShoeLookup() {
  const [searchBy, setSearchBy] = useState("brand");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false); // NEW: Loading state
  const [error, setError] = useState(null); // NEW: Error state
  const [searched, setSearched] = useState(false);

  // NEW: Function to search using API
  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;

    setLoading(true); // Show loading spinner
    setError(null); // Clear previous errors

    try {
      if (searchBy === "brand") {
        const data = await getShoesByBrand(q);
        setResults(data);
      }
      // ... handle other search types
      setSearched(true);
    } catch (err) {
      setError("Failed to fetch results. Please try again.");
      setResults([]);
      setSearched(true);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Show loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // Show error state
  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  // ... rest of component
}
```

---

## 🧪 Testing Checklist

- [ ] Shoe lookup fetches data correctly
- [ ] Brand search works
- [ ] Category search works
- [ ] ID search works
- [ ] Loading spinner shows while fetching
- [ ] Error message shows if API fails
- [ ] No console errors
- [ ] Network requests visible in DevTools

---

## 📝 API Request/Response Example

### **Request:**

```javascript
// Get shoes by brand "Nike"
GET https://kinetix-qnx5.onrender.com/brand/Nike
```

### **Response (Success):**

```json
[
  {
    "_id": "6a1eb24e64aac32fd29de3e3",
    "name": "Air Max",
    "brand": "Nike",
    "size": 42,
    "color": "Black",
    "category": "Daily trainer",
    "price": 2100,
    "stock": 15,
    "is_active": true
  }
]
```

### **Response (Error):**

```json
{
  "error": "Brand not found"
}
```

---

## 🚨 Common Issues & Solutions

| Issue                                 | Solution                                                    |
| ------------------------------------- | ----------------------------------------------------------- |
| "Network Error"                       | Check if backend API is running                             |
| "Cannot read properties of undefined" | Make sure API response has expected data structure          |
| "CORS Error"                          | Backend already has `withCredentials: true` in axios config |
| Infinite loading                      | Add `useEffect` dependency array                            |
| No results showing                    | Check console for error messages                            |

---

## 📚 Newbie Tips

1. **console.log() is your friend** - Log API responses to understand data structure
2. **Check Network tab** - See exact requests/responses in DevTools
3. **Read error messages** - They usually tell you what's wrong
4. **Test one search type at a time** - Get one working, then add others
5. **Start simple** - Get search working, then add create/update/delete

---

## ✅ Next Steps

1. Create `src/api/shoesApi.js` with all API functions
2. Update `ShoeLookup.jsx` to use API calls
3. Test each search function
4. Add create/update/delete functionality to other admin components
5. Deploy to production

---

**Last Updated:** 2026-06-07  
**Status:** Ready to implement ✅
