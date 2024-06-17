import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import FlexEnd from "components/FlexEnd";
import FlexStart from "components/FlexStart";
import UserImage from "components/UserImage";
import React from "react";
import { format } from "timeago.js";

const MessageLeftWidget = ({ message,friend }) => {
  const { palette } = useTheme();
  return (
       <FlexStart gap={"1rem"} width={"100%"} mt={"1rem"}>
        <UserImage size="30px" image={friend.picturePath}/>
          <FlexStart
          px={"0.6rem"}
          py={"0.6rem"}
            flexDirection={"column"}
            width={"60%"}
            sx={{
              backgroundColor: palette.primary.main,
              borderRadius: "9px",
            }}
          >
            <FlexStart width={"100%"}>
              <Typography fontSize={"0.75rem"}>{message.message}</Typography>
            </FlexStart>
            <FlexEnd width={"100%"}>
              <Typography fontSize="0.5rem">
                {format(message.createdAt)}
              </Typography>
            </FlexEnd>
          </FlexStart>
        </FlexStart>
    
  );
};

export default MessageLeftWidget;
