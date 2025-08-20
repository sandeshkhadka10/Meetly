import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import httpStatus from "http-status";

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: "http://localhost:8000/api/v1/users",
    withCredentials:true
});

export const AuthProvider = ({ children }) => {
    const authContext = useContext(AuthContext);

    const [userData, setUserData] = useState(authContext);

    const router = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {
            let request = await client.post("/register", {
                name: name,
                username: username,
                password: password
            });
            if (request.status === httpStatus.CREATED) {
                return request.data.message;
            }
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    const handleLogin = async (username, password) => {
        try {
            let request = await client.post("/login", {
                username: username,
                password: password
            });
            if (request.status === httpStatus.CREATED) {
                setUserData({username});
                router("/home");
            }

        } catch (error) {
            throw error.response?.data || error;
        }
    }

    const handleLogout = async()=>{
        try{
            let request = await client.get("/logout");
            if(request.status === httpStatus.CREATED){
                setUserData(null);
                router("/");
            }
        }catch(error){
             throw error.response?.data || error;
        }

    }

    const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                meeting_code: meetingCode
            });
            return request.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    const getHistoryOfUser = async () => {
        try {
            let request = await client.get("/get_all_activity");
            return request.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    const data = {
        userData, setUserData, handleRegister, handleLogin, handleLogout, addToUserHistory, getHistoryOfUser
    }
    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}