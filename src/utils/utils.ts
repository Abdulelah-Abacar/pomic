import { type ClassValue, clsx } from "clsx";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const saveToRecentPlayedHistories = (episode, currentTime, duration) => {
  if (!episode || !episode.episodeId) return; // Ensure episode has a unique identifier

  const storageKey = "recentPlayedHistories";
  const maxHistoryLength = 20; // Limit the history to the last 20 episodes

  // Get current history from local storage
  const currentHistory = JSON.parse(localStorage.getItem(storageKey)) || [];

  // Check for duplicates using episodeId
  const existingEpisodeIndex = currentHistory.findIndex(
    (item) => item.episodeId === episode.episodeId
  );

  if (existingEpisodeIndex !== -1) {
    // If the episode already exists, remove it from its current position
    currentHistory.splice(existingEpisodeIndex, 1);
  }

  // Construct the episode object with additional data
  const updatedEpisode = {
    episodeId: episode.episodeId,
    currentTime: currentTime || 0, // Defaults to 0 if not provided
    duration: duration || 0, // Defaults to 0 if not provided
    title: episode.title || "Unknown Title", // Optional: Add other metadata if needed
  };

  // Add the updated episode to the front of the history
  const updatedHistory = [updatedEpisode, ...currentHistory];

  // Limit the history size
  if (updatedHistory.length > maxHistoryLength) {
    updatedHistory.pop();
  }

  // Save updated history back to local storage
  localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
};

// forward refs
export function fr<T = HTMLElement, P = React.HTMLAttributes<T>>(
  component: ForwardRefRenderFunction<T, P>
) {
  const wrapped = forwardRef(component);
  wrapped.displayName = component.name;
  return wrapped;
}

export function convertSecondsToDate(seconds) {
  // Convert seconds to milliseconds and create a new Date object
  const date = new Date(seconds * 1000);
  return date.toLocaleDateString(); // Returns a readable date and time string
}

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};
