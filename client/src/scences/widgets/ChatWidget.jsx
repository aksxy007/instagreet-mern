import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  Typography,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import FlexStart from "components/FlexStart";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import { addMessage, setCurrentChat, setMessages } from "state/chatSlice";
import MessageWidget from "./MessageWidget";
import ScrollableBox from "components/ScrollableBox";
import Loader from "components/Loader";

import io from 'socket.io-client';



const ChatWidget = ({ friendId, onBack, isExpanded }) => {
  const dispatch = useDispatch();
  const [friend, setFriend] = useState(null);
  const [user, setUser] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");
  const navigate = useNavigate();
  const socket = useRef()
  const w = "100%";

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const neutralLight = palette.neutral.light;
  const [newMessage,setNewMassage] = useState("");
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  
  const currentChat = useSelector((state) => state.chat.currentChat);
  const currentMessage = useSelector((state) => state.chat.messages)||[];

  const userId = useSelector((state) => state.auth.user._id);

  const handleMessage = async () => {
    if (!messageText.trim()) return;

    const chatResponse = await fetch(`http://localhost:3001/chats/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ senderId: userId, receiverId: friendId }),
    });

    const chat = await chatResponse.json();
    dispatch(setCurrentChat({ chat }));
    // console.log("current chat", chat);


    socket.current.emit('sendMessage', {
      chatId:chat._id,
      senderId: userId,
      receiverId: friendId,
      messageText: messageText,
    });

    const messageResponse = await fetch(`http://localhost:3001/message/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId: userId,
        receiverId: friendId,
        messageText,
      }),
    });

    const message = await messageResponse.json();
    // console.log("sent message", message);
    dispatch(addMessage({ chatId: currentChat._id, message }));

    setMessageText("");
  };

  const getFriendUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${friendId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    setFriend(data);
  };

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    setUser(data);
  };

  const setPresentChat = async () => {
    // console.log("called function");
    const chatResponse = await fetch(
      `http://localhost:3001/chats/find/${userId}/${friendId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const chat = await chatResponse.json();
    // console.log("current chat", chat);
    dispatch(setCurrentChat({ chat }));
  };

  const getCurrentUserChats = async () => {
    const messageResponse = await fetch(
      `http://localhost:3001/message/${currentChat._id}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const messages = await messageResponse.json();
    // console.log(messages);
    dispatch(setMessages({ messages }));
  };

  useEffect(()=>{
    socket.current=io.connect('http://localhost:3001')
    socket.current.on("getMessage",(data)=>{
      dispatch(addMessage({
        chatId: data.chatId,
        message: { sender: data.senderId, message: data.messageText },
      }));
  });
  return () => {
    socket.current.disconnect();
  };
  },[dispatch])

  useEffect(()=>{
    socket.current.emit("addUser",userId)
    socket.current.on("getUsers",(connected_users)=>console.log(connected_users))

  },[userId])

  
  
  useEffect(() => {
    getUser();
    getFriendUser();
    setPresentChat();
  }, []);


  useEffect(() => {
      // Set chat data after fetching (example);
      getCurrentUserChats(); 
      setLoading(false); // Set loading to false after data is loaded
  }, [currentChat]);


  if (friend === null || user === null || currentMessage===null) return null;

  // console.log("current chat after load", currentChat);
  // console.log("current chat id", currentChat._id);
  // console.log("current messsages", currentMessage);

  return (
    <>
    {loading? (<Box height={"100%"} display="flex" justifyContent='center' alignItems={'center'}>
      <Loader/>
    </Box>):(
      <>
      {isExpanded ? (
        <Box mt={"1rem"} height={"100%"}>
        <Box>
          <FlexStart mt="1rem" mx="0" gap="0.5rem">
            <Button onClick={onBack}>
              <ArrowBackIcon />
            </Button>
            <UserImage image={friend.picturePath} />
            <Box
              onClick={() => {
                navigate(`/profile/${friendId}`);
                navigate(0);
              }}
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
              <Typography color={medium}>{friend.location}</Typography>
            </Box>
          </FlexStart>
          <Divider sx={{ mt: "1rem" }} />
        </Box>
  
        <ScrollableBox
          display={"flex"}
          flexDirection={"column"}
          justifyContent="start"
          mt={"1rem"}
          height={"60%"}
        >
          {currentMessage?.map((message) => (
            <MessageWidget message={message} user={user} friend={friend} />
          ))}
        </ScrollableBox>
        <FlexBetween
          mx={"1rem"}
          position={"absolute"}
          left={0}
          right={0}
          bottom={"3%"}
          backgroundColor={neutralLight}
          borderRadius="9px"
          gap="3rem"
          padding="0.1rem 0.3rem"
          
        >
          <InputBase
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            value={messageText}
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
              padding: "0.5rem 0.5rem",
            }}
            fullWidth
          />
          <IconButton onClick={handleMessage}>
            <SendIcon />
          </IconButton>
        </FlexBetween>
      </Box>
      ):(<></>)}
      </>
      
      
    )
  }
    </>
    
  );
};

export default ChatWidget;
