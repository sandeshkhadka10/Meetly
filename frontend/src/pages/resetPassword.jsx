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

export default function ForgetPassword() {
    const [email, setEmail] = React.useState();
    const [resetCode, setResetCode] = React.useState();
    const [newPassword, setNewPassword] = React.useState();
    const [resetError, setResetError] = React.useState();

    const { handleResetPassword } = React.useContext(AuthContext);

    let handleResetPasswordAuth = async () => {
        try {
            if (!email && !resetCode && !newPassword) {
                setResetError("Email, Reset Code and New Password are required");
                return;
            } else if (!email && !resetCode) {
                setResetError("Email and Reset Code are required");
                return;
            } else if (!email && !newPassword) {
                setResetError("Email and New Password are required");
                return;
            } else if (!resetCode && !newPassword) {
                setResetError("Reset Code and New Password are required");
                return;
            } else if (!email) {
                setResetError("Email is required");
                return;
            } else if (!resetCode) {
                setResetError("Reset Code is required");
                return;
            } else if (!newPassword) {
                setResetError("New Password is required");
                return;
            }
            setResetError("");

            let result = await handleResetPassword(email, resetCode, newPassword);
            setEmail("");
            setResetCode("");
            setNewPassword("");

        } catch (error) {
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

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="resetCode"
                                label="Reset Code"
                                name="resetCode"
                                value={resetCode || ""}
                                autoFocus
                                size="small"
                                onChange={(e) => setResetCode(e.target.value)}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="newPassword"
                                label="New Password"
                                name="newPassword"
                                value={newPassword || ""}
                                autoFocus
                                size="small"
                                onChange={(e) => setNewPassword(e.target.value)}
                            />

                            <p style={{ color: "red" }}>{resetError}</p>

                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 2 }}
                                onClick={handleResetPasswordAuth}
                            >
                                Reset Password
                            </Button>


                        </Box>
                    </Box>
                </Paper>
                <ToastContainer />
            </Box>
        </ThemeProvider>
    );
}