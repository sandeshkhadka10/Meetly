import React, { useState,useRef,useEffect } from "react";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";

const server_url = "http://localhost:8000";

var connections={};

const peerConfigConnections = {
    "iceServers":[
        {"urls":"stun:stun.l.google.com:19302"}
    ]
}

export default function VideoMeetComponent(){
    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoRef = useRef();

    let [videoAvailable,setVideoAvailable] = useState(true);
    let [audioAvailable,setAudioAvailable] = useState(true);
    let [video,setVideo] = useState();
    let [audio,setAudio] = useState();
    let [screen,setScreen] = useState();
    let [showModal, setModal] = useState();
    let [screenAvailable, setScreenAvailable] = useState();
    let [messages,setMessages] = useState([]);
    let [message,setMessage] = useState("");
    let [newMessage,setNewMessage] = useState(0);
    let [askForUsername,setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");

    const videoRef = useRef([]);

    let [videos,setVideos] = useState([]);

    const getPermissions = async()=>{
        try{
            const videoPermission = await navigator.mediaDevices.getUserMedia({video:true});
            if(videoPermission){
                setVideoAvailable(true);
            }else{
                setVideoAvailable(false);
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({video:true});
            if(audioPermission){
                setAudioAvailable(true);
            }else{
                setAudioAvailable(false);
            }
            
        }catch(error){

        }
    }

    // if(isChrome() === false){

    // }

    useEffect(()=>{
        getPermissions();
    },[])

    return(
        <div>
            {/* main video features */}
            {askForUsername === true ? 
            <div>
              <h2>Enter into lobby</h2>
              {username}
              <TextField id="outlined-basic" label="Username" value={username} onChange={(e)=>setUsername(e.target.value)} variant="outlined" />
              <Button variant="contained">Connect</Button>
              <div>
                <video ref={localVideoRef}autoPlay muted></video>
              </div>

            </div>:<></>}
        </div>
    )
}