import React, { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw, ContentState} from "draft-js";
import {convertToHTML} from "draft-convert"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloudinaryWidget from "./CloudinaryWidget";
import axios from "axios";
import { UserContext } from '../UserContext';
import { API_BASE_URL } from "../Constants";

export default function CreateStory() {
  const  {id}   = useParams()
  const userContext = useContext(UserContext)
  const userName = userContext[0].user_name
  const [editorState, setEditorState] = useState(() => 
    EditorState.createEmpty()
  );
  
  const [isStoryPublic, setIsStoryPublic] = useState(true)
  const [storyTitle, setStoryTitle] = useState('')
  const [storyText, setStoryText] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [dateCreated, setDateCreated] = useState('')
  const [storyId, setStoryId] = useState("")
  const [isStorySubmitted, setIsStorySubmitted] = useState(false)

  let navigate = useNavigate()
  let path = `/story/${storyId}`
  if(isStorySubmitted && storyId !== ''){navigate(path)} 

  const changeStoryTitle = (e) => {
    setStoryTitle(e.target.value)
  } 

  const getStoryFromEditor = () => {
    let text = convertToRaw(editorState.getCurrentContent())
    setStoryText(text)
  }

  const createTimeStamp = () => {
    let currentTimestamp = Date.now()
    let date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(currentTimestamp)
    setDateCreated(date)
  }

  const getStoryInfo = async () => {
    try{
      const {data} = await axios(`${API_BASE_URL}/stories/getstory/${id}`) 
      setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(data.story_text))))
      setStoryTitle(data.story_title)
      setPhotoUrl(data.photo_url)
      setDateCreated(data.date_created)
      setStoryId(data.story_id)
    } catch (err) {
      console.error(err.message)
    }
  }

  useEffect(() => {
    getStoryFromEditor()
  },[editorState])

  useEffect(() => {
    if(id){
      getStoryInfo()
    } else{
      createTimeStamp()
    }
  },[])

  const submitStory = async() => {
    console.log('test')
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token
        }
      }
      const body = {isStoryPublic, storyTitle, storyText, photoUrl, dateCreated, userName}
      const story = await axios.post(`${API_BASE_URL}/stories/createstory`, body, config)
      setStoryId(story.data)
      setIsStorySubmitted(true)
    } catch (err) {
      console.error(err)
    }
  }

  const submitEdits = async() => {
    console.log('test')
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token
        }
      }
      const body = {storyTitle, storyText, photoUrl, storyId}
      const edits = await axios.put(`${API_BASE_URL}/stories/editstory`, body, config)

      if(edits.data === 'story updated'){
        setIsStorySubmitted(true)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className = "create-story-container">
      <CloudinaryWidget photoUrl = {photoUrl} setPhotoUrl = {setPhotoUrl} />
      <TextField 
          onChange={e => changeStoryTitle(e)}
          id="outlined-basic" 
          label="Story Title" 
          variant="outlined" 
          sx={{ m: 1, width: '25ch' }}
          value={storyTitle}
      />
      <div className = 'text-editor'>
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
          />
      </div>
      <div className="create-story-btn-container">
        <Button 
          onClick={id ? submitEdits : submitStory}
          variant="contained" 
          sx={{ width: 250}}
        >
          Submit Story
        </Button>
        <Button 
          variant="outlined"
          sx={{ mt: 3, width: 250}}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}