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

const defaultTheme = createTheme();

export default function Authentication() {
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
            
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            
            <Box component="form" noValidate sx={{ mt: 2, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                size="small"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                size="small"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" size="small" />}
                label="Remember me"
                sx={{ mt: 1 }}
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
              >
                Sign In
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
      </Box>
    </ThemeProvider>
  );
}