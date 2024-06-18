import { createSlice } from "@reduxjs/toolkit";

const initialChatState = {
    chats: [],
    currentChat: null,
    messages: []
};

export const chatSlice = createSlice({
    name: "chat",
    initialState: initialChatState,
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload.chats;
        },
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload.chat;
            // state.messages = action.payload.chat.messages;
        },
        setMessages: (state, action) => {
            state.messages = action.payload.messages;
        },
        addMessage: (state, action) => {
            if (state.currentChat && state.currentChat._id === action.payload.chatId) {
                state.messages=[...state.messages, action.payload.message]
            }
        },
        markMessageAsRead: (state, action) => {
            const { chatId, messageId } = action.payload;
            const chat = state.chats.find(chat => chat.id === chatId);
            if (chat) {
              const message = chat.messages.find(message => message.id === messageId);
              if (message) {
                message.read = true;
              }
            }
           
          },
    }
});


export const {
    setChats,
    setCurrentChat,
    setMessages,
    addMessage,
    markMessageAsRead,
} = chatSlice.actions;

export default chatSlice.reducer;