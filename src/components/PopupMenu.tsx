import { useState } from "react";
import FavoriteIcon from "../assets/favorite";
import ShareIcon from "../assets/share";
import Playlist1Icon from "../assets/Playlist1";
import db from "../appwrite/database";
import LoaderSpinner from "./LoaderSpinner";
import { Query } from "appwrite";
import { useAuth } from "@clerk/clerk-react";

function PopupMenu({ episodeId }) {
  const { userId } = useAuth();
  const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch playlists for the logged-in user
  const fetchPlaylists = async () => {
    if (!userId) {
      return; // Skip fetching if no user is logged in
    }

    setLoading(true);
    try {
      const response = await db.playlist.list([
        Query.equal("userId", userId), // Filter playlists by current user's ID
        Query.orderDesc("$createdAt"),
      ]);
      setPlaylists(response.documents);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add episode to the user's favorites array
  const addToFavorites = async () => {
    if (!userId) {
      alert("You need to log in to add to favorites.");
      return;
    }

    try {
      // Fetch the user's document
      const userDocument = await db.user.list([
        Query.equal("clerkId", userId), // Filter playlists by userId(ClerkId)
      ]);
      const user = userDocument?.documents[0];

      // Check if the episode is already in favorites
      if (user.favorites && user.favorites.includes(episodeId)) {
        alert("This episode is already in your favorites.");
        return;
      }

      // Update the favorites array
      const updatedFavorites = user.favorites
        ? [episodeId, ...user.favorites]
        : [episodeId];

      await db.user.update(user.$id, {
        favorites: updatedFavorites,
      });

      alert("Episode added to favorites successfully!");
    } catch (error) {
      console.error("Error adding to favorites:", error);
      alert("Failed to add episode to favorites.");
    }
  };

  return (
    <>
      {/* Popup Menu */}
      <ul className="absolute top-full right-6 min-w-max flex flex-col justify-center gap-3 p-3 px-5 list-none w-fit text-sm font-semibold rounded-2xl bg-zinc-900">
        <li className="flex gap-3 items-center">
          <ShareIcon className="w-4 aspect-square" color="#f4f4f5" />
          <span>Share</span>
        </li>
        <li
          className="flex gap-3 items-center cursor-pointer"
          onClick={() => {
            setShowPlaylistDialog(true);
            fetchPlaylists();
          }}
        >
          <Playlist1Icon className="w-4 aspect-square" color="#f4f4f5" />
          <span>Add To Playlist</span>
        </li>
        <li
          className="flex gap-3 items-center cursor-pointer"
          onClick={addToFavorites}
        >
          <FavoriteIcon className="w-4 aspect-square" color="#f4f4f5" />
          <span>Add To Favorites</span>
        </li>
      </ul>

      {/* Playlist Dialog */}
      {showPlaylistDialog && (
        <AddToPlaylistDialog
          playlists={playlists}
          loading={loading}
          setShowPlaylistDialog={setShowPlaylistDialog}
          setPlaylists={setPlaylists}
          episodeId={episodeId}
          userId={userId}
        />
      )}
    </>
  );
}

export default PopupMenu;

function AddToPlaylistDialog({
  playlists,
  loading,
  setShowPlaylistDialog,
  setPlaylists,
  episodeId,
  userId,
}) {
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  // Handle creating a new playlist
  const createNewPlaylist = async () => {
    if (!userId) {
      alert("You need to log in to create a playlist.");
      return;
    }

    if (!newPlaylistName.trim()) {
      alert("Playlist name cannot be empty.");
      return;
    }

    setCreatingPlaylist(true);
    try {
      const response = await db.playlist.create({
        title: newPlaylistName,
        episodesId: [],
        episodesTotalNum: 0,
        userId: userId,
      });
      setPlaylists((prev) => [response, ...prev]);
      alert("Playlist created successfully!");
      setNewPlaylistName("");
    } catch (error) {
      console.error("Error creating playlist:", error);
      alert("Failed to create playlist.");
    } finally {
      setCreatingPlaylist(false);
    }
  };

  // Handle adding an episode to a playlist
  const addToPlaylist = async (playlistId) => {
    try {
      const selectedPlaylist = playlists.find(
        (playlist) => playlist.$id === playlistId
      );

      if (selectedPlaylist.episodesId.includes(episodeId)) {
        alert("This episode is already in the playlist.");
        return;
      }

      const updatedEpisodes = [...selectedPlaylist.episodesId, episodeId];

      await db.playlist.update(playlistId, {
        episodesId: updatedEpisodes,
        episodesTotalNum: updatedEpisodes.length,
      });

      alert("Episode added to playlist successfully!");
      setShowPlaylistDialog(false);

      setPlaylists((prev) =>
        prev.map((playlist) =>
          playlist.$id === playlistId
            ? {
                ...playlist,
                episodesId: updatedEpisodes,
                episodesTotalNum: updatedEpisodes.length,
              }
            : playlist
        )
      );
    } catch (error) {
      console.error("Error adding episode to playlist:", error);
      alert("Failed to add episode to playlist.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-zinc-900 rounded-2xl p-5 w-full max-w-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Manage Playlist</h2>
          <button
            onClick={() => setShowPlaylistDialog(false)}
            className="text-lg font-bold"
            aria-label="Close dialog"
            title="Close dialog"
          >
            ×
          </button>
        </div>
        {!userId ? (
          <p className="text-gray-400 text-center">
            You need to log in to manage playlists.
          </p>
        ) : loading ? (
          <LoaderSpinner />
        ) : (
          <>
            {/* New Playlist Creation */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter new playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="w-full p-2 rounded-lg bg-zinc-800 text-white"
              />
              <button
                onClick={createNewPlaylist}
                disabled={creatingPlaylist}
                className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500"
              >
                {creatingPlaylist ? "Creating..." : "Create Playlist"}
              </button>
            </div>

            {/* Existing Playlists */}
            {playlists.length > 0 ? (
              <ul className="list-none flex flex-col gap-3">
                {playlists.map((playlist) => (
                  <li
                    key={playlist.$id}
                    className="flex justify-between items-center p-3 rounded-lg bg-zinc-800 cursor-pointer hover:bg-zinc-700"
                    onClick={() => addToPlaylist(playlist.$id)}
                  >
                    <span>{playlist.title}</span>
                    <span className="text-sm text-gray-400">
                      {playlist.episodesTotalNum} episodes
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-center">No playlists found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
