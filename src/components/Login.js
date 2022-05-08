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
import axios from 'axios';
import { API_BASE_URL } from '../Constants'


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

    const onSubmitForm = async (e) => {
        e.preventDefault()
        try {
            const body = { email, password }
            const { data } = await axios.post(`${API_BASE_URL}/auth/login`, body)
            localStorage.setItem("token", data.token)
            if(data.token){
                setIsAuthenticated(true)
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    
    return(
        <Fragment>
            <div className="login-page-outer">
                <div className="login-img-container"></div>
                <div className="login-form-container">
                    <h4>Sign In</h4>
                    <p>Enter your email and password to sign in</p>
                    <Box 
                        component="form" 
                        noValidate 
                        onSubmit={e => onSubmitForm(e)} 
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