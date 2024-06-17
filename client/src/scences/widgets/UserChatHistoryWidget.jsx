import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import FlexStart from "components/FlexStart";
import UserImage from "components/UserImage";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {format} from 'timeago.js';

const UserChatHistoryWidget = ({ chat }) => {
  const { palette } = useTheme();
  const {users, lastMessage} = chat;
  // console.log("users in chatHistory",users)
  const loggedInUser = useSelector((state)=>state.auth.user?._id);
  const otherUserId =  users.senderId === loggedInUser ? users.receiverId : users.senderId;
  const token = useSelector((state)=>state.auth.token)
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const [friend,setFriend] = useState(null);
  const navigate = useNavigate();

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${otherUserId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    setFriend(data);
  };

  useEffect(()=>{
    getUser();
  },[])

  if(friend===null) return;

  // console.log(lastMessage)

  return (
    <>
    {lastMessage!==null ? (<FlexBetween py={"0.5rem"} gap="1rem">
      <FlexStart gap={"1rem"}>
      <UserImage image={friend.picturePath} />
      <Box
      >
        <Typography
          color={main}
          variant="h5"
          fontWeight="500"
          sx={{
            "&:hover": {
              color: palette.primary.light,
              cursor: "pointer",
            },
          }}
        >
          {`${friend.firstName} ${friend.lastName}`}
        </Typography>
        {/* <Typography color={medium}>{`${friend.firstName}:`} {lastMessage?.message}</Typography> */}
        {lastMessage?.sender===loggedInUser?(
          
          <Typography color={medium}>You: {lastMessage?.message}</Typography>
        ):(
          <Typography color={medium}>{`${friend.firstName}:`} {lastMessage?.message}</Typography>
        )}
        
      </Box>
      </FlexStart>
      <Box>
        <Typography fontSize={"0.5rem"} color={medium}>
          {format(lastMessage?.createdAt)}
        </Typography>
      </Box>
    </FlexBetween>):(
      <></>
    )
    }
    </>
    
  );
};

export default UserChatHistoryWidget;
