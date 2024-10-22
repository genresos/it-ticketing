import { IconType } from "react-icons";
import {
  MdAccountCircle,
  MdCalendarToday,
  MdDashboard,
  MdOutlineAddchart,
  MdOutlineError,
} from "react-icons/md";

interface LinkItems {
  id: number;
  name: string;
  icon: IconType | null;
  link: string;
}

const linkItems: LinkItems[] = [
  { id: 1, name: "Dashboard", icon: MdDashboard, link: "/dashboard" },
  { id: 2, name: "My Task", icon: MdCalendarToday, link: "/dashboard/my-task" },
  { id: 3, name: "Issues", icon: MdOutlineError, link: "/dashboard/issues" },
  {
    id: 4,
    name: "Add Issue",
    icon: MdOutlineAddchart,
    link: "/dashboard/add-issue",
  },
  { id: 5, name: "Account", icon: null, link: "#" },
  { id: 6, name: "Profile", icon: MdAccountCircle, link: "/dashboard/profile" },
];

export default linkItems;
