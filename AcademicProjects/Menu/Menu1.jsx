import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, CheckCircle, ArrowLeft } from "lucide-react";
import axios from "axios";

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // Load cart count on mount
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.reduce((sum, i) => sum + i.qty, 0));
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get("http://localhost:7080/api/Menu");

        const categoryMap = {
          1: "Starters",
          2: "Main Course",
          3: "Desserts",
          4: "Drinks",
          5: "Specials"
        };

        const mappedItems = response.data.map((item) => ({
          ...item,
          id: item.menu_id,
          name: item.item_name,
          category: categoryMap[item.category_id] || "Other",
          description: item.description,
          price: `\u20B9${item.price}`,
          rawPrice: item.price,
          image: item.image ? `data:image/jpeg;base64,${item.image}` : null
        }));

        setMenuItems(mappedItems);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      }
    };

    fetchMenu();
  }, []);

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exist = cart.find((i) => i.id === item.id);

    if (exist) {
      exist.qty += 1;
    } else {
      cart.push({ ...item, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Update cart count badge
    const newCount = cart.reduce((sum, i) => sum + i.qty, 0);
    setCartCount(newCount);

    // Show toast notification - no blocking alert!
    setToast(item.name);
    setTimeout(() => setToast(null), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/Login");
  };

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const categories = ["All", "Starters", "Main Course", "Desserts", "Drinks", "Specials"];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-amber-50 to-white">

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle size={20} />
          <span className="font-semibold">{toast} added to cart!</span>
        </div>
      )}

      {/* Sticky Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow sticky top-0 z-40">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-amber-900 hover:text-amber-600 font-semibold transition"
        >
          <ArrowLeft size={20} /> Back
        </button>

        {/* Cart Icon with live count badge */}
        <Link to="/Cart" className="relative text-amber-900 hover:text-amber-600 transition">
          <ShoppingCart size={28} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </Link>
      </div>

      <div className="p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-amber-900 mb-6 text-center">{"\uD83C\uDF7D\uFE0F"} Menu</h1>

        {/* CATEGORY FILTER BUTTONS */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                selectedCategory === cat
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-amber-100 text-amber-900 hover:bg-amber-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* MENU ITEMS GRID */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-lg">
            No items found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-24">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-md hover:shadow-xl transition-shadow rounded-xl flex flex-col h-full border border-amber-100 overflow-hidden"
              >
                {item.image ? (
                  <img src={item.image} className="h-48 w-full object-cover" alt={item.name} />
                ) : (
                  <div className="h-48 w-full bg-amber-100 flex items-center justify-center text-amber-500 font-bold text-lg border-b border-amber-200">
                    No Image
                  </div>
                )}

                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="font-bold text-lg text-amber-900 line-clamp-1">{item.name}</h2>
                  <p className="text-gray-500 text-sm mt-1 mb-3 line-clamp-2 flex-grow">{item.description}</p>

                  <div className="mt-auto flex items-center justify-between gap-2">
                    <span className="font-bold text-amber-700 text-xl">{item.price}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-150 shadow-sm hover:shadow-md flex items-center gap-1"
                    >
                      <ShoppingCart size={16} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating "View Cart" button appears when cart has items */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <Link to="/Cart">
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 transition-all hover:scale-105">
              <ShoppingCart size={20} />
              View Cart ({cartCount} items)
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}









