import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Protect, useAuth } from "@clerk/clerk-react";
import { Query } from "appwrite";

import LoaderSpinner from "./LoaderSpinner";
import Modal from "./Modal"; // Import a reusable Modal component
import CreatePlaylist from "./CreatePlaylist"; // Import your Create Playlist component

import PlayListIcon from "../assets/playlist";
import SearchIcon from "../assets/Search";
import PlusIcon from "../assets/plus";

import db from "../appwrite/database";
import PlaylistItem from "./PlaylistItem";
import UserProfile from "./UserProfile";
import Menu from "./Menu";

function LeftSidebar() {
  const { isSignedIn, userId } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

  const fetchUserPlaylists = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // console.log("Fetching playlists for user:", userId); // Debugging user ID
      const response = await db.playlist.list([
        Query.equal("userId", userId), // Ensure your database includes this field
        Query.orderDesc("$createdAt"),
      ]);
      // console.log("Playlists response:", response.documents); // Log the response
      setPlaylists(response.documents);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchUserPlaylists();
    }
  }, [isSignedIn]);

  return (
    <div className="flex flex-col gap-4 h-[calc(100%-40px)] max-h-[98vh]">
      <div className="lg:hidden">
        <UserProfile />
      </div>

      {/* Menu */}
      <Menu />

      {/* Playlists */}
      <div className="relative flex flex-col gap-2 py-5 pb-2 rounded-2xl bg-stone-900 overflow-hidden grow">
        {/* Header */}
        <div className="flex justify-between items-center px-5">
          <div className="flex gap-3 items-center text-base font-semibold">
            <PlayListIcon color="#f0f0f0" className="w-6 h-6" />
            <div>Your playlist ({playlists.length})</div>
          </div>
          <div className="flex gap-5 items-center">
            <Link to={"playlists"}>
              <SearchIcon
                color="#f0f0f0"
                className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100 hover:scale-110 duration-300"
              />
            </Link>
            <button
              onClick={() => setIsModalOpen(true)} // Open the modal
              className="opacity-80 hover:opacity-100 hover:scale-110 duration-300"
            >
              <PlusIcon color="#f0f0f0" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Playlist Items */}
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
          <div className="flex flex-col gap-1 px-2 h-full">
            {!loading ? (
              <>
                {playlists.length === 0 ? (
                  <p className="text-center p-5">You have no playlists yet</p>
                ) : (
                  <PlaylistsContainer>
                    {playlists.map((item, i) => (
                      <PlaylistItem item={item} key={i} />
                    ))}
                  </PlaylistsContainer>
                )}
              </>
            ) : (
              <LoaderSpinner />
            )}
          </div>
        </Protect>
      </div>

      {/* Modal for Create Playlist */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <CreatePlaylist onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

export default LeftSidebar;

function isVisible(parent, child) {
  // Determines whether a child element is visible within its parent
  return !(
    child.offsetTop - parent.offsetTop > parent.offsetHeight ||
    child.offsetLeft - parent.offsetLeft > parent.offsetWidth
  );
}

function PlaylistsContainer({ children }) {
  const parentRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const parent = parentRef.current;

    if (parent) {
      const allChildren = Array.from(parent.children);

      // Check if any child overflows the parent
      const isAnyChildInvisible = allChildren.some(
        (child) => !isVisible(parent, child)
      );

      setIsOverflowing(isAnyChildInvisible);
    }
  }, [children]); // Re-run whenever children change

  return (
    <div ref={parentRef} className="max-h-[95%] overflow-hidden">
      {/* Render all children */}
      {children}

      {/* Show 'Show More' button if content is overflowing */}
      {isOverflowing && (
        <Link
          to={"playlists"}
          className="absolute z-10 left-0 bottom-0 w-full p-5 flex justify-center items-center bg-gradient-to-t from-stone-900 via-stone-900/80 font-light hover:font-normal duration-200"
        >
          Show All
        </Link>
      )}
    </div>
  );
}
