// import React,{useState, useEffect,useContext} from "react";
// import {AuthContext} from '../contexts/AuthContenxt';
// import { useNavigate } from "react-router-dom";
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';

// export default function History(){
//     const {getHistoryOfUser} = useContext(AuthContext);
//     const [meetings,setMeetings] = useState([]);
//     const routeTo = useNavigate();

//     useEffect(()=>{
//         const fetchHistory = async ()=>{
//             try{
//                 const history = await getHistoryOfUser();
//                 setMeetings(history);
//             }catch{
//                 // implement SnackBar
//             }
//         }
//         fetchHistory();
//     },[]);

//     return(
//         <div>
//            {
//             meetings.map(e=>{
//                 return(
//                     <>
//                       <Card variant="outlined">{card}</Card>
//                     </>
//                 )
//             })
//            }
//         </div>
//     )
// }