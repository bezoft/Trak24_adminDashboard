import React, { useState, useEffect } from 'react';
import ThemeSwitcher from './themeSwitcher';
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import CreateVehicle from '../adminpages/Modals/CreateVehicle';
import CreateSimBatch from '../adminpages/Modals/CreateSimBatch';
import AttachSim from '../adminpages/Modals/Attachsim';
import DetachSim from '../adminpages/Modals/DetachSim';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null); // Tracks the open submenu
  const [selected, setselected] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simBatchModal, setsimBatchModal] = useState(false);
  const [attachsimModal, setattachsimModal] = useState(false);
  const [detachsimModal, setdetachsimModal] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const closesimbModal = () => setsimBatchModal(false);
  const closeattachsimModal = () => setattachsimModal(false);
  const closedetachsimModal = () => setdetachsimModal(false);
  const { decryptData } = useAuth()

  const DispalyName = decryptData().name
  useEffect(() => {

    const path = window.location.pathname;
    //checkPath(path);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleSubmenu = (menu) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu); // Toggle current menu, close others
  };

  // const checkPath = (path) => {
  //   if (path === "/eagle-eye-monitoring") {
  //     changeselected("#1");
  //   }
  //   else if (path === "/maintanace") {
  //     changeselected("#2");
  //   }
  //   else if (path === "/manage-incidents") {
  //     changeselected("#3");
  //   }
  //   else if (path === "/auto-report-log") {
  //     changeselected("#4");
  //   }
  //   else if (path === "/live-caution") {
  //     changeselected("#5");
  //   }
  //   else if (path === "/new-customer") {
  //     changeselected("#6");
  //   }
  //   else if (path === "/customer-info") {
  //     changeselected("#7");
  //   }
  //   else if (path === "/login-log") {
  //     changeselected("#8");
  //   }
  //   else if (path === "/custom-reports") {
  //     changeselected("#9");
  //   }
  //   else if (path === "/stock-list") {
  //     changeselected("#10");
  //   }
  //   else if (path === "/unit-status") {
  //     changeselected("#11");
  //   }
  //   else if (path === "/unit-shipment") {
  //     changeselected("#12");
  //   }
  //   else if (path === "/sms-center") {
  //     changeselected("#13");
  //   }
  //   else if (path === "/sim-list") {
  //     changeselected("#14");
  //   }
  //   else if (path === "/sim-entry") {
  //     changeselected("#15");
  //   } else if (path === "/attach-sim") {
  //     changeselected("#16");
  //   } else if (path === "/detach-sim") {
  //     changeselected("#17");
  //   }
  //   else if (path === "/customer-billing") {
  //     changeselected("#18");
  //   }
  //   else if (path === "/tech-team") {
  //     changeselected("#19");
  //   }
  //   else if (path === "/admin-roles") {
  //     changeselected("#20");
  //   } else if (path === "/config-new-unit") {
  //     changeselected("#21");
  //   }
  // };

  const logout = () => {
    localStorage.removeItem('user'); // Remove the user from localStorage
    localStorage.removeItem('token'); // Remove the token from localStorage
    window.location.reload(); // Reload the page or redirect to the login page
  };

  const changeselected = (btn) => {
    setselected(btn); // Toggle current menu, close others
  };
  console.log(selected);


  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 w-full flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-600 text-white transition-shadow ${isScrolled
          ? 'border-b border-gray-200 dark:border-gray-800 shadow-md'
          : ''
          } bg-white dark:bg-[#23272f]`}
      >
        {/* Left Corner: Drawer Toggle Button */}
        <div className="flex items-center">
          <button
            onClick={toggleDrawer}
            className=" dark:hover:bg-gray-600 hover:bg-gray-200 text-black dark:text-white  px-4 py-2 rounded mr-4"
          >
            ☰
          </button>
          <img
            src="/assets/trak24comtr.png"
            alt="Left Logo"
            className="h-8 dark:hidden"
          />
          <img
            src="/assets/trak24comtrw.png"
            alt="Left Logo"
            className="h-8 hidden dark:block"
          />
        </div>

        {/* Right Corner: Buttons */}
        <div className="flex items-center space-x-4">
          <h1 className='hidden md:block text-lg'>Hi, {DispalyName}</h1>
          <ThemeSwitcher />
          <a className="p-2  hover:bg-gray-100 dark:hover:bg-[#343A46] rounded-full cursor-pointer" title='Logout'>
            <IoIosLogOut onClick={logout} className=' text-black dark:text-white size-8' />
          </a>
        </div>
      </header>

      {/* Side Drawer */}
      <div
        className={`fixed top-0 left-0 h-full bg-white dark:bg-[#23272f] overflow-auto shadow-lg z-40 transform transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{ width: '300px' }}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-800">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button
              onClick={toggleDrawer}
              className="text-gray-600 dark:text-gray-400"
            >
              ✕
            </button>
          </div>

          {/* Drawer Navigation */}
          <nav className="space-y-1 mt-5">
            {/* Simple Menu Items */}

            <div onClick={() => navigate("/")} className={` hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
              <a className="block text-gray-800 dark:text-gray-200">
                Home
              </a>
            </div>

            <div>
              <button
                onClick={() => { toggleSubmenu('Monitoring Center'); }}
                className={` flex items-center justify-between w-72 dark:hover:bg-[#343A46] hover:bg-gray-100 mr-4 p-3 rounded-tr-2xl rounded-br-2xl`}
              >
                Monitoring Center
                <span>{openSubmenu === 'Monitoring Center' ? <IoIosArrowDown /> : <IoIosArrowForward />}</span>
              </button>
              <div
                className={`transition-[max-height] duration-300 overflow-hidden ${openSubmenu === 'Monitoring Center' ? 'max-h-64' : 'max-h-0'
                  }`}
              >
                <div>
                  <div onClick={() => navigate("/eagle-eye-monitoring")} className={` hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a  className="block ">
                      Eagle Eye
                    </a>
                  </div>

                  <div onClick={() => navigate("/maintanace")} className={` hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a className="block ">
                      Maintanace
                    </a>
                  </div>

                  <div onClick={() => navigate("/manage-incidents")} className={` hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a className="block ">
                      Incidents
                    </a>
                  </div>

                  <div onClick={() => navigate("/auto-report-log")} className={` hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a className="block ">
                      Auto Report Log
                    </a>
                  </div>

                  <div onClick={() => navigate("/live-caution")} className={` hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a className="block ">
                      Live Caution
                    </a>
                  </div>
                </div>
              </div>
            </div>



            {/* <div onClick={() => changeselected("#2")} className={`${selected === "#2" ? "dark:bg-[#412e28] bg-[#ffeee6]" : ""} hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
              <a href="/map-tracking" className="block text-gray-800 dark:text-gray-200">
              Vehicle
              </a>
            </div> */}

            <div>
              <button
                onClick={() => { toggleSubmenu('Customers'); }}
                className={` flex items-center justify-between w-72 dark:hover:bg-[#343A46] hover:bg-gray-100 mr-4 p-3 rounded-tr-2xl rounded-br-2xl`}
              >
                Customers
                <span>{openSubmenu === 'Customers' ? <IoIosArrowDown /> : <IoIosArrowForward />}</span>
              </button>
              <div
                className={`transition-[max-height] duration-300 overflow-hidden ${openSubmenu === 'Customers' ? 'max-h-64' : 'max-h-0'
                  }`}
              >
                <div onClick={() => navigate("/customer-info")} className={` hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                  <a className="block ">
                    Customer Info
                  </a>
                </div>
                <div onClick={() => navigate("/new-customer")} className={` hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                  <a className="block ">
                    New Customer
                  </a>
                </div>

                <div>
                  <div onClick={() => navigate("/login-log")} className={` hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a className="block ">
                      Login Log
                    </a>
                  </div>

                  <div onClick={() => navigate("/custom-reports")} className={` hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a className="block ">
                      Custom Reports
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => { toggleSubmenu('Stock'); changeselected("#3"); }}
                className={` flex items-center justify-between w-72 dark:hover:bg-[#343A46] hover:bg-gray-100 mr-4 p-3 rounded-tr-2xl rounded-br-2xl`}
              >
                Stock
                <span>{openSubmenu === 'Stock' ? <IoIosArrowDown /> : <IoIosArrowForward />}</span>
              </button>
              <div
                className={`transition-[max-height] duration-300 overflow-hidden ${openSubmenu === 'Stock' ? 'max-h-64' : 'max-h-0'
                  }`}
              >
                <div>
                  <div onClick={() => navigate("/stock-list")} className={` hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a href="/stock-list" className="block ">
                      Stock List
                    </a>
                  </div>

                  <div onClick={() => navigate("/config-new-unit")} className={` hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a className="block ">
                      Configure New Unit
                    </a>
                  </div>

                  <div onClick={() => { setIsDrawerOpen(false); setIsModalOpen(true) }} className={` hover:bg-gray-100 dark:hover:bg-[#343A46] cursor-pointer w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a className="block ">
                      Create Vehicle
                    </a>
                  </div>

                  <div onClick={() => navigate("/unit-status")} className={` hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a className="block ">
                      Unit status
                    </a>
                  </div>

                  <div onClick={() => navigate("/new-shipment")} className={` hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a className="block ">
                      New Shipment
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div onClick={() => navigate("/sms-center")} className={` hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
              <a className="block text-gray-800 dark:text-gray-200">
                SMS Center
              </a>
            </div>

            <div>
              <button
                onClick={() => { toggleSubmenu('Sim Cards'); }}
                className={` flex items-center justify-between w-72 dark:hover:bg-[#343A46] hover:bg-gray-100 mr-4 p-3 rounded-tr-2xl rounded-br-2xl`}
              >
                Sim Cards
                <span>{openSubmenu === 'Sim Cards' ? <IoIosArrowDown /> : <IoIosArrowForward />}</span>
              </button>
              <div
                className={`transition-[max-height] duration-300 overflow-hidden ${openSubmenu === 'Sim Cards' ? 'max-h-64' : 'max-h-0'
                  }`}
              >
                <div>
                  <div onClick={() => navigate("/sim-cards")} className={` hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a className="block ">
                      SIM List
                    </a>
                  </div>

                  <div onClick={() => navigate("/sim-entry")} className={` hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a className="block ">
                      SIM Entry
                    </a>
                  </div>

                  <div onClick={() => { setIsDrawerOpen(false); setsimBatchModal(true) }} className={` hover:bg-gray-100 cursor-pointer dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a className="block ">
                      Create SIM Batch
                    </a>
                  </div>

                  <div onClick={() => { setIsDrawerOpen(false); setattachsimModal(true) }} className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a className="block ">
                      Attach SIM
                    </a>
                  </div>

                  <div onClick={() => { setIsDrawerOpen(false); setdetachsimModal(true) }} className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
                    <a className="block ">
                      Detach SIM
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div onClick={() => navigate("/customer-billing")} className={` hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
              <a className="block text-gray-800 dark:text-gray-200">
                Customer Billing
              </a>
            </div>

            <div onClick={() => navigate("/admin-roles")} className={` hover:bg-gray-100 dark:hover:bg-[#343A46] w-72 p-3 justify-center rounded-tr-2xl rounded-br-2xl`}>
              <a className="block text-gray-800 dark:text-gray-200">
                Admin Roles
              </a>
            </div>
            <div onClick={logout} className='hover:bg-gray-100 w-72 p-3 cursor-pointer dark:hover:bg-[#343A46] justify-center rounded-tr-2xl rounded-br-2xl'>
              <a className="block text-gray-800 dark:text-gray-200">
                Logout
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleDrawer}
        ></div>
      )}
      {isModalOpen === true ? (<CreateVehicle open={isModalOpen} onClose={closeModal} />) : null}
      {simBatchModal === true ? (<CreateSimBatch open={simBatchModal} onClose={closesimbModal} />) : null}
      {attachsimModal === true ? (<AttachSim open={attachsimModal} onClose={closeattachsimModal} />) : null}
      {detachsimModal === true ? (<DetachSim open={detachsimModal} onClose={closedetachsimModal} />) : null}
    </>
  );
};

export default Header;
