import React, { memo } from "react";
import { useAudio } from "../providers/AudioProvider";
import ShuffleIcon from "../assets/shuffle";
import StepForwardIcon from "../assets/StepForward";
import StepBackwardIcon from "../assets/StepBackward";
import PlayIcon from "../assets/play";
import PauseIcon from "../assets/Played";
import { Link } from "react-router-dom";
import { Progress } from "./ProgressNew";
import VolumeIcon from "../assets/volume";
import MuteIcon from "../assets/mute";
import RepeatIcon from "../assets/Repeate";
import { formatTime } from "../utils/utils";
import { cn } from "../utils/utils";
import ImagePlaceholder from "./ImagePlaceholder";

const PlayBar = () => {
  const {
    audio,
    togglePlayPause,
    toggleMute,
    forward,
    rewind,
    currentTime,
    isMuted,
    duration,
    isPlaying,
    setAudio, // Assuming this function is available to update audio state
  } = useAudio();

  // Handlers to avoid inline functions
  const handleTogglePlayPause = () => togglePlayPause();
  const handleToggleMute = () => toggleMute();
  const handleForward = () => forward();
  const handleRewind = () => rewind();
  const handleClose = () => setAudio(null); // Close playbar and stop audio

  return (
    <div
      className={cn(
        "sticky bottom-0 left-0 flex size-full flex-col text-zinc-100 font-bold z-50",
        {
          hidden: !audio?.audioUrl,
        }
      )}
    >
      <div className="flex flex-col md:flex-row relative overflow-hidden gap-4 lg:gap-8 justify-between items-center md:pr-8 w-full bg-zinc-900 max-md:max-w-full">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-[12px] font-bold"
          aria-label="Close"
        >
          ✖
        </button>

        <div className="w-full flex justify-stretch items-center gap-2">
          {/* Podcast Link and Image */}
          <Link to={`/episodes/${audio?.episodeId}`}>
            {audio?.imageUrl ? (
              <img
                src={audio.imageUrl}
                width={100}
                height={100}
                alt="podcast image"
                className="aspect-square object-contain"
              />
            ) : (
              <ImagePlaceholder
                title={audio?.title?.charAt(0)}
                className={
                  "min-w-16 sm:min-w-20 md:min-w-24 aspect-square !rounded-none"
                }
              />
            )}
          </Link>

          {/* Podcast Title and Author */}
          <PodcastDetails title={audio?.title} author={audio?.author} />
        </div>

        <div className="w-full flex flex-col sm:flex-row md:flex-col lg:flex-row justify-center items-stretch gap-2 p-3 pt-0 md:p-0">
          {/* Playback Controls */}
          <PlaybackControls
            isPlaying={isPlaying}
            onPlayPause={handleTogglePlayPause}
            onRewind={handleRewind}
            onForward={handleForward}
          />

          {/* Progress and Time */}
          <PlaybackProgress currentTime={currentTime} duration={duration} />
        </div>

        {/* Volume Control */}
        <VolumeControl isMuted={isMuted} onToggleMute={handleToggleMute} />
      </div>
    </div>
  );
};

const PodcastDetails = memo(({ title, author }) => (
  <div className="flex w-[240px] grow flex-col text-base font-medium">
    <h2 className="text-lg pr-7 md:pr-0 truncate">{title}</h2>
    <strong className="opacity-30">{author}</strong>
  </div>
));

const PlaybackControls = memo(
  ({ isPlaying, onPlayPause, onRewind, onForward }) => (
    <div className="flex gap-3 lg:gap-4 xl:gap-8 items-center justify-center">
      <ShuffleIcon color="#f0f0f0" className="w-6 h-6 cursor-pointer" />
      <StepBackwardIcon
        color="#f0f0f0"
        className="w-6 h-6 cursor-pointer"
        onClick={onRewind}
      />
      <div
        onClick={onPlayPause}
        className="cursor-pointer flex overflow-hidden gap-3.5 justify-center items-center self-stretch px-1.5 my-auto bg-indigo-500 h-[50px] min-h-[50px] rounded-[167px] w-[50px]"
      >
        {isPlaying ? (
          <PauseIcon className="w-6 aspect-square -mr-0.5" color="#f0f0f0" />
        ) : (
          <PlayIcon className="w-7 aspect-square -mr-0.5" color="#f0f0f0" />
        )}
      </div>
      <StepForwardIcon
        color="#f0f0f0"
        className="w-6 h-6 cursor-pointer"
        onClick={onForward}
      />
      <RepeatIcon color="#f0f0f0" className="w-6 h-5 cursor-pointer" />
    </div>
  )
);

const PlaybackProgress = memo(({ currentTime, duration }) => (
  <div className="flex flex-1 shrink gap-3.5 items-center min-w-[240px]">
    <time className="text-base opacity-70 font-medium text-white">
      {formatTime(currentTime)}
    </time>
    <div className="flex flex-col flex-1 shrink min-w-24 sm:min-w-[240px]">
      <Progress value={(currentTime / duration) * 100} max={duration} />
    </div>
    <time className="text-base opacity-70 font-medium text-white">
      {formatTime(duration)}
    </time>
  </div>
));

const VolumeControl = memo(({ isMuted, onToggleMute }) => (
  <div className="hidden md:flex gap-3 items-center cursor-pointer">
    {isMuted ? (
      <MuteIcon
        color="#f0f0f0"
        className="w-6 aspect-square h-6"
        onClick={onToggleMute}
      />
    ) : (
      <VolumeIcon
        color="#f0f0f0"
        className="w-6 aspect-square h-6"
        onClick={onToggleMute}
      />
    )}
  </div>
));

export default memo(PlayBar);
