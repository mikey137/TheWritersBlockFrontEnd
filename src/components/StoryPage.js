import React, { useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import { convertFromRaw } from "draft-js";
import {convertToHTML} from "draft-convert"
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import axios from 'axios';

export default function StoryPage(){
    const  {id}   = useParams()
    
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

    const updateViewCount = async () => {
        try {
            const update = await axios.put(`/stories/viewstory/${id}`)
        } catch (err) {
            console.log(err)
        }
    }

    const getStoryInfo = async () => {
        try{
            const response = await axios(`/stories/getstory/${id}`) 
            console.log(response.data)
            const convertedStoryText = (convertToHTML(convertFromRaw(JSON.parse(response.data.story_text))))
            setStoryInfo({
                user_id: response.data.user_id,
                story_text: convertedStoryText,
                story_title: response.data.story_title,
                date_created: response.data.date_created,
                public: response.data.public,
                photo_url: response.data.photo_url,
                views: response.data.views,
                likes: response.data.likes,
                user_name: response.data.user_name 
            })
        } catch (err) {
            console.error(err.message)
        }
    }

    const likeStory = async () => {
        try {
            const addLike = await axios.put(`/stories/likestory/${id}`) 
            setStoryInfo({
                ...storyInfo,
                likes: addLike.data
            })
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getStoryInfo()
        updateViewCount()
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
                            <IconButton onClick={likeStory} color='primary'>
                                <ThumbUpIcon/>
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>
            <div 
                dangerouslySetInnerHTML={{__html:`${storyInfo.story_text}`}} className="landing-content"
            >    
            </div>
        </div>
    )
}