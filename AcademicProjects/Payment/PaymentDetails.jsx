import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentPage() {

  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // API URL (change port if needed)
  const API_URL = "https://localhost:7080/api/Payment";

  // Load cart
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  // Convert price string to number
  const parsePrice = (price) => {
    return Number(price.toString().replace(/[^0-9.-]+/g, ""));
  };

  // Total amount
  const totalAmount = cartItems.reduce(
    (total, item) => total + parsePrice(item.price) * item.qty,
    0
  );

  // Pay Now
  const handlePayNow = async () => {

    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    setIsProcessing(true);

    const paymentData = {
      payment_date: new Date().toISOString().split("T")[0],
      amount: totalAmount,
      method: "Online Payment"
    };

    try {

      const response = await axios.post(API_URL, paymentData);

      console.log("API Response:", response.data);

      setIsProcessing(false);
      setShowSuccess(true);

      // Save order to Backend Database
      const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
      const userMail = currentUser.emailId || currentUser.email || "guest@example.com";
      const itemsString = cartItems.map(item => `${item.name} x${item.qty}`).join(", ");

      const newOrder = {
        id: `ORD${Date.now()}`,
        userEmail: userMail,
        items: itemsString,
        totalAmount: totalAmount,
        orderDate: new Date().toLocaleDateString(),
        status: "Pending"
      };

      try {
        console.log("Submitting Order Payload:", newOrder);
        await axios.post("https://localhost:7080/api/Orders/CreateOrder", newOrder);
      } catch (orderErr) {
        console.error("Order API Error:", orderErr);
      }

      // Clear cart
      localStorage.removeItem("cart");

      setTimeout(() => {
        navigate("/UserDash");
      }, 2000);

    } catch (error) {

      console.error("Payment API Error:", error);
      setIsProcessing(false);

      alert("Payment failed. Check API connection.");

    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6">

        <h1 className="text-2xl font-bold text-center mb-4">
          Restaurant Checkout
        </h1>

        {/* Order Summary */}

        <div className="border rounded-xl p-4 mb-6">

          <h2 className="font-semibold mb-3">Your Items</h2>

          {cartItems.length === 0 && (
            <p className="text-gray-500 text-sm">No items in cart</p>
          )}

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm text-gray-600 mb-1"
            >
              <span>{item.name} × {item.qty}</span>
              <span>₹{parsePrice(item.price) * item.qty}</span>
            </div>
          ))}

          <hr className="my-2" />

          <div className="flex justify-between font-bold">
            <span>Total Amount</span>
            <span>₹{totalAmount}</span>
          </div>

        </div>

        {/* Pay Button */}

        <button
          onClick={handlePayNow}
          disabled={isProcessing}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl disabled:opacity-60"
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
+
      </div>


      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">

          <div className="bg-white rounded-xl p-6 text-center">

            <p className="font-semibold mb-3">Processing Payment...</p>

            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

          </div>

        </div>
      )}

      {/* Success Popup */}

      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">

          <div className="bg-white rounded-xl p-6 text-center">

            <h2 className="text-green-600 font-bold text-xl mb-2">
              Payment Successful 🎉
            </h2>

            <p className="text-gray-500">
              Redirecting to dashboard...
            </p>

          </div>

        </div>
      )}

    </div>
  );
}