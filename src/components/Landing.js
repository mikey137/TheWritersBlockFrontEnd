import React, {Fragment, useEffect, useState} from 'react'
import Button from '@mui/material/Button';
import StoryPreview from './StoryPreview';
import { apiProvider } from '../services/apiProvider'

export default function Landing(){
    const [mostViewedStories, setMostViewededStories] = useState([])

    const handleGetMostViewedStories = async () => {
        const stories = await apiProvider.getMostViewedStories()
        setMostViewededStories(stories)
    }

    useEffect(() => {
        handleGetMostViewedStories()
    },[])

    return(
        <Fragment>
            <div className="landing-hero">
                <div className="landing-content-container">
                    <h1>The Writers' Block</h1>
                    <p>Where Ideas Come To Grow</p>
                    <div className="landing-button-container">
                        <Button href="/login" size="medium" variant="contained">LOGIN</Button>
                        <Button href="/register" size="medium" variant="text">SIGN UP</Button>
                    </div>
                </div>
            </div>
            <div className="landing-content">
                <h1>Most Viewed Stories</h1>
                <div className="stories-wrapper">
                    {mostViewedStories.map(story => (
                        <StoryPreview key = {story.story_id} story = {story} />
                    ))} 
                </div>
            </div>
        </Fragment>
    )
}