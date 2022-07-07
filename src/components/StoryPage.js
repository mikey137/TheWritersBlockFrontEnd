import React, { useEffect, useState, useContext} from 'react'
import { useParams } from 'react-router-dom';
import { convertFromRaw } from "draft-js";
import {convertToHTML} from "draft-convert"
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import { UserContext } from '../UserContext';
import DeleteStoryDialog from './DeleteStoryDialog';
import { apiProvider } from '../services/apiProvider';

export default function StoryPage(){
    const  {id}   = useParams()
    const userContext = useContext(UserContext)
    const [canUserEdit, setCanUserEdit] = useState(false)
    const [storyInfo, setStoryInfo] = useState({
        user_id: '',
        story_text: '',
        story_title: '',
        date_created: '',
        public: '',
        photo_url: '',
        views: '',
        likes: '',
        user_name: ''
    })

    const handleGetStoryInfo = async (storyId) => {
        const story = await apiProvider.getStoryInfo(storyId)
        const convertedStoryText = (convertToHTML(convertFromRaw(JSON.parse(story.story_text))))
        setStoryInfo({
            story_id: story.story_id,
            user_id: story.user_id,
            story_text: convertedStoryText,
            story_title: story.story_title,
            date_created: story.date_created,
            public: story.public,
            photo_url: story.photo_url,
            views: story.views,
            likes: story.likes,
            user_name: story.user_name 
        })
    }

    const handleLikeStory = async (storyId) => {
        const updatedLikeCount = await apiProvider.likeStory(storyId)
        setStoryInfo({
            ...storyInfo,
            likes: updatedLikeCount
        })
    }

    useEffect(() => {
        if(`${userContext[0].user_id}` === storyInfo.user_id){
            setCanUserEdit(true)
        }else{
            setCanUserEdit(false)
        }
    },[userContext, storyInfo])

    useEffect(() => {
        handleGetStoryInfo(id)
        apiProvider.updateViewCount(id)
    },[])
    
    return(
        <div className="story-page-container">
            <div 
                className="landing-hero" 
                style={{backgroundImage: `linear-gradient(
                    195deg,
                    rgba(66, 66, 74, 0.5),
                    rgba(25, 25, 25, 0.5)
                  ),url(${storyInfo.photo_url})`}}
            >
                <div className="landing-content-container">
                    <h1>{storyInfo.story_title}</h1>
                    <p>
                        By: 
                        <Link href={`/profile/${storyInfo.user_id}`} underline="none">
                            {storyInfo.user_name}
                        </Link>
                    </p>
                    <div className="story-social-info-container">
                        <div className="views">
                            <span>{storyInfo.views}</span>
                            <span> Views</span>
                        </div>
                        <div className="views">
                            <span>{storyInfo.likes}</span>
                            <IconButton onClick={() => handleLikeStory(storyInfo.story_id)} color='primary'>
                                <ThumbUpIcon/>
                            </IconButton>
                        </div>
                    </div>
                    <Button 
                        href={`/createstory/${storyInfo.story_id}`}
                        variant="contained" 
                        startIcon={<EditIcon />}
                        id = {canUserEdit ? 'edit-btn' : 'display-none'}
                    >
                        Edit Story
                    </Button>
                    <DeleteStoryDialog canUserEdit = {canUserEdit} id = {id}/>
                </div>
            </div>
            <div 
                dangerouslySetInnerHTML={{__html:`${storyInfo.story_text}`}} className="landing-content"
            >    
            </div>
        </div>
    )
}