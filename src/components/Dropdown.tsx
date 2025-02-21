import { useEffect, useRef, useState } from "react";

function Dropdown({ options, selectedVal, handleChange, placeholder }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", toggle);
    return () => document.removeEventListener("click", toggle);
  }, []);

  const selectOption = (option) => {
    setQuery("");
    handleChange(option); // Directly set the selected string
    setIsOpen(false); // Close dropdown after selection
  };

  function toggle(e) {
    setIsOpen(e && e.target === inputRef.current);
  }

  const getDisplayValue = () => {
    if (query) return query;
    if (selectedVal) return selectedVal;
    return "";
  };

  const filterOptions = () => {
    return options.filter((option) =>
      option.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <div className="dropdown">
      <div className="control">
        <div className="selected-value">
          <input
            ref={inputRef}
            type="text"
            value={getDisplayValue()}
            name="searchTerm"
            placeholder={placeholder}
            onChange={(e) => {
              setQuery(e.target.value);
              handleChange(null);
            }}
            onClick={toggle}
          />
        </div>
        <div className={`arrow ${isOpen ? "open" : ""}`}></div>
      </div>

      <div className={`options ${isOpen ? "open" : ""}`}>
        {filterOptions().map((option, index) => (
          <div
            onClick={() => selectOption(option)}
            className={`option ${option === selectedVal ? "selected" : ""}`}
            key={index}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dropdown;
