import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CreditCard, Wallet, Apple, Landmark, CheckCircle, ChevronRight, X, UtensilsCrossed } from "lucide-react";
import { FaGooglePay } from "react-icons/fa";

export default function PaymentPage() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // API URL
  const API_URL = "http://localhost:7080/api/Payment";

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

  // Billing breakdown (Simulated for visual flair)
  const subtotal = totalAmount / 1.23;
  const tax = subtotal * 0.08;
  const tip = subtotal * 0.15;

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
      method: paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)
    };

    try {
      const response = await axios.post(API_URL, paymentData);
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
        await axios.post("http://localhost:7080/api/Orders/CreateOrder", newOrder);
      } catch (orderErr) {
        console.error("Order API Error:", orderErr);
      }

      // Clear cart
      localStorage.removeItem("cart");

      setTimeout(() => {
        navigate("/UserDash");
      }, 2500);

    } catch (error) {
      console.error("Payment API Error:", error);
      setIsProcessing(false);
      alert("Payment failed. Check API connection.");
    }
  };

  return (
    <div className="relative min-h-screen font-serif bg-[#fdfaf5] text-[#4a3b31] overflow-x-hidden">
      
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cream-pixels.png')` }}></div>
      
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-5xl">
        
        {/* Header Section */}
        <header className="text-center mb-16">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="h-px w-16 bg-[#d4a373]"></div>
            <UtensilsCrossed size={32} className="text-[#8c5a31]" />
            <h2 className="text-3xl italic font-light text-[#8c5a31]">Golden Essence</h2>
            <div className="h-px w-16 bg-[#d4a373]"></div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-[#4a3b31] mb-2">Review & Pay Your Bill</h1>
          <p className="text-lg text-[#8b7e74] font-sans">Please review your order and select a payment method.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Order Summary */}
          <div className="bg-[#fffdfb] border border-[#e8dfd5] rounded-lg shadow-sm p-8 flex flex-col h-full">
            <h3 className="text-2xl font-bold border-b border-[#e8dfd5] pb-4 mb-6 text-[#8c5a31]">Order Summary</h3>
            
            <div className="flex-1 space-y-4 mb-8 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-lg">
                  <span className="font-medium">{item.name} <span className="text-sm text-[#8b7e74] ml-1">x{item.qty}</span></span>
                  <span className="font-sans font-semibold text-[#8c5a31]">{"\u20B9"}{(parsePrice(item.price) * item.qty).toFixed(2)}</span>
                </div>
              ))}
              {cartItems.length === 0 && <p className="text-center py-6 text-[#8b7e74]">Your cart is empty.</p>}
            </div>

            <div className="border-t border-[#e8dfd5] pt-6 space-y-3 font-sans">
              <div className="flex justify-between text-[#8b7e74]">
                <span>Subtotal</span>
                <span>{"\u20B9"}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#8b7e74]">
                <span>Tax (8%)</span>
                <span>{"\u20B9"}{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#8b7e74]">
                <span>Tip (15%)</span>
                <span>{"\u20B9"}{tip.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-[#e8dfd5]">
                <span className="text-2xl font-serif font-bold text-[#4a3b31]">Total Amount</span>
                <span className="text-3xl font-bold text-[#d48c31]">{"\u20B9"}{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={() => navigate("/Menu1")} className="mt-8 text-sm uppercase tracking-widest text-[#d4a373] hover:text-[#8c5a31] transition-colors border-b border-transparent hover:border-[#8c5a31] self-center pb-1">
              Edit Order
            </button>
          </div>

          {/* Right Column: Payment & Checkout */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-[#8c5a31] lg:mt-0">Select Payment Method</h3>
            
            <div className="space-y-3 font-sans">
              
              {/* Credit Card Card */}
              <div 
                onClick={() => setPaymentMethod("card")}
                className={`group cursor-pointer rounded-xl border-2 transition-all overflow-hidden ${paymentMethod === 'card' ? 'border-[#e67e22] ring-4 ring-[#e67e22]/10' : 'border-[#e8dfd5] hover:border-[#d4a373]'}`}
              >
                <div className={`p-4 flex items-center gap-4 ${paymentMethod === 'card' ? 'bg-[#e67e22] text-white' : 'bg-white text-[#4a3b31]'}`}>
                  <CreditCard size={24} />
                  <span className="font-bold text-lg flex-1">Credit / Debit Card</span>
                  {paymentMethod === 'card' && <CheckCircle size={20} />}
                </div>
                
                {paymentMethod === 'card' && (
                  <div className="p-6 bg-white space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <input 
                      type="text" 
                      placeholder="Card Number" 
                      className="w-full p-3 border border-[#e8dfd5] rounded-lg focus:outline-none focus:border-[#e67e22]" 
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="MM / YY" 
                        className="p-3 border border-[#e8dfd5] rounded-lg focus:outline-none focus:border-[#e67e22]" 
                      />
                      <input 
                        type="text" 
                        placeholder="CVC" 
                        className="p-3 border border-[#e8dfd5] rounded-lg focus:outline-none focus:border-[#e67e22]" 
                      />
                    </div>
                    <div className="flex gap-2">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2000px-Visa_Inc._logo.svg.png" className="h-6 opacity-60" alt="visa" />
                       <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-6 opacity-60" alt="master" />
                    </div>
                  </div>
                )}
              </div>

              {/* Apple Pay */}
              <div 
                onClick={() => setPaymentMethod("apple")}
                className={`p-4 cursor-pointer rounded-xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'apple' ? 'border-[#e67e22] bg-white shadow-md ring-4 ring-[#e67e22]/10' : 'border-[#e8dfd5] bg-white hover:border-[#d4a373]'}`}
              >
                 <Apple size={24} />
                 <span className="font-bold text-lg flex-1">Apple Pay</span>
                 {paymentMethod === 'apple' && <CheckCircle size={20} className="text-[#e67e22]" />}
              </div>

              {/* Google Pay */}
              <div 
                onClick={() => setPaymentMethod("google")}
                className={`p-4 cursor-pointer rounded-xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'google' ? 'border-[#e67e22] bg-white shadow-md ring-4 ring-[#e67e22]/10' : 'border-[#e8dfd5] bg-white hover:border-[#d4a373]'}`}
              >
                 <FaGooglePay size={28} className="text-[#4285F4]" />
                 <span className="font-bold text-lg flex-1">Google Pay</span>
                 {paymentMethod === 'google' && <CheckCircle size={20} className="text-[#e67e22]" />}
              </div>

              {/* Cash */}
              <div 
                onClick={() => setPaymentMethod("cash")}
                className={`p-4 cursor-pointer rounded-xl border-2 flex items-center gap-4 transition-all ${paymentMethod === 'cash' ? 'border-[#e67e22] bg-white shadow-md ring-4 ring-[#e67e22]/10' : 'border-[#e8dfd5] bg-white hover:border-[#d4a373]'}`}
              >
                 <Wallet size={24} className="text-[#27ae60]" />
                 <span className="font-bold text-lg flex-1">Pay with Cash</span>
                 {paymentMethod === 'cash' && <CheckCircle size={20} className="text-[#e67e22]" />}
              </div>

            </div>

            {/* Complete Payment Button */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing || cartItems.length === 0}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#d48c31] to-[#e67e22] text-white font-bold text-xl shadow-xl shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none mt-4 flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                "Complete Payment"
              )}
            </button>
            <p className="text-center text-xs text-[#8b7e74] uppercase tracking-widest font-sans">Secure encrypted payment processing</p>

          </div>

        </div>

      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] bg-[#4a3b31]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-12 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-[#4a3b31] mb-2 font-serif">Payment Success!</h2>
            <p className="text-[#8b7e74] mb-8 font-sans">Your order has been confirmed and is being prepared.</p>
            <div className="w-full bg-[#fdfaf5] p-3 rounded-xl text-sm font-sans text-[#8c5a31] animate-pulse">
              Redirecting to dashboard...
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #fdfaf5;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d4a373;
          border-radius: 10px;
        }
      `}} />

    </div>
  );
}





