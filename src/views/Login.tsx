import {
    Typography,
    TextField,
    Button,
    Box,
} from '@mui/material';
import React, { useState, KeyboardEvent } from 'react';

import { toast } from 'react-toastify';
import { storeToken } from '../utils/utilFunctions';

import { useNavigate } from 'react-router-dom';
import { showSuccessToast } from '../utils/utilFunctions';
import './login.css';
import bgImage from "../assets/login-bg.jpg";
import { addStyleToTextField } from '../utils/utilFunctions';

interface LoginErrors {
    email: string;
    password: string;
}

interface LoginResponse {
    message: string;
}

const Login = () => {
    const navigate = useNavigate(); // Initialize navigate function
    // State for form fields and errors
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<LoginErrors>({
        email: '',
        password: '',
    });

    // Validate form fields
    const validateForm = (): boolean => {
        let valid = true;
        let newErrors: LoginErrors = {
            email: '',
            password: '',
        };

        if (!email) {
            newErrors.email = 'email-required';
            valid = false;
        }

        if (!password) {
            newErrors.password = 'password-required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };


    const login = async (): Promise<void> => {
        if (!validateForm()) {
            return
        }

        console.log('🔐 Login attempt for:', email);
        console.log('📍 API URL:', process.env.REACT_APP_API_URL);

        const apiUrl = process.env.REACT_APP_API_URL;
        try {
            const response = await fetch(`${apiUrl}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            });

            console.log('📡 Login response status:', response.status);
            console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

            const data: LoginResponse = await response.json();
            console.log('📦 Login response data:', data);

            if (data.message === 'Successfully logged in!') {
                const token = response.headers.get('X-Auth-Token');
                console.log('🔑 Token received:', token ? 'YES' : 'NO');
                console.log('🔑 Token preview:', token ? token.substring(0, 50) + '...' : 'None');

                if (token) {
                    storeToken(token);
                    console.log('💾 Token stored successfully');
                } else {
                    console.warn('⚠️ No token in response headers');
                }
                showSuccessToast('login-success');
                navigate('/dashboard');
            } else {
                console.log('❌ Login failed:', data.message);
                showInvalidCredentials();
            }
        } catch (error) {
            console.error('❌ Login error:', error);

            toast.error('something-went-wrong', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    const showInvalidCredentials = (): void => {

        let newErrors: LoginErrors = {
            email: '',
            password: '',
        };

        newErrors.email = 'invalid-credentials';
        newErrors.password = 'invalid-credentials';

        setErrors(newErrors);
    }

    const handleKeyPress = (e: KeyboardEvent<HTMLFormElement>): void => {
        if (e.key === 'Enter') {
            login()
        }
    };

    return (
        <>
            <div
                className="login-bg"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                {/* <Navbar /> */}
                <Box component="form" noValidate autoComplete="off"
                    onKeyDown={handleKeyPress} sx={{
                        width: '20%', margin: 'auto',
                        marginTop: '100px', backgroundColor: 'white', padding: '20px', borderRadius: '10px'
                    }}>
                    <Typography variant="h3">Intra in cont</Typography>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={{ ...addStyleToTextField(email), mt: 2 }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label={'password'}
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                        sx={{ ...addStyleToTextField(password), mt: 2, mb: 2 }}
                    />

                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>email: david@gmail.com</Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>password: david</Typography>

                    <Button variant="contained" sx={{ backgroundColor: ' #009688', color: 'white' }}
                        fullWidth onClick={login}>
                        {'login'}
                    </Button>
                </Box>
            </div>

        </>
    );
};

export default Login; 