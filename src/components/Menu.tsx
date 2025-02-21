import HomeIcon from "../assets/home";
import DiscoverIcon from "../assets/discover";
import FollowingIcon from "../assets/following";
import { NavLink } from "react-router-dom";
const menuItems = [
  {
    icon: HomeIcon,
    title: "home",
  },
  {
    icon: DiscoverIcon,
    title: "discover",
  },
  {
    icon: FollowingIcon,
    title: "subscriptions",
  },
  {
    icon: FollowingIcon,
    title: "community",
  },
];

function Menu() {
  return (
    <ul className="list-none flex flex-col justify-center gap-4 py-4 px-5 text-base font-semibold rounded-2xl bg-stone-900">
      {menuItems.map(({ icon, title }, i) => {
        const Icon = icon;
        return (
          <li
            key={i}
            className={`flex items-center gap-3 hover:scale-105 duration-300`}
          >
            <NavLink
              to={`/${
                title === "home"
                  ? ""
                  : title === "subscriptions"
                  ? "profile"
                  : title
              }`}
              className={`w-full flex gap-2 items-center capitalize`}
              style={({ isActive }) => {
                return isActive ? { color: "#5C67DE" } : {};
              }}
            >
              <Icon className="w-6 h-6" />
              {title}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}

export default Menu;
