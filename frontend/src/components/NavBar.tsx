// import { useState, useEffect } from "react";
// import logo from "../assets/rezteche-logo.png";

// const NAV_ITEMS = [
//   { label: "Survival ", href: "./pages/level1" },
//   { label: "Obligation", href: "./pages/level2" },
//   { label: "Option", href: "./pages/level3" },
// ];

// export function NavBar() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const handleNavClick = (href: string) => {
//     const target = document.querySelector(href);
//     if (target) {
//       target.scrollIntoView({ behavior: "smooth" });
//     }
//     setIsOpen(false);
//   };

//   return (
//     <header
//       className={`fixed top-0 left-0 right-0 z-50 transition-all ${
//         isScrolled
//           ? "bg-slate-900/80 backdrop-blur-md border-b border-slate-800"
//           : "bg-transparent"
//       }`}
//     >
//       <div className="mx-auto max-w-6xl flex items-center justify-between px-4 md:px-8 lg:px-12 h-16">
//         {/* LOGO */}
//         <a href="https://www.rezteche.com/" className="flex items-center">
//           <img
//             src={logo}
//             alt="RezTeche Logo"
//             className="h-28 w-auto object-contain transition-all duration-200"
//           />
//         </a>

//         {/* DESKTOP NAV */}
//         <nav className="hidden md:flex gap-6 text-sm text-slate-300">
//           {NAV_ITEMS.map((item) => (
//             <button
//               key={item.href}
//               onClick={() => handleNavClick(item.href)}
//               className="hover:text-primary transition-colors"
//             >
//               {item.label}
//             </button>
//           ))}
//         </nav>

//         {/* MOBILE HAMBURGER */}
//         <button
//           className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-200 hover:text-primary hover:bg-slate-800/60 transition"
//           onClick={() => setIsOpen((prev) => !prev)}
//           aria-label="Toggle navigation menu"
//         >
//           <span
//             className={`block h-0.5 w-5 bg-slate-200 transition-transform duration-200 ${
//               isOpen ? "translate-y-1.5 rotate-45" : ""
//             }`}
//           />
//           <span
//             className={`block h-0.5 w-5 bg-slate-200 my-1 transition-opacity duration-200 ${
//               isOpen ? "opacity-0" : "opacity-100"
//             }`}
//           />
//           <span
//             className={`block h-0.5 w-5 bg-slate-200 transition-transform duration-200 ${
//               isOpen ? "-translate-y-1.5 -rotate-45" : ""
//             }`}
//           />
//         </button>
//       </div>

//       {/* MOBILE MENU DROPDOWN */}
//       {isOpen && (
//         <div className="md:hidden bg-slate-950/95 border-t border-slate-800">
//           <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2 text-sm text-slate-200">
//             {NAV_ITEMS.map((item) => (
//               <button
//                 key={item.href}
//                 onClick={() => handleNavClick(item.href)}
//                 className="w-full text-left py-2 hover:text-primary hover:bg-slate-900/70 rounded-md px-2 transition"
//               >
//                 {item.label}
//               </button>
//             ))}
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// }










import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/rezteche-logo.png";

const NAV_ITEMS = [
  { label: "Survival", to: "/level1" },
  { label: "Obligation", to: "/maintenance" },
  { label: "Option", to: "/level3" },
];

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (to: string) => {
    navigate(to);
    setIsOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        isScrolled
          ? "bg-slate-900/80 backdrop-blur-md border-b border-slate-800"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 md:px-8 lg:px-12 h-16">
        {/* LOGO */}
        <a href="https://www.rezteche.com/" className="flex items-center">
          <img
            src={logo}
            alt="RezTeche Logo"
            className="h-28 w-auto object-contain transition-all duration-200"
          />
        </a>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-6 text-sm text-slate-300">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.to}
              onClick={() => handleNavClick(item.to)}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-200 hover:text-primary hover:bg-slate-800/60 transition"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <span
            className={`block h-0.5 w-5 bg-slate-200 transition-transform duration-200 ${
              isOpen ? "translate-y-1.5 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-slate-200 my-1 transition-opacity duration-200 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-slate-200 transition-transform duration-200 ${
              isOpen ? "-translate-y-1.5 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-slate-950/95 border-t border-slate-800">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2 text-sm text-slate-200">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.to}
                onClick={() => handleNavClick(item.to)}
                className="w-full text-left py-2 hover:text-primary hover:bg-slate-900/70 rounded-md px-2 transition"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
