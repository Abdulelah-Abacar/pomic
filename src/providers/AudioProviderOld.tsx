import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import ReactHowler from "react-howler";
import { saveToRecentPlayedHistories } from "../utils/utils";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [audio, setAudio] = useState(null); // Stores audio data such as title, url, etc.
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Tracks current playback time
  const [duration, setDuration] = useState(0); // Tracks total duration of the audio
  const audioPlayerRef = useRef(null); // Reference to ReactHowler

  // Function to toggle play/pause state
  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  // Function to seek to a specific time in the audio
  const seekTo = (time) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.seek(time);
      setCurrentTime(time);
    }
  };

  // Function to rewind by a specified number of seconds
  const rewind = (seconds) => {
    seekTo(Math.max(0, currentTime - seconds));
  };

  const forward = () => {
    if (audioPlayerRef.current) {
      const newTime = Math.min(duration, currentTime + 10);
      seekTo(newTime); // Seek to the new time if within bounds
    }
  };

  const backward = () => {
    if (audioPlayerRef.current) {
      const newTime = Math.min(duration, currentTime - 10);
      seekTo(newTime); // Seek to the new time if within bounds
    }
  };

  // Function to replay the current episode from the beginning
  const replay = () => {
    seekTo(0);
    setIsPlaying(true); // Start playback again
  };

  // Update current time during playback
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        if (audioPlayerRef.current) {
          setCurrentTime(audioPlayerRef.current.seek());
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Handle audio load to get duration
  const handleLoad = () => {
    if (audioPlayerRef.current) {
      setDuration(audioPlayerRef.current.duration());
    }
  };

  // Update the recent played histories whenever a new audio is set
  useEffect(() => {
    if (audio) {
      saveToRecentPlayedHistories(audio);
    }
  }, [audio]);

  return (
    <AudioContext.Provider
      value={{
        audio,
        setAudio,
        isPlaying,
        togglePlayPause,
        currentTime,
        duration,
        seekTo,
        rewind,
        forward,
        backward,
        replay,
        setIsPlaying,
      }}
    >
      {audio && (
        <ReactHowler
          src={audio.audioUrl}
          playing={isPlaying}
          ref={audioPlayerRef}
          onLoad={handleLoad}
          onEnd={() => setIsPlaying(false)}
        />
      )}
      {children}
    </AudioContext.Provider>
  );
};

// Custom hook to use audio context
export const useAudio = () => useContext(AudioContext);
