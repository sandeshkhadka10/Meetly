import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEnd from "@mui/icons-material/CallEnd";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import Badge from "@mui/material/Badge";
import ChatIcon from "@mui/icons-material/Chat";
import styles from "../styles/videoComponent.module.css";

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
    let [showModal, setModal] = useState(true);
    let [screenAvailable, setScreenAvailable] = useState();
    let [messages, setMessages] = useState([]);
    let [message, setMessage] = useState("");
    let [newMessage, setNewMessage] = useState(3);
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

    // it is called when the browser successfully grants access to the user's camera and microphone
    // and receives the new media stream from the browser
    let getUserMediaSuccess = (stream) => {
        // stops old tracks from window.localStream to prevent multiple media streams from stacking
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) {
            console.log(e);
        }
        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for (let id in connections) {
            // skips sending the stream to yourself
            if (id === socketIdRef.current) continue;

            // adds your new stream to the peer connection so the remote user can see/hear you
            connections[id].addStream(window.localStream)

            // creates an SDP offer
            // sets it as your local description
            // sends it to the peer using Socket.IO, so the peer can respond with an SDP answer
            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }));
                    })
                    .catch(e => console.log(e));
            })
        }

        // it runs when the user disables camera or mic, or stops screen sharing
        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false)
            setAudio(false)

            // tries to stop any remaining tracks from the video element to fully clean up the media stream
            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop())
            } catch (e) {
                console.log(e);
            }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            localVideoRef.current.srcObject = window.localStream;

            for (let id in connections) {
                connections[id].addStream(window.localStream)
                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                        }).catch((e) => {
                            console.log(e);
                        })
                })
            }
        })
    }

    // these function creates the silent audio track
    let silence = () => {
        // it is used to manage and play audio in web applications
        let ctx = new AudioContext()

        // creates an OscillatorNode, which generates a periodic waveform
        // it is a source of audio signals
        let oscillator = ctx.createOscillator();

        // 1. ctx.createMediaStreamDestination(): Creates a MediaStreamAudioDestinationNode which can be used to capture audio output into a MediaStream.
        // 2. oscillator.connect(...): Connects the oscillator to this destination node.
        let dst = oscillator.connect(ctx.createMediaStreamDestination());

        oscillator.start();
        ctx.resume()

        // dst.stream.getAudioTracks()[0]: gets the first audio track from the MediaStream produced by the destination node
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }

    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height });
        canvas.getContext('2d').fillRect(0, 0, width, height);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled: false });
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

            } catch (e) {
                console.log(e);
            }
        }
    }
    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    }, [audio, video])

    let gotMessageFromServer = (fromId, message) => {
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
                                socketRef.current.emit("signal", fromId, JSON.stringify({ "sdp": connections[fromId].localDescription }
                                ))
                            }).catch(e => console.log(e));
                        }).catch(e => console.log(e));
                    }

                }).catch(e => console.log(e));
            }

            // check if whether the received signal object cotains an ice property
            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e));
            }
        }

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
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
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
                            setVideos(videos => {
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
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
                        window.localStream = blackSilence();
                        connections[socketListId].addStream(window.localStream);
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
        connectToSocketServer();
    }

    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }

    // This is useful for turning the camera on/off
    let handleVideo = () => {
        setVideo(!video);
    }

    // This is useful for turning the audio on/off
    let handleAudio = () => {
        setAudio(!audio);
    }

    let getDisplayMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop());
        } catch (e) {
            console.log(e);
        }
        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            connections[id].addStream(window.localStream);
            connections[id].createOffer().then((description) => [
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }));
                    })
                    .catch((e) => {
                        console.log(e);
                    })
            ])
        }
        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false);

            // tries to stop any remaining tracks from the video element to fully clean up the media stream
            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop())
            } catch (e) {
                console.log(e);
            }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            localVideoRef.current.srcObject = window.localStream;

            getUserMedia();
        })
    }

    let getDisplayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDisplayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => {
                        console.log(e);
                    })
            }
        }
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDisplayMedia();
        }
    }, [screen])

    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleMessage = () => {
        setModal(!showModal);
    }

    return (
        <div>
            {askForUsername ? (
                <div>
                    <h2>Enter into lobby</h2>
                    <TextField
                        id="outlined-basic"
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        variant="outlined"
                    />
                    <Button variant="contained" onClick={connect}>
                        Connect
                    </Button>
                    <div>
                        <video ref={localVideoRef} autoPlay muted playsInline></video>
                    </div>
                </div>
            ) : (
                <div className={styles.meetVideoContainer} style={{ background: "black" }}>
                    <div className={styles.buttonContainers}>
                        <IconButton onClick={handleVideo} style={{ color: "white" }}>
                            {video === true ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>

                        <IconButton style={{ color: "red" }}>
                            <CallEnd />
                        </IconButton>

                        <IconButton onClick={handleAudio} style={{ color: "white" }}>
                            {audio === true ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>

                        {screenAvailable === true ?
                            <IconButton onClick={handleScreen} style={{ color: "white" }}>
                                {screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton> : <></>
                        }

                        <Badge badgeContent={newMessage} max={999} color="secondary">
                            <IconButton onClick={handleMessage} style={{ color: "white" }}>
                                <ChatIcon />
                            </IconButton>
                        </Badge>
                    </div>

                    {/* Local video */}
                    <video className={styles.meetUserVideo} ref={localVideoRef} autoPlay muted playsInline></video>

                    {/* Remote videos */}
                    <div className={styles.conferenceView}>
                        {showModal ? <div className={styles.chatRoom}>
                            <div className={styles.chatContainer}>
                                <h1>Chat</h1>
                                <div className={styles.chattingArea}>
                                    <TextField id="outlined-basic" label="Enter your chat" variant="outlined" />
                                    <Button variant="contained">Send</Button>
                                </div>
                            </div>

                        </div> : <></>}

                        {videos.map((video) => (
                            <div key={video.socketId}>
                                <video
                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                >
                                </video>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

