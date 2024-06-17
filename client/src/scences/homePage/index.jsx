import { Box, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Navbar from 'scences/navbar'
import UserWidget from 'scences/widgets/UserWidget'
import MyPostWidget from 'scences/widgets/MyPostWidget'
import PostsWidget from 'scences/widgets/PostsWidget'
import AdvertWigdet from 'scences/widgets/AdvertWidget'
import FriendListWidget from 'scences/widgets/FriendListWidget'
import ChatPage from 'scences/ChatPage'

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
  const {_id,picturePath} = useSelector((state)=>state.auth.user);


  return (
    <Box>
      <Navbar/>
      <Box 
        width={"100%"}
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex":"block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%":undefined}>
          <UserWidget userId={_id} picturePath={picturePath}/>
        </Box>
        <Box flexBasis={isNonMobileScreens ? "48%":undefined} mt={isNonMobileScreens ? undefined:"2rem"} >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id}/>
        </Box>
        {isNonMobileScreens && <Box flexBasis="26%">
            <AdvertWigdet/> 
            <Box m="2rem 0"/> 
            <FriendListWidget userId={_id}/>      
          </Box>}
        
      </Box>
    </Box>
  )
}

export default HomePage