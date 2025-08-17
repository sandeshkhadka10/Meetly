import {Server} from "socket.io";

let connections={}
let messages={}
let timeOnline={}

export const connectToSocket = (server)=>{
    const io = new Server(server,{
        // here we are merging socket with express server and it is for testing purpose only i.e not for production
        cors:{
            origin:"*",
            methods:["GET","POST"],
            allowedHeaders:["*"],
            credentials:true
        }
    });
  
    io.on("connection",(socket)=>{
        console.log("Something connected");

        // join call or you can input any name you want
        socket.on("join-call",(path)=>{
            if(connections[path] === undefined){
                connections[path] = [];
            }

            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();

            // notify exisiting users that a new user joined
            for(let a = 0; a < connections[path].length; a++){
                io.to(connections[path][a]).emit("user-joined",socket.id,connections[path]);
            }

            if(messages[path] !== undefined){
                for(let a = 0; a < messages[path].length; ++a){
                    // send chat history to the newly joined user
                    io.to(socket.id).emit("chat-message",messages[path][a]['data'],
                        messages[path][a]['sender'],messages[path][a]['socket-id-sender']
                    )
                }
            }
        });

        socket.on("signal",(toId,message)=>{
            // send chat history to the newly joined user
            io.to(toId).emit("signal",socket.id,message);
        });

        socket.on("chat-message",(data,sender)=>{
            // the main work of reduce here is to find the room name where the current socket is located.
            const [matchingRoom, found] = Object.entries(connections)
            .reduce(([room, isFound],[roomKey, roomValue]) =>{
                if(!isFound && roomValue.includes(socket.id)){
                    return [roomKey, true];
                }
                return [room, isFound];
            },['',false]);
            
            // if matching room is found then only processed
            if(found === true){
                if(messages[matchingRoom] === undefined){
                    messages[matchingRoom] = [];
                }
                messages[matchingRoom].push({"sender":sender, "data":data, "socket-id-sender":socket.id});
                console.log("message",matchingRoom,":",sender,data);

                connections[matchingRoom].forEach((elem)=>{
                    io.to(elem).emit("chat-message",data,sender,socket.id);
                })
            }
        });

        // to handle cleanup and notify others when a user disconnects and it runs automatically
        socket.on("disconnect",()=>{
            var diffTime = Math.abs(timeOnline[socket.id] - new Date());
            
            // declares a variable to store the room name that this socket belonged to
            var key;
            
            // key and value extract garera teslai check gareko
            for(const[k,v] of JSON.parse(JSON.stringify(Object.entries(connections)))){
                for(let a = 0; a < v.length; ++a){
                    if(v[a] === socket.id){
                        key = k;
                        
                        // tells every user in that room that the user has left
                        for(let a = 0; a < connections[key].length; ++a){
                            io.to(connections[key][a]).emit("user-left",socket.id);
                        }
                        
                        // find the position of the socket in the room list and remove using splice
                        var index = connections[key].indexOf(socket.id);
                        connections[key].splice(index,1);

                        if(connections[key].length === 0){
                            delete connections[key];
                        }
                    }
                }
            }
        });
    });

    return io;
}