import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import MessageLeftWidget from './MessageLeftWidget';
import MessageRightWidget from './MessageRightWidget';
import { useSelector } from 'react-redux';

const MessageWidget = ({message,user,friend}) => {
  // console.log("message",message)
  return (
    <Box px={"1rem"} width={"100%"}>
        {message.sender !== user._id?(
            <MessageLeftWidget message={message} friend={friend}/>
        ):(
            <MessageRightWidget message={message} user={user}/>
        )}
    </Box>
  )
}

export default MessageWidget