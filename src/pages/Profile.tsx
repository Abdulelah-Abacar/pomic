import { useEffect, useState, useCallback, memo } from "react";
import PlaylistCard from "../components/PlaylistCard";
import ProfileNoPlaylists from "../components/ProfileNoPlaylists";
import EpisodeListItem from "../components/EpisodeListItem";
import { useQuery } from "@apollo/client";
import {
  GET_MultiplePodcastEpisodes,
  GET_MultiplePodcastSeries,
} from "../query.js";
import LoaderSpinner from "../components/LoaderSpinner";
import db from "../appwrite/database.js";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Query } from "appwrite";
import { Link } from "react-router-dom";
import HistoryEmptyState from "../components/HistoryEmptyState.js";
import PodcastCard from "../components/PodcastCard.js";

const navigationItems = ["Playlists", "Favorites", "History", "Subscriptions"];

function Profile() {
  const { user } = useUser(); // Use Clerk for user data
  const { isSignedIn } = useAuth(); // Use Clerk for authentication
  const [activeSection, setActiveSection] = useState("Playlists"); // State for active section

  return (
    <div className="h-screen overflow-y-scroll pb-14">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">
          {isSignedIn ? user?.fullName : "Guest"}
          <br />
          <small className="text-sm opacity-70">
            @{isSignedIn ? user?.username : "Guest"}
          </small>
        </h1>
        <button className="flex gap-2 outline-none border-none justify-center items-center px-4 py-2.5 text-base font-bold rounded shadow-sm bg-stone-900">
          <span>Setting</span>
        </button>
      </div>
      <br />
      <div>
        {/* Profile Navigation with click handling */}
        <Navigation
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Conditional Rendering for each section */}
        {activeSection === "Playlists" && (
          <Playlists activeSection={activeSection} />
        )}
        {activeSection === "Favorites" && <Favorites />}
        {activeSection === "History" && <History />}
        {activeSection === "Subscriptions" && <Subscriptions />}
      </div>
    </div>
  );
}

export default Profile;

const Navigation = memo(({ activeSection, setActiveSection }) => {
  const handleTapChange = useCallback(
    (item) => {
      setActiveSection(item);
    },
    [setActiveSection]
  ); // `useCallback` ensures the reference stays the same across renders.

  return (
    <div className="2xl:w-fit mx-auto mb-5 flex gap-5 items-center px-3 py-2 text-lg text-center overflow-x-auto whitespace-nowrap scroll-snap-x scroll-snap-mandatory rounded-2xl bg-stone-900">
      {navigationItems.map((item, i) => (
        <div key={i} className="flex gap-5 items-center">
          <span
            onClick={() => handleTapChange(item)}
            role="button"
            tabIndex={i}
            className={`flex-1 shrink self-stretch px-8 py-3 rounded-2xl cursor-pointer select-none ${
              activeSection === item
                ? "bg-gradient-to-r from-[#5C67DE] to-[#7463AF] text-white"
                : ""
            }`}
          >
            {item}
          </span>
          {i < navigationItems.length - 1 && (
            <div className="border-2 border-solid border-neutral-800 h-[40px]" />
          )}
        </div>
      ))}
    </div>
  );
});

function History() {
  const [recentPlayedEpisodes, setRecentPlayedEpisodes] = useState([]);
  const [historyEpisodes, setHistoryEpisodes] = useState([]);

  // Extract IDs and fetch episodes using GET_MultiplePodcastEpisodes
  const episodeIds = recentPlayedEpisodes.map((ep) => ep.episodeId).map(String);

  // Fetch episodes using Apollo Client for History
  useQuery(GET_MultiplePodcastEpisodes, {
    variables: { uuids: episodeIds || [] },
    skip: episodeIds.length === 0, // Skip query if no IDs
    onCompleted: (data) => {
      // Update historyEpisodes state when data is available
      if (data?.getMultiplePodcastEpisodes) {
        setHistoryEpisodes(data.getMultiplePodcastEpisodes);
      }
    },
  });

  // Fetch recent played episodes from local storage
  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("recentPlayedHistories")) || [];
    setRecentPlayedEpisodes(storedHistory);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {historyEpisodes.length > 0 ? (
        historyEpisodes.map((episode) => (
          <EpisodeListItem key={episode.id} episode={episode} />
        ))
      ) : (
        <HistoryEmptyState />
      )}
    </div>
  );
}

function Favorites() {
  const { userId } = useAuth(); // Use Clerk for authentication
  const [favoritesIds, setFavoritesIds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useQuery(GET_MultiplePodcastEpisodes, {
    variables: { uuids: favoritesIds || [] },
    skip: favoritesIds.length === 0, // Skip query if no IDs
    onCompleted: (data) => {
      if (data?.getMultiplePodcastEpisodes) {
        setFavorites(data.getMultiplePodcastEpisodes);
      }
    },
  });

  const fetchUserFavoritesIds = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await db.user.list([Query.equal("clerkId", userId)]);
      const res = response?.documents[0];
      if (res?.favorites) {
        const ids = res.favorites.map(String);
        setFavoritesIds(ids);
      }
    } catch (error) {
      console.error("Error fetching Favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserFavoritesIds();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {loading ? (
        <LoaderSpinner />
      ) : favorites.length > 0 ? (
        favorites.map((episode) => (
          <EpisodeListItem key={episode.uuid} episode={episode} />
        ))
      ) : (
        <p className="text-center">No favorite episodes found.</p>
      )}
    </div>
  );
}

function Subscriptions() {
  const { userId } = useAuth(); // Use Clerk for authentication
  const [subscriptionsIds, setSubscriptionsIds] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useQuery(GET_MultiplePodcastSeries, {
    variables: { uuids: subscriptionsIds || [] },
    skip: subscriptionsIds.length === 0, // Skip query if no IDs
    onCompleted: (data) => {
      if (data?.getMultiplePodcastSeries) {
        setSubscriptions(data.getMultiplePodcastSeries);
      }
    },
  });

  const fetchUserSubscriptionsIds = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await db.user.list([Query.equal("clerkId", userId)]);
      const res = response?.documents[0];
      if (res?.subscriptions) {
        const ids = res.subscriptions.map(String);
        setSubscriptionsIds(ids);
      }
    } catch (error) {
      console.error("Error fetching Subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSubscriptionsIds();
  }, []);

  return (
    <div>
      {loading ? (
        <LoaderSpinner />
      ) : subscriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 mt-10">
          {subscriptions.map(({ uuid, name, imageUrl }) => (
            <PodcastCard key={uuid} id={uuid} title={name} img={imageUrl} />
          ))}
        </div>
      ) : (
        <p className="text-center">No Subscribed Podcasts found.</p>
      )}
    </div>
  );
}

function Playlists({ activeSection }) {
  const { userId, isSignedIn } = useAuth(); // Use Clerk for authentication
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <>
      <div className="flex justify-end font-bold my-5">
        <Link to={`/${activeSection.toLowerCase()}`}>View All</Link>
      </div>
      <div className="flex gap-5 overflow-x-auto whitespace-nowrap scroll-snap-x scroll-snap-mandatory">
        {loading ? (
          <LoaderSpinner />
        ) : playlists.length > 0 ? (
          playlists.map((item, i) => <PlaylistCard item={item} key={i} />)
        ) : (
          <ProfileNoPlaylists />
        )}
      </div>
    </>
  );
}
