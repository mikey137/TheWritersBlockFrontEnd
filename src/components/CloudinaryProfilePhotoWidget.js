import React,{useEffect, useRef} from 'react'
import IconButton from '@mui/material/IconButton';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { apiProvider } from '../services/apiProvider';

export default function CloudinaryProfilePhotoWidget({canUserEdit, setUserProfileInfo}){
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
                    console.log(`newUrl: ${result.info.url}`)
                    setUserProfileInfo(userProfileInfo => ({
                        ...userProfileInfo, user_photo: result.info.url
                    }))
                    apiProvider.updateUserPhoto(result.info.url)
                }
            }
        ) 
    },[])

    return(
        <IconButton     
            id = {canUserEdit ? "profile-photo-edit-btn" : "display-none"} 
            color="primary" 
            aria-label="upload picture" 
            component="span"
            onClick={openMyWidget}
        >
            <CameraAltIcon />
        </IconButton>
    )
}