import React, {Fragment, useState, useContext, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import StoryPreview from './StoryPreview';
import CloudinaryWidgetCoverPhoto from './CloudinaryWidgetCoverPhoto'
import CloudinaryProfilePhotoWidget from './CloudinaryProfilePhotoWidget'
import { UserContext } from '../UserContext';
import axios from 'axios';
import { API_BASE_URL } from '../Constants';

export default function PublicProfile({isAuthenticated}){
    const userContext = useContext(UserContext)
    const { id } = useParams()

    const [userProfileInfo, setUserProfileInfo] = useState({
        user_name: '',
        user_photo: '',
        user_cover_photo: '',
        about_user: ''
    })
    const [userStories, setUserStories] = useState([])
    const [canUserEdit, setCanUserEdit] = useState(false)
    const [isEditingAbout, setIsEditingAbout] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const [numberOfFollowers, setNumberOfFollowers] = useState(0)

    const handleChange = (event) => {
        setUserProfileInfo({
            ...userProfileInfo, [event.target.name]: event.target.value 
        });
      };

    const toggleIsEditing = () => {
        setIsEditingAbout(!isEditingAbout)
    }

    const getUserInfo = async () => {
        try {
           const response = await axios(`${API_BASE_URL}/users/publicuserinfo/${id}`)
           setUserProfileInfo(response.data)
        } catch (err) {
            console.error(err)
        }
    }

    const getUserStories = async () => {
        try {
            const stories = await axios(`${API_BASE_URL}/stories/mystories/${id}`)
            setUserStories(stories.data)
        } catch (err) {
            console.error(err)
        }
    }

    const editAboutUser = async () => {
        try{
            const config = {
                headers: {
                  "Content-Type": "application/json",
                  token: localStorage.token 
                }
            }
            const data = {about_user: `${userProfileInfo.about_user }`} 
            const updatedAboutText = await axios.put(`${API_BASE_URL}/users/userabout`, data, config)
            console.log(updatedAboutText)
        } catch(err){
            console.error(err)
        }
    }

    const handleFollowUser = async () => {
        try {
            const config = {
                headers: {
                  "Content-Type": "application/json",
                  token: localStorage.token 
                }
            }
            
            const data = {userToFollow: id}
            const followUser = await axios.post(`${API_BASE_URL}/followers/followuser`, data, config)

            console.log(followUser)
        } catch (err) {
            console.error(err)
        }
    }

    const checkIfFollowing = async () => {
        try {
            const config = {
                headers: {
                  "Content-Type": "application/json",
                  token: localStorage.token 
                }
            }
            const data = {followee: id}
            const bool = await axios.post(`${API_BASE_URL}/followers/isfollowing`, data, config)
            
            setIsFollowing(bool.data)
        } catch (err) {
            console.error(err)
        }
    }

    const getNumberOfFollowers = async () => {
        try {
            const  followers = await axios(`${API_BASE_URL}/followers/numberoffollowers/${id}`)
            setNumberOfFollowers(followers.data.rows[0].count)
        } catch (err) {
            console.error(err)
        }
    }

    const handleSubmit = () => {
        editAboutUser()
        toggleIsEditing()
    }

    useEffect(() => {
        getUserInfo()
        getUserStories()
        getNumberOfFollowers()
    },[])

    useEffect(() => {
        checkIfFollowing()
        if(userContext[0].user_id === id){
            setCanUserEdit(true)
        }
    },[userContext])


    return(
        <Fragment>
            <div className="margin-top" style={{marginTop: '3.5rem'}}></div>
            <div 
                className="profile-cover-photo"
                style={{backgroundImage: `url(${userProfileInfo.user_cover_photo})`}}
            >
            <CloudinaryWidgetCoverPhoto     
                canUserEdit = { canUserEdit} 
                setUserProfileInfo = {setUserProfileInfo} 
            />   
            </div>
            <div className="profile-content">
                <div 
                    className="profile-img"
                    style={{backgroundImage: `url(${userProfileInfo.user_photo})`}}
                >
                    <CloudinaryProfilePhotoWidget 
                        canUserEdit = {canUserEdit} 
                        setUserProfileInfo = {setUserProfileInfo} 
                    />
                </div>
                <div className="profile-user-info">
                    <div className="name-btn-container">
                        <h3>{userProfileInfo.user_name}</h3>
                        <Button 
                            id = { !canUserEdit ? "follow-btn" : "display-none"}
                            variant="outlined"
                            onClick={handleFollowUser}
                            disabled={!isAuthenticated}
                        >
                            {isFollowing ? "Following" : "Follow"}
                        </Button>
                    </div>
                    <div className="followers" >
                        <span>{numberOfFollowers}</span>
                        <span> Followers</span>
                    </div>
                    <div className="about-user">
                        <p id = {isEditingAbout ? "display-none" : "about-user-text"}>
                            {userProfileInfo.about_user}
                        </p>
                        <div id={ isEditingAbout ? "textfield-wrapper" : "display-none"}>
                        <TextField
                            id= "outlined-multiline-flexible"
                            name="about_user"
                            sx= {{width: "90vw"}}
                            label="Edit About Me"
                            multiline
                            value={userProfileInfo.about_user}
                            onChange = {handleChange}
                            
                        />
                        </div>
                        <div className="edit-about-btn-container">
                            <Button 
                                id = {canUserEdit && !isEditingAbout ? "edit-about-me-btn" : "display-none"}
                                variant="text"
                                onClick = {toggleIsEditing}
                            >
                                Edit About Me
                            </Button>
                            <Button 
                                id = {isEditingAbout ? "submit-changes-btn" : "display-none"}
                                variant="text"
                                onClick = {handleSubmit}
                            >
                                Submit Changes
                            </Button>
                        </div>
                    </div>
                </div>
                <h3>Checkout My Lastest Work</h3>
                <div className="story-container">
                    {userStories.map(story => (
                    <StoryPreview story = {story} />
                    ))} 
                </div>  
            </div>
        </Fragment>
    )
}