import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import {API_BASE_URL} from '../Constants'

export default function DeleteStoryDialog({canUserEdit, id}) {
    const [open, setOpen] = useState(false);
    const story_id = {id}

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteStory = async() => {
        try {
            const config = {
                data: {id},
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token
                }
            }
            const storyToDelete = await axios.delete(`${API_BASE_URL}/stories/deletestory`, config)
            console.log(storyToDelete)
            handleClose()
        } catch (err) {
            console.error(err)
        } 
    }

    return (
        <div>
            <Button 
                variant="contained" 
                startIcon={<DeleteIcon />}
                color="error"
                sx={{marginTop: '1rem'}}
                id = {canUserEdit ? 'edit-btn' : 'display-none'}
                onClick={handleClickOpen}
            >
                Delete Story
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Are you sure you want to delete this story?"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    This will permanently delete the story, you can't undo this action.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleDeleteStory}
                        href="/dashboard"
                    >
                        Delete
                    </Button>
                    <Button 
                        onClick={handleClose} 
                        autoFocus
                        color="success"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}