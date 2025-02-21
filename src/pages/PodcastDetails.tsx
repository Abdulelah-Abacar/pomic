import { useParams } from "react-router-dom";
import EpisodeListItem from "../components/EpisodeListItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQuery } from "@apollo/client";
import { GET_PODCASTSERIES } from "../query.js";
import LoaderSpinner from "../components/LoaderSpinner.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import SearchIcon from "../assets/Search";
import { Input } from "../components/input.js";
import Dropdown from "../components/Dropdown.js";
import { useDebounce } from "../utils/useDebounce.js";
import ImagePlaceholder from "../components/ImagePlaceholder.js";
import FilterIcon from "../assets/filter.js";
import db from "../appwrite/database.js";
import { Query } from "appwrite";
import { useAuth } from "@clerk/clerk-react";
import { cn } from "../utils/utils.js";

function PodcastDetails() {
  const { id } = useParams();
  const { userId } = useAuth();

  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [order, setOrder] = useState("LATEST");
  const [search, setSearch] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const debouncedValue = useDebounce(search, 500);
  const limit = 10;

  const { loading, error, data, fetchMore, refetch } = useQuery(
    GET_PODCASTSERIES,
    {
      variables: { uuid: id, limitPerPage: limit },
    }
  );

  const fetchMoreEpisodes = async () => {
    if (isFetchingMore) return;
    setIsFetchingMore(true);
    try {
      await fetchMore({
        variables: {
          page: page + 1,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;
          return {
            getPodcastSeries: {
              ...prevResult.getPodcastSeries,
              episodes: [
                ...prevResult.getPodcastSeries.episodes,
                ...fetchMoreResult.getPodcastSeries.episodes,
              ],
            },
          };
        },
      });
      setPage((prevPage) => prevPage + 1);
    } finally {
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    if (debouncedValue) {
      refetch({ sortOrder: "SEARCH", searchTerm: debouncedValue });
    } else {
      refetch({ sortOrder: order });
    }
  }, [order, refetch, debouncedValue]);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!userId) return;

      try {
        const userDocument = await db.user.list([
          Query.equal("clerkId", userId),
        ]);
        const user = userDocument?.documents[0];
        setSubscribed(user?.subscriptions?.includes(id) || false);
      } catch (error) {
        console.error("Error checking subscription status:", error);
        setSubscribed(false);
      }
    };

    checkSubscription();
  }, [id, userId]);

  const podcast = useMemo(() => data?.getPodcastSeries, [data]);

  const renderEpisode = useCallback(
    (episode, index) => (
      <EpisodeListItem key={`${episode.uuid}-${index}`} episode={episode} />
    ),
    []
  );

  const addToSubscriptions = async () => {
    if (!userId) {
      alert("You need to log in to subscribe.");
      return;
    }

    try {
      const userDocument = await db.user.list([Query.equal("clerkId", userId)]);
      const user = userDocument?.documents[0];

      if (user.subscriptions && user.subscriptions.includes(id)) {
        const updatedSubscriptions = user.subscriptions.filter(
          (po) => po !== id
        );

        await db.user.update(user.$id, {
          subscriptions: updatedSubscriptions,
        });
        alert("Unsubscribed successfully!");
        setSubscribed(false);
        return;
      }

      const updatedSubscriptions = user.subscriptions
        ? [id, ...user.subscriptions]
        : [id];

      await db.user.update(user.$id, {
        subscriptions: updatedSubscriptions,
      });

      alert("Subscribed successfully!");
      setSubscribed(true);
    } catch (error) {
      console.error("Error adding to subscriptions:", error);
      alert("Failed to subscribe.");
      setSubscribed(false);
    }
  };

  if (loading && !data) return <LoaderSpinner />;
  if (error) return <p>Error fetching podcast data: {error.message}</p>;

  return (
    <div className="flex flex-col gap-5 max-h-screen overflow-y-auto pb-14">
      <div className="flex flex-col gap-3 relative items-start justify-end p-5 aspect-[1/0.4] xl:aspect-[1/0.3] rounded-3xl">
        {podcast.imageUrl ? (
          <img
            loading="lazy"
            srcSet={podcast.imageUrl}
            alt={podcast.name}
            className="object-fill absolute inset-0 size-full rounded-2xl filter brightness-50"
          />
        ) : (
          <ImagePlaceholder
            title={podcast.name[0]}
            className="object-fill absolute inset-0 size-full rounded-2xl"
          />
        )}
        <div className="z-10">
          <h1 className="text-2xl font-semibold mb-3">{podcast?.name}</h1>
          <button
            className={cn(
              "outline-none border-none bg-indigo-500 py-3 px-14 font-bold rounded-xl",
              {
                "bg-gray-600": subscribed,
              }
            )}
            type="button"
            onClick={addToSubscriptions}
          >
            {subscribed ? "Unsubscribe" : "Subscribe"}
          </button>
        </div>
      </div>

      <div>
        <h2 className="font-bold text-xl mb-5">Genres:</h2>
        <div className="flex flex-wrap gap-2 mb-5">
          {podcast.genres.map((genre, i) => (
            <span
              key={i}
              className="inline-block border border-white text-sm font-medium px-3 py-1 rounded-full"
            >
              {genre.replace("PODCASTSERIES_", "")}
            </span>
          ))}
        </div>
        <h2 className="font-bold text-xl">Description:</h2>
        <p className="font-light text-lg mt-3">{podcast?.description}</p>
      </div>

      <div className="flex justify-between items-center mt-4 sticky top-0 z-10 p-2 backdrop-blur-lg">
        <strong className="text-xl">
          {podcast?.totalEpisodesCount || 0} Episodes
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
        {order === "LATEST" ? (
          <FilterIcon
            className="w-7 aspect-square"
            color="#f0f0f0"
            onClick={() => setOrder("OLDEST")}
          />
        ) : (
          <FilterIcon
            className="w-7 aspect-square rotate-180"
            color="#f0f0f0"
            onClick={() => setOrder("LATEST")}
          />
        )}
      </div>

      <div
        id="episodesList"
        className="overflow-y-auto min-h-[calc(100vh-8rem)]"
      >
        <InfiniteScroll
          dataLength={podcast?.episodes?.length || 0}
          next={fetchMoreEpisodes}
          hasMore={podcast?.episodes?.length < podcast?.totalEpisodesCount}
          loader={<LoaderSpinner />}
          scrollableTarget="episodesList"
          endMessage={
            <p className="text-center font-light mt-5">No more episodes</p>
          }
          className="flex flex-col gap-3"
        >
          {podcast?.episodes?.map(renderEpisode)}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default PodcastDetails;
