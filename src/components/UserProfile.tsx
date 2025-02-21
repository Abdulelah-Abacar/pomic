import { Link } from "react-router-dom";
import ArrowIcon from "../assets/arrow";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

function UserProfile() {
  const { user } = useUser();
  return (
    <Link
      to="/profile"
      className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-stone-900"
    >
      <div className="flex gap-3 items-center justify-center">
        <SignedOut>
          <SignInButton>
            <img
              title="Sign-in"
              loading="lazy"
              srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/e3f4ea6078a35a0087407584db8a9a3a95976771ab7f92a97847ef435ea37e61?placeholderIfAbsent=true&apiKey=80f4ae603f654b1180916f1d64214f30&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/e3f4ea6078a35a0087407584db8a9a3a95976771ab7f92a97847ef435ea37e61?placeholderIfAbsent=true&apiKey=80f4ae603f654b1180916f1d64214f30&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/e3f4ea6078a35a0087407584db8a9a3a95976771ab7f92a97847ef435ea37e61?placeholderIfAbsent=true&apiKey=80f4ae603f654b1180916f1d64214f30&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/e3f4ea6078a35a0087407584db8a9a3a95976771ab7f92a97847ef435ea37e61?placeholderIfAbsent=true&apiKey=80f4ae603f654b1180916f1d64214f30&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/e3f4ea6078a35a0087407584db8a9a3a95976771ab7f92a97847ef435ea37e61?placeholderIfAbsent=true&apiKey=80f4ae603f654b1180916f1d64214f30&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/e3f4ea6078a35a0087407584db8a9a3a95976771ab7f92a97847ef435ea37e61?placeholderIfAbsent=true&apiKey=80f4ae603f654b1180916f1d64214f30&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/e3f4ea6078a35a0087407584db8a9a3a95976771ab7f92a97847ef435ea37e61?placeholderIfAbsent=true&apiKey=80f4ae603f654b1180916f1d64214f30&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/e3f4ea6078a35a0087407584db8a9a3a95976771ab7f92a97847ef435ea37e61?placeholderIfAbsent=true&apiKey=80f4ae603f654b1180916f1d64214f30"
              className="object-contain rounded-full aspect-square w-[50px]"
            />
          </SignInButton>
          <b className="truncate">Gest</b>
        </SignedOut>
        <SignedIn>
          <UserButton />
          <b className="truncate">{user?.fullName}</b>
        </SignedIn>
      </div>
      <ArrowIcon color="#5C67DE" className="w-4 h-4" />
    </Link>
  );
}

export default UserProfile;
