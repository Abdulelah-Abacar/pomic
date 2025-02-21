import { Link } from "react-router-dom";
import HistoryIcon from "../assets/history";

function HistoryEmptyState() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center gap-1 text-center font-bold">
        <HistoryIcon className="aspect-square w-[253px]" />
        <h1 className="text-4xl">No History Yet.</h1>
        <p className="text-white text-opacity-70 text-2xl">
          You have to listen to some podcasts <br />
          click{" "}
          <Link to={"/discover"} className="text-indigo-500">
            here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default HistoryEmptyState;
