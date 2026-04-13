import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  ClipboardList, 
  LogOut, 
  User, 
  MapPin, 
  History, 
  Edit3, 
  Camera,
  Mail,
  Phone,
  Briefcase,
  Home
} from "lucide-react";
import axios from "axios";

export default function UserDash() {
  const [active, setActive] = useState("profile");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState({ summary: false, personal: false, address: false });

  // Profile State with extended fields
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "0316-4567890",
    role: "Customer",
    country: "India",
    cityState: "Bengaluru, Karnataka",
    photo: null
  });

  const [myOrders, setMyOrders] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);

  // ===============================
  // INITIAL LOAD
  // ===============================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setProfile(prev => ({
        ...prev,
        firstName: user.firstName || (user.name ? user.name.split(" ")[0] : ""),
        lastName: user.lastName || (user.name ? user.name.split(" ").slice(1).join(" ") : ""),
        email: user.emailId || user.email || prev.email,
        role: user.role === 1 ? "Admin" : "Customer",
        photo: localStorage.getItem("profilePhoto") || null
      }));
    }
  }, []);

  const fetchOrders = async () => {
    if (!profile.email) return;
    try {
      const resp = await axios.get(`http://localhost:7080/api/Orders/GetOrders/${profile.email}`);
      setMyOrders(resp.data);
      const expenseResp = await axios.get(`http://localhost:7080/api/Orders/GetTotalExpense/${profile.email}`);
      setTotalExpense(expenseResp.data?.totalExpense || 0);
    } catch (err) {
      console.error("Failed to load orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [profile.email]);

  // ===============================
  // HANDLERS
  // ===============================
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile(prev => ({ ...prev, photo: reader.result }));
      localStorage.setItem("profilePhoto", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (section) => {
    setIsEditing({ ...isEditing, [section]: false });
    // Persist to localStorage
    const user = JSON.parse(localStorage.getItem("currentUser")) || {};
    user.firstName = profile.firstName;
    user.lastName = profile.lastName;
    user.name = `${profile.firstName} ${profile.lastName}`.trim();
    localStorage.setItem("currentUser", JSON.stringify(user));

    setSuccessMessage(`Updated ${section} successfully! \u2705`);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      window.location.href = "/Login";
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans antialiased text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-80 bg-slate-50 border-r border-orange-100 flex flex-col group transition-all duration-300">
        
        {/* Sidebar Header: Profile User Summary */}
        <div className="p-8 border-b border-orange-50 flex flex-col items-center">
            <div className="relative mb-4">
              <img 
                src={profile.photo || `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=f97316&color=fff`} 
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md"
                alt="Avatar"
              />
            </div>
            <div className="text-center w-full">
              <h3 className="font-bold text-slate-800 text-lg">{profile.firstName} {profile.lastName}</h3>
              <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mt-1">{profile.role}</p>
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mt-2">
                <MapPin size={12} className="text-orange-300" /> {profile.cityState}
              </div>
            </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-1.5">
          <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Menu</p>
          
          <NavItem 
            icon={<Home size={20} />} 
            label="Home" 
            active={active === "dashboard"} 
            onClick={() => setActive("dashboard")} 
          />
          <NavItem 
            icon={<History size={20} />} 
            label="History" 
            active={active === "orders"} 
            onClick={() => setActive("orders")} 
          />
          <NavItem 
            icon={<User size={20} />} 
            label="My Profile" 
            active={active === "profile"} 
            onClick={() => setActive("profile")} 
          />
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-orange-50">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-semibold"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
        
        {/* Top Sticky Header */}
        <header className="h-20 bg-white border-b border-orange-100 px-10 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight tracking-tight">Account Settings</h2>
          {successMessage && (
            <div className="animate-in fade-in slide-in-from-top-4 bg-orange-50 text-orange-600 px-6 py-2 rounded-full text-sm font-bold border border-orange-100 shadow-sm">
              {successMessage}
            </div>
          )}
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto bg-amber-50/20">
          <div className="max-w-4xl mx-auto py-12 px-10 space-y-8">
            
            {active === "profile" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>

                {/* --- HEADER PROFILE CARD --- */}
                <div className="bg-white rounded-3xl border border-orange-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      <div className="relative">
                        <img 
                          src={profile.photo || `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=f97316&color=fff`} 
                          className="w-24 h-24 rounded-3xl object-cover ring-4 ring-orange-50 shadow-lg"
                          alt="Large Avatar"
                        />
                        <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white cursor-pointer shadow-lg hover:bg-orange-600 transition transform hover:scale-110">
                          <Camera size={16} />
                          <input type="file" hidden onChange={handlePhotoChange} accept="image/*" />
                        </label>
                      </div>
                      <div>
                        <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight tracking-tighter">{profile.firstName} {profile.lastName}</h3>
                        <p className="text-orange-500 font-bold uppercase text-[11px] tracking-widest mt-1">{profile.role}</p>
                        <p className="text-slate-400 text-sm mt-1">{profile.cityState}</p>
                      </div>
                    </div>
                    <EditButton onClick={() => setIsEditing({...isEditing, summary: !isEditing.summary})} isEditing={isEditing.summary} />
                  </div>
                </div>

                {/* --- PERSONAL INFO CARD --- */}
                <ProfileCard 
                  title="Personal information" 
                  isEditing={isEditing.personal}
                  onToggleEdit={() => isEditing.personal ? handleSave("personal") : setIsEditing({...isEditing, personal: true})}
                >
                  <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                    <InfoField label="First Name" value={profile.firstName} isEditing={isEditing.personal} onChange={(v) => setProfile({...profile, firstName: v})} />
                    <InfoField label="Last Name" value={profile.lastName} isEditing={isEditing.personal} onChange={(v) => setProfile({...profile, lastName: v})} />
                    <InfoField label="Email Address" value={profile.email} isEditing={false} />
                    <InfoField label="Phone" value={profile.phone} isEditing={isEditing.personal} onChange={(v) => setProfile({...profile, phone: v})} />
                    <InfoField label="Role" value={profile.role} isEditing={false} />
                  </div>
                </ProfileCard>

                {/* --- ADDRESS CARD --- */}
                <ProfileCard 
                  title="Address" 
                  isEditing={isEditing.address}
                  onToggleEdit={() => isEditing.address ? handleSave("address") : setIsEditing({...isEditing, address: true})}
                >
                  <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                    <InfoField label="Country" value={profile.country} isEditing={isEditing.address} onChange={(v) => setProfile({...profile, country: v})} />
                    <InfoField label="City/State" value={profile.cityState} isEditing={isEditing.address} onChange={(v) => setProfile({...profile, cityState: v})} />
                  </div>
                </ProfileCard>
              </div>
            )}

            {active === "orders" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                 <h1 className="text-2xl font-bold text-slate-800">My Order History</h1>
                 {myOrders.length === 0 ? (
                   <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-orange-100">
                     <ClipboardList className="mx-auto text-orange-200 mb-4" size={64} />
                     <p className="text-slate-400 font-semibold italic">No orders found yet</p>
                   </div>
                 ) : (
                   myOrders.map(o => (
                     <div key={o.id} className="bg-white rounded-2xl border border-orange-100 p-6 flex justify-between items-center shadow-sm hover:shadow-md transition group">
                       <div>
                         <p className="font-bold text-slate-800 text-lg">Order #{o.id}</p>
                         <p className="text-xs text-orange-400 font-bold uppercase mt-1 tracking-widest">{o.orderDate}</p>
                         <p className="text-sm text-slate-500 mt-2 max-w-[400px]">{o.items}</p>
                         <p className="text-xl font-bold text-orange-600 mt-4">{"\u20B9"}{Number(o.totalAmount || 0).toFixed(2)}</p>
                       </div>
                       <span className={`px-5 py-2 rounded-full text-xs font-bold ring-1 transition-colors ${
                         o.status === "Pending" ? "bg-amber-50 text-amber-600 ring-amber-100" : "bg-orange-50 text-orange-600 ring-orange-100"
                       }`}>
                         {o.status}
                       </span>
                     </div>
                   ))
                 )}
              </div>
            )}

            {active === "dashboard" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight tracking-tighter">Hello, {profile.firstName}!</h1>
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col justify-between h-56 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform">
                       <History size={120} />
                    </div>
                    <p className="text-orange-100 font-bold uppercase tracking-widest text-xs relative z-10">Total Spend</p>
                    <h3 className="text-5xl font-black relative z-10 tracking-tighter">{"\u20B9"}{totalExpense.toFixed(2)}</h3>
                  </div>
                  <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col justify-between h-56 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform">
                       <ClipboardList size={120} />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs relative z-10">Active Orders</p>
                    <h3 className="text-5xl font-black relative z-10 tracking-tighter tracking-tighter underline decoration-orange-500 decoration-4 underline-offset-8">{myOrders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length}</h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ===============================
// HELPER COMPONENTS
// ===============================

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold ${
      active 
        ? "bg-orange-100 text-orange-600" 
        : "text-slate-400 hover:text-orange-500 hover:bg-orange-50/50"
    }`}
  >
    <span className={active ? "text-orange-600" : "text-slate-300 group-hover:text-orange-400 transition-colors"}>{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
);

const ProfileCard = ({ title, children, isEditing, onToggleEdit }) => (
  <div className="bg-white rounded-3xl border border-orange-100 p-8 shadow-sm">
    <div className="flex justify-between items-center mb-8">
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      <EditButton onClick={onToggleEdit} isEditing={isEditing} />
    </div>
    {children}
  </div>
);

const EditButton = ({ onClick, isEditing }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 ${
      isEditing 
        ? "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200" 
        : "bg-amber-50 text-orange-600 hover:bg-amber-100 border border-orange-200"
    }`}
  >
    {isEditing ? "Save" : "Edit"} <Edit3 size={14} />
  </button>
);

const InfoField = ({ label, value, isEditing, onChange }) => (
  <div className="space-y-2">
    <p className="text-[11px] font-bold text-orange-400 uppercase tracking-widest">{label}</p>
    {isEditing ? (
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-orange-50/30 border border-orange-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-bold"
      />
    ) : (
      <p className="text-slate-800 font-bold text-sm tracking-tight">{value || "-"}</p>
    )}
  </div>
);
