import UserProfile from "./UserProfile";
import TopPodcastsCarousel from "./TopPodcastsCarousel";
import TopEpisodesCarousel from "./TopEpisodesCarousel";
function RightSidebar() {
  return (
    <div className="flex flex-col gap-4">
      <UserProfile />
      <TopPodcastsCarousel />
      <TopEpisodesCarousel />
    </div>
  );
}

export default RightSidebar;
