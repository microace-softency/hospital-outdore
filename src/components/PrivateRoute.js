import React from "react";
import Layout from "../layouts/Layout";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import LandingPage from "./LandindPage";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute() {
    const { token } = useAuth()
    return token ?  <Outlet/> : <Navigate to="/login"/>
}