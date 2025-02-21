import { Link } from "react-router-dom";
import ArrowIcon from "../assets/arrow";
import PlayIcon from "../assets/play";
import PauseIcon from "../assets/Played";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { useAudio } from "../providers/AudioProvider";
import LoaderSpinner from "../components/LoaderSpinner";
import { GET_TopChartsByCountry } from "../query";

function TopEpisodesCarousel() {
  const [active, setActive] = useState(1);
  const intervalRef = useRef(null);
  const { isPlaying, togglePlayPause, setAudio, audio } = useAudio();

  const { loading, error, data } = useQuery(GET_TopChartsByCountry, {
    variables: {
      taddyType: "PODCASTEPISODE",
      country: "UNITED_STATES_OF_AMERICA", // Change dynamically if needed
      limitPerPage: 4,
      page: 1,
    },
  });

  const episodes =
    data?.getTopChartsByCountry?.podcastEpisodes.slice(0, 4) || [];

  const handlePlayPause = () => {
    if (audio?.episodeId === episodes[active].uuid) {
      togglePlayPause();
    } else {
      setAudio({
        title: episodes[active].name,
        audioUrl: episodes[active].audioUrl,
        imageUrl: episodes[active].imageUrl,
        author: episodes[active].podcastSeries.authorName,
        episodeId: episodes[active].uuid,
      });
    }
  };

  // Function to move to the next slide
  const nextSlide = () => {
    setActive((prev) => (prev === episodes.length ? 1 : prev + 1));
  };

  // Start and stop interval for autoplay
  const startTimer = () => {
    intervalRef.current = setInterval(nextSlide, 10000); // 10 seconds
  };
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer(); // Cleanup on unmount
  }, [episodes]);

  if (loading) {
    return <LoaderSpinner />;
  }

  if (error) {
    console.error("Error fetching top episodes:", error);
    return <p>Failed to load top episodes.</p>;
  }

  return (
    <div
      className="flex flex-col gap-4 p-3 rounded-2xl bg-stone-900/30 backdrop-blur-sm"
      onMouseEnter={stopTimer} // Stop the timer on hover
      onMouseLeave={startTimer} // Restart the timer when hover ends
    >
      <div className="flex justify-between items-center text-lg font-bold">
        <p>Top Episodes</p>
        <Link to="/top-episodes">
          <ArrowIcon
            color="#f0f0f0"
            className="w-4 aspect-square hover:scale-110 duration-300"
          />
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex relative flex-col rounded-2xl aspect-video">
          <img
            loading="lazy"
            srcSet={episodes[active - 1]?.imageUrl}
            alt={episodes[active - 1]?.name}
            className="object-cover absolute inset-0 size-full rounded-2xl"
          />
          <div className="flex items-end aspect-video rounded-2xl bg-stone-900/50 backdrop-blur-[2px]">
            <div className="flex gap-2 items-center p-2">
              <div
                onClick={handlePlayPause}
                className="flex justify-center items-center bg-indigo-500 h-8 rounded-full min-w-8 hover:-translate-y-1 duration-300 cursor-pointer"
              >
                {!isPlaying ? (
                  <PauseIcon color="#f0f0f0" className="w-4 h-4" />
                ) : (
                  <PlayIcon color="#f0f0f0" className="w-4 h-4" />
                )}
              </div>
              <Link
                to={`/episodes/${episodes[active - 1]?.uuid}`}
                className="text-base font-medium tracking-wide line-clamp-2"
              >
                {episodes[active - 1]?.name}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dots for navigation */}
      <ul className="list-none flex gap-2 justify-center items-center">
        {episodes.map((_, i) => (
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

export default TopEpisodesCarousel;
