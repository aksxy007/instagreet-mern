import { Box, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import Navbar from 'scences/navbar';
import AdvertWigdet from 'scences/widgets/AdvertWidget';
import FriendListWidget from 'scences/widgets/FriendListWidget';
import MyPostWidget from 'scences/widgets/MyPostWidget';
import PostsWidget from 'scences/widgets/PostsWidget';
import UserWidget from 'scences/widgets/UserWidget';

const Profile = () => {
  const [user,setUser] = useState(null)
  const {userId} = useParams();
  const token = useSelector((state)=>state.auth.token)
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)")

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); 

  if(!user) return null;
  return (
    <Box>
      <Navbar/>
      <Box 
        width={"100%"}
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex":"block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%":undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath}/>
          <Box m="2rem 0"/> 
          <FriendListWidget userId={userId}/> 
        </Box>
        <Box flexBasis={isNonMobileScreens ? "48%":undefined} mt={isNonMobileScreens ? undefined:"2rem"} >
          <MyPostWidget picturePath={user.picturePath} />
          <PostsWidget userId={userId} isProfile={true} />
        </Box>
        {isNonMobileScreens && <Box flexBasis="26%">
            <AdvertWigdet/>      
          </Box>}
      </Box>
    </Box>
  )
}

export default Profile