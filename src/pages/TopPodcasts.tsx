import InfiniteScroll from "react-infinite-scroll-component";
import PodcastCard from "../components/PodcastCard";
import LoaderSpinner from "../components/LoaderSpinner";
import Dropdown from "../components/Dropdown";
import { countriesName } from "../constant";
import { useEffect, useState } from "react";
import { GET_TopChartsByCountry } from "../query";
import { useQuery } from "@apollo/client";
import { useSearchParams } from "react-router-dom";

function TopPodcasts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [podcasts, setPodcasts] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const country = searchParams.get("country") || "UNITED_STATES_OF_AMERICA";
  const PODCASTS_PER_PAGE = 25;

  const { loading, error, fetchMore, refetch } = useQuery(
    GET_TopChartsByCountry,
    {
      variables: {
        taddyType: "PODCASTSERIES",
        country: country.toUpperCase().replace(/ /g, "_"),
        limitPerPage: PODCASTS_PER_PAGE,
        page: 1,
      },
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      onCompleted: (initialData) => {
        const initialPodcasts =
          initialData?.getTopChartsByCountry?.podcastSeries || [];
        setPodcasts(initialPodcasts);
        setHasMore(initialPodcasts.length === PODCASTS_PER_PAGE);
      },
    }
  );

  const loadMoreItems = async () => {
    if (isLoadingMore || loading || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const { data: newData } = await fetchMore({
        variables: {
          page: page + 1,
        },
      });

      const newPodcasts = newData?.getTopChartsByCountry?.podcastSeries || [];
      setPodcasts((prev) => [...prev, ...newPodcasts]);
      setPage((prev) => prev + 1);
      setHasMore(newPodcasts.length === PODCASTS_PER_PAGE);
    } catch (err) {
      console.error("Error fetching more data:", err);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setPodcasts([]);
    setHasMore(true);
    refetch();
  }, [searchParams, refetch]);

  const updateSearchParams = (paramName, value) => {
    if (value) {
      searchParams.set(paramName, value);
    } else {
      searchParams.delete(paramName);
    }
    setSearchParams(searchParams);
  };

  if (error) {
    return (
      <div className="text-center">
        <p>Failed to load top podcasts. Please try again later.</p>
        <button onClick={() => refetch()} className="text-blue-500 underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center gap-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Top Podcasts in {country.replace(/_/g, " ")}
        </h1>
        <Dropdown
          options={countriesName}
          placeholder={"Select Country..."}
          selectedVal={country}
          handleChange={(val) => updateSearchParams("country", val)}
        />
      </div>
      <div id="topPodcastsList" className="overflow-y-auto max-h-[90vh]">
        {loading && podcasts.length === 0 && <LoaderSpinner centered />}
        {!loading && podcasts.length === 0 && (
          <p className="text-center font-light p-5">
            No podcasts found for the selected country.
          </p>
        )}
        <InfiniteScroll
          className="!overflow-visible"
          dataLength={podcasts.length}
          next={loadMoreItems}
          hasMore={hasMore}
          loader={<LoaderSpinner />}
          scrollableTarget="topPodcastsList"
          endMessage={
            <p className="text-center font-light p-5">
              No more podcasts to load.
            </p>
          }
        >
          <div className="grid gap-5 lg:grid-cols-3 2xl:grid-cols-4">
            {podcasts.map(({ uuid, name, imageUrl }) => (
              <PodcastCard key={uuid} id={uuid} title={name} img={imageUrl} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default TopPodcasts;
