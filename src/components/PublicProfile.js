import React, {Fragment, useState, useContext, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import StoryPreview from './StoryPreview';
import CloudinaryWidgetCoverPhoto from './CloudinaryWidgetCoverPhoto'
import CloudinaryProfilePhotoWidget from './CloudinaryProfilePhotoWidget'
import { UserContext } from '../UserContext';
import { apiProvider } from '../services/apiProvider';

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

    const handleGetUserInfo = async (userId) => {
        const info = await apiProvider.getUserInfo(userId)
        setUserProfileInfo(info)
    }

    const handleGetUserStories = async (userId) => {
        const stories = await apiProvider.getMyStories(userId)
        setUserStories(stories)
    }

    const handleUpdateAboutMe = async (aboutMe) => {    
        await apiProvider.updateAboutMe(aboutMe)
    }

    const handleFollowUser = async (userId) => { 
        await apiProvider.followUser(userId)
        setIsFollowing(true)
    }

    const checkIfFollowing = async (userId) => {
        const bool = await apiProvider.checkIfFollowing(userId)
        setIsFollowing(bool)
    }

    const handleGetNumberOfFollowers = async (userId) => {
        const  followersCount = await apiProvider.getNumberOfFollowers(userId)
        setNumberOfFollowers(followersCount)
    }

    const handleSubmit = () => {
        handleUpdateAboutMe(userProfileInfo.about_user)
        toggleIsEditing()
    }

    useEffect(() => {
        handleGetUserInfo(id)
        handleGetUserStories(id)
        handleGetNumberOfFollowers(id)
    },[])

    useEffect(() => {
        checkIfFollowing(id)
        if(userContext[0].user_id === id){
            setCanUserEdit(true)
        }
    },[userContext])


    return(
        <Fragment>
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
                            onClick={() => handleFollowUser(id)}
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
                            sx= {{width: "40vw"}}
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
                    <div className="stories-wrapper">
                        {userStories.map(story => (
                            <StoryPreview story = {story} key = {story.story_id} />
                        ))} 
                    </div>
                </div>  
            </div>
        </Fragment>
    )
}