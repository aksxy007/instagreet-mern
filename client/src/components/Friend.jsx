import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setFriends } from 'state';
import FlexBetween from './FlexBetween';
import UserImage from './UserImage';
import { Box, IconButton, Typography } from '@mui/material';
import { PersonAddOutlined, PersonRemoveOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';


const Friend = ({friendId,name,subtitle,userPicturePath}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const {_id} = useSelector((state)=>state.auth.user)
    const token = useSelector((state)=>state.auth.token)
    const friends = useSelector((state)=>state.auth.user.friends);

    const {palette} =useTheme()
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;
    

    const isFriend =  friends.find((friend)=> friend._id === friendId);

    const patchFriend = async ()=>{
        const resposne = await fetch(`http://localhost:3001/users/${_id}/${friendId}`,{
            method:"PATCH",
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json",
            }
        })

        const data = await resposne.json();
        dispatch(setFriends({friends:data}))
    }

    return (
    <FlexBetween>
        <FlexBetween gap="1rem">
            <UserImage image={userPicturePath}/>
            <Box 
                onClick={()=>{
                    navigate(`/profile/${friendId}`)
                    navigate(0);
                }}
            >
                <Typography
                    color={main}
                    variant='h5'
                    fontWeight='500'
                    sx={{
                        "&:hover":{
                            color:palette.primary.light,
                            cursor:"pointer"
                        }
                    }}
                >
                    {name}
                </Typography>
                <Typography color={medium}>
                    {subtitle}
                </Typography>
            </Box>
        </FlexBetween>
        <IconButton
            onClick={()=>patchFriend()}
            sx={{
                backgroundColor:primaryLight,
                p:"0.6rem"
            }}
        >
            {isFriend ?(
                <PersonRemoveOutlined sx={{color:primaryDark}}/>
            ):(
                <PersonAddOutlined sx={{color:primaryDark}}/>
            )}
        </IconButton>
    </FlexBetween>
  )
}

export default Friend