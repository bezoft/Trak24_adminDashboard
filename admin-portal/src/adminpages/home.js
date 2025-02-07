import React from "react";
import { TbLocation, TbMessage, TbReportAnalytics } from "react-icons/tb"; // Import the required icons
import { FaRegMap, FaGlobeAmericas } from "react-icons/fa";
import { PiTruck, PiInfoLight } from "react-icons/pi";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { MdSupportAgent } from "react-icons/md";
import Header from "../Components/header";
import Dashboard from "./Dashboard";


const Card = ({ icon: Icon, name, path }) => (
  <a href={path} className="cursor-pointer flex flex-col items-center justify-center border border-gray-300 rounded-lg p-2 transition-all duration-400 ease-in-out 
    hover:shadow-sm hover:shadow-gray-400 
    dark:hover:shadow-sm dark:hover:shadow-orange-500 
    w-80 h-36"> {/* Increased width and adjusted padding */}
    <div className="text-4xl mb-2"><Icon /></div> {/* Render the icon component */}
    <div className="text-lg font-medium">{name}</div>
  </a>
);

const Home = () => {

  return (
    <>
      <Header />
<Dashboard/>
    </>
  );
};

export default Home;
