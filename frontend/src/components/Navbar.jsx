import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { LogOut } from "lucide-react";
import logo from "../assets/Logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false); // Renamed for clarity
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false); // New state for mobile dropdown
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  // Handle scroll and Escape key
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY <= lastScrollY || currentScrollY <= 50);
      setLastScrollY(currentScrollY);
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setIsDesktopDropdownOpen(false);
        setIsMobileDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [lastScrollY]);

  // Unified navigation handler
  const navigateAndClose = (path) => {
    if (path === "logout") {
      logout();
      path = "/";
    }
    navigate(path);
    setMenuOpen(false);
    setIsDesktopDropdownOpen(false);
    setIsMobileDropdownOpen(false);
  };

  // Menu item component
  const MenuItem = ({ path, label, isButton, isLogout, isMobile }) => (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        navigateAndClose(isLogout ? "logout" : path);
      }}
      className={
        isButton
          ? `px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-base font-medium rounded-md transition-colors duration-200 ${
              isMobile ? "w-full text-center" : ""
            }`
          : `flex items-center gap-1 text-gray-700 hover:text-black text-base font-medium transition-colors duration-200 ${
              isMobile ? "text-center py-2 w-full" : ""
            }`
      }
      aria-label={isLogout ? "Sign out of your account" : label}
    >
      {isLogout && (
        <LogOut size={16} className="text-gray-700 hover:text-black" />
      )}
      {label}
    </a>
  );

  // Dropdown item component
  const DropdownItem = ({ label, path }) => (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        navigateAndClose(path);
      }}
      className="block py-2 px-3 rounded-lg text-base text-gray-800 hover:bg-gray-100" // Changed text-sm to text-base
    >
      {label}
    </a>
  );

  // Menu items configuration
  const menuItems = [
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
    { path: "/support", label: "Support" },
    {
      label: "More",
      isDropdown: true,
      submenu: [
        { label: "Add your restaurant", path: "/add-restaurent" },
        { label: "Sign up to deliver", path: "/more/purchases" },
      ],
    },
    ...(isAuthenticated
      ? [
          { path: "/profile", label: "Profile" },
          { path: "/dashboard", label: "Dashboard" },
          {
            path: "logout",
            label: "Sign Out",
            isButton: false,
            isLogout: true,
          },
        ]
      : [
          { path: "/signup", label: "Sign Up" },
          { path: "/login", label: "Login", isButton: true },
        ]),
  ];

  return (
    <nav
      className={`bg-white mx-auto max-w-full px-4 sm:px-6 md:px-8 py-5 fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center mx-auto max-w-6xl justify-between">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigateAndClose("/");
          }}
          className="flex items-center space-x-2"
        >
          <img
            src={logo}
            alt="PickMyFood Logo"
            className="h-8 w-8 object-contain"
          />
          <span className="text-2xl font-bold text-black">PickMyFood</span>
        </a>

        {/* Hamburger/Close Menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-800 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 rounded-md"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>

        {/* Desktop Menu */}

        <div className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) =>
            item.isDropdown ? (
              <div key={item.label} className="relative">
                <button
                  onClick={() =>
                    setIsDesktopDropdownOpen(!isDesktopDropdownOpen)
                  }
                  className="inline-flex items-center gap-x-2 text-base font-medium rounded-lg bg-white text-gray-800 focus:outline-none"
                  aria-haspopup="menu"
                  aria-expanded={isDesktopDropdownOpen}
                  aria-label="More options"
                >
                  {item.label}
                  <svg
                    className={`w-4 h-4 ${
                      isDesktopDropdownOpen ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {isDesktopDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg z-50 sm:right-0 sm:w-48">
                    {" "}
                    {/* Changed left-0 to right-0 */}
                    <div className="p-1 space-y-0.5">
                      {item.submenu.map((subItem) => (
                        <DropdownItem
                          key={subItem.path}
                          label={subItem.label}
                          path={subItem.path}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <MenuItem key={item.path} {...item} />
            )
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? " opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col mt-4 space-y-4 px-4 pb-4">
          {" "}
          {/* Adjusted spacing */}
          {menuItems.map((item) =>
            item.isDropdown ? (
              <div key={item.label}>
                <button
                  onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                  className="w-full py-3 px-4 inline-flex items-center justify-between gap-x-2 text-base font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none"
                  aria-haspopup="menu"
                  aria-expanded={isMobileDropdownOpen}
                  aria-label="More options"
                >
                  {item.label}
                  <svg
                    className={`w-4 h-4 ${
                      isMobileDropdownOpen ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {isMobileDropdownOpen && (
                  <div className="mt-2 w-full bg-white shadow-md rounded-lg">
                    <div className="p-2 space-y-1">
                      {" "}
                      {/* Adjusted padding and spacing */}
                      {item.submenu.map((subItem) => (
                        <DropdownItem
                          key={subItem.path}
                          label={subItem.label}
                          path={subItem.path}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <MenuItem key={item.path} {...item} isMobile />
            )
          )}
        </div>
      </div>
    </nav>
  );
}
