import React,{useEffect, useRef} from 'react'
import Button from '@mui/material/Button';

export default function CloudinaryWidget({setPhotoUrl, btnType}){
  let myWidget = useRef()

  const openMyWidget = () => {
    myWidget.current.open()
  }

  useEffect(() => {
      myWidget.current = window.cloudinary.createUploadWidget({
      cloudName: 'nimbus137', 
      uploadPreset: 'k0l0cx3a'},
      (error, result) => { 
        if (!error && result && result.event === "success") { 
          setPhotoUrl(result.info.url)
        }
      }
    )
  },[])

  return(
    <Button 
      onClick={openMyWidget} 
      sx={{m: 1, width: '75%', maxWidth: '250px'}} 
      variant="contained" 
      id="upload_widget" 
      className="cloudinary-button"
    >
      Upload Photo
    </Button>
  )
}