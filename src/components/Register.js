import React, {Fragment, useEffect, useState} from 'react'
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import { FormControl, FormHelperText } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import {API_BASE_URL} from '../Constants'

export default function Register({setIsAuthenticated}){
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        verifyPassword: "",
        name: "",
        showPassword: false,
        showVerifyPassword: false
    })
    const [isUserNameTaken, setIsUserNameTaken] = useState(false)
    const [isEmailTaken, setIsEmailTaken] = useState(false)
    const [isEmailValid, setIsEmailValid] = useState(false)
    const [isPasswordStrong, setIsPassWordStrong] = useState(false)
    const [doPasswordsMatch, setDoPasswordsMatch] = useState(false)

    const {email, password, verifyPassword, name } = inputs

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/

    const onChange = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    }

    const handleClickShowPassword = () => {
        setInputs({
          ...inputs,
          showPassword: !inputs.showPassword,
        });
    };

    const handleClickShowVerifyPassword = () => {
        setInputs({
            ...inputs,
            showVerifyPassword: !inputs.showVerifyPassword,
        });
    };
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const checkIsUserNameTaken = async () => {
        try {
            const body = { name }
            const {data} = await axios.post(`${API_BASE_URL}/auth/checkusername`, body)
            setIsUserNameTaken(data)
        } catch (err) {
            console.error(err)
        }
    }

    const checkIsEmailTaken = async () => {
        try {
            const body = { email }
            const { data } = await axios.post(`${API_BASE_URL}/auth/checkemail`, body) 
            setIsEmailTaken(data)
        } catch (err) {
            console.error(err)
        }
    }

    const checkIsEmailValid = () => {
        if(emailPattern.test(inputs.email)){
           setIsEmailValid(true) 
        }else{
            setIsEmailValid(false)
        }
    }

    const checkPasswordStrength = () => {
        if(strongPasswordPattern.test(inputs.password)){
            setIsPassWordStrong(true)
        }else{
            setIsPassWordStrong(false)
        }
    } 

    const checkIfPasswordsMatch = () => {
        if(inputs.password === inputs.verifyPassword){
            setDoPasswordsMatch(true)
        }else{
            setDoPasswordsMatch(false)
        }
    }

    useEffect(() => {
        checkIsUserNameTaken()
    },[inputs.name])

    useEffect(() => {
        checkIsEmailValid()
        checkIsEmailTaken()
    },[inputs.email])


    useEffect(() => {
        checkPasswordStrength()
    },[inputs.password])

    useEffect(() => {
        checkIfPasswordsMatch()
    },[inputs.verifyPassword][inputs.password])

    const checkFormCompleteness = () => {
        console.log('test')
        if(
            inputs.name !== "" &&
            isUserNameTaken === false &&
            inputs.email !== "" &&
            isEmailTaken === false &&
            isEmailValid === true &&
            isPasswordStrong === true &&
            inputs.password === inputs.verifyPassword
        ){
            return true
        }else{
            return false
        }
    }

    const onSubmitForm = async (e) => {
        e.preventDefault()
        if(checkFormCompleteness){
            try {
                const body = { email, password, name} 
                const { data } = await axios.post(`${API_BASE_URL}/auth/register`, body)
     
                localStorage.setItem("token", data.token)
                setIsAuthenticated(true)
             } catch (err) {
                 console.error(err.message)
             }
        }
    }

    return(
        <Fragment>
            <div className="login-page-outer">
                <div className="login-img-container">
                    <h1>Find Your Inspiration!</h1>
                </div>
                <div className="login-form-container">
                    <h1>The Writers Block</h1>
                    <h4>Join Us Today</h4>
                    <h4>and Bring Your Ideas to Life!</h4>
                    <p>Enter your username, email, and password to register</p>
                    <Box 
                        component="form" 
                        noValidate 
                        onSubmit={e => onSubmitForm(e)} 
                        sx={{ mt: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <TextField 
                            error={isUserNameTaken}
                            helperText={isUserNameTaken ? "Username Taken" : ""}
                            onChange={e => onChange(e)}
                            variant="outlined" 
                            required
                            fullWidth
                            id="name"
                            label="username"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            sx={{ m: 1, width: '25ch' }}
                        />
                        <TextField 
                            error={isEmailTaken || (!isEmailValid && inputs.email !== '')}
                            helperText={isEmailTaken ? "Email Already Registered" : !isEmailValid && inputs.email !== '' ? "Must Enter Valid Email" : ''}
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
                            <InputLabel 
                                htmlFor="outlined-adornment-password"
                            >
                                Password
                            </InputLabel>
                            <OutlinedInput
                                error={!isPasswordStrong && inputs.password !== ""}
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
                            <FormHelperText id="outlined-adornment-password">
                                {!isPasswordStrong && inputs.password !== "" ? "Must Conatain 8 characters, uppercase, lowcase, symbol, and number" : ""}
                            </FormHelperText>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-verifyPassword"> Verify Password</InputLabel>
                        <OutlinedInput
                            error={!doPasswordsMatch && inputs.verifyPassword !== ""}
                            required
                            fullWidth
                            name="verifyPassword"
                            id="outlined-adornment-verifyPassword"
                            autoComplete="current-password"
                            type={inputs.showVerifyPassword ? 'text' : 'password'}
                            value={inputs.verifyPassword}
                            onChange={e => onChange(e)}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowVerifyPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {inputs.showVerifyPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                            label="Verify Password"
                        />
                        <FormHelperText id="outlined-adornment-verifyPassword" filled>
                            {!doPasswordsMatch ? "Doesn't Match Password" : ""}
                        </FormHelperText>
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Register
                        </Button>
                        <p>
                            Already have an account?
                            <Link href="/login" variant="body2">
                            {"Sign In"}
                            </Link> 
                        </p>
                    </Box>
                </div>
            </div>
        </Fragment>
    )
}