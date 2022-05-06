import React,{useEffect, useRef} from 'react'
import Button from '@mui/material/Button';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import axios from 'axios';

export default function CloudinaryWidgetCoverPhoto({canUserEdit, setUserProfileInfo}){
    let myWidget = useRef()

    const openMyWidget = () => {
        myWidget.current.open()
    }

    const updateCoverPhoto = async (newUrl) => {
        try{
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token 
                }
            }
            const data = {user_cover_photo: `${newUrl}`} 
            const updatedCoverPhoto = await axios.put("/users/usercoverphoto", data, config)
            console.log(updatedCoverPhoto)
        } catch(err){
            console.error(err)
        }
    }

    useEffect(() => {
        myWidget.current = window.cloudinary.createUploadWidget({
            cloudName: 'nimbus137', 
            uploadPreset: 'k0l0cx3a'},
            (error, result) => { 
                if (!error && result && result.event === "success") { 
                    setUserProfileInfo(userProfileInfo =>({
                        ...userProfileInfo, user_cover_photo: result.info.url
                    }))
                    updateCoverPhoto(result.info.url)
                }
            }
        )
    },[])

    return(
        <Button
            id = {canUserEdit ? "cover-photo-edit-btn" : "display-none"}
            variant="contained" 
            startIcon={<CameraAltIcon />}
            onClick={openMyWidget}
        >
            Edit Cover Photo
        </Button>
    )
}