


import { ChevronRight, ChevronLeft, UtensilsCrossed, Phone, Mail, MapPin, ShoppingCart, Home, Menu, HelpCircle, User, LogOut, X } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../src/context/useAuth";
import { COLORS } from "../src/constants/COLORS";



export default function HomePage1() {
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const scrollRight1 = () => {
    if (scrollRef1.current) {
      scrollRef1.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const scrollLeft1 = () => {
    if (scrollRef1.current) {
      scrollRef1.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleProtectedAction = (path) => {
    if (!user) {
      navigate("/Login");
    } else {
      navigate(path);
    }
  };

  const scrollRight2 = () => {
    if (scrollRef2.current) {
      scrollRef2.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const scrollLeft2 = () => {
    if (scrollRef2.current) {
      scrollRef2.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const interiors1 = [
    { url: "https://www.properties.market/ae/blog/wp-content/uploads/2023/08/Best-Restaurant-Interior-Design-Ideas-for-a-Luxurious-Ambiance.png", name: "Luxury Lounge" },
    { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEKXC1gJvZBygA1c_Z7aufOOiGyYXPTAl9hA&s", name: "Modern Dining" },
    { url: "https://image.made-in-china.com/202f0j00vjsVGDznnZgY/Low-Price-Banquet-Hall-Villa-Restaurant-Big-Luxury-Stainless-Steel-LED-Chandelier.webp", name: "Chandelier Elegance" },
    { url: "https://m.media-amazon.com/images/I/61KOHFhWbpL._UF1000,1000_QL80_.jpg", name: "Cozy Corners" },
    { url: "https://i.pinimg.com/736x/86/c8/38/86c838458f7545d8b9fa313f39da0f56.jpg", name: "Garden Cafe" },
  ];

  const interiors2 = [
    { url: "https://images.venuebookingz.com/17948-1550558769-wm-IMG-20190219-WA0028.jpg", name: "Elegant Hall" },
    { url: "https://images.picxy.com/cache/2020/4/27/117bfb820202ec7224c73745d5f76e43.jpg", name: "Banquet Space" },
    { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_oKBr_XUJIZZwoAORYBbTyyBYcCGSe5HB7WvwYPdlRYBkDkVN7zBdm3LZhb1SJqadv0o&usqp=CAU", name: "Party Room" },
    { url: "https://i.ytimg.com/vi/RP2f34BlHhw/maxresdefault.jpg", name: "Event Setup" },
    { url: "https://www.avikalp.com/cdn/shop/products/MWZ3112_wallpaper1.jpg?v=1746038321", name: "Sleek & Modern" },
  ];

  return (
    <div className="w-full overflow-x-hidden scroll-smooth">
    
     
      <section
        className="h-screen bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://www.properties.market/ae/blog/wp-content/uploads/2023/08/Best-Restaurant-Interior-Design-Ideas-for-a-Luxurious-Ambiance.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        {/* inline navbar for this page */}
        <nav className="absolute top-0 left-0 w-full z-50 bg-gradient-to-r from-amber-50 via-amber-100 to-white backdrop-blur-md border-b border-amber-500/50 shadow-lg">
            <div className="flex justify-between items-center px-6 py-5 md:px-10 md:py-6">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="text-amber-600 hidden sm:block" size={32} />
                <h1 className="text-2xl sm:text-3xl font-bold text-amber-900 drop-shadow-lg">Golden Essence</h1>
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-8">
                <ul className="flex space-x-6">
                  <li><a href="#home" className="flex items-center gap-2 text-amber-900 font-medium hover:text-amber-600 transition"><Home size={20}/> <span className="hidden lg:inline">Home</span></a></li>
                  <li>
                    <button onClick={() => navigate("/Menu1")} className="flex items-center gap-2 text-amber-900 font-medium hover:text-amber-600 transition">
                      <Menu size={20}/> <span className="hidden lg:inline">Menu</span>
                    </button>
                  </li>
                  <li><a href="#interiors" className="flex items-center gap-2 text-amber-900 font-medium hover:text-amber-600 transition"><HelpCircle size={20}/> <span className="hidden lg:inline">Interiors</span></a></li>
                  <li><a href="#book" className="flex items-center gap-2 text-amber-900 font-medium hover:text-amber-600 transition"><UtensilsCrossed size={20}/> <span className="hidden lg:inline">Book</span></a></li>
                  <li><a href="#contact" className="flex items-center gap-2 text-amber-900 font-medium hover:text-amber-600 transition"><Phone size={20}/> <span className="hidden lg:inline">Contact</span></a></li>
                </ul>
              </div>

              {/* Desktop Right Section */}
              <div className="hidden md:flex items-center gap-6">
                <button onClick={() => handleProtectedAction("/Cart")} className="relative cursor-pointer text-amber-900 hover:text-amber-600 transition">
                  <ShoppingCart size={24}/>
                </button>
                
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="relative cursor-pointer text-amber-900 hover:text-amber-600 transition"
                    >
                      <User size={24}/>
                    </button>
                    {menuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
                        <div className="px-4 py-2 border-b">
                          <p className="font-semibold text-sm">{user.username}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                        <Link to="/UserDash">
                          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                            Profile
                          </button>
                        </Link>
                        {isAdmin && (
                          <Link to="/Admin">
                            <button className="block w-full text-left px-4 py-2 hover:bg-amber-100 text-amber-900 font-semibold border-t border-amber-100">
                              Admin Panel
                            </button>
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            navigate("/");
                            setMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-red-600 hover:bg-red-100 flex items-center gap-2"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link to="/Login">
                      <button className="bg-amber-900 hover:bg-amber-950 text-white px-4 py-2 rounded-lg transition">
                        Login
                      </button>
                    </Link>
                    <Link to="/Signup">
                      <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition">
                        Signup
                      </button>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center gap-4">
                <button onClick={() => handleProtectedAction("/Cart")} className="text-amber-900 hover:text-amber-600 transition">
                  <ShoppingCart size={22}/>
                </button>
                <button
                  onClick={() => setMobileNavOpen(!mobileNavOpen)}
                  className="text-amber-900 hover:text-amber-600 transition p-2 hover:bg-black/10 rounded-lg"
                >
                  {mobileNavOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileNavOpen && (
              <div className="md:hidden mt-4 pb-6 border-t border-amber-600/30 pt-6 animate-in fade-in slide-in-from-top-2">
                {/* Mobile Navigation Links */}
                <ul className="space-y-1 mb-6">
                  <li>
                    <a 
                      href="#home" 
                      onClick={() => setMobileNavOpen(false)} 
                      className="flex items-center gap-3 text-amber-900 font-medium hover:bg-black/10 p-3 rounded-lg transition"
                    >
                      <Home size={20}/> Home
                    </a>
                  </li>
                  <li>
                    <button 
                      onClick={() => { 
                        navigate("/Menu1"); 
                        setMobileNavOpen(false); 
                      }} 
                      className="w-full flex items-center gap-3 text-amber-900 font-medium hover:bg-black/10 p-3 rounded-lg transition text-left"
                    >
                      <Menu size={20}/> Menu
                    </button>
                  </li>
                  <li>
                    <a 
                      href="#interiors" 
                      onClick={() => setMobileNavOpen(false)} 
                      className="flex items-center gap-3 text-amber-900 font-medium hover:bg-black/10 p-3 rounded-lg transition"
                    >
                      <HelpCircle size={20}/> Interiors
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#book" 
                      onClick={() => setMobileNavOpen(false)} 
                      className="flex items-center gap-3 text-amber-900 font-medium hover:bg-black/10 p-3 rounded-lg transition"
                    >
                      <UtensilsCrossed size={20}/> Book
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#contact" 
                      onClick={() => setMobileNavOpen(false)} 
                      className="flex items-center gap-3 text-amber-900 font-medium hover:bg-black/10 p-3 rounded-lg transition"
                    >
                      <Phone size={20}/> Contact
                    </a>
                  </li>
                </ul>

                {/* Mobile Divider */}
                <div className="h-px bg-amber-600/30 my-4"></div>

                {/* Mobile User Section */}
                {user ? (
                  <div className="space-y-2">
                    <div className="bg-amber-600/10 p-3 rounded-lg mb-3">
                      <p className="text-amber-900 font-semibold text-sm">{user.username}</p>
                      <p className="text-amber-700 text-xs">{user.email}</p>
                    </div>
                    <Link to="/UserDash" onClick={() => setMobileNavOpen(false)}>
                      <button className="w-full flex items-center gap-3 text-amber-900 font-medium hover:bg-black/10 p-3 rounded-lg transition text-left">
                        <User size={20}/> Profile
                      </button>
                    </Link>
                    {isAdmin && (
                      <Link to="/Admin" onClick={() => setMobileNavOpen(false)}>
                        <button className="w-full flex items-center gap-3 text-amber-900 font-bold bg-amber-500/10 p-3 rounded-lg transition text-left">
                          <HelpCircle size={20}/> Admin Dashboard
                        </button>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        navigate("/");
                        setMobileNavOpen(false);
                      }}
                      className="w-full flex items-center gap-3 text-red-600 font-medium hover:bg-red-500/10 p-3 rounded-lg transition text-left"
                    >
                      <LogOut size={20}/> Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/Login" onClick={() => setMobileNavOpen(false)}>
                      <button className="w-full bg-amber-900 hover:bg-amber-950 text-white px-4 py-2.5 rounded-lg transition font-medium text-sm">
                        Login
                      </button>
                    </Link>
                    <Link to="/Signup" onClick={() => setMobileNavOpen(false)}>
                      <button className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg transition font-medium text-sm">
                        Signup
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            )}
        </nav>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white">
          <h2 className="text-5xl font-extrabold drop-shadow-lg">Welcome to Golden Essence</h2>
          <p className="mt-4 text-lg">A taste of prestige, plated in perfection</p>
          {!user && (
            <p className="mt-6 text-amber-300 text-lg font-semibold">
            </p>
          )}
        </div>
      </section>

      
      <section id="interiors" className="h-screen w-full bg-gradient-to-br from-amber-50 to-white relative px-10 py-16">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8 drop-shadow-lg">Interiors</h2>
        
        
        <div className="relative mb-12">
          <div ref={scrollRef1} className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-6 scrollHide">
            {interiors1.map((item, index) => (
              <div key={index} className="flex-shrink-0 w-72 h-64 rounded-2xl shadow-xl relative overflow-hidden bg-white">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${item.url})` }}>
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="absolute bottom-0 w-full bg-white/80 backdrop-blur-sm py-2 text-center">
                  <p className="text-gray-800 font-semibold text-lg">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={scrollLeft1} className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-amber-500 text-white p-3 rounded-full shadow-lg hover:bg-amber-600 transition">
            <ChevronLeft size={24}/>
          </button>
          <button onClick={scrollRight1} className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-amber-500 text-white p-3 rounded-full shadow-lg hover:bg-amber-600 transition">
            <ChevronRight size={24}/>
          </button>
        </div>
        
       
        <h3 className="text-2xl font-bold text-gray-800 mt-1 drop-shadow-sm text-center ">Party Halls / Events</h3>
        <div className="relative">
          <div ref={scrollRef2} className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-6">
            {interiors2.map((item, index) => (
              <div key={index} className="flex-shrink-0 w-72 h-64 rounded-2xl shadow-xl relative overflow-hidden bg-white">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${item.url})` }}>
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="absolute bottom-0 w-full bg-white/80 backdrop-blur-sm py-2 text-center">
                  <p className="text-gray-800 font-semibold text-lg">{item.name}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={scrollLeft2} className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-amber-500 text-white p-3 rounded-full shadow-lg hover:bg-amber-600 transition">
            <ChevronLeft size={24}/>
          </button>
          <button onClick={scrollRight2} className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-amber-500 text-white p-3 rounded-full shadow-lg hover:bg-amber-600 transition">
            <ChevronRight size={24}/>
          </button>
        </div>
      </section>

   
      <div className="h-20 md:h-32"></div> 

     
      <section 
        id="book" 
        className="h-screen w-full bg-cover bg-center relative px-10 py-16 flex flex-col items-center justify-center text-center"
        style={{
          backgroundImage: "url('https://thumbs.dreamstime.com/b/luxury-table-settings-fine-dining-glassware-beautiful-blurred-background-events-weddings-preparation-holiday-passover-139822267.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-3 mb-10 justify-center ">
            <UtensilsCrossed size={40} className="text-amber-300"/> 
            <h2 className="text-4xl font-extrabold text-white drop-shadow-lg">Book a Table</h2>
          </div>
          <p className="text-lg text-white mb-6">Reserve your spot and enjoy a luxurious dining experience at Golden Essence.</p>
          <button
            onClick={() => handleProtectedAction("/TableOrder")}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl shadow-lg text-lg font-semibold transition mt-8"
          >
            Reserve Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="w-full bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <UtensilsCrossed className="text-amber-500" size={24} />
                <h3 className="text-2xl font-bold text-amber-500">Golden Essence</h3>
              </div>
              <p className="text-gray-300">Experience exquisite dining with traditional recipes and modern ambiance. Your satisfaction is our priority.</p>
            </div>

            {/* Quick Links */}
           

            {/* Contact Info */}
            <div>
              <h4 className="text-xl font-semibold text-amber-500 mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <Phone size={18} className="text-amber-400"/>
                  +91 98765 43210
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={18} className="text-amber-400"/>
                  info@goldenessence.com
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={18} className="text-amber-400"/>
                  Bangalore, Karnataka
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-700 mb-6" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; 2024 Golden Essence Restaurant. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-amber-400 transition">Privacy Policy</a>
              <a href="#" className="hover:text-amber-400 transition">Terms & Conditions</a>
              <a href="#" className="hover:text-amber-400 transition">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

