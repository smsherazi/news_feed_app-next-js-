import { Roboto,Poppins,Inter,Edu_QLD_Beginner } from "next/font/google";
import Search from "./search";
import Image from "next/image";


const roboto = Roboto({
  subsets: ['cyrillic'],
  weight: ['300']
})
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200']
})
const Edu = Edu_QLD_Beginner({
  subsets: ['latin'],
  weight: ['400']
})
// import 'bootstrap/dist/js/bootstrap.bundle.js'
export default function Navbar({
  searchClick,
  searchQuery,
  setSearchQuery,
  country,
  setCountry,
}) {



  return (
    <nav className="fixed-top glass-navbar">
      <div className="container-fluid justify-content-between d-flex">
        <div className="d-flex gap-4 align-items-center" id="navbarNavDropdown">
          <Image src={'/logoImg.png'} alt="logo" width={'100'} height={'70'}/>
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <select
                className={`${roboto.className} custom-select`}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="pk">🇵🇰 Pakistan</option>
                <option value="us">🇺🇸 United States</option>
                <option value="in">🇮🇳 India</option>
                <option value="gb">🇬🇧 United Kingdom</option>
                <option value="au">🇦🇺 Australia</option>
                <option value="fr">🇫🇷 France</option>
                <option value="sa">🇸🇦 Saudi Arabia</option>
              </select>
            </li>
          </ul>
        </div>

        {/* Right-aligned Search Component */}
        <div className="d-flex align-items-center">
          <Search
            handleBtn={searchClick}
            query={searchQuery}
            setQuery={setSearchQuery}
          />
        </div>
      </div>
    </nav>
  );
}
