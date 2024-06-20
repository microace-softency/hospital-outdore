// import Container from "react-bootstrap/Container";
// import Navbar from "react-bootstrap/Navbar";
// import { useGlobalState } from "../context/GlobalStateContext";
// import { TfiMenu } from "react-icons/tfi";
// import { useState, useEffect } from "react";
// import logo from "../assets/logo/HIMS_v4.png";
// import msclogo from "../assets/logo/msc.png";
// import { RxAvatar } from "react-icons/rx";

// function AppNavbar() {
//   const { state, dispatch } = useGlobalState();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   useEffect(() => {
//     setSidebarOpen(state.sidebarOpen);
//   }, [state.sidebarOpen]);

//   const userdetails = JSON.parse(localStorage.getItem("userdetails"));
//   return (
//     <div
//       className={`bg-sky-300  overflow-hidden fixed w-screen h-62 z-1 drop-shadow backdrop-filter backdrop-blur-sm bg-opacity-50 bg-slate-200 ${
//         sidebarOpen ? "md:pl-[250px]" : ""
//       }`}
//     >
//       <Navbar>
//         <Container style={{justifyContent:"end"}}>
//           <div className="flex  items-center text-slate-600 ">
//             <div
//               className={sidebarOpen ? "hidden" : ""}
//               onClick={() => {
//                 dispatch({ type: "TOGGLE_SIDEBAR" });
//               }}
//             >
//               <TfiMenu className=" text-black " />
//             </div>
//             {/* <img className='w-40 h-20 -my-4 pt-2 ps-2' src={logo} alt="Logo" /> */}
//             {/* <div className="w-full px-3 py-3"> */}
//               <div className="flex justify-between items-center">
//                 {/* <p className='font-semibold mb-0 text-slate-100 text-black'>{tenant?.email}</p> */}
//                 <h6 style={{color:"red"}}> Welcome!!</h6>
//                 <br/>
//                 <p className="font-semibold mb-0 text-slate-100 text-black">
//                   Snehangshu
//                 </p>
//                 <div
//                   className="flex items-center"
//                   // onClick={() => NavigateAndToggleSidebar('/user')}
//                 >
//                   <RxAvatar className="w-10 h-10 text-sky-500 rounded-full me-2 drop-shadow hover:bg-sky-50 hover:text-sky-600" />
//                 </div>
//               </div>
//             {/* </div> */}
//           </div>
//           {/* <div className='px-3 fixed w-[250px] bottom-0 flex items-center'>
//         <img src={msclogo} className='w-10' alt='logo' />
//         <span className='ms-2 mt-3'>
//           <small className='text-slate-800'>Developed by</small>
//           <p className='font-semibold text-gray-900'>Microace Software</p>
//         </span>
//       </div> */}
//         </Container>
//       </Navbar>
//     </div>
//   );
// }

// export default AppNavbar;


import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { useGlobalState } from "../context/GlobalStateContext";
import { TfiMenu } from "react-icons/tfi";
import { useState, useEffect } from "react";
import logo from "../assets/logo/HIMS_v4.png";
import msclogo from "../assets/logo/msc.png";
import { RxAvatar } from "react-icons/rx";  
import { useAuth } from "../context/AuthContext";

function AppNavbar() {
  const { username, email } = useAuth()
  const { state, dispatch } = useGlobalState();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [greeting, setGreeting] = useState("");


  useEffect(() => {
    setSidebarOpen(state.sidebarOpen);
  }, [state.sidebarOpen]);
  
  const displayName = username || "Guest"; 
 
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour >= 4 && currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour >= 12 && currentHour < 16) {
      setGreeting("Good Afternoon");
    } else if (currentHour >= 16 && currentHour < 20) {
      setGreeting("Good Evening");
    } else {
      setGreeting("Good Night");
    }
  }, []); 

  return (
    <div
      className={`bg-sky-300 overflow-hidden fixed w-screen h-62 z-1 drop-shadow backdrop-filter backdrop-blur-sm bg-opacity-50 bg-slate-200 ${
        sidebarOpen ? "md:pl-[150px]" : "" 
      }`}
    >
      <Navbar>
        <Container>
          <div
            className={sidebarOpen ? "hidden" : ""} 
            onClick={() => {
              dispatch({ type: "TOGGLE_SIDEBAR" });
            }}
          >
            <TfiMenu className="text-black" />
          </div>
          <div className="flex justify-end items-center w-full gap-2"> 
            <div className="flex gap-2">
              {/* <h6 style={{ color: "red" }}>Welcome </h6> */}
              <h6 style={{ color: "red" }}>{greeting}</h6>
              <h6 className="font-semibold mb-0 text-slate-100 text-black">
                {displayName}
              </h6>
            </div>
            <div className="flex items-center">
              <RxAvatar className="w-10 h-10 text-sky-500 rounded-full me-2 drop-shadow hover:bg-sky-50 hover:text-sky-600" />
            </div>
          </div>
        </Container>
      </Navbar>
    </div>
  );
}

export default AppNavbar;
