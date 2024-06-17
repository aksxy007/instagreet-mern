import { useTheme } from "@emotion/react";
import { Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  Typography,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setChats } from "state/chatSlice";
import UserChatHistoryWidget from "./UserChatHistoryWidget";
import ChatWidget from "./ChatWidget";
import FriendsSearch from "components/FriendsSearch";
import Navbar from "scences/navbar";
import ScrollableBox from "components/ScrollableBox";

const ChatsWidget = ({onChatClick}) => {
  const { palette } = useTheme();
  const neutralLight = palette.neutral.light;
  const primary = palette.primary.main;
  const mediumMain = palette.neutral.mediumMain;

  const loggedInUserId = useSelector((state) => state.auth.user._id);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const chats = useSelector((state) => state.chat.chats);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isChat, setIsChat] = useState(false);

  const handleSearch = () => {
    getAllUsers();
  };
  const getAllUsers = async () => {
    const response = await fetch(`http://localhost:3001/users/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const users = await response.json();
    // console.log("all Users", users);
    return setSearchResults(
      users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(search.toLowerCase()) ||
          user.lastName.toLowerCase().includes(search.toLowerCase()) ||
          user.location.toLowerCase().includes(search.toLowerCase()) ||
          user.occupation.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  const getUserChats = async () => {
    const response = await fetch(`http://localhost:3001/chats/${user._id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userChats = await response.json();
    dispatch(setChats({ chats: userChats }));
  };

  useEffect(() => {
    if (user._id) getUserChats();
  }, [user._id, dispatch, token]);

  useEffect(() => {
    getAllUsers();
  }, [search]);

  // console.log("chats", chats);
  return (
    <WidgetWrapper mt={"1rem"} mx={"0.1rem"} height={"95%"}>
      <ScrollableBox height={"100%"}>
        <FlexBetween
          position={"relative"}
          backgroundColor={palette.neutral.light}
          borderRadius="9px"
          gap="3rem"
          padding="0.1rem 0.3rem"
        >
          <InputBase
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find a chat..."
            value={search}
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
              padding: "0 0.5rem",
            }}
          />
          <IconButton onClick={handleSearch}>
            <Search />
          </IconButton>
          {search !== "" ? (
            
            <Box
              py="1rem"
              position={"absolute"}
              top="50%"
              left={0}
              zIndex={100}
              width={"100%"}
              my={"2rem"}
              sx={{ borderRadius: "0.75rem", backgroundColor: palette.neutral.light }}
            >
              {searchResults?.map((user) => (
                <Box py={"0.2rem"} onClick={()=> onChatClick(user._id)}>
                  <FriendsSearch
                    friendId={user._id}
                    name={`${user.firstName} ${user.lastName}`}
                    userPicturePath={user.picturePath}
                    subtitle={user.occupation}
                  />
                  <Divider sx={{color: palette.neutral.dark, margin: "0.3rem" }} />
                </Box>
              ))}
            </Box>
          ) : (
            <></>
          )}
        </FlexBetween>
        <FlexBetween>
          <Box width={"100%"} zIndex={2} mt={"1rem"}>
            {chats && chats.length > 0 ? (
              chats.map((chat) => (
              <Box width={"100%"} key={chat._id} onClick={()=> onChatClick(chat.users.senderId===user._id?chat.users.receiverId:chat.users.senderId)}>
                  <UserChatHistoryWidget chat={chat} />
                  <Divider />
                </Box>)
              )
            ) : (
              <Typography fontSize={"2rem"} color={neutralLight}>No chats Available!</Typography>
            )}
          </Box>
        </FlexBetween>
      </ScrollableBox>
    </WidgetWrapper>
  );
};

export default ChatsWidget;
