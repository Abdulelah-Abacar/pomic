import { useEffect, useState } from "react";
import SearchIcon from "../assets/Search";
import PlaylistCard from "./PlaylistCard";
import db from "../appwrite/database";
import { Query } from "appwrite";
import LoaderSpinner from "./LoaderSpinner";
import { useDebounce } from "../utils/useDebounce";

function PlaylistSearch() {
  const [playlists, setPlaylists] = useState([]); // Stores the currently displayed playlists
  const [allPlaylists, setAllPlaylists] = useState([]); // Stores all playlists
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const debouncedValue = useDebounce(search, 500); // Debounce the search input

  // Fetch all playlists initially
  const init = async () => {
    setLoading(true);
    const response = await db.playlist.list([Query.orderDesc("$createdAt")]);
    setPlaylists(response.documents);
    setAllPlaylists(response.documents); // Store all playlists
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  // Filter playlists whenever the debounced search value changes
  useEffect(() => {
    if (debouncedValue) {
      const filteredPlaylists = allPlaylists.filter((playlist) =>
        playlist.title.toLowerCase().includes(debouncedValue.toLowerCase())
      );
      setPlaylists(filteredPlaylists);
    } else {
      setPlaylists(allPlaylists); // Reset to all playlists if search is empty
    }
  }, [debouncedValue, allPlaylists]);

  return (
    <div className="col-span-5 relative">
      <div className="flex justify-between items-center gap-3 sticky top-0 z-40">
        <div className="flex items-center rounded-2xl bg-stone-900 min-h-[50px] w-full pl-5">
          <SearchIcon
            color="#f0f0f0"
            className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100 hover:scale-110 duration-300"
          />
          <input
            className="w-11/12 border-none outline-none px-3 bg-transparent placeholder:font-thin placeholder:text-lg text-xl font-semibold"
            type="text"
            autoFocus
            placeholder="I want to listen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)} // Update the search state
          />
        </div>
      </div>
      <br />
      <div className="grid gap-5 gap-y-6 lg:grid-cols-3 2xl:grid-cols-4">
        {!loading ? (
          <>
            {playlists.map(({ $id, title, episodesTotalNum, imageUrl }, i) => (
              <PlaylistCard
                key={i}
                title={title}
                num={episodesTotalNum}
                img={imageUrl}
                id={$id}
              />
            ))}
          </>
        ) : (
          <LoaderSpinner />
        )}
      </div>
    </div>
  );
}

export default PlaylistSearch;
