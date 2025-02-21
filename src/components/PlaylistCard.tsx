import { Link } from "react-router-dom";
import PlayIcon from "../assets/play";
import ImagePlaceholder from "./ImagePlaceholder";
function PlaylistCard({ item }) {
  return (
    <Link to={`/playlists/${item?.$id}`} className="h-fit">
      <div className="flex flex-col justify-center gap-3 min-w-72">
        <div className="flex relative items-end justify-end p-5 rounded-2xl aspect-square">
          {item?.imageUrl ? (
            <img
              loading="lazy"
              srcSet={item?.imageUrl}
              alt={item?.title}
              className="object-cover absolute inset-0 size-full rounded-2xl"
            />
          ) : (
            <ImagePlaceholder
              title={item?.title?.charAt(0)}
              className="object-cover absolute inset-0 size-full rounded-2xl"
            />
          )}
          <div className="flex justify-center items-center bg-indigo-500 h-10 min-w-10 rounded-full  hover:-translate-y-1 duration-300 cursor-pointer z-20">
            <PlayIcon color="#f0f0f0" className="w-5 h-5" />
          </div>
        </div>
        <div className="flex flex-col justify-center gap-1 font-bold overflow-hidden">
          <h2 className="text-xl truncate">{item?.title}</h2>
          <small className="text-sm opacity-40 tracking-widest font-light">
            # {item?.episodesTotalNum} . Episodes
          </small>
        </div>
      </div>
    </Link>
  );
}

export default PlaylistCard;
