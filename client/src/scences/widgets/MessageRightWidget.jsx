import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import FlexEnd from "components/FlexEnd";
import FlexStart from "components/FlexStart";
import UserImage from "components/UserImage";
import React, { useEffect, useState } from "react";
import { format } from "timeago.js";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useDispatch } from "react-redux";
import { markMessageAsRead } from "state/chatSlice";

const MessageRightWidget = ({ message,user}) => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const [isRead,setIsRead] = useState(message?.read);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if the message is read
      // For example, you can check if the message has been read within the last 5 seconds
      const isMessageRead = message.read;
      setIsRead(isMessageRead);
      if (!isMessageRead) {
        // Dispatch an action to mark the message as read after a timeout
        dispatch(markMessageAsRead({ chatId: message.chatId, messageId: message.id }));
      }
    }, 1000); // Check every 1 seconds

    return () => clearTimeout(timer); // Clear the timer on component unmount
  }, [message, dispatch]);

  return (
       <FlexEnd gap={'1rem'} width={"100%"} mt={"1rem"}>
        <UserImage size="30px" image={user.picturePath} />
          <FlexEnd
          px={"0.6rem"}
          py={"0.6rem"}
            flexDirection={"column"}
            width={"60%"}
            sx={{
              backgroundColor: palette.background.default,
              borderRadius: "9px",
            }}
          >
            <FlexStart width={"100%"}>
              <Typography fontSize={"0.75rem"}>{message.message}</Typography>
            </FlexStart>
            <FlexEnd gap={"0.5rem"} width={"100%"}>
              <Typography fontSize="0.5rem">
                {format(message.createdAt)}
              </Typography>
              {(message.read===false || message.read==true) && (
              <Typography>
                {isRead ? <DoneAllIcon fontSize="inherit" sx={{color:palette.primary.main}}/> : <DoneAllIcon fontSize="inherit" color="grey"/>}
              </Typography>
              )
            }
            </FlexEnd>
          </FlexEnd>
        </FlexEnd>
    
  );
};

export default MessageRightWidget;
