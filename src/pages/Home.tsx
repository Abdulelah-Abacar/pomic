import { Link } from "react-router-dom";

import PodcastCard from "../components/PodcastCard";
import ArrowIcon from "../assets/arrow";

import { GET_TopChartsByGenres, GET_TopChartsByCountry } from "../query.js";
import { useQuery } from "@apollo/client";
import { popularGenres } from "../constant";
import LoaderSpinner from "../components/LoaderSpinner.js";

function Home() {
  // Query for recommended podcasts
  const {
    loading: recommendLoading,
    error: recommendError,
    data: recommendData,
  } = useQuery(GET_TopChartsByCountry, {
    variables: {
      taddyType: "PODCASTSERIES",
      country: "UNITED_STATES_OF_AMERICA",
      limitPerPage: 10,
    },
  });

  // Queries for podcasts by genres
  const genreQueries = popularGenres.map((genre) =>
    useQuery(GET_TopChartsByGenres, {
      variables: {
        limitPerPage: 10,
        genres: genre,
      },
    })
  );

  // Check if any of the queries are loading
  const isLoading =
    recommendLoading || genreQueries.some(({ loading }) => loading);

  // Check if there's an error in any query
  const isError = recommendError || genreQueries.some(({ error }) => error);

  // Render PodcastsByGenres component
  const renderPodcastsByGenre = (genreIndex) => {
    const { data, loading } = genreQueries[genreIndex];
    if (loading) return null;
    return data?.getTopChartsByGenres?.podcastSeries?.map(
      ({ uuid, name, imageUrl }, i) => (
        <PodcastCard
          key={i}
          id={`${uuid}`}
          title={name}
          img={imageUrl}
          className="w-52"
        />
      )
    );
  };

  // Show a single loader if loading
  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoaderSpinner />
      </div>
    );
  }

  // Show an error message if any query failed
  if (isError) {
    return (
      <div className="h-screen flex justify-center items-center text-red-500">
        <p>Error loading data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-scroll">
      <div>
        {/* Recommended Podcasts Section */}
        <div className="flex flex-col justify-center">
          <div className="flex justify-between items-center text-2xl font-bold">
            <h1>Recommend</h1>
            <Link to="/discover">
              <ArrowIcon color="#f0f0f0" className="w-4 aspect-square" />
            </Link>
          </div>
          <div className="flex gap-5 pt-5 overflow-x-auto whitespace-nowrap scroll-snap-x scroll-snap-mandatory">
            {recommendData?.getTopChartsByCountry.podcastSeries
              .slice(0, 10)
              .map(({ uuid, name, imageUrl }) => (
                <PodcastCard
                  key={uuid}
                  id={`${uuid}`}
                  title={name}
                  img={imageUrl}
                  className="w-52"
                />
              ))}
          </div>
        </div>

        {/* Podcasts by Genres Section */}
        {popularGenres.map((genre, i) => (
          <div key={i} className="flex flex-col justify-center mt-10">
            <div className="flex justify-between items-center text-2xl font-bold">
              <h1>
                {genre
                  .replace("PODCASTSERIES_", "")
                  .toLowerCase()
                  .replace(/_/g, " ")}
              </h1>
              <Link
                to={`/discover?genre=${genre
                  .replace("PODCASTSERIES_", "")
                  .toLowerCase()
                  .replace(/_/g, " ")}`}
              >
                <ArrowIcon color="#f0f0f0" className="w-4 aspect-square" />
              </Link>
            </div>
            <div className="flex gap-5 pt-5 overflow-x-auto whitespace-nowrap scroll-snap-x scroll-snap-mandatory">
              {renderPodcastsByGenre(i)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
