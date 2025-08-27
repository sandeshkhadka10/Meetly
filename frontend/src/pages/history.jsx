import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../contexts/AuthContenxt';
import { useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [historyError,setHistoryError] = useState("");
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                if(history.length === 0){
                    setHistoryError("No history for the related user");
                    return;
                }
                setMeetings(history);
            } catch(error){
                console.log(error);
            }
        }
        fetchHistory();
    }, []);

    let formatDate = (dateString) =>{
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2,"0");
        const month = (date.getMonth() + 1).toString().padStart(2,"0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <div>
            <IconButton onClick={() => {
                routeTo("/home")
            }}>
                <HomeIcon />
            </IconButton>
            {<p style={{color:"red"}}>{historyError}</p>}
            {
                (meetings.length !== 0)?meetings.map((e,i) => {
                    return (
                        <>
                            <Card key={i} variant="outlined">
                                <CardContent>
                                    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                        Code:{e.meetingCode}
                                    </Typography>
                                    <Typography variant="body2">
                                        Date:{formatDate(e.date)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </>
                    )
                }):<></>
            }
        </div>
    )
}