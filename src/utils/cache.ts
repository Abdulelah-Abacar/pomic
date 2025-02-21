import { InMemoryCache } from "@apollo/client";

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        searchForTerm: {
          keyArgs: ["filterForGenres"], // This ensures that different genre results are cached separately
          merge(existing = { podcastSeries: [] }, incoming) {
            // Merge the new results with the existing results
            return {
              ...incoming,
              podcastSeries: [
                ...existing.podcastSeries,
                ...incoming.podcastSeries,
              ],
            };
          },
        },
        getPodcastSeries: {
          keyArgs: ["uuid"],
          merge(existing = {}, incoming) {
            return {
              ...incoming,
              episodes: existing.episodes
                ? [...existing.episodes, ...incoming.episodes]
                : incoming.episodes,
            };
          },
        },
        getTopChartsByCountry: {
          keyArgs: ["country", "taddyType"], // Cache based on country and type
          merge(existing = {}, incoming, { args }) {
            const { page } = args || {};
            const merged = existing.podcastSeries
              ? existing.podcastSeries.slice(0)
              : [];

            if (incoming.podcastSeries) {
              if (page === 1) {
                // Reset for the first page
                return incoming;
              }
              merged.push(...incoming.podcastSeries);
            }

            return {
              ...incoming,
              podcastSeries: merged,
            };
          },
        },
      },
    },
  },
});
