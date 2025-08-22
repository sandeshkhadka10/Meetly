import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {AuthContext} from '../contexts/AuthContenxt';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultTheme = createTheme();

export default function Authentication() {
  const [name,setName] = React.useState();
  const [username,setUsername] = React.useState();
  const [password,setPassword] = React.useState();
  const [error,setError] = React.useState();
  
  const [formState,setFormState] = React.useState(0);
  
  const {handleRegister, handleLogin} = React.useContext(AuthContext);

  let handleAuth = async() =>{
    try{
      if(formState === 0){
        let result = await handleLogin(username,password);
        setUsername("");
        setPassword("");
      }
      else if(formState === 1){
        let result = await handleRegister(name,username,password);
        setName("");
        setUsername("");
        setPassword("");
      }
    }catch(error){
      throw error;
    }
  };

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
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            
            <div>
              <Button variant={formState === 0 ? "contained":""} onClick={()=> {setFormState(0)}}>
                Sign In
              </Button>
              <Button variant={formState === 1 ? "contained":""} onClick={()=> {setFormState(1)}}>
                Register
              </Button>
            </div>
            
            <Box component="form" noValidate sx={{ mt: 2, width: '100%' }}>
              {/* <p>{name}</p> */}
              {/* if signup is pressed then display full name */}
              {formState === 1 ? 
              <TextField
                margin="normal"
                required
                fullWidth
                id="Full Name"
                label="Full Name"
                name="username"
                value={name || ""}
                autoFocus
                size="small"
                onChange={(e)=>setName(e.target.value)}
              />
              : <></>}

              {/* if signin is pressed then not displaying full name */}
              {/* <p>{username}</p> */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={username || ""}
                autoFocus
                size="small"
                onChange={(e)=>setUsername(e.target.value)}
              />
              {/* <p>{password}</p> */}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                value={password || ""}
                label="Password"
                type="password"
                id="password"
                size="small"
                onChange={(e)=>setPassword(e.target.value)}
              />

              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" size="small" />}
                label="Remember me"
                sx={{ mt: 1 }}
              /> */}
              
              {/* it is for displaying error message at the signup or signin */}
              <p style={{color:"red"}}>{error}</p>

              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
                onClick={handleAuth}
              >
                {formState === 0 ? "Sign In": "Register" }
              </Button>

              {/* <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Link href="#" variant="body2">
                    Sign Up
                  </Link>
                </Grid>
              </Grid> */}

            </Box>
          </Box>
        </Paper>
        <ToastContainer/>
      </Box>
    </ThemeProvider>
  );
}