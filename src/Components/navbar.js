'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiLogIn } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";
import Search from "./search";
import ProfileDropdown from "./profileDropdown";
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
  availableCountries = []  
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchBtn = () => {
    let finalQuery = searchQuery.trim();

    // ✅ SavedNews → empty allowed, Timeline → default "latest"
    if (!finalQuery) {
      finalQuery = isSavedPage ? "" : "latest";
    }

    onSearchChange(finalQuery, country);
  };

  const handleCountryChange = (code) => {
    setCountry(code);
    onSearchChange(searchQuery, code);
    setDropdownOpen(false);
  };

  // ✅ Agar saved page hai to sirf wo countries show hongi jo availableCountries me hain
  const countries = isSavedPage
    ? availableCountries.map(c => ({ code: c, label: c.toUpperCase() }))
    : [
        { code: "pk", label: "🇵🇰 Pakistan" },
        { code: "us", label: "🇺🇸 United States" },
        { code: "in", label: "🇮🇳 India" },
        { code: "gb", label: "🇬🇧 United Kingdom" },
        { code: "au", label: "🇦🇺 Australia" },
        { code: "fr", label: "🇫🇷 France" },
        { code: "sa", label: "🇸🇦 Saudi Arabia" },
      ];

  return (
    <nav className="fixed-top glass-navbar p-2 shadow-sm" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
      <div className="container-fluid justify-content-between d-flex align-items-center">
        <div className="d-flex gap-3 align-items-center">
          <Image src={"/logoImg.png"} alt="logo" width={40} height={40} priority />
          <div className="position-relative dropdown">
            <button className="dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {countries.find((c) => c.code === country)?.label || "🌍 All"}
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
        </div>

        <div className="search-box d-flex align-items-center gap-3 position-relative">
          
          <Search query={searchQuery} setQuery={setSearchQuery} handleBtn={handleSearchBtn} />

          {user ? (
            <ProfileDropdown userData={user} setUser={setUser} />
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
