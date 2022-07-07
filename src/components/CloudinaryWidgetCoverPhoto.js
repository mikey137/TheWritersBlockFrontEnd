import React,{useEffect, useRef} from 'react'
import Button from '@mui/material/Button';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { apiProvider } from '../services/apiProvider';

export default function CloudinaryWidgetCoverPhoto({canUserEdit, setUserProfileInfo}){
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
                    setUserProfileInfo(userProfileInfo =>({
                        ...userProfileInfo, user_cover_photo: result.info.url
                    }))
                    apiProvider.updateCoverPhoto(result.info.url)
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