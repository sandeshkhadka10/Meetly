import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";

const server_url = "http://localhost:8000";

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {
    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoRef = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState([]);
    let [audio, setAudio] = useState();
    let [screen, setScreen] = useState();
    let [showModal, setModal] = useState();
    let [screenAvailable, setScreenAvailable] = useState();
    let [messages, setMessages] = useState([]);
    let [message, setMessage] = useState("");
    let [newMessage, setNewMessage] = useState(0);
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");

    const videoRef = useRef([]);

    let [videos, setVideos] = useState([]);

    const getPermissions = async () => {
        try {
            // asking video permission
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
            } else {
                setVideoAvailable(false);
            }

            // asking audio permission
            const audioPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (audioPermission) {
                setAudioAvailable(true);
            } else {
                setAudioAvailable(false);
            }

            // asking screen share permission
            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            // if both video and audio is availabe
            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });

                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = userMediaStream;
                    }
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    // if(isChrome() === false){

    // }

    useEffect(() => {
        getPermissions();
    }, [])

    let getUserMediaSuccess = (stream) => {
        var signal = JSON.parse(message);
        // checks whether the signaling message is not from yourself
        // fromId is assumedd to be the ID of the peer who sent the signal
        if (fromId !== socketIdRef.current) {
            // checks whether the signal object contains SDP which is required for WebRTC negitiation
            if (signal.sdp) {
                // Sets the remote peer’s SDP (offer/answer) as the remote description on your RTCPeerConnection
                // RTCSessionDescription wraps the SDP object to make it usable.
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    // If the received SDP is an offer, your side must respond with an answer.
                    if (signal.sdp.type === "offer") {
                        // Creates an SDP answer to the offer using the WebRTC API.
                        connections[fromId].createAnswer().then((description) => {
                            // After creating the answer, you set it as your local description, which means "I’m ready to communicate with this config."
                            connections[fromId].setLocalDescription(description).then(() => {
                                // Sends the local description (your answer) back to the original peer (fromId) using the signal event.
                                socketIdRef.current.emit("signal", fromId, JSON.stringify({ "sdp": connections[fromId].localDescription }
                                ))
                            })
                        })
                    }

                })
            }
        }
    }

    // it's job is to request camera/mic stream from the
    // browser, or stop the stream if not needed.
    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            // if the required video/audio isn't available,
            // it will stop the current stream
            try {

                // gets all tracks(video/audio) from the current media stream in the <video> element.
                let tracks = localVideoRef.current.srcObject.getTracks();

                // loops over them and stops each track(camera/mic)
                tracks.forEach(track => track.stop())

            } catch (error) {

            }
        }
    }
    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    }, [audio, video])

    let gotMessageFromServer = (fromId, message) => {

    }

    let addMessage = () => {

    }

    // it's responsbile for initalizing socket connections and
    // managing the WebRTC peer connections and signaling
    let connectToSocketServer = () => {

        // connects the client to the Socket.IO server using the server_url
        socketRef.current = io.connect(server_url, { secure: false });

        // handles signal events from server and these messages typically include
        // WebRTC signaling data like SDP offers/answers or ICE candidates.
        socketRef.current.on('signal', gotMessageFromServer);

        // it executes when the client successfully connects to the socket server
        socketRef.current.on("connect", () => {

            // This is used to group users into the same room for video calls
            socketRef.current.emit("join-call", window.location.href);

            // saves the client's socket Id into a reference for later identifications
            socketIdRef.current = socketRef.current.id;

            // handles incoming chat message
            socketRef.current.on("chat-message", addMessage);

            // handle user leaving
            socketRef.current.on("user-left", (id) => {
                setVideo((videos) => videos.filter((video) => video.socketId !== id))
            })

            // handles user joining
            socketRef.current.on("user-joined", (id, clients) => {

                // loops through all client socket IDs and creates a peer connection for each.
                clients.forEach((socketListId) => {
                    // it creates a new WebRTC peer connection and stores it in a connections object with
                    // their socket ID as the key
                    // peerConfigConnections typically includes ICE server configurations(STUN)
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

                    // when a new ICE candidate(connection path info) is found, it's send to the peer via the
                    // socket using the signal event
                    connections[socketListId].onicecandidate = (event) => {
                        if (event.candidate != null) {
                            socketRef.current.emit("signal", socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // trigger when the remote stream is received
                    connections[socketListId].onaddstream = (event) => {
                        // checks if the video stream for that socket ID already exists
                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        // if the video stream already exists, update it with the new stream
                        if (videoExists) {
                            setVideo(videos => {
                                const updateVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updateVideos;
                                return updateVideos;
                            })
                        } else {
                            // if the video stream does not exist, add it as a new entry to videos state
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoPlay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };

                    // if your local video/audio stream is available, add it to the peer conncetion
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream);
                    } else {
                        // let blackSlience
                    }
                })

                // checks if the newly joined user is me
                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        // if id2 is me then skip
                        if (id2 === socketIdRef.current) continue
                        try {
                            // otherwise add local stream to each other peer connection
                            connections[id2].addStream(window.localStream)
                        } catch (error) { }

                        // creates an SDP offer
                        // set it as the local description
                        // send it to the corresponding peer via signal event.
                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit("signal", id2, JSON.stringify({ "sdp": connections[id2].localDescription }))
                                })
                                .catch((error) => {
                                    console.log(error);
                                })
                        })
                    }
                }
            })
        })
    }

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        // connectToSocketServer();
    }

    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }

    return (
        <div>
            {/* main video features */}
            {askForUsername === true ?
                <div>
                    <h2>Enter into lobby</h2>
                    {/* {username} */}
                    <TextField id="outlined-basic" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} variant="outlined" />
                    <Button variant="contained" onClick={connect}>Connect</Button>
                    <div>
                        <video ref={localVideoRef} autoPlay muted></video>
                    </div>

                </div> : <></>}
        </div>
    )
}