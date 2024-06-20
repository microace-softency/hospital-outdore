import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { IoSettingsSharp } from "react-icons/io5";
import { BiSolidDashboard } from "react-icons/bi";
import { RxAvatar } from "react-icons/rx";
import { BsClipboard2DataFill } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { useGlobalState } from "../context/GlobalStateContext";
import { FaUserDoctor } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import { GiMedicines } from "react-icons/gi";
import { IoPerson } from "react-icons/io5";
import { GrUserWorker } from "react-icons/gr";
import { FaLocationDot } from "react-icons/fa6";
import { FaFemale } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { BsCalendar2PlusFill } from "react-icons/bs";
import { FaWallet } from "react-icons/fa";
import { toast } from "react-toastify";
import { GetCollection, collections } from "../config";
// import logo from '../assets/logo/msc.png';
import { GiMicroscope } from "react-icons/gi";
import { LuTestTube2 } from "react-icons/lu";
import { FaHospitalUser } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { GiHospitalCross } from "react-icons/gi";
import { BiPurchaseTag } from "react-icons/bi";
import { GiReturnArrow } from "react-icons/gi";
import { MdInventory } from "react-icons/md";
import { FaBedPulse } from "react-icons/fa6";
import logo from "../assets/logo/HIMS_v4.png";
import Companylogo from "../assets/logo/msc.png";
import { TfiMenu } from "react-icons/tfi";
import { FcDepartment } from "react-icons/fc";
import { LuTestTubes } from "react-icons/lu";
import { CiShoppingTag } from "react-icons/ci";





function Sidebar() {
  const { user, tenant } = useAuth();
  const isAdmin = tenant?.role === "ADMIN" ? true : false;
  const { state, dispatch } = useGlobalState();
  const navigate = useNavigate();
  const location = useLocation();
  const [masterMenuOpen, setMasterMenuOpen] = useState(false);
  const [salesEntryOpen, setSalesEntryOpen] = useState(false);
  const [purchaseEntryOpen, setPurchaseEntryOpen] = useState(false);
  const [reportMenuOpen, setReportMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const windowWidth = window.innerWidth;
  const { logout, signOut } = useAuth();

  console.log("user", tenant);
  useEffect(() => {
    setSidebarOpen(state.sidebarOpen);
  }, [state.sidebarOpen]);

  const toggleMasterMenu = () => {
    setMasterMenuOpen(!masterMenuOpen);
  };
  const togglePuechaseMenu = () => {
    setPurchaseEntryOpen(!purchaseEntryOpen);
  };

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  const closeSidebarOutsideClick = (e) => {
    if (sidebarOpen && !e.target.closest(".sidebar")) {
      dispatch({ type: "TOGGLE_SIDEBAR" });
    }
  };
  const NavigateAndToggleSidebar = (path) => {
    navigate(path);
    if (windowWidth < 768) {
      dispatch({ type: "TOGGLE_SIDEBAR" });
    }
  };

  useEffect(() => {
    if (sidebarOpen && windowWidth < 768) {
      document.addEventListener("click", closeSidebarOutsideClick);
      document.addEventListener("touchstart", closeSidebarOutsideClick);
    }

    return () => {
      document.removeEventListener("click", closeSidebarOutsideClick);
      document.removeEventListener("touchstart", closeSidebarOutsideClick);
    };
  }, [sidebarOpen, dispatch]);

  return (
    <aside
      className={`overflow-hidden shadow flex flex-col bg-sky-300 sidebar text-black font-semibold h-full fixed transition ease-in-out duration-200 z-2 w-[250px] backdrop-filter backdrop-blur-sm bg-opacity-50 bg-slate-300 ${
        sidebarOpen ? "" : "-translate-x-full"
      }`}
    >
      <div className="">
        {/* avatar and close button */}
        {/* <div className='w-full px-3 py-3'>
          <div className='flex justify-between items-center'>
            <div
              className='flex items-center'
              onClick={() => NavigateAndToggleSidebar('/user')}>
              <RxAvatar className='w-10 h-10 text-sky-500 rounded-full me-2 drop-shadow hover:bg-sky-50 hover:text-sky-600' />
            </div>
            <p className='font-semibold mb-0 text-slate-100 text-black'>{tenant?.email}</p>
            <AiOutlineClose
              className='w-6 h-6'
              onClick={() => {
                dispatch({ type: 'TOGGLE_SIDEBAR' });
              }}
            />
          </div>
        </div> */}
        <div className="flex items-center text-slate-600 gap-5">
          <div
            className={sidebarOpen ? "hidden" : ""}
            onClick={() => {
              dispatch({ type: "TOGGLE_SIDEBAR" });
            }}
          >
            <TfiMenu className=" text-black " />
          </div>
          <img className="w-40 h-20 -my-4 pt-2 ps-2" src={logo} alt="Logo" />
          <AiOutlineClose
            className="w-6 h-6"
            onClick={() => {
              dispatch({ type: "TOGGLE_SIDEBAR" });
            }}
          />
        </div>
        <hr />
        <div className="max-h-[72vh] overflow-y-auto">
          <div
            onClick={() => {
              NavigateAndToggleSidebar("/");
            }}
            className={`${
              location.pathname === "/"
                ? "bg-sky-50 text-sky-600"
                : "bg-sky-300"
            } flex items-center py-2 hover:bg-sky-50 hover:text-sky-600  text-sky-50 mx-2 my-2 bg-sky-400 rounded cursor-pointer  drop-shadow`}
          >
            <BiSolidDashboard className="h-8 w-8 mx-3 -my-2" />
            <p className="no-underline text-black font-semibold text-lg m-0">
              Dashboard
            </p>
          </div>
          <div
            onClick={() => {
              NavigateAndToggleSidebar("/appoinment");
            }}
            className={`${
              location.pathname === "/appoinment"
                ? "bg-sky-50 text-sky-600"
                : "bg-sky-300"
            } flex items-center py-2 hover:bg-sky-50 hover:text-sky-600  text-sky-50 mx-2 my-2 bg-sky-400 rounded cursor-pointer  drop-shadow`}
          >
            <BsCalendar2PlusFill className="h-5 w-5 mx-4" />
            <p className="no-underline text-black font-semibold text-lg m-0">
              Registation
            </p>
          </div>
          {/* <div
            onClick={() => { NavigateAndToggleSidebar('/admit') }}
            className={`${location.pathname === '/admit' ? 'bg-sky-50 text-sky-600' : 'bg-sky-300' 
              } flex items-center py-2 hover:bg-sky-50 hover:text-sky-600  text-sky-50 mx-2 my-2 bg-sky-400 rounded cursor-pointer  drop-shadow`}
          >
            <BsCalendar2PlusFill className='h-5 w-5 mx-4' />
            <p className="no-underline text-black font-semibold text-lg m-0">
              Doctor 
            </p>
          </div> */}
          {/* <div
            onClick={() => {
              NavigateAndToggleSidebar("/admission");
            }}
            className={`${
              location.pathname === "/admission"
                ? "bg-sky-50 text-sky-600"
                : "bg-sky-300"
            } flex items-center py-2 hover:bg-sky-50 hover:text-sky-600  text-sky-50 mx-2 my-2 bg-sky-400 rounded cursor-pointer  drop-shadow`}
          >
            <FaBedPulse className="h-5 w-5 mx-4" />
            <p className="no-underline text-black font-semibold text-lg m-0">
              Admission
            </p>
          </div> */}
          <div
            onClick={() => {
              NavigateAndToggleSidebar("/vendor");
            }}
            className={`${
              location.pathname === "/vendor"
                ? "bg-sky-50 text-sky-600"
                : "bg-sky-300"
            } flex items-center py-2 hover:bg-sky-50 hover:text-sky-600  text-sky-50 mx-2 my-2 bg-sky-400 rounded cursor-pointer  drop-shadow`}
          >
            <IoSettingsSharp className="h-5 w-5 mx-4" />
            <p className="no-underline text-black font-semibold text-lg m-0">
              Settings
            </p>
          </div>
        </div>
      </div>
      <div
        onClick={handleLogout}
        className="flex justify-around items-center mt-auto mx-auto h-5 border-2 bg-sky-600 border-sky-600 py-1 h-max w-2/3 rounded-md mb-24 hover:bg-sky-500  hover:text-sky-600  text-sky-50shadow cursor-pointer"
      >
          <p className="no-underline text-white font-semibold text-lg m-0">
            Logout
          </p>
          <MdLogout className="h-5 w-5 text-white" />
        </div>
      <div className='px-3 fixed w-[250px] bottom-0 flex items-center'>
        <img src={Companylogo} className='w-10' alt='Companylogo' />
        <span className='ms-2 mt-3'>
          <small className='text-slate-800'>Developed by</small>
          <p className='font-semibold text-gray-900'>Microace Software</p>
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;
