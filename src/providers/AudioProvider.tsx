import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { saveToRecentPlayedHistories } from "../utils/utils";

const AudioContext = createContext();

const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audio, setAudio] = useState();

  const saveProgress = () => {
    if (audioRef.current && audio) {
      saveToRecentPlayedHistories(
        audio, // Current audio object
        audioRef.current.currentTime, // Current playback time
        audioRef.current.duration // Total duration
      );
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current?.paused) {
      audioRef.current?.play();
      setIsPlaying(true);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
      // Save progress when the audio is paused
      saveProgress();
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted((prev) => !prev);
    }
  };

  const forward = () => {
    if (
      audioRef.current &&
      audioRef.current.currentTime &&
      audioRef.current.duration &&
      audioRef.current.currentTime + 5 < audioRef.current.duration
    ) {
      audioRef.current.currentTime += 5;
    }
  };

  const rewind = () => {
    if (audioRef.current && audioRef.current.currentTime - 5 > 0) {
      audioRef.current.currentTime -= 5;
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", updateCurrentTime);
      return () => {
        audioElement.removeEventListener("timeupdate", updateCurrentTime);
      };
    }
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audio?.audioUrl) {
      if (audioElement) {
        audioElement.play().then(() => {
          setIsPlaying(true);
        });
      }
    } else {
      audioElement?.pause();
      setIsPlaying(true);
      // Save progress when switching to a new audio
      saveProgress();
    }
    return () => {
      // Save progress before the component unmounts or audio changes
      saveProgress();
    };
  }, [audio]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);

    // Save progress when the audio ends
    saveProgress();
  };

  return (
    <AudioContext.Provider
      value={{
        audio,
        setAudio,
        rewind,
        forward,
        toggleMute,
        togglePlayPause,
        isMuted,
        isPlaying,
        duration,
        currentTime,
      }}
    >
      <audio
        ref={audioRef}
        src={audio?.audioUrl}
        className="hidden"
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);

  if (!context)
    throw new Error("useAudio must be used within an AudioProvider");

  return context;
};

export default AudioProvider;
