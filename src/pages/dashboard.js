import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import MyCalendar from '../components/MyCalendar';
import axios from 'axios';
import { FaUserDoctor } from "react-icons/fa6";



function Dashboard() {
  const { company } = useAuth()
  useEffect(() => {
    // console.log('712201', company);
  },[company])
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [doctorData, setDoctorData] = useState([]);
  const [StaffsData, setStaffsData] = useState([]);
  const [PatientsData, setPatientsData] = useState([]);
  const [error, setError] = useState([]);


  const DoctorDataLoad = async () => {
    try {
      const response = await axios.get("http://localhost:8005/api/doctor");
      setDoctorData(response.data[0]);
    } catch (error) {
      setError(error.message);
    }
  }

  const StaffDataLoad = async () => {
    try {
      const response = await axios.get("http://localhost:8005/api/staff");
      setStaffsData(response.data[0]);
    } catch (error) {
      setError(error.message);
    }
  };

  const PatientDataLoad = async () => {
    try {
      const admissionResponse = await axios.get(
        "http://localhost:8005/api/admission"
      );
      setPatientsData(admissionResponse.data[0]);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    DoctorDataLoad();
    StaffDataLoad();
    PatientDataLoad()
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleAddToHomeScreen = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="container min-h-screen p-4">
      {/* <div className='px-3 fixed w-[250px] bottom-0 flex items-center'>
        <img src={msclogo} className='w-10' alt='logo' />
        <span className='ms-2 mt-3'>
          <small className='text-slate-800'>Developed by</small>
          <p className='font-semibold text-gray-900'>Microace Software</p>
        </span>
      </div> */}
      {deferredPrompt && (
        <>
        <div className="fixed bottom-0 right-0 p-4">
          <button onClick={handleAddToHomeScreen} className="bg-blue-500 text-white p-2 rounded">
            Add to Home Screen
          </button>
        </div>
      </>
      )}
      <div className='flex items-center justify-start w-full h-full'>
        {/* <p className='text-[30px] text-slate-600 font-bold'> {company?.CName || 'Welcome'}</p> */}
      </div>
      <Row className='pt-4'>
        <Col sm={6} md={6} lg={3} xl={3} className=''>
          <div className='rounded-xl bg-sky-50 drop-shadow sm:w-60 mx-auto h-max my-1'>
            <div className='w-full mx-auto flex items-center around justify-between px-4'>
              <p className='text-xl font-semibold'>Doctors</p>
              <p className='text-[30px] font-bold text-green-700 text-right'>{doctorData.length}</p>
            </div>
          </div>
        </Col>
        <Col sm={6} md={6} lg={3} xl={3} className=''>
          <div className='rounded-xl bg-sky-50 drop-shadow sm:w-60 mx-auto h-max my-1'>
            <div className='w-full mx-auto flex items-center around justify-between px-4'>
              <p className='text-xl font-semibold'>Staffs</p>
              <p className='text-[30px] font-bold text-sky-700 text-right'>{StaffsData.length}</p>
            </div>
          </div>
        </Col>
        <Col  sm={6} md={6} lg={3} xl={3} className=''>
          <div className='rounded-xl bg-sky-50 drop-shadow sm:w-60 mx-auto h-max my-1'>
            <div className='w-full mx-auto flex items-center around justify-between px-4'>
              <p className='text-xl font-semibold'>Patients</p>
              <p className='text-[30px] font-bold text-yellow-700 text-right'>{PatientsData.length}</p>
            </div>
          </div>
        </Col>
        <Col  sm={6} md={6} lg={3} xl={3} className=''>
          <MyCalendar/>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
