import PlayIcon from "../assets/play";
import PauseIcon from "../assets/Played";
import BackwardIcon from "../assets/backward";
import ForwardIcon from "../assets/forward";
import ArrowIcon from "../assets/arrow";
import { formatTime } from "../utils/utils";
import { useAudio } from "../providers/AudioProvider";
import { Progress } from "./ProgressNew";
import { Link } from "react-router-dom";
import Dots from "./Dots";
import ImagePlaceholder from "./ImagePlaceholder";

function EpisodeDetailsPlayer({ episode }) {
  const {
    audio,
    setAudio,
    isPlaying,
    togglePlayPause,
    forward,
    rewind,
    currentTime,
    duration,
  } = useAudio();

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
    <div className="lg:flex justify-between items-stretch rounded-2xl bg-stone-900 overflow-hidden">
      <div className="lg:w-1/2 flex relative items-end justify-end p-2 aspect-square">
        {episode.imageUrl ? (
          <img
            loading="lazy"
            srcSet={episode.imageUrl}
            alt={episode.name}
            className="object-cover absolute inset-0 size-full"
          />
        ) : (
          <ImagePlaceholder
            title={episode.name[0]}
            className="object-cover absolute inset-0 size-full"
          />
        )}
        <div className="flex items-end justify-between w-full font-bold">
          <Link
            to={`/podcasts/${episode.podcastSeries.uuid}`}
            className="px-4 py-2.5 text-lg tracking-wide rounded-full bg-stone-900/70 backdrop-blur-sm"
          >
            {episode.podcastSeries.name}
          </Link>
          {episode.episodeNumber && (
            <p className="px-5 py-2.5 text-2xl tracking-wider bg-stone-900/70 rounded-full backdrop-blur-sm">
              {episode.episodeNumber}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:justify-between lg:aspect-square p-5 pl-3 lg:w-1/2">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-3xl font-bold tracking-tighter">
            Ep {episode.episodeNumber}: {episode.name}
          </h2>
          <Dots episode={episode} />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col justify-center gap-10">
            <div className="flex gap-5 justify-between items-center">
              <div className="flex gap-5 items-center">
                <BackwardIcon
                  className="w-6 aspect-square cursor-pointer"
                  color="#f0f0f0"
                  onClick={
                    isPlaying && audio?.episodeId === episode.uuid
                      ? rewind
                      : () => {}
                  }
                />
                <div
                  className="flex items-center justify-center my-auto w-12 h-12 rounded-full bg-zinc-100 cursor-pointer"
                  onClick={handlePlayPause}
                >
                  {isPlaying && audio?.episodeId === episode.uuid ? (
                    <PauseIcon
                      className="w-6 aspect-square -mr-0.5"
                      color="#121212"
                    />
                  ) : (
                    <PlayIcon
                      className="w-6 aspect-square -mr-0.5"
                      color="#121212"
                    />
                  )}
                </div>
                <ForwardIcon
                  className="w-6 aspect-square cursor-pointer"
                  color="#f0f0f0"
                  onClick={
                    isPlaying && audio?.episodeId === episode.uuid
                      ? forward
                      : () => {}
                  }
                />
              </div>
              <div className="flex gap-2 justify-center items-center text-sm">
                <p>Listen in</p>
                <ArrowIcon
                  color="#f0f0f0"
                  className="w-3 aspect-square rotate-90"
                />
              </div>
            </div>

            <div className="flex flex-col">
              {isPlaying && audio?.episodeId === episode.uuid ? (
                <time className="text-base opacity-70">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </time>
              ) : (
                <time className="text-base opacity-70">
                  {formatTime(0)} / {formatTime(episode?.duration)}
                </time>
              )}
              <div className="flex flex-col mt-2 w-full rounded-xl">
                {isPlaying && audio?.episodeId === episode.uuid ? (
                  <Progress
                    value={(currentTime / duration) * 100}
                    max={duration}
                  />
                ) : (
                  <Progress
                    value={(0 / episode?.duration) * 100}
                    max={episode?.duration}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EpisodeDetailsPlayer;
