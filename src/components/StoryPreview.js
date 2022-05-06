import React, {Fragment, useEffect, useState} from 'react'
import { convertFromRaw } from "draft-js";
import {convertToHTML} from "draft-convert"
import Link from '@mui/material/Link';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

export default function StoryPreview({story}){
    const [storyPreview, setStoryPreview] = useState('')

    const handleConvertStoryText = (unconvertedText) => {
        const convertedText = convertToHTML(convertFromRaw(JSON.parse(unconvertedText)))
        const startOfParagraph = convertedText.indexOf('<p>')+3
        const subString = convertedText.substring(startOfParagraph, startOfParagraph + 100)
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