import { useEffect, useRef, useState } from "react";
import DotsIcon from "../assets/Dots";
import PopupMenu from "./PopupMenu.js";

function Dots({ episode }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null);

  // Toggle the popup menu visibility
  const handleDotsClick = () => {
    setMenuVisible((prevVisible) => !prevVisible);
  };

  // Handle clicking outside of the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <DotsIcon
        onClick={handleDotsClick}
        className="w-5 h-5 cursor-pointer"
        color="#f0f0f0"
      />
      {menuVisible && <PopupMenu episodeId={episode.uuid} />}
    </div>
  );
}

export default Dots;
