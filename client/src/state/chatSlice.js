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
            state.messages = action.payload.chat.messages;
        },
        setMessages: (state, action) => {
            state.messages = action.payload.messages;
        },
        addMessage: (state, action) => {
            if (state.currentChat && state.currentChat._id === action.payload.chatId) {
                state.messages.push(action.payload.message);
            }
        }
    }
});


export const {
    setChats,
    setCurrentChat,
    setMessages,
    addMessage
} = chatSlice.actions;

export default chatSlice.reducer;