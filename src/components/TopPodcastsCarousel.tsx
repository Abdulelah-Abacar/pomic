import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import ArrowIcon from "../assets/arrow";
import LoaderSpinner from "../components/LoaderSpinner";
import { GET_TopChartsByCountry } from "../query";

function TopPodcastsCarousel() {
  const [active, setActive] = useState(1);

  // Fetch top podcasts data
  const { loading, error, data } = useQuery(GET_TopChartsByCountry, {
    variables: {
      taddyType: "PODCASTSERIES",
      country: "UNITED_STATES_OF_AMERICA", // Change dynamically if needed
      page: 1,
    },
  });

  const carouselItems =
    data?.getTopChartsByCountry?.podcastSeries.slice(0, 4) || [];

  // Handle slide change
  const nextSlide = () => {
    setActive((prev) => (prev === carouselItems?.length ? 1 : prev + 1));
  };

  // Change the slide every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 10000);

    return () => clearInterval(interval);
  }, [data]);

  if (loading) {
    return <LoaderSpinner />;
  }

  if (error) {
    console.error("Error fetching top podcasts:", error);
    return <p>Failed to load top podcasts.</p>;
  }

  return (
    <div className="flex flex-col gap-4 text-lg font-bold">
      <div className="flex justify-between items-center">
        <p>Top Podcasts</p>
        <Link to="/top-podcasts">
          <ArrowIcon
            color="#f0f0f0"
            className="w-4 aspect-square hover:scale-110 duration-300"
          />
        </Link>
      </div>

      {/* Carousel content */}
      <div className="grid grid-cols-1 grid-rows-1 justify-center rounded-2xl text-xl capitalize">
        {/* Image */}
        <img
          loading="lazy"
          srcSet={carouselItems[active - 1]?.imageUrl}
          className="object-contain w-full aspect-square rounded-2xl"
          alt={carouselItems[active - 1]?.name}
        />

        {/* Title overlay */}
        <div className="flex items-center px-10 bg-[#121212]/65 backdrop-blur-md -mt-24 h-24 rounded-b-2xl">
          <Link to={`/podcasts/${carouselItems[active - 1]?.uuid}`}>
            {carouselItems[active - 1]?.name}
          </Link>
        </div>
      </div>

      {/* Dots for navigation */}
      <ul className="list-none flex gap-2 justify-center items-center">
        {carouselItems.map((_, i) => (
          <li
            key={i}
            onClick={() => setActive(i + 1)}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer bg-zinc-100 ${
              active !== i + 1 && "bg-zinc-100/40"
            }`}
          />
        ))}
      </ul>
    </div>
  );
}

export default TopPodcastsCarousel;
