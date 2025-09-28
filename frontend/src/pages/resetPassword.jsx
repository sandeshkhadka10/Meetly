import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContenxt';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultTheme = createTheme();

export default function ForgetPassword(){
    const [email,setEmail] = React.useState();
    const [resetCode,setResetCode] = React.useState();
    const [newPassword,setNewPassword] = React.useState();
    const [emailError,setEmailError] = React.useState();
    
    const {handleForgetPassword} = React.useContext(AuthContext);

    let handleForgetPasswordAuth = async()=>{
        try{
            if(!email){
                setEmailError("Email is required");
                return;
            }
            setEmailError("");

            let result = await handleForgetPassword(email);
            setEmail("");

        }catch(error){
            throw error;
        }
    }

    return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <CssBaseline />

        <Paper
          elevation={8}
          sx={{
            p: 4,
            maxWidth: 400,
            width: '100%',
            mx: 2,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            
            <h2>Verify Email</h2>
            
            <Box component="form" noValidate sx={{ mt: 2, width: '100%' }}>
              
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  value={email || ""}
                  autoFocus
                  size="small"
                  onChange={(e) => setEmail(e.target.value)}
                />
            
              <p style={{ color: "red" }}>{emailError}</p>

              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
                onClick={handleForgetPasswordAuth}
              >
                Send Reset Code
              </Button>

    
            </Box>
          </Box>
        </Paper>
        <ToastContainer />
      </Box>
    </ThemeProvider>
  );
}