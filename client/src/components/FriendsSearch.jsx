import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setFriends } from 'state';
import FlexBetween from './FlexBetween';
import UserImage from './UserImage';
import { Box, Divider, IconButton, Typography } from '@mui/material';
import { PersonAddOutlined, PersonRemoveOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';

const FriendsSearch = ({friendId,name,subtitle,userPicturePath}) => {
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
    const neutralLight = palette.neutral.light;
    
    

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
    <FlexBetween mx="1rem" py="0.5rem" px="0.8rem" sx={{borderRadius:"0.75rem"}}>
        <FlexBetween gap="0.6rem">
            <UserImage size='45px' image={userPicturePath}/>
            <Box 
                
            >
                <Typography
                    color={primaryDark}
                    variant='h5'
                    fontWeight='500'
                    fontSize={'0.9rem'}
                    sx={{
                        "&:hover":{
                            color:palette.primary.main,
                            cursor:"pointer"
                        }
                    }}
                >
                    {name}
                </Typography>
                <Typography textOverflow={"ellipsis"} fontSize={"0.8rem"} color={medium}>
                    {subtitle}
                </Typography>
            </Box>
        </FlexBetween>
        <IconButton
            
            onClick={()=>patchFriend()}
            sx={{
                backgroundColor:primaryLight,
                p:"0.6rem",
                width:"30px",
                height:"30px"
                
            }}
        >
            {isFriend ?(
                <PersonRemoveOutlined fontSize='0.8rem' sx={{color:primaryDark}}/>
            ):(
                <PersonAddOutlined fontSize='0.8rem' sx={{color:primaryDark}}/>
            )}
        </IconButton>
    </FlexBetween>
    
    
  )
}

export default FriendsSearch