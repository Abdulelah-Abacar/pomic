import EpisodeListItem from "../components/EpisodeListItem";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_TopChartsByCountry } from "../query.js";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useEffect } from "react";
import LoaderSpinner from "../components/LoaderSpinner.js";
import Dropdown from "../components/Dropdown.js";
import { countriesName } from "../constant/index.js";

function TopEpisodes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Track loading for fetchMore
  const [hasMore, setHasMore] = useState(true); // Assume more data initially

  const country = searchParams.get("country") || "UNITED_STATES_OF_AMERICA";

  const { loading, error, fetchMore, refetch } = useQuery(
    GET_TopChartsByCountry,
    {
      variables: {
        taddyType: "PODCASTEPISODE",
        country: country.toUpperCase().replace(/ /g, "_"),
        limitPerPage: 25,
        page: 1, // Always start with page 1
      },
      fetchPolicy: "cache-and-network", // Prefer cached data, but update with the network
      nextFetchPolicy: "cache-first", // For subsequent fetches
      onCompleted: (initialData) => {
        const initialEpisodes =
          initialData?.getTopChartsByCountry?.podcastEpisodes || [];
        setEpisodes(initialEpisodes);
        setHasMore(initialEpisodes.length === 25); // Assume more data if limit is met
      },
    }
  );

  // Load more episodes
  const loadMoreItems = async () => {
    if (isLoadingMore || loading || !hasMore) return; // Prevent duplicate calls

    setIsLoadingMore(true); // Set loading state for fetchMore
    try {
      const { data: newData } = await fetchMore({
        variables: {
          page: page + 1, // Increment the page
        },
      });

      const newEpisodes = newData?.getTopChartsByCountry?.podcastEpisodes || [];
      setEpisodes((prev) => [...prev, ...newEpisodes]); // Append new episodes
      setPage((prev) => prev + 1); // Increment page on successful fetch
      setHasMore(newEpisodes.length === 25); // If fewer than limit, no more data
    } catch (err) {
      console.error("Error fetching more data:", err);
      setHasMore(false); // Stop further fetches on error
    } finally {
      setIsLoadingMore(false); // Reset loading state
    }
  };

  // Refetch when search params (country) change
  useEffect(() => {
    setPage(1); // Reset to page 1 for new search
    setEpisodes([]); // Clear current episodes
    setHasMore(true); // Assume more data initially
    refetch(); // Refetch data for the new search
  }, [searchParams, refetch]);

  // Update search params when dropdown value changes
  const updateSearchParams = (paramName, value) => {
    if (value) {
      searchParams.set(paramName, value);
    } else {
      searchParams.delete(paramName);
    }
    setSearchParams(searchParams);
  };

  if (error) {
    console.error("Error fetching top episodes:", error);
    return <p>Failed to load top episodes.</p>;
  }

  return (
    <div className="p-4">
      {/* Filters */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Top Episodes in {country.replace(/_/g, " ")}
        </h1>
        <Dropdown
          options={countriesName}
          placeholder="Select Country..."
          selectedVal={country}
          handleChange={(val) => updateSearchParams("country", val)}
        />
      </div>

      {/* Infinite Scroll Implementation */}
      <div className="mt-6">
        {episodes.length === 0 && !loading ? (
          <p className="text-center font-light">No episodes available.</p>
        ) : (
          <div id="episodesList" className="overflow-y-auto max-h-[80vh]">
            <InfiniteScroll
              className="!overflow-visible"
              dataLength={episodes.length}
              next={loadMoreItems}
              hasMore={hasMore}
              loader={<LoaderSpinner />}
              scrollableTarget="episodesList"
              endMessage={
                <p className="text-center">No more episodes to load.</p>
              }
            >
              <div className="flex flex-col gap-3">
                {episodes.map((episode, i) => (
                  <EpisodeListItem
                    key={`${episode.uuid}-${i}`}
                    episode={episode}
                  />
                ))}
              </div>
            </InfiniteScroll>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopEpisodes;
