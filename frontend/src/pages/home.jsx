import React,{useState} from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
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
                    <h2>Meetly</h2>
                </div>
                <div style={{display:"flex",alignItems:"center"}}>
                    <IconButton>
                        <RestoreIcon/>
                        <p style={{fontSize:"1rem"}}>History</p>
                    </IconButton>
                    <Button onClick={()=>{
                        localStorage.removeItem("token")
                        navigate("/auth")
                    }}>
                        <p>Logout</p>
                    </Button>
                </div>
            </div>
            <div className="meetContainer">
                <div className="leftPanel">
                    <div>
                        <h2>Providing Quality Video Call Just Like Quality Education</h2>
                        <div style={{display:"flex",gap:"10px"}}>
                            <TextField onChange={e => setMeetingCode(e.target.value)} id="outlined-basic" label="Outlined" variant="outlined" />
                            <Button onClick={handleJoinVideoCall} variant="contained">Join</Button>
                        </div>
                    </div>
                </div>
                <div className="rightPanel">
                    <img src="/singleMobile.png" alt=""/>
                </div>
            </div>
        </div>
    )
}

// so WrappedComponent renders these components
export default withAuth(HomeComponent);