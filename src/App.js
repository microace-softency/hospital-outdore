// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GlobalStateProvider } from './context/GlobalStateContext'; // Import the GlobalStateProvider
import Dashboard from './pages/dashboard';
import LoginPage from './pages/login';
import Layout from './layouts/Layout';
import { AuthProvider } from './context/AuthContext';
import MainContent from './layouts/Content';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute';
import Customers from './pages/Patient/Patient';
import Doctor from './pages/Doctor/Doctor';
import Staff from './pages/Staff/Staff';
import Medicine from './pages/Medicine/Medicine';
import Appointments from './pages/Appoinment/Appoinment';
import Admit from './pages/Admit/Admit';
import Payment from './pages/Payment/Payment';
import Checkup from './pages/Checkup/Checkup';
import Location from './pages/location/Location';
import ViewAppoinment from './pages/Appoinment/ViewAppoinment';
import Prescription from './pages/Admit/Prescription';
import Packeg from './pages/packeg/Packeg';
import OutdoreUser from './pages/outdoreuser/OutdoreUser';
import Pathology from './pages/pathology/Pathology';
import Test from './pages/test/Test';
import Product from './pages/product/Product';
import Bed from './pages/bed/Bed';
import Purchase from './pages/purchase/Purchase';
import PurchaseReturn from './pages/purchase/PurchaseReturn';
import PurchasesInventoryIssue from './pages/purchase/PurchasesInventoryIssue';
import CreateCustomer from './components/CreateCustomer';
import DoctorDetailsUpdate from './components/DoctorDetailsUpdate';
import UpdateTest from './components/UpdateTest';
import AppointmentsUpdate from './components/AppoinmentUpdate';
import UpdateLocation from './components/UpdateLocation';
import UpdatePackeg from './components/UpdatePackeg';
import UpdatePathology from './components/UpdatePathology';
import UpdateProduct from './components/UpdateProduct';
import UpdateStaff from './components/UpdateStaff ';
import UpdateBed from './components/UpdateBed';
import UpdateAdmitpatiant from './components/UpdateAdmitpatiant ';
import ViewPurchase from './components/ViewPurchase ';
import Department from './pages/Department/Department';
import UpdateDepartment from './components/UpdateDepartment';
import GroupTest from './pages/test/GroupTest';
import SaleBill from './pages/sale/Bill/SaleBill';
import Sales from './pages/sale/Sales';
import ViewSales from './components/ViewSales';


function App() {

  document.addEventListener('ionBackButton', (ev) => {
    ev.detail.register(10, () => {
      // console.log('Handler was called!');
    });
  });

  return (
    <Router>
      <AuthProvider>
        <ToastContainer />
        <GlobalStateProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
          <Layout>
            <MainContent>
              <Routes>
              <Route path="/" element={<PrivateRoute />} >
                <Route path="/" element={<Dashboard />} />
                <Route path="/patient" element={<Customers />} />
                <Route path="/doctor" element={<Doctor/>} />
                <Route path="/doctor/:id" element={<DoctorDetailsUpdate/>} />
                <Route path="/test" element={<Test/>} />
                <Route path="/test/:id" element={<UpdateTest/>} />
                <Route path="/grouptest" element={<GroupTest/>} />
                <Route path="/staff" element={<Staff/>} />
                <Route path="/staff/:id" element={<UpdateStaff/>} />
                <Route path="/location" element={<Location/>} />
                <Route path="/location/:id" element={<UpdateLocation/>} />
                <Route path="/medicine" element={<Medicine/>} />
                <Route path="/appoinment" element={<Appointments/>} />
                <Route path="/appoinment/:id" element={<AppointmentsUpdate/>} />
                <Route path="/viewappoinment/:id" element={<ViewAppoinment/>} />
                <Route path="/checkup" element={<Checkup/>} />
                <Route path="/admission" element={<Admit/>} />
                <Route path="/admission/:id" element={<UpdateAdmitpatiant/>} />
                <Route path="/patientdetails/:id" element={<Prescription/>} />
                <Route path="/payment" element={<Payment/>} />
                <Route path="/packeg" element={<Packeg/>} />
                <Route path="/packeg/:id" element={<UpdatePackeg/>} />
                <Route path="/createoutdoreuser" element={<OutdoreUser/>} />
                <Route path="/pathology" element={<Pathology/>} />
                <Route path="/pathology/:id" element={<UpdatePathology/>} />
                <Route path="/product" element={<Product/>} />
                <Route path="/product/:id" element={<UpdateProduct/>} />
                <Route path="/bed" element={<Bed/>} />
                <Route path="/bed/:id" element={<UpdateBed/>} />
                <Route path="/department" element={<Department/>} />
                <Route path="/department/:id" element={<UpdateDepartment/>} />
                <Route path="/purchases" element={<Purchase/>} />
                <Route path="/purchases/:id" element={<ViewPurchase />} />
                <Route path="/purchasesreturn" element={<PurchaseReturn/>} />
                <Route path="/Purchaseinventoryissues" element={<PurchasesInventoryIssue/>} />
                <Route path="/sales" element={<Sales/>} />
                <Route path="/sales/:id" element={<ViewSales/>} />
              </Route>
              </Routes>
            </MainContent>
          </Layout>
        </GlobalStateProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
