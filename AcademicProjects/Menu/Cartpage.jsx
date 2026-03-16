import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  // Update cart in state & localStorage
  const updateCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const increaseQty = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    );
    updateCart(updated);
  };

  const decreaseQty = (id) => {
    const updated = cartItems
      .map((item) =>
        item.id === id ? { ...item, qty: item.qty - 1 } : item
      )
      .filter((item) => item.qty > 0);
    updateCart(updated);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    updateCart(updated);
  };

  // Convert price to number safely — handles "₹150", 150, or "150"
  const parsePrice = (price) => Number(String(price).replace(/[^0-9.-]+/g, ""));

  const totalAmount = cartItems.reduce(
    (total, item) => total + parsePrice(item.price) * item.qty,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex justify-center items-start py-10 px-4">

      <div className="w-full max-w-3xl">

        <h1 className="text-3xl font-bold mb-6 text-center text-amber-900">
          🛒 Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-xl shadow">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty 🛒</p>
            <Link to="/Menu1">
              <button className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold">
                Browse Menu
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-3 last:border-b-0"
                >
                  <div>
                    <h2 className="font-medium text-lg">{item.name}</h2>
                    <p className="text-gray-500">
                      ₹{parsePrice(item.price)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded font-semibold text-amber-900"
                    >
                      -
                    </button>

                    <span className="w-6 text-center">{item.qty}</span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      className="px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded font-semibold text-amber-900"
                    >
                      +
                    </button>
                  </div>

                  {/* Price & Remove */}
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">
                      ₹{parsePrice(item.price) * item.qty}
                    </span>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="mt-6 bg-white p-6 rounded-xl shadow flex flex-col md:flex-row justify-between items-center">
              <h2 className="text-xl font-bold">
                Total: ₹{totalAmount}
              </h2>

              <Link to="/PaymentDetails">
                <button className="mt-4 md:mt-0 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold">
                  Proceed to Payment
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;
