import React, {Fragment, useEffect, useState} from 'react'
import Link from '@mui/material/Link';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

export default function StoryPreview({story}){
    const [storyPreview, setStoryPreview] = useState('')

    const handleConvertStoryText = (unconvertedText) => {
        const fullText = JSON.parse(unconvertedText).blocks[0].text
        const subString = fullText.substring(0, 100)
        setStoryPreview(subString)
    }

    useEffect(() => {
        handleConvertStoryText(story.story_text)
    },[])

    return(
        <Fragment>
            <div className="story-preview-container">
                <div 
                    className="story-img"
                    style={{backgroundImage: `url(${story.photo_url})`}}
                ></div>
                <h5>{story.story_title}</h5>
                <p>{storyPreview} ...</p>
                <Link href={`/story/${story.story_id}`} underline="hover">
                    {'Read More'} <ArrowRightAltIcon />
                </Link>
            </div>   
        </Fragment>
    )
}