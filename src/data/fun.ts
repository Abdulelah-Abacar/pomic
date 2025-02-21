import Podcasts from "./Podcasts.json";
import Playlists from "./Playlists.json";

export const getPodcasts = () => {
  return Podcasts;
};

export const getPodcastById = (id) => {
  return Podcasts.filter((podcast) => podcast.id == id)[0];
};

export const podcastsCategories = () => {
  return Array.from(new Set(Podcasts.map((podcast) => podcast.category)));
};

export const getPlaylists = () => {
  return Playlists;
};
export const getPlaylistsById = (id) => {
  return Playlists.filter((playlist) => playlist.id == id)[0];
};

export const getPodcastEpisodes = (podcastId) => {
  const podcastEpisodes = Podcasts.filter(
    (podcast) => podcast.id == podcastId
  )[0].episodes;

  return podcastEpisodes;
};

export const getPlaylistEpisodes = (playlistId) => {
  const playlistEpisodes = Playlists.filter(
    (playlist) => playlist.id == playlistId
  )[0].episodes;

  return playlistEpisodes;
};

export const getPodcastEpisodeById = (episodeId) => {
  return Podcasts.map(
    (podcast) =>
      podcast.episodes.filter((episode) => episode.id == episodeId)[0]
  ).filter((item) => item !== undefined)[0];
};

export const getPodcastsByCategory = (category) => {
  return Podcasts.filter((podcast) => podcast.category == category);
};
