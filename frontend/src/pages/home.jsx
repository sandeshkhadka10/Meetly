import React,{useState} from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import RestoreIcon from '@mui/icons-material/Restore';

function HomeComponent(){
    let navigate = useNavigate();

    const [meetingCode,setMeetingCode] = useState("");

    let handleJoinVideoCall = async () =>{
        navigate(`/${meetingCode}`);
    }

    return(
        <div>
            <div className="navBar">
                <div style={{display:"flex"}}>
                    <h3>Meetly</h3>
                </div>
                <div style={{display:"flex",alignItems:"center"}}>
                    <IconButton>
                        <RestoreIcon/>
                        <p style={{fontSize:"18px"}}>History</p>
                    </IconButton>
                    <Button onClick={()=>{
                        localStorage.removeItem("token")
                        navigate("/auth")
                    }}>
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    )
}

// so WrappedComponent renders these components
export default withAuth(HomeComponent);