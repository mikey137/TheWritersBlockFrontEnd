import React, { useState, useEffect, useContext} from 'react'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { UserContext } from '../UserContext';
import StoryPreview from './StoryPreview';
import { apiProvider } from '../services/apiProvider';

function TabPanel({children, value, index}) {
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
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
    const [mostViewedStories, setMostViewededStories] = useState()
    const [newestStories, setNewestStories] = useState()

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    const handleGetMyStories = async (userId) => {
        const stories = await apiProvider.getMyStories(userId)
        setMyStories(stories)
    }

    const handleGetMostViewedStories = async () => {
        const stories = await apiProvider.getMostViewedStories()
        setMostViewededStories(stories)
    }

    const handleGetNewestStories = async () => {
        const stories = await apiProvider.getNewestStories()
        setNewestStories(stories)
    }

    useEffect(() => {
        handleGetMostViewedStories()
        handleGetNewestStories()
    },[])

    useEffect(() => {
        handleGetMyStories(userContext[0].user_id)
    },[userContext])

    return(
        <div className = "dashboard-container">
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                    <Tab label="My Stories" {...a11yProps(0)} />
                    <Tab label="Most Viewed Stories" {...a11yProps(1)} />
                    <Tab label="Newest Stories" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <div className="stories-wrapper">
                        {myStories?.map(story => (
                            <StoryPreview story = {story} key = {story.story_id} />
                        ))} 
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div className="stories-wrapper">
                        {mostViewedStories?.map(story => (
                            <StoryPreview story = {story} key = {story.story_id}/>
                        ))} 
                    </div>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <div className="stories-wrapper">
                        {newestStories?.map(story => (
                            <StoryPreview story = {story} key = {story.story_id}/>
                        ))} 
                    </div>
                </TabPanel>
            </Box>
        </div>
    )
}