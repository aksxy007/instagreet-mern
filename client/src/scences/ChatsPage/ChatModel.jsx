import React, { useState } from "react";
import { Box, Modal,IconButton, Typography, Button } from "@mui/material";
import ChatsWidget from "scences/widgets/ChatsWidget";
import { ExpandLess, ExpandMore, Close, Message } from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import ChatWidget from "scences/widgets/ChatWidget";


const ChatPopup = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);

  const handleClose = () => { // Prevent the modal from closing on background click
    setIsOpen(!isOpen); // Call the onClose function from the parent component
  };

  const handleToggleExpand = () => { // Prevent the modal from closing on button click
    setIsExpanded(!isExpanded);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleModalClick = (e) => {
    // Prevent closing if clicking inside the modal
    e.stopPropagation();
  };

  const openChat = (friendId) => {
    setCurrentChat(friendId);
  };

  const goBackToChats = () => {
    setCurrentChat(null);
  };
  



  console.log("current chat in modal;",currentChat)
   
  return (
    <>
    <Button sx={{width:"0"}} onClick={handleToggle}>
    <Message sx={{ fontSize: "25px" }} />
    </Button>
    <Modal open={isOpen} onClose={handleClose} >
        <div onClick={handleModalClick}>
        <Box
        sx={{
          position: "fixed",
          bottom: 0,
          right: "1%",
          width: "100%",
          maxWidth: 400, // Adjust the maximum width as needed
          height:isExpanded? "600px":"50px",
          bgcolor: "background.paper",
          p: 2,
          boxShadow: 24,
          borderRadius:"1rem 1rem 0 0",
        }}
      >
        <FlexBetween>
        <IconButton onClick={handleToggleExpand}>
            {isExpanded ? <ExpandLess/> : <ExpandMore/>}
          </IconButton>
        <Typography fontSize={"1rem"}>
            Chats
        </Typography>

        {/* Close button */}
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
        </FlexBetween>
        
        {/*chats widgets */}
        {currentChat ? (
              <ChatWidget friendId={currentChat} onBack={goBackToChats} isExpanded={isExpanded} />
            ) : (
              <ChatsWidget onChatClick={openChat} />
            )}
        {/* <ChatsWidget /> */}
      </Box>
        </div>
    </Modal>
    </>
    
  );
};

export default ChatPopup;
