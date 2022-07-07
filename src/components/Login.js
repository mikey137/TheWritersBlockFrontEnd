import React, {Fragment, useState} from 'react'
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import { FormControl } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { apiProvider } from '../services/apiProvider';


export default function Login({setIsAuthenticated}){
    const [inputs, setInputs] = useState({
        email:"",
        password:"",
        showPassword: false
    })

    const { email, password } = inputs

    const onChange = e => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    }

    const handleClickShowPassword = () => {
        setInputs({
          ...inputs,
          showPassword: !inputs.showPassword,
        });
    };
    
    const handleMouseDownPassword = (event) => {
    event.preventDefault();
    };

    const handleLogin = async (e) => {
        e.preventDefault()
        const token = await apiProvider.login(email, password)
        localStorage.setItem("token", token)
        if(token){
            setIsAuthenticated(true)
        }
    }
    
    return(
        <Fragment>
            <div className="login-page-outer">
                <div className="login-img-container">
                    <h1>Find Your Inspiration!</h1>
                </div>
                <div className="login-form-container">
                    <h1>The Writers' Block</h1>
                    <h4>Sign In</h4>
                    <p>Enter your email and password to sign in</p>
                    <Box 
                        component="form" 
                        noValidate 
                        onSubmit={e => handleLogin(e)} 
                        sx={{ mt: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <TextField 
                            onChange={e => onChange(e)}
                            variant="outlined" 
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            sx={{ m: 1, width: '25ch' }}
                        />
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            required
                            fullWidth
                            name="password"
                            id="outlined-adornment-password"
                            autoComplete="current-password"
                            type={inputs.showPassword ? 'text' : 'password'}
                            value={inputs.password}
                            onChange={e => onChange(e)}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {inputs.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                            label="Password"
                        />
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <p>
                            Don't have an account?
                            <Link href="/register" variant="body2">
                            {"Sign Up"}
                            </Link> 
                        </p>
                    </Box>
                </div>
            </div>
        </Fragment>
    )
}