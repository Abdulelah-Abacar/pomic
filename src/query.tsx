import { gql } from "@apollo/client";

export const SEARCH_FOR_TERM_QUERY = gql`
  query searchForTerm(
    $term: String
    $page: Int
    $limitPerPage: Int
    $filterForTypes: [TaddyType]
    $filterForCountries: [Country]
    $filterForLanguages: [Language]
    $filterForGenres: [Genre]
    $filterForSeriesUuids: [ID]
    $filterForNotInSeriesUuids: [ID]
    $isExactPhraseSearchMode: Boolean
    $isSafeMode: Boolean
    $searchResultsBoostType: SearchResultBoostType
  ) {
    searchForTerm(
      term: $term
      page: $page
      limitPerPage: $limitPerPage
      filterForTypes: $filterForTypes
      filterForCountries: $filterForCountries
      filterForLanguages: $filterForLanguages
      filterForGenres: $filterForGenres
      filterForSeriesUuids: $filterForSeriesUuids
      filterForNotInSeriesUuids: $filterForNotInSeriesUuids
      isExactPhraseSearchMode: $isExactPhraseSearchMode
      isSafeMode: $isSafeMode
      searchResultsBoostType: $searchResultsBoostType
    ) {
      searchId
      podcastSeries {
        uuid
        name
        imageUrl
        authorName
        genres
      }
      podcastEpisodes {
        uuid
        guid
        name
        audioUrl
        episodeNumber
      }
    }
  }
`;

export const GET_PODCASTSERIES = gql`
  query getPodcastSeries(
    $uuid: ID
    $page: Int
    $limitPerPage: Int
    $searchTerm: String
    $sortOrder: SortOrder
  ) {
    getPodcastSeries(uuid: $uuid) {
      uuid
      hash
      name
      genres
      description(shouldStripHtmlTags: true)
      imageUrl
      datePublished
      language
      seriesType
      contentType
      authorName
      totalEpisodesCount
      episodes(
        limitPerPage: $limitPerPage
        page: $page
        searchTerm: $searchTerm
        sortOrder: $sortOrder
      ) {
        uuid
        name
        description(shouldStripHtmlTags: true)
        audioUrl
        imageUrl
        duration
        datePublished
        episodeNumber
        podcastSeries {
          uuid
          name
          authorName
        }
      }
    }
  }
`;

export const GET_PODCASTEPISODE = gql`
  query getPodcastEpisode($uuid: ID) {
    getPodcastEpisode(uuid: $uuid) {
      uuid
      hash
      name
      imageUrl
      description(shouldStripHtmlTags: true)
      datePublished
      guid
      subtitle
      audioUrl
      videoUrl
      fileLength
      fileType
      duration
      episodeType
      seasonNumber
      episodeNumber
      websiteUrl
      isExplicitContent
      isRemoved
      podcastSeries {
        uuid
        name
        authorName
      }
    }
  }
`;

export const GET_TopChartsByCountry = gql`
  query getTopChartsByCountry(
    $taddyType: TaddyType!
    $country: Country!
    $limitPerPage: Int
    $page: Int
  ) {
    getTopChartsByCountry(
      taddyType: $taddyType
      country: $country
      limitPerPage: $limitPerPage
      page: $page
    ) {
      topChartsId
      podcastSeries {
        uuid
        name
        imageUrl
        authorName
        genres
      }
      podcastEpisodes {
        uuid
        name
        description(shouldStripHtmlTags: true)
        audioUrl
        imageUrl
        duration
        datePublished
        episodeNumber
        podcastSeries {
          uuid
          name
          authorName
        }
      }
    }
  }
`;

export const GET_TopChartsByGenres = gql`
  query getTopChartsByGenres($limitPerPage: Int!, $genres: [Genre!]) {
    getTopChartsByGenres(
      taddyType: PODCASTSERIES
      genres: $genres
      limitPerPage: $limitPerPage
    ) {
      topChartsId
      podcastSeries {
        uuid
        name
        imageUrl
        genres
        authorName
      }
    }
  }
`;

export const GET_MultiplePodcastEpisodes = gql`
  query getMultiplePodcastEpisodes($uuids: [ID]) {
    getMultiplePodcastEpisodes(uuids: $uuids) {
      uuid
      hash
      name
      description(shouldStripHtmlTags: true)
      imageUrl
      datePublished
      guid
      subtitle
      audioUrl
      videoUrl
      fileLength
      fileType
      duration
      episodeType
      seasonNumber
      episodeNumber
      websiteUrl
      isExplicitContent
      isRemoved
    }
  }
`;

export const GET_MultiplePodcastSeries = gql`
  query getMultiplePodcastSeries($uuids: [ID]) {
    getMultiplePodcastSeries(uuids: $uuids) {
      uuid
      name
      itunesId
      description
      imageUrl
      itunesInfo {
        uuid
        publisherName
        baseArtworkUrlOf(size: 640)
      }
    }
  }
`;
