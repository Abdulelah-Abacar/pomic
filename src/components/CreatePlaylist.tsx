import db from "../appwrite/database";
import PropTypes from "prop-types";
import { useAuth } from "@clerk/clerk-react";

function CreatePlaylist({ onClose }) {
  const { userId } = useAuth();

  const handleAdd = async (e) => {
    e.preventDefault();
    const playlistName = e.target.playlistName.value.trim();

    // Check if the user is logged in
    if (!userId) {
      alert("You need to log in to create a playlist.");
      return;
    }

    // Validate playlist name
    if (playlistName === "") {
      alert("Please enter a playlist name.");
      return;
    }

    try {
      const payload = {
        title: playlistName,
        userId: userId,
      };

      const response = await db.playlist.create(payload);
      console.log("Playlist created:", response);

      // Reset the form and close the modal
      e.target.reset();
      onClose();
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <input
        className="w-11/12 border-none outline-none px-3 bg-transparent placeholder:font-thin placeholder:text-lg text-xl font-semibold"
        type="text"
        autoFocus
        placeholder="Playlist Name"
        name="playlistName"
      />
      <div className="flex gap-4 mt-10">
        <button
          className="outline-none border-none bg-indigo-500 py-3 px-14 font-bold rounded-xl"
          type="submit"
        >
          Add
        </button>
        <button
          className="outline-none border border-[#f0f0f0] py-3 px-14 font-bold rounded-xl"
          type="reset"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

CreatePlaylist.propTypes = {
  onClose: PropTypes.func.isRequired, // Function to close the modal
  userId: PropTypes.string, // User ID to associate the playlist
};

export default CreatePlaylist;
