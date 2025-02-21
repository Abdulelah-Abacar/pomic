import { Routes, Route, Outlet } from "react-router-dom";

import { PlayBar, LeftSidebar, RightSidebar } from "./components";

import {
  Home,
  Discover,
  Profile,
  PodcastDetails,
  EpisodeDetails,
  TopPodcasts,
  TopEpisodes,
  PlaylistDetails,
  Playlists,
  SignInPage,
  SignUpPage,
} from "./pages";
import NotFound from "./pages/NotFound";
import db from "./appwrite/database";
import { Query } from "appwrite";
import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import Navbar from "./components/Navbar";
import { Community, CommunityChannel } from "./pages/Community";

function App() {
  const { isSignedIn } = useAuth(); // Clerk's auth state
  const { user } = useUser(); // Clerk's user data

  useEffect(() => {
    const createUserInAppwrite = async () => {
      if (isSignedIn && user) {
        try {
          const { id } = user;

          // Check if the user already exists in Appwrite
          const existingUser = await db.user.list([Query.equal("clerkId", id)]);

          if (existingUser.total > 0) {
            console.log("User already exists in Appwrite.");
            return;
          }

          // If not, create a new user
          const payload = {
            clerkId: id,
            createdAt: new Date().toISOString(),
          };

          await db.user.create(payload);
          console.log("User successfully created in Appwrite.");
        } catch (error) {
          console.error("Error creating user in Appwrite:", error);
        }
      }
    };

    createUserInAppwrite();
  }, [isSignedIn, user]);

  return (
    <Routes>
      <Route path="sign-in" element={<SignInPage />} />
      <Route path="sign-up" element={<SignUpPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="discover" element={<Discover />} />
        <Route path="profile" element={<Profile />} />
        <Route path="top-podcasts" element={<TopPodcasts />} />
        <Route path="top-episodes" element={<TopEpisodes />} />
        <Route path="playlists" element={<Playlists />} />
        <Route path="podcasts/:id" element={<PodcastDetails />} />
        <Route path="episodes/:id" element={<EpisodeDetails />} />
        <Route path="playlists/:id" element={<PlaylistDetails />} />
        <Route path="/404" element={<NotFound />} />
      </Route>
      <Route path="/community" element={<Community />} />
      <Route path="/community/:id" element={<CommunityChannel />} />
    </Routes>
  );
}

function Layout() {
  return (
    <>
      <div className="font-qs grid grid-cols-1 md:grid-cols-[300px_calc(100vw-350px)] lg:grid-cols-[250px_calc(100vw-550px)_auto] xl:grid-cols-[300px_calc(100vw-650px)_auto] 2xl:grid-cols-[350px_calc(100vw-750px)_auto] gap-5 p-2 md:p-5 h-screen bg-[#0a0a0a]/20 bg-gradient-to-br from-[#1B1B1B] to-[#14151F] text-zinc-100 overflow-hidden">
        <div className="hidden md:block">
          <LeftSidebar />
        </div>

        <div className="relative">
          <Navbar />
          <Outlet />
        </div>

        <div className="hidden lg:block min-w-52 max-w-80">
          <RightSidebar />
        </div>
      </div>
      <PlayBar />
    </>
  );
}

export default App;
