import { useTheme } from "@emotion/react";
import { Box, Button, Divider, IconButton, Typography, useMediaQuery } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import React from "react";
import MyCommentWidget from "./MyCommentWidget";
import UserImage from "components/UserImage";
import Friend from "components/Friend";
import { useNavigate } from "react-router-dom";
import FlexStart from "components/FlexStart";
import FlexEnd from "components/FlexEnd";
import { DeleteOutline, EditOutlined, FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const CommentWidget = ({ comments, postId }) => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const mediumMain = palette.neutral.mediumMain;
  const primary = palette.primary.main;

  const isNonMobileScreens = useMediaQuery("(min-width:1000px)")

  const pad = isNonMobileScreens?"0.8rem":"0"
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state)=>state.auth.token)

  const handleDeleteComment=async (commentId)=>{
    const response = await fetch(`http://localhost:3001/posts/${postId}/comments/${commentId}`,{
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    }})

    const updatePost = await response.json();
    // console.log("updatePost->comment",updatePost)
    dispatch(setPost({post:updatePost}))
  }

  const patchCommentLike = async (commentId) => {
    const resposne = await fetch(`http://localhost:3001/posts/${postId}/comments/${commentId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user._id }),
    });

    const updatedPost = await resposne.json();
    // console.log(updatedPost)
    dispatch(setPost({ post: updatedPost }));
  };

  return (
    <WidgetWrapper>
      <Box display="flex" justifyContent="center" mb="1rem">
        <Typography fontWeight="500" fontSize="1.2rem" color={main}>
          Comments
        </Typography>
      </Box>
      <Box height="200px" overflow="auto" p={pad}>
        {comments.map((comment, i) => (
          <FlexBetween
            
            gap="1rem"
            sx={{
              backgroundColor: palette.neutral.light,
              borderRadius: "0.5rem",
              padding: "0.3rem 0.2rem",
              margin: "0 0 0.5rem 0",
            }}
          >
            <FlexStart gap="1rem" width={"80%"}>
              <UserImage size="45px" image={comment.userPicturePath} />
              <Box
                onClick={() => {
                  navigate(`/profile/${comment.userId}`);
                  navigate(0);
                }}
              >
                <Typography
                  color={main}
                  variant="h5"
                  fontSize={isNonMobileScreens?"1rem":"0.8rem"}
                  fontWeight="500"
                  sx={{
                    "&:hover": {
                      color: palette.primary.dark,
                      cursor: "pointer",
                    },
                  }}
                >
                  {`${comment.firstName} ${comment.lastName}`}
                </Typography>
                <Box>
                  <Typography color={medium}
                  variant="h5"
                  fontSize={isNonMobileScreens?"1rem":"0.7rem"}
                  fontWeight="300">{comment.text}</Typography>
                </Box>
              </Box>
            </FlexStart>
            <FlexEnd gap="0rem">
            <IconButton onClick={()=>patchCommentLike(comment._id)}>
              {Boolean(comment.likes[user._id]) ? (
                <FavoriteOutlined fontSize="0.9rem" sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined fontSize="0.9rem"/>
              )}
            </IconButton>
            <Typography color={main}
                  variant="h5"
                  fontSize={isNonMobileScreens?"1rem":"0.8rem"}
                  fontWeight="500">{Object.keys(comment.likes).length}</Typography>
            </FlexEnd>

            {comment?.userId === user?._id ? (
              <FlexEnd gap="0.2rem" width={"10%"}>
                <Button onClick={()=>handleDeleteComment(comment._id)}>
                  <DeleteOutline sx={{ color: mediumMain, ":hover":{
                    color:"rgb(255 0 0)"
                  } }}  />
                </Button>
              </FlexEnd>
            ) : (
              <FlexEnd></FlexEnd>
            )}
            
          </FlexBetween>
        ))}
      </Box>
      <FlexBetween>
        <MyCommentWidget postId={postId} />
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default CommentWidget;
