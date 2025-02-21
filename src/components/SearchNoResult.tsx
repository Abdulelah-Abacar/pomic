import NoSearchResultIcon from "../assets/NoSearchResult";

function SearchNoResult() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <NoSearchResultIcon className="aspect-square w-[253px] h-48" />
        <h1 className="font-bold text-4xl">No results found.</h1>
        <p className="text-white text-opacity-70 text-2xl">
          Try adjusting your search to find <br /> what you are looking for
        </p>
      </div>
    </div>
  );
}

export default SearchNoResult;
