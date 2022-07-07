import axios from 'axios'
import { API_BASE_URL } from '../Constants'

const config = {
    headers: {
        "Content-Type": "application/json",
        token: localStorage.token
    }
}

const getMyStories = async (userId) => {
    try {
        const {data} = await axios(`${API_BASE_URL}/stories/mystories/${userId}`)
        return data
    } catch (err) {
        console.error(err)
    }
}

const getMostViewedStories = async () => {
    try {
        const {data} = await axios.get(`${API_BASE_URL}/stories/mostviewed`)
        return data
    } catch (err) {
        console.error(err)
    }
}

const getNewestStories = async () => {
    try {
        const {data} = await axios(`${API_BASE_URL}/stories/neweststories`)
        return data
    } catch (err) {
        console.error(err)
    }
}

const deleteStory = async(id) => {
    try {
        await axios.delete(`${API_BASE_URL}/stories/deletestory`, config)
    } catch (err) {
        console.error(err)
    } 
}

const getStoryInfo = async (id) => {
    try{
      const {data} = await axios(`${API_BASE_URL}/stories/getstory/${id}`) 
      return data
    } catch (err) {
      console.error(err.message)
    }
}

const submitStory = async (body) => {
    try {
        const {data} = await axios.post(`${API_BASE_URL}/stories/createstory`, body, config)
        return data
    } catch (err) {
        console.error(err)
    }
}

const submitEdits = async (body) => {
    try {
      const edits = await axios.put(`${API_BASE_URL}/stories/editstory`, body, config)
      return edits
    } catch (err) {
      console.error(err)
    }
}

const login = async (email, password) => {
    try {
        const body = { email, password }
        const { data } = await axios.post(`${API_BASE_URL}/auth/login`, body)
        return data.token
    } catch (err) {
        console.log(err.message)
    }
}

const getUserInfo = async (id) => {
    try {
        const {data} = await axios(`${API_BASE_URL}/users/publicuserinfo/${id}`)
        return data
    } catch (err) {
        console.error(err)
    }
}

const updateAboutMe = async (aboutMe) => {
    try{
        const data = {about_user: `${aboutMe}`} 
        await axios.put(`${API_BASE_URL}/users/userabout`, data, config)
    } catch(err){
        console.error(err)
    }
}

const updateUserPhoto = async (newUrl) => {
    try{
        const data = {user_photo: `${newUrl}`} 
        await axios.put(`${API_BASE_URL}/users/userphoto`, data, config)
    } catch(err){
        console.error(err)
    }
}

const updateCoverPhoto = async (newUrl) => {
    try{
        const data = {user_cover_photo: `${newUrl}`} 
        await axios.put(`${API_BASE_URL}/users/usercoverphoto`, data, config)
    } catch(err){
        console.error(err)
    }
}

const followUser = async (userId) => {
    try {
        const data = {userToFollow: userId}
        await axios.post(`${API_BASE_URL}/followers/followuser`, data, config)
    } catch (err) {
        console.error(err)
    }
}

const checkIfFollowing = async (userId) => {
    try {
        const body = {followee: userId}
        const {data} = await axios.post(`${API_BASE_URL}/followers/isfollowing`, body, config)
        return {data}
    } catch (err) {
        console.error(err)
    }
}

const getNumberOfFollowers = async (userId) => {
    try {
        const  {data} = await axios(`${API_BASE_URL}/followers/numberoffollowers/${userId}`)
        return data.rows[0].count
    } catch (err) {
        console.error(err)
    }
}

const checkIsUserNameTaken = async (name) => {
    try {
        const body = {name}
        const {data} = await axios.post(`${API_BASE_URL}/auth/checkusername`, body)
        return data
    } catch (err) {
        console.error(err)
    }
}

const checkIsEmailTaken = async (email) => {
    try {
        const body = { email }
        const { data } = await axios.post(`${API_BASE_URL}/auth/checkemail`, body) 
        return data
    } catch (err) {
        console.error(err)
    }
}

const registerNewUser = async (body) => {
    try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/register`, body)
        return data.token
    } catch (err) {
        console.error(err.message)
    }
}

const updateViewCount = async (storyId) => {
    try {
        await axios.put(`${API_BASE_URL}/stories/viewstory/${storyId}`)
    } catch (err) {
        console.log(err)
    }
}

const likeStory = async (storyId) => {
    try {
        const {data} = await axios.put(`${API_BASE_URL}/stories/likestory/${storyId}`) 
        return data
    } catch (err) {
        console.error(err)
    }
}

export const apiProvider = {
    getMyStories,
    getMostViewedStories,
    getNewestStories,
    deleteStory,
    getStoryInfo,
    submitStory,
    submitEdits,
    login,
    getUserInfo,
    updateAboutMe,
    updateUserPhoto,
    updateCoverPhoto,
    followUser,
    checkIfFollowing,
    getNumberOfFollowers,
    checkIsUserNameTaken,
    checkIsEmailTaken,
    registerNewUser,
    updateViewCount,
    likeStory
}