import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import CloudinaryWidget from "./CloudinaryWidget";
import axios from "axios";
import { UserContext } from '../UserContext';
import { API_BASE_URL } from "../Constants";



export default function CreateStory() {
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

  let navigate = useNavigate()
  let path = `/story/${storyId}`
  if(storyId !== ''){navigate(path)} 

  const toggleIsStoryPublic = () => {
    setIsStoryPublic(!isStoryPublic)
  } 

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

  useEffect(() => {
    getStoryFromEditor()
    createTimeStamp()
  },[editorState])

  const submitStory = async() => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token
        }
      }
      const body = {isStoryPublic, storyTitle, storyText, photoUrl, dateCreated, userName}
      const story = await axios.post(`${API_BASE_URL}./stories/createstory`, body, config)
      setStoryId(story.data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className = "create-story-container">
        <FormControlLabel 
          control={<Switch defaultChecked onChange={toggleIsStoryPublic}/>} 
          label="Share Story Publicly" 
        />
        <CloudinaryWidget setPhotoUrl = {setPhotoUrl} />
        <TextField 
            onChange={e => changeStoryTitle(e)}
            id="outlined-basic" 
            label="Story Title" 
            variant="outlined" 
            sx={{ m: 1, width: '25ch' }}
        />
        <div className = 'text-editor'>
            <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            />
        </div>
        <div className="create-story-btn-container">
            <Button 
              onClick={submitStory}
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