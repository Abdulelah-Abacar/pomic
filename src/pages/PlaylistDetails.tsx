import { useEffect, useState, useCallback, useMemo } from "react";
import db from "../appwrite/database";
import { useNavigate, useParams } from "react-router-dom";
import EpisodeListItem from "../components/EpisodeListItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQuery } from "@apollo/client";
import { GET_MultiplePodcastEpisodes } from "../query.js";
import LoaderSpinner from "../components/LoaderSpinner.js";
import SearchIcon from "../assets/Search";
import { Input } from "../components/input.js";
import { useDebounce } from "../utils/useDebounce.js";
import ImagePlaceholder from "../components/ImagePlaceholder.js";
import { useAuth } from "@clerk/clerk-react";

function PlaylistDetails() {
  const { userId } = useAuth(); // Use user from Clerk to access the logged-in user's details
  const { id } = useParams();

  const navigate = useNavigate();

  // States
  const [playlist, setPlaylist] = useState(null);
  const [episodeIds, setEpisodeIds] = useState([]);
  const [chunkedEpisodeIds, setChunkedEpisodeIds] = useState([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [allEpisodes, setAllEpisodes] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingPlaylist, setLoadingPlaylist] = useState(true);

  const debouncedSearch = useDebounce(search, 300);
  const MAX_CHUNK_SIZE = 25;

  const {
    loading: loadingEpisodes,
    error: episodesError,
    data: episodesData,
    fetchMore,
  } = useQuery(GET_MultiplePodcastEpisodes, {
    variables: {
      uuids: chunkedEpisodeIds[currentChunkIndex] || [],
      search: debouncedSearch,
    },
    skip: chunkedEpisodeIds.length === 0,
    onCompleted: (data) => {
      if (data?.getMultiplePodcastEpisodes) {
        setAllEpisodes((prevEpisodes) => [
          ...prevEpisodes,
          ...data.getMultiplePodcastEpisodes,
        ]);
      }
    },
  });

  // Function to fetch playlist details
  const fetchPlaylist = useCallback(async () => {
    try {
      const response = await db.playlist.get(id);

      if (response && response.episodesId) {
        const ids = response.episodesId.map(String); // Convert to strings
        setEpisodeIds(ids);

        const chunks = [];
        for (let i = 0; i < ids.length; i += MAX_CHUNK_SIZE) {
          chunks.push(ids.slice(i, i + MAX_CHUNK_SIZE));
        }
        setChunkedEpisodeIds(chunks);
      }

      setPlaylist(response);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    } finally {
      setLoadingPlaylist(false);
    }
  }, [id]);

  useEffect(() => {
    if (!userId) {
      navigate("/404");
    }
  }, [userId]);

  useEffect(() => {
    fetchPlaylist();
  }, [fetchPlaylist]);

  // Function to fetch more episodes
  const fetchMoreEpisodes = useCallback(() => {
    if (currentChunkIndex < chunkedEpisodeIds.length - 1) {
      setCurrentChunkIndex((prev) => prev + 1);
    }
  }, [currentChunkIndex, chunkedEpisodeIds.length]);

  if (loadingPlaylist) return <LoaderSpinner />;
  if (!playlist)
    return <p className="text-center text-lg">Playlist not found.</p>;

  return (
    <div className="flex flex-col gap-5 max-h-screen overflow-y-auto pb-14">
      {/* Playlist Header */}
      <div className="flex flex-col gap-3 relative items-start justify-end p-5 aspect-[1/0.4] xl:aspect-[1/0.3] rounded-3xl">
        {playlist.imageUrl ? (
          <img
            loading="lazy"
            srcSet={playlist.imageUrl}
            alt={playlist.title}
            className="object-fill absolute inset-0 size-full rounded-2xl filter brightness-50"
          />
        ) : (
          <ImagePlaceholder
            title={playlist.title[0]}
            className="object-fill absolute inset-0 size-full rounded-2xl"
          />
        )}
        <div className="z-10">
          <h1 className="text-2xl font-semibold mb-3">{playlist?.title}</h1>
        </div>
      </div>

      {/* Playlist Description */}
      <div>
        <h2 className="font-bold text-xl">Description:</h2>
        <p className="font-light text-lg mt-3">{playlist.description}</p>
      </div>

      {/* Search Input */}
      <div className="flex justify-between items-center mt-4 sticky top-0 z-10 p-2 bg-zinc-900">
        <strong className="text-xl">
          {playlist.episodesTotalNum} Episodes
        </strong>
        <div className="relative">
          <Input
            className="w-full rounded-none border-b border-b-slate-400 border-solid outline-none px-3 pb-5 bg-transparent placeholder:font-thin placeholder:text-lg text-xl font-semibold pl-12"
            placeholder="Search episodes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchIcon
            color="#f0f0f0"
            className="absolute left-4 top-1 w-5 h-5 cursor-pointer opacity-80 hover:opacity-100 hover:scale-110 duration-300"
          />
        </div>
      </div>

      {/* Episodes List */}
      <div
        id="episodesList"
        className="overflow-y-auto min-h-[calc(100vh-8rem)]"
      >
        {loadingEpisodes && allEpisodes.length === 0 ? (
          <LoaderSpinner />
        ) : episodesError ? (
          <p className="text-center text-red-500">Error loading episodes.</p>
        ) : (
          <InfiniteScroll
            dataLength={allEpisodes.length}
            next={fetchMoreEpisodes}
            hasMore={currentChunkIndex < chunkedEpisodeIds.length - 1}
            loader={<LoaderSpinner />}
            scrollableTarget="episodesList"
            endMessage={
              <p className="text-center font-light mt-5">No more episodes</p>
            }
            className="flex flex-col gap-3"
          >
            {allEpisodes.map((episode, i) => (
              <EpisodeListItem key={`${episode.uuid}-${i}`} episode={episode} />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}

export default PlaylistDetails;
