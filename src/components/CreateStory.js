import React, { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloudinaryWidget from "./CloudinaryWidget";
import { UserContext } from '../UserContext';
import { apiProvider } from "../services/apiProvider";

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

  const handleGetStoryInfo = async () => {
    const story = await apiProvider.getStoryInfo(id)
    setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(story.story_text))))
    setStoryTitle(story.story_title)
    setPhotoUrl(story.photo_url)
    setDateCreated(story.date_created)
    setStoryId(story.story_id)
  }

  const handleSubmitStory = async() => {
    const body = {isStoryPublic, storyTitle, storyText, photoUrl, dateCreated, userName}
    const story = await apiProvider.submitStory(body)
    setStoryId(story.data)
    setIsStorySubmitted(true)
  }

  const handleSubmitEdits = async() => {
    const body = {storyTitle, storyText, photoUrl, storyId}
    const {data} = await apiProvider.submitEdits(body)
    if(data === 'story updated'){
      setIsStorySubmitted(true)
    }
  }

  useEffect(() => {
    getStoryFromEditor()
  },[editorState])

  useEffect(() => {
    if(id){
      handleGetStoryInfo()
    } else{
      createTimeStamp()
    }
  },[])

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
          onClick={id ? handleSubmitEdits : handleSubmitStory}
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