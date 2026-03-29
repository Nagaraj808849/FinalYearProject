import React, { useState, useEffect } from "react";
import { LayoutDashboard, ClipboardList, LogOut, User } from "lucide-react";
import axios from "axios";

export default function UserDash() {

  const [active, setActive] = useState("dashboard");
  const [loggedIn, setLoggedIn] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [showBigImage, setShowBigImage] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    photo: null,
  });

  const [myOrders, setMyOrders] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);

  // ===============================
  // LOAD USER FROM LOCAL STORAGE
  // ===============================

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setProfile({
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || (user.emailId || user.email || "").split("@")[0] || "User",
        email: user.emailId || user.email || "",
        photo: localStorage.getItem("profilePhoto") || null
      });
    }
  }, []);

  // ===============================
  // LOAD ORDERS FROM API
  // ===============================

  const fetchOrders = async () => {
    if (!profile.email) return;
    try {
      const resp = await axios.get(`http://localhost:7080/api/Orders/GetOrders/${profile.email}`);
      const orders = resp.data;
      setMyOrders(orders);
      
      const expenseResp = await axios.get(`http://localhost:7080/api/Orders/GetTotalExpense/${profile.email}`);
      setTotalExpense(expenseResp.data.totalExpense);
    } catch (err) {
      console.error("Failed to load orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // refresh every 30 seconds
    return () => clearInterval(interval);
  }, [profile.email]);

  // ===============================
  // PROFILE IMAGE UPLOAD
  // ===============================

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    // Save to LocalStorage to persist User Profile
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    const names = profile.name.split(" ");
    currentUser.firstName = names[0] || "";
    currentUser.lastName = names.slice(1).join(" ") || "";
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    localStorage.setItem("profilePhoto", profile.photo);
    
    setSuccessMessage("Profile Updated Successfully \u2705");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/Login"; // Hard redirect to clear all state
  };

  if (!loggedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-orange-50">
        <button
          onClick={() => setLoggedIn(true)}
          className="bg-orange-400 text-white px-6 py-2 rounded-xl"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-orange-50 relative">

      {/* SIDEBAR */}

      <div className="w-64 bg-white shadow-lg text-gray-700 flex flex-col p-5 space-y-6">

        <h1 className="text-2xl font-bold text-orange-500">
          Restaurant Panel
        </h1>

        <button
          onClick={() => setActive("dashboard")}
          className={`flex items-center gap-2 p-2 rounded-xl ${
            active === "dashboard"
              ? "bg-orange-100 text-orange-600"
              : "hover:bg-orange-50"
          }`}
        >
          <LayoutDashboard size={18} /> Dashboard
        </button>

        <button
          onClick={() => setActive("orders")}
          className={`flex items-center gap-2 p-2 rounded-xl ${
            active === "orders"
              ? "bg-orange-100 text-orange-600"
              : "hover:bg-orange-50"
          }`}
        >
          <ClipboardList size={18} /> Orders
        </button>

        <button
          onClick={() => setActive("profile")}
          className={`flex items-center gap-2 p-2 rounded-xl ${
            active === "profile"
              ? "bg-orange-100 text-orange-600"
              : "hover:bg-orange-50"
          }`}
        >
          <User size={18} /> Profile
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-2 rounded-xl text-red-400 mt-auto hover:bg-red-50"
        >
          <LogOut size={18} /> Logout
        </button>

      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 p-8 overflow-y-auto">

        {active === "dashboard" && (

          <div>

            <h2 className="text-3xl font-bold text-orange-600 mb-6">
              Welcome, {profile.name}
            </h2>

            <div className="bg-white rounded-2xl shadow p-6 max-w-sm">

              <h3 className="text-lg font-semibold text-gray-600">
                My Total Expense
              </h3>

              <p className="text-4xl font-bold text-orange-500 mt-2">
                {"\u20B9"}{totalExpense.toFixed(2)}
              </p>

            </div>


          </div>

        )}

        {active === "orders" && (

          <div>

            <h2 className="text-3xl font-bold text-orange-600 mb-6">
              My Orders
            </h2>

            <div className="space-y-4">

              {myOrders.length === 0 ? (
                <p>No Orders Found</p>
              ) : (

                myOrders.map((order) => (

                  <div
                    key={order.id}
                    className="bg-white rounded-2xl shadow p-6 flex justify-between"
                  >

                    <div>

                      <p className="font-semibold">
                        Order #{order.id}
                      </p>

                      <p className="text-sm text-gray-600">
                        Items: {order.items}
                      </p>

                      <p className="text-sm text-gray-600">
                        Date: {order.orderDate}
                      </p>

                      <p className="text-sm text-gray-600">
                        Amount: {"\u20B9"}{Number(order.totalAmount || 0).toFixed(2)}
                      </p>

                    </div>

                    <span
                      className={`px-6 py-3 rounded-full text-sm font-semibold ${
                        order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "Preparing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {order.status}
                    </span>

                  </div>

                ))

              )}

            </div>

          </div>

        )}

        {active === "profile" && (

          <div>

            <h2 className="text-3xl font-bold text-orange-600 mb-6">
              User Profile
            </h2>

            <div className="bg-white rounded-2xl shadow max-w-xl p-6 space-y-4">

              <div className="flex flex-col items-center gap-4">

                <img
                  src={profile.photo || "https://via.placeholder.com/120"}
                  alt="Profile"
                  onClick={() => setShowBigImage(true)}
                  className="w-28 h-28 rounded-full object-cover border cursor-pointer"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />

              </div>

              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-2 border border-orange-300 rounded-xl bg-white focus:outline-none focus:border-orange-500"
                placeholder="Full Name"
              />

              <input
                type="email"
                value={profile.email}
                readOnly
                className="w-full p-2 border rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                title="Email cannot be changed"
              />

              <button
                onClick={handleSaveProfile}
                className="w-full bg-orange-400 text-white py-2 rounded-xl hover:bg-orange-500"
              >
                Save Changes
              </button>

              {successMessage && (
                <p className="text-green-600 text-center font-semibold">
                  {successMessage}
                </p>
              )}

            </div>

          </div>

        )}

      </div>

      {/* BIG IMAGE VIEW */}

      {showBigImage && (

        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40">

          <img
            src={profile.photo || "https://via.placeholder.com/250"}
            alt="Big Profile"
            className="w-64 h-64 rounded-full object-cover border-4 border-white mb-6"
          />

          <button
            onClick={() => setShowBigImage(false)}
            className="bg-orange-400 text-white px-6 py-2 rounded-xl hover:bg-orange-500"
          >
            Back
          </button>

        </div>

      )}

    </div>
  );
}





