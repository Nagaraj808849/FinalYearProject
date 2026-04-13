import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BarChart3, Users, ShoppingCart, TrendingUp, Settings, LogOut, Menu as MenuIcon, X, PlusCircle, ClipboardList } from "lucide-react";
import { useAuth } from "../src/context/useAuth";
import axios from "axios";


export default function Admin() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menu, setMenu] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate("/Login");
    }, 1500);
  };

  const [view, setView] = useState("Dashboard");
  const [newSpecial, setNewSpecial] = useState({ name: "", price: "" });
  const [showCreateMenuDialog, setShowCreateMenuDialog] = useState(false);
  const [newMenuData, setNewMenuData] = useState({
    item_name: "",
    category_id: 1,
    price: "",
    description: "",
    image: null,
    is_available: true
  });
  const [menuMessage, setMenuMessage] = useState({ text: "", type: "" });

  const [users, setUsers] = useState([]);

  const [admins, setAdmins] = useState(() => {
    const s = localStorage.getItem("admins");
    return s ? JSON.parse(s) : [{ username: "admin", password: "admin123" }];
  });

  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);

  const fetchMenu = async () => {
    try {
      const response = await axios.get("http://localhost:7080/api/Menu");
      setMenu(response.data);
    } catch (err) {
      console.error("Failed to fetch menu:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:7080/api/Orders/GetAllOrders");
      setOrders(response.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get("http://localhost:7080/api/TableReservation/GetAllReservations");
      setReservations(response.data);
    } catch (err) {
      console.error("Failed to fetch reservations:", err);
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchOrders();
    fetchReservations();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:7080/api/Registration/GetRegisters");

      const mappedUsers = response.data.map((u) => ({
        id: u.userId,
        name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
        email: u.emailId,
        role: u.role === 1 ? "Admin" : "Customer",
        status: "Active"
      }));

      setUsers(mappedUsers);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    localStorage.setItem("admins", JSON.stringify(admins));
  }, [admins]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const addSpecial = () => {
    if (!newSpecial.name || !newSpecial.price) return;
    const newItem = {
      id: Date.now(),
      name: newSpecial.name,
      price: Number(newSpecial.price),
      category: "Specials",
    };
    setMenu((m) => [...m, newItem]);
    setNewSpecial({ name: "", price: "" });
  };

  const removeSpecial = (id) => {
    setMenu((m) => m.filter((item) => item.id !== id));
  };

  const removeUser = async (userId) => {
    if (!confirm(`Remove user? This cannot be undone.`)) return;
    try {
      await axios.delete(`http://localhost:7080/api/Registration/DeleteRegister/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put("http://localhost:7080/api/Orders/UpdateStatus", {
        Id: orderId,
        Status: newStatus
      });
      fetchOrders();
    } catch (err) {
      console.error("Status Update Error:", err);
      alert("Failed to update status.");
    }
  };

  const deleteOrder = (orderId) => {
    if (!confirm(`Delete order ${orderId}?`)) return;
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMenuMessage({ text: "Image is too large (max 5MB).", type: "error" });
        return;
      }
      setMenuMessage({ text: "", type: "" });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setNewMenuData({ ...newMenuData, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateMenu = async (e) => {
    e.preventDefault();
    setMenuMessage({ text: "Creating menu item...", type: "info" });
    try {
      const payload = {
        category_id: Number(newMenuData.category_id),
        item_name: newMenuData.item_name,
        description: newMenuData.description,
        price: Number(newMenuData.price),
        image: newMenuData.image,
        is_available: newMenuData.is_available
      };
      const response = await axios.post("http://localhost:7080/api/Menu/AddMenuItem", payload, {
        headers: { "Content-Type": "application/json" }
      });
      setMenuMessage({ text: "Menu item created successfully!", type: "success" });
      setTimeout(() => {
        setShowCreateMenuDialog(false);
        setMenuMessage({ text: "", type: "" });
        setNewMenuData({
          item_name: "", category_id: 1, price: "", description: "", image: null, is_available: true
        });
        fetchMenu(); // Refresh the list
      }, 1500);
    } catch (err) {
      console.error(err);
      setMenuMessage({ text: "Failed to create menu item. Make sure API is running.", type: "error" });
    }
  };

  const formatItems = (itemsStr) => {
    try {
      if (!itemsStr) return "-";
      const parsed = JSON.parse(itemsStr);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => `${item.name} (x${item.quantity || 1})`).join(", ");
      }
      return itemsStr;
    } catch {
      return itemsStr; // Fallback
    }
  };

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalOrders = orders.length;
    const revenue = orders
      .filter((o) => o.status !== "Cancelled") // Count all paid orders except cancelled ones
      .reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);
    const pending = orders.filter((o) => o.status === "Pending").length;
    return { totalUsers, totalOrders, revenue, pending };
  }, [users, orders]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">

      {/* Main Container */}
      <div className="flex min-h-[calc(100vh-100px)] relative">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 md:hidden z-30"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside className={`fixed md:relative w-72 md:w-72 bg-gradient-to-b from-amber-900 to-amber-800 text-white p-6 shadow-xl z-40 h-full md:h-auto transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
          </div>

          <nav className="flex flex-col gap-3">
            <button
              onClick={() => { setView("Dashboard"); setSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${view === "Dashboard"
                  ? "bg-amber-700 text-white shadow-lg"
                  : "hover:bg-amber-700 text-amber-100"
                }`}
            >
              <BarChart3 size={20} />
              Dashboard
            </button>

            <button
              onClick={() => { setView("Menu"); setSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${view === "Menu"
                  ? "bg-amber-700 text-white shadow-lg"
                  : "hover:bg-amber-700 text-amber-100"
                }`}
            >
              <MenuIcon size={20} />
              Menu
            </button>

            <button
              onClick={() => { setView("Orders"); setSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${view === "Orders"
                  ? "bg-amber-700 text-white shadow-lg"
                  : "hover:bg-amber-700 text-amber-100"
                }`}
            >
              <ShoppingCart size={20} />
              Orders
            </button>

            <button
              onClick={() => { setView("Users"); setSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${view === "Users"
                  ? "bg-amber-700 text-white shadow-lg"
                  : "hover:bg-amber-700 text-amber-100"
                }`}
            >
              <Users size={20} />
              Users
            </button>

            <button
              onClick={() => { setView("Reservations"); setSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${view === "Reservations"
                  ? "bg-amber-700 text-white shadow-lg"
                  : "hover:bg-amber-700 text-amber-100"
                }`}
            >
              <ClipboardList size={20} />
              Reservations
            </button>

            <button
              onClick={() => { setView("Settings"); setSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${view === "Settings"
                  ? "bg-amber-700 text-white shadow-lg"
                  : "hover:bg-amber-700 text-amber-100"
                }`}
            >
              <Settings size={20} />
              Settings
            </button>
          </nav>

          <button 
            onClick={() => setShowLogoutModal(true)}
            className="mt-auto w-full flex items-center gap-3 px-4 py-3 rounded-lg text-amber-100 hover:bg-amber-700 transition font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </aside>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300 text-center">
              {isLoggingOut ? (
                <div className="py-6 flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4"></div>
                  <h3 className="text-xl font-bold text-amber-900">Logging out...</h3>
                  <p className="text-gray-500">Securing your session. Please wait.</p>
                </div>
              ) : (
                <>
                  <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <LogOut size={40} className="text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Logout</h3>
                  <p className="text-gray-500 mb-8">Are you sure you want to exit the admin panel? Any unsaved changes may be lost.</p>
                  
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleLogout}
                      className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg active:scale-95"
                    >
                      Yes, Logout
                    </button>
                    <button 
                      onClick={() => setShowLogoutModal(false)}
                      className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                      Stay Logged In
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-auto w-full md:w-auto">
          {view === "Dashboard" && (
            <>
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-4xl font-bold text-amber-900 mb-1 sm:mb-2">Dashboard</h2>
                <p className="text-sm sm:text-base text-amber-700">Welcome to Golden Essence Admin Panel</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
                {/* Users Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-blue-600 font-semibold text-sm mb-1">Total Users</div>
                      <div className="text-4xl font-bold text-blue-900">{stats.totalUsers}</div>
                    </div>
                    <Users size={40} className="text-blue-300" />
                  </div>
                </div>

                {/* Orders Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-green-600 font-semibold text-sm mb-1">Total Orders</div>
                      <div className="text-4xl font-bold text-green-900">{stats.totalOrders}</div>
                    </div>
                    <ShoppingCart size={40} className="text-green-300" />
                  </div>
                </div>

                {/* Revenue Card */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-400 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-amber-700 font-semibold text-sm mb-1">Total Revenue</div>
                      <div className="text-3xl font-bold text-amber-900">{"\u20B9"}{stats.revenue?.toFixed(2)}</div>
                    </div>
                    <TrendingUp size={40} className="text-amber-300" />
                  </div>
                </div>

                {/* Pending Card */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-red-600 font-semibold text-sm mb-1">Pending Orders</div>
                      <div className="text-4xl font-bold text-red-900">{stats.pending}</div>
                    </div>
                    <ShoppingCart size={40} className="text-red-300" />
                  </div>
                </div>
              </div>

              {/* Recent Orders Section */}
              <div>
                <h3 className="text-2xl font-bold text-amber-900 mb-4">Recent Orders</h3>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-200">
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No orders yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                          <tr>
                            <th className="px-6 py-3 text-left font-semibold">Order ID</th>
                            <th className="px-6 py-3 text-left font-semibold">Customer</th>
                            <th className="px-6 py-3 text-left font-semibold">Items</th>
                            <th className="px-6 py-3 text-left font-semibold">Amount</th>
                            <th className="px-6 py-3 text-left font-semibold">Date</th>
                            <th className="px-6 py-3 text-left font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-100">
                          {orders
                            .slice()
                            .reverse()
                            .slice(0, 6)
                            .map((o) => (
                              <tr key={o.id} className="hover:bg-amber-50 transition">
                                <td className="px-6 py-4 font-semibold text-amber-900">{o.id}</td>
                                <td className="px-6 py-4 text-gray-700">{o.userEmail}</td>
                                <td className="px-6 py-4 text-gray-600 text-sm max-w-[200px] truncate" title={formatItems(o.items)}>{formatItems(o.items)}</td>
                                <td className="px-6 py-4 font-bold text-amber-700">{"\u20B9"}{Number(o.totalAmount || 0).toFixed(2)}</td>
                                <td className="px-6 py-4 text-gray-600">{o.orderDate}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${o.status === "Delivered" ? "bg-green-100 text-green-700" :
                                      o.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                                        "bg-gray-100 text-gray-700"
                                    }`}>
                                    {o.status || "Pending"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Reservations Section */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-amber-900 mb-4">Upcoming Reservations</h3>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-200">
                  {reservations.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No reservations yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                          <tr>
                            <th className="px-6 py-3 text-left font-semibold">Guest Name</th>
                            <th className="px-6 py-3 text-left font-semibold">Date & Time</th>
                            <th className="px-6 py-3 text-left font-semibold">People</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-100">
                          {reservations.slice(0, 6).map((r, i) => (
                            <tr key={i} className="hover:bg-amber-50 transition">
                              <td className="px-6 py-4 font-semibold text-amber-900">{r.userName}</td>
                              <td className="px-6 py-4 text-gray-600">{new Date(r.reservationDateTime).toLocaleString()}</td>
                              <td className="px-6 py-4 font-bold text-amber-700">{r.noOfPeople} PAX</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Users Section */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-amber-900 mb-4">New Users</h3>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-200">
                  {users.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No users yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                          <tr>
                            <th className="px-6 py-3 text-left font-semibold">Name</th>
                            <th className="px-6 py-3 text-left font-semibold">Email</th>
                            <th className="px-6 py-3 text-left font-semibold">Role</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-100">
                          {users.slice(0, 6).map((u, i) => (
                            <tr key={i} className="hover:bg-amber-50 transition">
                              <td className="px-6 py-4 font-semibold text-amber-900">{u.name}</td>
                              <td className="px-6 py-4 text-gray-600">{u.email}</td>
                              <td className="px-6 py-4 font-bold text-amber-700">{u.role}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {view === "Menu" && (
            <>
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-4xl font-bold text-amber-900 mb-1 sm:mb-2">Menu Management</h2>
                <p className="text-sm sm:text-base text-amber-700">Manage your restaurant menu items</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6 flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-amber-900">Current Menu Items</h3>
                  <p className="text-gray-500 text-sm">Create or manage your menu items here.</p>
                </div>
                <button
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg text-sm sm:text-base flex items-center gap-2"
                  onClick={() => setShowCreateMenuDialog(true)}
                >
                  <PlusCircle size={20} /> Create Menu
                </button>
              </div>

              {/* LIST MENU ITEMS */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-200">
                {menu.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <p className="text-gray-500 text-base sm:text-lg">No menu items found. Create one!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm sm:text-base">
                      <thead className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                        <tr>
                          <th className="px-3 sm:px-6 py-2 sm:py-4 text-left font-semibold">Image</th>
                          <th className="px-3 sm:px-6 py-2 sm:py-4 text-left font-semibold">Item Name</th>
                          <th className="px-3 sm:px-6 py-2 sm:py-4 text-left font-semibold">Description</th>
                          <th className="px-3 sm:px-6 py-2 sm:py-4 text-left font-semibold">Price</th>
                          <th className="px-3 sm:px-6 py-2 sm:py-4 text-left font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-100 bg-white">
                        {menu.map((item) => (
                          <tr key={item.menu_id} className="hover:bg-amber-50 transition">
                            <td className="px-3 sm:px-6 py-2 sm:py-4">
                              {item.image ? (
                                <img src={`data:image/jpeg;base64,${item.image}`} alt={item.item_name} className="w-16 h-16 object-cover rounded shadow" />
                              ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400 border border-gray-300">No Img</div>
                              )}
                            </td>
                            <td className="px-3 sm:px-6 py-2 sm:py-4 font-semibold text-amber-900">
                              {item.item_name}
                              {!item.is_available && <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Unavailable</span>}
                            </td>
                            <td className="px-3 sm:px-6 py-2 sm:py-4 text-gray-600 text-sm max-w-xs truncate">{item.description}</td>
                            <td className="px-3 sm:px-6 py-2 sm:py-4 font-bold text-amber-700">{"\u20B9"}{item.price}</td>
                            <td className="px-3 sm:px-6 py-2 sm:py-4">
                              <button
                                onClick={async () => {
                                  if (confirm(`Delete ${item.item_name}?`)) {
                                    try {
                                      await axios.delete(`http://localhost:7080/api/Menu/DeleteMenuItem/${item.menu_id}`);
                                      fetchMenu();
                                    } catch (err) {
                                      console.error(err);
                                      alert("Failed to delete item");
                                    }
                                  }
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-semibold transition text-sm"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* CREATE MENU DIALOG */}
              {showCreateMenuDialog && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-amber-900">Create New Menu Item</h3>
                      <button onClick={() => setShowCreateMenuDialog(false)} className="text-gray-500 hover:text-red-500">
                        <X size={24} />
                      </button>
                    </div>

                    {menuMessage.text && (
                      <div className={`p-3 rounded mb-4 font-semibold text-center ${menuMessage.type === 'success' ? 'bg-green-100 text-green-700' :
                          menuMessage.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {menuMessage.text}
                      </div>
                    )}

                    <form onSubmit={handleCreateMenu} className="space-y-4 text-left">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Item Name</label>
                          <input required type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                            value={newMenuData.item_name} onChange={(e) => setNewMenuData({ ...newMenuData, item_name: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                          <select className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                            value={newMenuData.category_id} onChange={(e) => setNewMenuData({ ...newMenuData, category_id: e.target.value })}>
                            <option value={1}>Starters</option>
                            <option value={2}>Main Course</option>
                            <option value={3}>Desserts</option>
                            <option value={4}>Drinks</option>
                            <option value={5}>Specials</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Price ({"\u20B9"})</label>
                          <input required type="number" min="0" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-amber-500 outline-none"
                            value={newMenuData.price} onChange={(e) => setNewMenuData({ ...newMenuData, price: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Available?</label>
                          <div className="flex items-center h-10">
                            <input type="checkbox" className="w-5 h-5 accent-amber-600"
                              checked={newMenuData.is_available} onChange={(e) => setNewMenuData({ ...newMenuData, is_available: e.target.checked })} />
                            <span className="ml-2 text-gray-700">Yes, it's available</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                        <textarea required rows="3" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-amber-500 outline-none w-full"
                          value={newMenuData.description} onChange={(e) => setNewMenuData({ ...newMenuData, description: e.target.value })}></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Item Image</label>
                        <input required type="file" accept="image/*" className="w-full border border-gray-300 rounded p-2" onChange={handleImageUpload} />
                        {newMenuData.image && <p className="text-xs text-green-600 mt-1">Image loaded successfully.</p>}
                      </div>

                      <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setShowCreateMenuDialog(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition font-semibold">
                          Cancel
                        </button>
                        <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition shadow disabled:opacity-50" disabled={menuMessage.type === 'info' || !newMenuData.image}>
                          Save Menu Item
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

          {view === "Reservations" && (
            <>
              <div className="mb-6 sm:mb-8 text-left">
                <h2 className="text-2xl sm:text-4xl font-bold text-amber-900 mb-1 sm:mb-2">Reservations Management</h2>
                <p className="text-sm sm:text-base text-amber-700">Manage all table bookings</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6 flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-amber-900">Current Reservations</h3>
                  <p className="text-gray-500 text-sm">Real-time reservation data from the database.</p>
                </div>
                <button
                  onClick={fetchReservations}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg text-sm sm:text-base whitespace-nowrap"
                >
                  Refresh
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-amber-200">
                {reservations.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No reservations found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm sm:text-base text-left">
                      <thead className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                        <tr>
                          <th className="px-6 py-4 font-semibold">Guest Name</th>
                          <th className="px-6 py-4 font-semibold">Email</th>
                          <th className="px-6 py-4 font-semibold">Date & Time</th>
                          <th className="px-6 py-4 font-semibold">People</th>
                          <th className="px-6 py-4 font-semibold">Special Requests</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-100 bg-white">
                        {reservations.map((res) => (
                          <tr key={res.reservationId} className="hover:bg-amber-50 transition text-gray-700">
                            <td className="px-6 py-4 font-semibold text-amber-900">{res.userName}</td>
                            <td className="px-6 py-4">{res.userEmail}</td>
                            <td className="px-6 py-4">{new Date(res.reservationDateTime).toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
                                {res.noOfPeople} PAX
                              </span>
                            </td>
                            <td className="px-6 py-4 italic text-sm">{res.specialAttentions || "None"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {view === "Orders" && (
            <>
              <div className="mb-6 sm:mb-8 text-left">
                <h2 className="text-2xl sm:text-4xl font-bold text-amber-900 mb-1 sm:mb-2">Orders Management</h2>
                <p className="text-sm sm:text-base text-amber-700">Manage all customer orders</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6 flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-amber-900">All Orders</h3>
                  <p className="text-gray-500 text-sm">Real-time order data from the database.</p>
                </div>
                <button
                  onClick={fetchOrders}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg text-sm sm:text-base whitespace-nowrap"
                >
                  Refresh
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-200">
                {orders.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <p className="text-gray-500 text-base sm:text-lg">No orders found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm md:text-base">
                      <thead className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                        <tr>
                          <th className="px-2 sm:px-6 py-2 sm:py-4 text-left font-semibold">Order ID</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-4 text-left font-semibold">Customer Email</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-4 text-left font-semibold">Items</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-4 text-left font-semibold">Amount</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-4 text-left font-semibold">Date & Time</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-4 text-left font-semibold">Status</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-4 text-left font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-100">
                        {orders
                          .slice()
                          .reverse()
                          .map((o) => (
                            <tr key={o.id} className="hover:bg-amber-50 transition">
                              <td className="px-2 sm:px-6 py-2 sm:py-4 font-semibold text-amber-900">{o.id}</td>
                              <td className="px-2 sm:px-6 py-2 sm:py-4 text-gray-700">{o.userEmail}</td>
                              <td className="px-2 sm:px-6 py-2 sm:py-4 text-gray-600 text-sm max-w-xs truncate" title={formatItems(o.items)}>{formatItems(o.items)}</td>
                              <td className="px-2 sm:px-6 py-2 sm:py-4 font-bold text-amber-700">{"\u20B9"}{Number(o.totalAmount || 0).toFixed(2)}</td>
                              <td className="px-2 sm:px-6 py-2 sm:py-4 text-gray-600 text-xs sm:text-base">{o.orderDate}</td>
                              <td className="px-2 sm:px-6 py-2 sm:py-4">
                                <select
                                  value={o.status || "Pending"}
                                  onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                  className="border-2 border-amber-300 rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                  <option>Pending</option>
                                  <option>Preparing</option>
                                  <option>Served</option>
                                  <option>Delivered</option>
                                  <option>Cancelled</option>
                                </select>
                              </td>
                              <td className="px-2 sm:px-6 py-2 sm:py-4">
                                <button
                                  onClick={() => deleteOrder(o.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-semibold transition text-xs sm:text-base"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {view === "Users" && (
            <>
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-4xl font-bold text-amber-900 mb-1 sm:mb-2">Users Management</h2>
                <p className="text-sm sm:text-base text-amber-700">Manage registered users</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-6 flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-amber-900">Registered Users</h3>
                  <p className="text-gray-500 text-sm">Real-time user accounts from the database.</p>
                </div>
                <button
                  onClick={fetchUsers}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg text-sm sm:text-base whitespace-nowrap"
                >
                  Refresh
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-200">
                {users.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <p className="text-gray-500 text-base sm:text-lg">No registered users</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm md:text-base">
                      <thead className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                        <tr>
                          <th className="px-2 sm:px-6 py-2 sm:py-4 text-left font-semibold">Name</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-4 text-left font-semibold hidden md:table-cell">Email</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-4 text-left font-semibold">Role</th>
                          <th className="px-2 sm:px-6 py-2 sm:py-4 text-left font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-100">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-amber-50 transition">
                            <td className="px-2 sm:px-6 py-2 sm:py-4 font-semibold text-amber-900">{u.name}</td>
                            <td className="px-2 sm:px-6 py-2 sm:py-4 text-gray-600 hidden md:table-cell">{u.email || "-"}</td>
                            <td className="px-2 sm:px-6 py-2 sm:py-4">
                              <span
                                className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${u.role === "Admin"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-blue-100 text-blue-700"
                                  }`}
                              >
                                {u.role}
                              </span>
                            </td>
                            <td className="px-2 sm:px-6 py-2 sm:py-4">
                              <button
                                onClick={() => removeUser(u.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-semibold transition text-xs sm:text-base"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {view === "Settings" && (
            <>
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-4xl font-bold text-amber-900 mb-1 sm:mb-2">Settings</h2>
                <p className="text-sm sm:text-base text-amber-700">Golden Essence Restaurant Information</p>
              </div>

              <div className="bg-gradient-to-br from-white to-amber-50 border-2 border-amber-300 rounded-xl shadow-lg p-4 sm:p-8 max-w-2xl">
                <div className="space-y-4 sm:space-y-6">
                  <div className="border-b border-amber-200 pb-3 sm:pb-4">
                    <label className="block text-amber-900 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Restaurant Name</label>
                    <p className="text-lg sm:text-2xl font-bold text-amber-700">Golden Essence</p>
                  </div>

                  <div className="border-b border-amber-200 pb-3 sm:pb-4">
                    <label className="block text-amber-900 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Operating Hours</label>
                    <p className="text-base sm:text-lg text-gray-700">10:00 AM - 11:00 PM (Daily)</p>
                  </div>

                  <div className="border-b border-amber-200 pb-3 sm:pb-4">
                    <label className="block text-amber-900 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Contact Email</label>
                    <p className="text-base sm:text-lg text-gray-700">info@goldenessence.com</p>
                  </div>
                  <div className="border-b border-amber-200 pb-3 sm:pb-4">
                    <label className="block text-amber-900 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Phone Number</label>
                    <p className="text-base sm:text-lg text-gray-700">+91 98765 43210</p>
                  </div>
                  <div className="pb-4">
                    <label className="block text-amber-900 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Location</label>
                    <p className="text-base sm:text-lg text-gray-700">Bangalore, Karnataka, India</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}










