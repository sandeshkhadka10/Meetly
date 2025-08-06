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
            // asking video permission
            const videoPermission = await navigator.mediaDevices.getUserMedia({video:true});
            if(videoPermission){
                setVideoAvailable(true);
            }else{
                setVideoAvailable(false);
            }
            
            // asking audio permission
            const audioPermission = await navigator.mediaDevices.getUserMedia({video:true});
            if(audioPermission){
                setAudioAvailable(true);
            }else{
                setAudioAvailable(false);
            }
            
            // asking screen share permission
            if(navigator.mediaDevices.getDisplayMedia){
                setScreenAvailable(true);
            }else{
                setScreenAvailable(false);
            }
            
            // if both video and audio is availabe
            if(videoAvailable || audioAvailable){
                const userMediaStream = await navigator.mediaDevices.getUserMedia({video: videoAvailable, audio: audioAvailable});
        
                if(userMediaStream){
                    window.localStream = userMediaStream;
                    if(localVideoRef.current){
                        localVideoRef.current.srcObject = userMediaStream;
                    }
                }
            }
            
        }catch(error){
            console.log(error);
        }
    }

    // if(isChrome() === false){

    // }

    useEffect(()=>{
        getPermissions();
    },[])

    let getUserMediaSuccess = (stream) => {

    }

    // it's job is to request camera/mic stream from the
    // browser, or stop the stream if not needed.
    let getUserMedia = () =>{
        if((video && videoAvailable) || (audio && audioAvailable)){
            navigator.mediaDevices.getUserMedia({video: video, audio: audio})
            .then(getUserMediaSuccess) // Todo: getUserMediaSuccess
            .then((stream)=>{})
            .catch((e)=>console.log(e))
        }else{
            // if the required video/audio isn't available,
            // it will stop the current stream
            try{

                // gets all tracks(video/audio) from the current media stream in the <video> element.
                let tracks = localVideoRef.current.srcObject.getTracks();

                // loops over them and stops each track(camera/mic)
                tracks.forEach(track => track.stop())
                
            }catch(error){

            }
        }
    }
    useEffect(() =>{
        if(video !== undefined && audio !== undefined){
            getUserMedia();
        }
    },[audio,video])

    let getMedia = () =>{
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        // connectToSocketServer();
    }

    let connect = () =>{
        setAskForUsername(false);
        getMedia();
    }

    return(
        <div>
            {/* main video features */}
            {askForUsername === true ? 
            <div>
              <h2>Enter into lobby</h2>
              {username}
              <TextField id="outlined-basic" label="Username" value={username} onChange={(e)=>setUsername(e.target.value)} variant="outlined" />
              <Button variant="contained" onClick={connect}>Connect</Button>
              <div>
                <video ref={localVideoRef}autoPlay muted></video>
              </div>

            </div>:<></>}
        </div>
    )
}