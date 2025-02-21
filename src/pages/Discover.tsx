import PodcastCard from "../components/PodcastCard";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { SEARCH_FOR_TERM_QUERY, GET_TopChartsByCountry } from "../query.js";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useEffect, useRef } from "react";
import LoaderSpinner from "../components/LoaderSpinner.js";
import Searchbar from "../components/Searchbar.js";
import SearchNoResult from "../components/SearchNoResult.js";
import Dropdown from "../components/Dropdown.js";
import { countriesName, genresName, languagesName } from "../constant/index.js";

function Discover() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [podcasts, setPodcasts] = useState([]);

  const containerRef = useRef(null);

  const genre = searchParams.get("genre");
  const country = searchParams.get("country");
  const language = searchParams.get("language");
  const term = searchParams.get("term");

  const useTopChartsQuery = !genre && !language && !term;

  const topChartsVariables = {
    taddyType: "PODCASTSERIES",
    country: country
      ? country.toUpperCase().replace(/ /g, "_")
      : "UNITED_STATES_OF_AMERICA",
    limitPerPage: 10,
    page: 1,
  };

  const searchVariables = {
    filterForGenres: genre
      ? `PODCASTSERIES_${genre.toUpperCase().replace(/ /g, "_")}`
      : null,
    filterForCountries: country
      ? country.toUpperCase().replace(/ /g, "_")
      : null,
    filterForLanguages: language
      ? language.toUpperCase().replace(/ /g, "_")
      : null,
    term: term || null,
    limitPerPage: 10,
    page: 1,
  };

  const { loading, error, data, fetchMore, refetch } = useQuery(
    useTopChartsQuery ? GET_TopChartsByCountry : SEARCH_FOR_TERM_QUERY,
    {
      variables: useTopChartsQuery ? topChartsVariables : searchVariables,
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      onCompleted: (initialData) => {
        const fetchedPodcasts = useTopChartsQuery
          ? initialData.getTopChartsByCountry?.podcastSeries
          : initialData.searchForTerm?.podcastSeries;

        setPodcasts(fetchedPodcasts || []);
        setHasMore(fetchedPodcasts?.length === 10);
      },
    }
  );

  const loadMoreItems = async () => {
    if (loading || !hasMore) return;
    try {
      const { data: newData } = await fetchMore({
        variables: {
          ...(useTopChartsQuery ? topChartsVariables : searchVariables),
          page: page + 1,
        },
      });

      const newItems = useTopChartsQuery
        ? newData.getTopChartsByCountry?.podcastSeries
        : newData.searchForTerm?.podcastSeries;

      setPodcasts((prev) => [...prev, ...newItems]);
      setPage((prev) => prev + 1);
      setHasMore(newItems.length === 10);
    } catch (error) {
      console.error("Error fetching more data:", error);
      setHasMore(false);
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

  // Auto-fetch more if the screen is not filled
  useEffect(() => {
    const checkIfScreenFilled = () => {
      const container = containerRef.current;
      if (container && container.scrollHeight <= container.clientHeight) {
        loadMoreItems();
      }
    };

    if (!loading) {
      checkIfScreenFilled();
    }
  }, [podcasts, loading]);

  if (error) console.error("Error fetching data:", error);

  return (
    <div>
      <div className="flex justify-between items-center gap-3">
        <Searchbar />
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-3">
          <Dropdown
            options={genresName}
            placeholder="Select Genre..."
            selectedVal={genre}
            handleChange={(val) => updateSearchParams("genre", val)}
          />
          <Dropdown
            options={countriesName}
            placeholder="Select Country..."
            selectedVal={country}
            handleChange={(val) => updateSearchParams("country", val)}
          />
          <Dropdown
            options={languagesName}
            placeholder="Select Language..."
            selectedVal={language}
            handleChange={(val) => updateSearchParams("language", val)}
          />
        </div>
      </div>

      <div
        ref={containerRef}
        id="podcastsList"
        className="overflow-y-auto max-h-[80vh] mt-10"
      >
        {podcasts.length === 0 && !loading ? (
          <SearchNoResult />
        ) : (
          <InfiniteScroll
            className="!overflow-visible"
            dataLength={podcasts.length}
            next={loadMoreItems}
            hasMore={hasMore}
            loader={<LoaderSpinner />}
            scrollableTarget="podcastsList"
            endMessage={<p className="text-center">No more items to load.</p>}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
              {podcasts.map(({ uuid, name, imageUrl }) => (
                <PodcastCard key={uuid} id={uuid} title={name} img={imageUrl} />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}

export default Discover;
