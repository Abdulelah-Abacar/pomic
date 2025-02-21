import { useState, useEffect } from "react";
import LoaderSpinner from "../components/LoaderSpinner.js";
import SearchIcon from "../assets/Search";
import SearchNoResult from "../components/SearchNoResult.js";
import PlaylistCard from "../components/PlaylistCard.js";
import { Query } from "appwrite";
import { useDebounce } from "../utils/useDebounce.js";
import db from "../appwrite/database.js";
import { Link } from "react-router-dom";
import { Protect, useAuth } from "@clerk/clerk-react";

function Playlists() {
  const { isSignedIn, userId } = useAuth(); // Use user from Clerk to access the logged-in user's details
  const [playlists, setPlaylists] = useState([]); // Stores the currently displayed playlists
  const [allPlaylists, setAllPlaylists] = useState([]); // Stores all playlists (for searching)
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const debouncedValue = useDebounce(search, 500); // Debounce the search input

  // Fetch the current user's playlists initially
  const init = async () => {
    if (!userId) return; // Exit if no user is logged in

    setLoading(true);
    try {
      // Fetch playlists filtered by the current user's ID
      const response = await db.playlist.list([
        Query.equal("userId", userId), // Filter playlists by userId
        Query.orderDesc("$createdAt"), // Sort by creation date
      ]);
      setPlaylists(response.documents);
      setAllPlaylists(response.documents); // Store all playlists for search filtering
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      init();
    }
  }, [isSignedIn]); // Trigger init when user signs in

  // Filter playlists whenever the debounced search value changes
  useEffect(() => {
    if (isSignedIn) {
      if (debouncedValue) {
        const filteredPlaylists = allPlaylists.filter((playlist) =>
          playlist.title.toLowerCase().includes(debouncedValue.toLowerCase())
        );
        setPlaylists(filteredPlaylists);
      } else {
        setPlaylists(allPlaylists); // Reset to all playlists if search is empty
      }
    }
  }, [debouncedValue, allPlaylists, isSignedIn]);

  return (
    <div>
      <div className="flex items-center rounded-2xl bg-stone-900 min-h-[50px] w-full pl-5 mb-5">
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

      <Protect
        fallback={
          <p className="text-center p-5">
            SignIn to see playlists <br />{" "}
            <Link to={"/sign-in"} className="text-indigo-500 font-bold">
              SignIn
            </Link>
          </p>
        }
      >
        {playlists.length === 0 && !loading ? (
          <SearchNoResult />
        ) : (
          <div className="grid gap-5 gap-y-6 lg:grid-cols-2 2xl:grid-cols-3 h-screen overflow-scroll pb-24">
            {!loading ? (
              <>
                {playlists.map((item, i) => (
                  <PlaylistCard key={i} item={item} />
                ))}
              </>
            ) : (
              <LoaderSpinner />
            )}
          </div>
        )}
      </Protect>
    </div>
  );
}

export default Playlists;
