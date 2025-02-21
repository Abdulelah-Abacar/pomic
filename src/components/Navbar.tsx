import { useState } from "react";
import HamburgerIcon from "../assets/hamburger";
import UserProfile from "./UserProfile";
import Menu from "./Menu";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Menu visibility state
  return (
    <>
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(true)} // Open the modal
        >
          <HamburgerIcon className="w-7 aspect-square" color="#f4f4f5" />
        </button>
      </div>
      <>
        {/* Modal for Create Playlist */}
        {isMenuOpen && (
          <div
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-50 bg-black/50"
          >
            <div className="shadow-lg relative left-10 top-10">
              <div className="flex flex-col gap-4 w-60">
                <UserProfile />

                {/* Menu */}
                <Menu />
              </div>
            </div>
          </div>
        )}
      </>
    </>
  );
}

export default Navbar;
