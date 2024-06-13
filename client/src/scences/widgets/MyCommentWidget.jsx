 import { useTheme } from '@emotion/react'
import { AttachFileOutlined, DeleteOutline, EditOutlined, GifBoxOutlined, ImageOutlined, MicOutlined, MoreHorizOutlined, SendOutlined } from '@mui/icons-material'
import { Box, Button, Divider, InputBase, Typography, useMediaQuery } from '@mui/material'
import FlexBetween from 'components/FlexBetween'
import FlexEnd from 'components/FlexEnd'
import FlexStart from 'components/FlexStart'
import UserImage from 'components/UserImage'
import WidgetWrapper from 'components/WidgetWrapper'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPost } from 'state'
 
 const MyCommentWidget = ({postId}) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const { palette } = useTheme();
  const { _id,firstName,lastName,picturePath } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

    const handleComment =async ()=>{
      const response=await fetch(`http://localhost:3001/posts/${postId}/comments`,{
        method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: _id,firstName:firstName,lastName:lastName,text:comment,userPicturePath:picturePath })
      })
      const data = await response.json();
      console.log(data)
      dispatch(setPost({post:data}))
      setComment("")
    } 


   return (
    <WidgetWrapper width={"100%"} mb="1rem">
    <FlexBetween gap="0.5rem">
      <UserImage image={picturePath} size='45px' />
      <InputBase
        placeholder="comment"
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        sx={{
          width: "100%",
          backgroundColor: palette.neutral.light,
          borderRadius: "2rem",
          padding: "0.5rem 1rem",
        }}
      />
    </FlexBetween>
    <Divider sx={{ margin: "1.25rem 0" }} />
    <FlexEnd gap="1rem">
      <Button
        disabled={!comment}
        onClick={handleComment}
        sx={{
          color: palette.background.default,
          backgroundColor: palette.primary.main,
          borderRadius: "3rem",
          "&:hover":{
            cursor:'pointer'
          }
        }}
      >
        <SendOutlined/>
      </Button>
    </FlexEnd>
  </WidgetWrapper>
   )
 }
 
 export default MyCommentWidget