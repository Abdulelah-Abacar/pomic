import HeadphoneIcon from "../assets/headphone";
import ClockIcon from "../assets/clock";
import PlayIcon from "../assets/play";
import PauseIcon from "../assets/Played";
import { Link } from "react-router-dom";
import { convertSecondsToDate, formatTime } from "../utils/utils.js";
import { useAudio } from "../providers/AudioProvider.js";
import ImagePlaceholder from "./ImagePlaceholder.js";
import Dots from "./Dots";

function EpisodeListItem({ episode }) {
  const { audio, setAudio, isPlaying, togglePlayPause } = useAudio();

  const handlePlayPause = () => {
    if (audio?.episodeId === episode.uuid) {
      togglePlayPause();
    } else {
      setAudio({
        title: episode.name,
        audioUrl: episode.audioUrl,
        imageUrl: episode.imageUrl,
        author: episode.podcastSeries.authorName,
        episodeId: episode.uuid,
      });
    }
  };

  return (
    <div className="grid grid-cols-[60px_1fr_35px] sm:grid-cols-[auto_1fr_35px] gap-2 items-center p-2 hover:shadow-md duration-300 hover:scale-[0.99] select-none">
      <div className="flex items-center gap-2">
        <div onClick={handlePlayPause} className="hidden sm:block">
          {isPlaying && audio?.episodeId === episode.uuid ? (
            <div className="cursor-pointer flex justify-center items-center bg-indigo-500 w-10 aspect-square rounded-full">
              <PauseIcon
                className="w-6 aspect-square -mr-0.5"
                color="#f0f0f0"
              />
            </div>
          ) : (
            <PlayIcon
              className="w-6 aspect-square cursor-pointer"
              color="#f0f0f0"
            />
          )}
        </div>
        <div className="flex gap-3 items-center text-lg font-bold max-w-96 overflow-hidden">
          {episode.imageUrl ? (
            <img
              loading="lazy"
              srcSet={episode.imageUrl}
              className="object-contain rounded w-14 aspect-square"
              alt={episode.name}
            />
          ) : (
            <ImagePlaceholder
              className={"py-4 w-16 min-w-14 max-w-20 rounded-lg"}
              title={episode.name?.charAt(0)}
            />
          )}
        </div>
      </div>
      <div className="grid lg:grid-cols-[50%_45%] xl:grid-cols-[70%_20%] text-lg font-bold">
        <Link
          to={`/episodes/${episode.uuid}`}
          className="lg:max-w-[90%] truncate"
        >
          {episode.name}
        </Link>
        <div className="flex gap-3 justify-start lg:justify-center items-center text-sm lg:text-lg mt-2 lg:pl-8 lg:mt-0 opacity-70 lg:opacity-100">
          <div className="flex gap-2 justify-center items-center">
            <HeadphoneIcon className="w-6 aspect-square" color="#f0f0f0" />
            <p>{convertSecondsToDate(episode.datePublished)}</p>
          </div>
          <div className="flex gap-2 justify-center items-center">
            <ClockIcon className="w-6 aspect-square" color="#f0f0f0" />
            <p>{formatTime(episode.duration)}</p>
          </div>
        </div>
      </div>
      <div className="ml-auto">
        <Dots episode={episode} />
      </div>
    </div>
  );
}

export default EpisodeListItem;
