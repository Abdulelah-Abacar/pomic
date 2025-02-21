import { Link } from "react-router-dom";
import PlayedIcon from "../assets/Played";
import ImagePlaceholder from "./ImagePlaceholder";
import React, { useState } from "react";

function PlaylistItem({ item }) {
  const [played, setPlayed] = useState(false);
  return (
    <Link
      to={`playlists/${item.$id}`}
      className={`grid gap-2 grid-cols-[auto_1fr_auto] place-items-start font-medium cursor-pointer p-2 hover:bg-stone-800/20 hover:scale-y-110 hover:scale-x-105 duration-500`}
    >
      <div className="">
        {item.imageUrl ? (
          <img
            loading="lazy"
            srcSet={item.imageUrl}
            className="object-contain rounded-lg aspect-square w-[45px]"
            alt={item.title}
          />
        ) : (
          <ImagePlaceholder
            className={"py-1 min-w-14 max-w-14 rounded-lg"}
            title={item.title?.charAt(0)}
          />
        )}
      </div>
      <div className="overflow-hidden max-w-[95%]">
        <p className="text-base truncate">{item.title}</p>
        <small className={`text-sm opacity-40 tracking-widest font-light`}>
          {item.episodesTotalNum} episodes
        </small>
      </div>

      {played && (
        <div className="w-8 h-8 border-2 border-[#5C67DE] rounded-full flex items-center justify-center scale-95 ml-auto">
          <PlayedIcon color="#5C67DE" className="w-4 h-4" />
        </div>
      )}
    </Link>
  );
}

export default React.memo(PlaylistItem);
