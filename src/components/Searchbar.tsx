import { useEffect, useState } from "react";
import { Input } from "./input";
import { useDebounce } from "../utils/useDebounce";
import SearchIcon from "../assets/Search";
import { useLocation, useNavigate } from "react-router";

const Searchbar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const debouncedValue = useDebounce(search, 500);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    // console.log(searchParams);
    // console.log(searchParams.toString());

    if (debouncedValue) {
      // Add or update the search term in the query parameters
      searchParams.set("term", debouncedValue);
      navigate(`/discover?${searchParams.toString()}`);
    } else {
      // If debouncedValue is empty, remove the "term" query parameter but keep others
      searchParams.delete("term");

      // If there are no query parameters left, navigate to `/discover` without any parameters
      if ([...searchParams].length === 0) {
        navigate("/discover");
      } else {
        // If other query parameters (like genre, country, etc.) exist, preserve them
        navigate(`/discover?${searchParams.toString()}`);
      }
    }
  }, [navigate, location.search, debouncedValue]);

  return (
    <div className="relative block w-full">
      <Input
        className="w-full border-none outline-none px-3 bg-stone-900 placeholder:font-thin placeholder:text-lg text-xl font-semibold pl-12"
        placeholder="i want to listen...."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <SearchIcon
        color="#f0f0f0"
        className="absolute left-4 top-3.5 w-5 h-5 cursor-pointer opacity-80 hover:opacity-100 hover:scale-110 duration-300"
      />
    </div>
  );
};

export default Searchbar;
