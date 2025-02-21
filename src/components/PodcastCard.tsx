import { Link } from "react-router-dom";

function PodcastCard({
  id,
  title,
  img,
  className,
}: {
  id: string;
  title: string;
  img: string;
  className?: string;
}) {
  return (
    <Link to={`/podcasts/${id}`}>
      <figure
        className={`flex flex-col justify-center overflow-hidden hover:-translate-y-1.5 duration-300 ${className}`}
      >
        <img
          loading="lazy"
          srcSet={img}
          className="object-contain rounded-lg aspect-square"
        />
        <h1 className="mt-2 w-full text-xl font-bold truncate">{title}</h1>
      </figure>
    </Link>
  );
}

export default PodcastCard;
