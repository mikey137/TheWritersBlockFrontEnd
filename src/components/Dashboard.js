import React, { useState, useEffect, useContext} from 'react'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { UserContext } from '../UserContext';
import axios from 'axios';
import StoryPreview from './StoryPreview';
import { API_BASE_URL } from '../Constants'

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
  
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
  

export default function Dashboard(){
    const userContext = useContext(UserContext)
    const [value, setValue] = useState(0);
    const [myStories, setMyStories] = useState([])
    const [mostViewedStories, setMostViewededStories] = useState([])
    const [newestStories, setNewestStories] = useState([])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    

    const getMyStories = async () => {
        try {
            const stories = await axios(`${API_BASE_URL}/stories/mystories/${userContext[0].user_id}`)
            setMyStories(stories.data)
        } catch (err) {
            console.error(err)
        }
    }

    const getMostViewedStories = async () => {
        try {
            const stories = await axios(`${API_BASE_URL}/stories/mostviewed`)
            setMostViewededStories(stories.data)
        } catch (err) {
            console.error(err)
        }
    }

    const getNewestStories = async () => {
        try {
            const stories = await axios(`${API_BASE_URL}/stories/neweststories`)
            setNewestStories(stories.data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getMostViewedStories()
        getNewestStories()
    },[])

    useEffect(() => {
        getMyStories()
    },[userContext])

    return(
        <div className = "dashboard-container">
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="My Stories" {...a11yProps(0)} />
                    <Tab label="Most Viewed Stories" {...a11yProps(1)} />
                    <Tab label="Newest Stories" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    {myStories.map(story => (
                    <StoryPreview story = {story} />
                    ))} 
                </TabPanel>
                <TabPanel value={value} index={1}>
                    {mostViewedStories.map(story => (
                    <StoryPreview story = {story} />
                    ))} 
                </TabPanel>
                <TabPanel value={value} index={2}>
                    {newestStories.map(story => (
                        <StoryPreview story = {story} />
                    ))} 
                </TabPanel>
            </Box>
        </div>
    )
}