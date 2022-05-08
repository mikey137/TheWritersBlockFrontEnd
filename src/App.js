import React, {Fragment, useState, useEffect} from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom"
import './App.css';
import Navbar from './components/NavBar';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';
import Landing from './components/Landing';
import PublicProfile from './components/PublicProfile';
import StoryPage from './components/StoryPage';
import CreateStory from './components/CreateStory';
import { UserProvider } from './UserContext';
import axios from 'axios';
import { API_BASE_URL } from './Constants'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState("")

  async function isAuth(){
    if(localStorage.token){
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            token: localStorage.token
          }
        }
        const response = await axios(`${API_BASE_URL}/auth/is-verify`, config)
        
        setIsAuthenticated(response.data)
      } catch (err) {
        console.error(err.message)
      }
    }else{
      setIsAuthenticated(false)
    }
  }

  useEffect(() => {
    isAuth()
  },[isAuthenticated])

  return (
    <Fragment>
      <UserProvider isAuthenticated = { isAuthenticated }>
      <BrowserRouter>
        <Navbar isAuthenticated = { isAuthenticated } setIsAuthenticated = { setIsAuthenticated }/>
        <Routes>
          <Route 
            path="/" 
            element ={<Landing />}
          />
          <Route 
            path="/login" 
            element ={isAuthenticated !== true ? <Login setIsAuthenticated = { setIsAuthenticated } /> : <Navigate to = "/dashboard" />}
          />
          <Route 
            path="/register" 
            element ={isAuthenticated !== true ?<Register setIsAuthenticated = { setIsAuthenticated } /> : <Navigate to = "/dashboard" />}
          />
          <Route 
            path="/dashboard" 
            element ={isAuthenticated !== false ? <Dashboard /> : <Navigate to = "/login" />}
          />
          <Route
            path= "/profile/:id"
            element ={<PublicProfile isAuthenticated = {isAuthenticated} />}
          />
          <Route
            path= "/story/:id"
            element ={<StoryPage />}
          />
          <Route
            path= "/createstory"
            element ={isAuthenticated !== false ? <CreateStory /> : <Navigate to = "/login" /> }
          />
        </Routes>
      </BrowserRouter>
      </UserProvider>
    </Fragment>
  );
}

export default App;
