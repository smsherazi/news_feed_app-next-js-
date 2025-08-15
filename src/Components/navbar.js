"use client";

import { Roboto, Poppins, Inter, Edu_QLD_Beginner } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { FiLogIn } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Search from "./search";
import ProfileDropdown from "./profileDropdown";

const roboto = Roboto({
  subsets: ["cyrillic"],
  weight: ["300"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200"],
});

const Edu = Edu_QLD_Beginner({
  subsets: ["latin"],
  weight: ["400"],
});

const countries = [
  { code: "pk", label: "🇵🇰 Pakistan" },
  { code: "us", label: "🇺🇸 United States" },
  { code: "in", label: "🇮🇳 India" },
  { code: "gb", label: "🇬🇧 United Kingdom" },
  { code: "au", label: "🇦🇺 Australia" },
  { code: "fr", label: "🇫🇷 France" },
  { code: "sa", label: "🇸🇦 Saudi Arabia" },
];

export default function Navbar({
  searchClick,
  searchQuery,
  setSearchQuery,
  country,
  setCountry,
  setFinalValue,
  user,
  setUser,
  setLoader
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav
      className="fixed-top glass-navbar p-2 shadow-sm"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
    >
      <div className="container-fluid justify-content-between d-flex align-items-center">
        <div className="d-flex gap-3 align-items-center">
          <Image
            src={"/logoImg.png"}
            alt="logo"
            width={40}
            height={40}
            priority
          />

          {/* Custom Dropdown */}
          <div className="position-relative dropdown">
            <button
              className={`dropdown-toggle ${poppins.className}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {countries.find((c) => c.code === country)?.label}
            </button>
            {dropdownOpen && (
              <ul
                className="dropdown-menu show position-absolute mt-1"
                style={{ zIndex: 1000 }}
              >
                {countries.map((item) => (
                  <li key={item.code}>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setCountry(item.code);
                        setDropdownOpen(false);
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

  
        
        <div className="search-box d-flex align-content-center gap-3 position-relative">
          {/* Login/Signup */}
          {user ? (
              <ProfileDropdown userData={user} setUser={setUser} setLoader={setLoader} setCloseCountryDropdown={()=> setDropdownOpen(false)}/>
          ) : (
            <>
              <div className="icon-wrapper">
              <Link href="/login" className="text-white fs-5">
                <FiLogIn />
              </Link>
              <span className="tooltip-text">Login</span>
              </div>
              <div className="icon-wrapper">
              <Link href="/signup" className="text-white fs-5">
                <FaUserPlus />
              </Link>
              <span className="tooltip-text">Signup</span>
              </div>
            </>
          )}

                {/* Custom Search Box */}
          <Search
            query={searchQuery}
            setQuery={setSearchQuery}
            handleBtn={searchClick}
            setInputValue={setFinalValue}
          />
        </div>
      </div>
    </nav>
  );
}
