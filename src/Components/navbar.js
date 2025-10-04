'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiLogIn } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";
import Search from "./search";
import ProfileDropdown from "./profileDropdown";
import { usePathname } from "next/navigation";
import { Roboto, Poppins, Edu_QLD_Beginner } from "next/font/google";

const roboto = Roboto({ subsets: ["cyrillic"], weight: ["300"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["200"] });
const Edu = Edu_QLD_Beginner({ subsets: ["latin"], weight: ["400"] });

export default function Navbar({
  onSearchChange,
  country,
  setCountry,
  isSavedPage = false,
  user,
  setUser,
  availableCountries = [],
  setLoader,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  const handleSearchBtn = () => {
    let finalQuery = searchQuery.trim();
    if (!finalQuery) finalQuery = isSavedPage ? "" : "latest";
    onSearchChange(finalQuery, country);
  };

  const handleCountryChange = (code) => {
    setCountry(code);
    onSearchChange(searchQuery, code);
    setDropdownOpen(false);
  };

  useEffect(() => {
    setDropdownOpen(false);
  }, [country]);

  const countryLabels = {
    pk: "🇵🇰 Pakistan",
    us: "🇺🇸 United States",
    in: "🇮🇳 India",
    gb: "🇬🇧 United Kingdom",
    au: "🇦🇺 Australia",
    fr: "🇫🇷 France",
    sa: "🇸🇦 Saudi Arabia",
  };

  let countries = [];
  if (country) {
    const countryCodes = Array.from(new Set(country.split(",").map(c => c.trim().toLowerCase())));
    countries = countryCodes.map(code => ({
      code,
      label: countryLabels[code] || code.toUpperCase(),
    }));
    Object.keys(countryLabels).forEach(code => {
      if (!countries.some(c => c.code === code)) {
        countries.push({ code, label: countryLabels[code] });
      }
    });
  }

  const hideCountryAndSearch = pathname === "/about" || pathname === "/privacy";

  return (
    <nav className="fixed-top glass-navbar p-2 shadow-sm" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
      <div className="container-fluid justify-content-between d-flex align-items-center">
        <div className="d-flex gap-3 align-items-center">
          <Link href="/">
            <Image src={"/logoImg.png"} alt="logo" width={40} height={40} priority />
          </Link>
          {/* Country dropdown tab hi show karo jab country available ho and not in about/privacy */}
          {!hideCountryAndSearch && country && (
            <div className="position-relative dropdown">
              <button className="dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {countries.find(c => c.code === country.split(",")[0].trim().toLowerCase())?.label || "🌍 All"}
              </button>
              {dropdownOpen && (
                <ul className="dropdown-menu show position-absolute mt-1" style={{ zIndex: 1000 }}>
                  {countries.map((item) => (
                    <li key={item.code}>
                      <button className="dropdown-item" onClick={() => handleCountryChange(item.code)}>
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="search-box d-flex align-items-center gap-3 position-relative">
          {/* Hide search bar on about/privacy pages */}
          {!hideCountryAndSearch && (
            <Search query={searchQuery} setQuery={setSearchQuery} handleBtn={handleSearchBtn} />
          )}

          {/* Links for About & Privacy Policy */}
          <div className="navbar-links">
            <Link href="/about" className="text-white text-decoration-none">About</Link>
            <Link href="/privacypolicy" className="text-white text-decoration-none">Privacy Policy</Link>
          </div>


          {/* Profile dropdown always shown if user logged in */}
          {user ? (
            <ProfileDropdown
              userData={user}
              setUser={setUser}
              setLoader={setLoader}
              setCloseCountryDropdown={() => setDropdownOpen(false)}
            />
          ) : (
            <>
              <div className="icon-wrapper">
                <Link href="/login" className="text-white fs-5"><FiLogIn /></Link>
              </div>
              <div className="icon-wrapper">
                <Link href="/signup" className="text-white fs-5"><FaUserPlus /></Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
