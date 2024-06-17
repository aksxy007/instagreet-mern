import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter,Navigate,Routes,Route } from "react-router-dom";
import HomePage from "scences/homePage";
import LoginPage from "scences/loginPage";
import Profile from "scences/profile";
import { themeSettings } from "./theme.js";
import ChatsPage from "scences/ChatsPage/index.jsx";
import ChatPage from "scences/ChatPage/index.js";


function App() {
  const mode = useSelector((state)=>state.auth.mode)
  const theme = useMemo(()=> createTheme(themeSettings(mode)),[mode]);
  const isAuth = Boolean(useSelector((state)=>state.auth.token))
  // console.log("isAuth",isAuth)
  return (
    <div className="app">
      <BrowserRouter>
      <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/home" element={isAuth ? <HomePage/>:<Navigate to="/"/>}/>
          <Route path="/profile/:userId" element={isAuth ? <Profile/>:<Navigate to="/"/>}/>
          {/* <Route path="/chats/:userId" element={isAuth?<ChatsPage/>:<Navigate to='/'/>}/> */}
          {/* <Route path="/chats/:userId/chat/:friendId" element={isAuth?<ChatPage/>:<Navigate to='/'/>}/> */}
        </Routes>
      </ThemeProvider>
        
      </BrowserRouter>
    </div>
  );
}

export default App;
