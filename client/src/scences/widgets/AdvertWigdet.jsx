import { useTheme } from '@emotion/react'
import { Typography } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';
import React from 'react'

const AdvertWigdet = () => {
    const {palette} = useTheme()
    const dark = palette.neutral.dark;
    const main = palette.neutral.dark;
    const medium = palette.neutral.dark;


  return (
    <WidgetWrapper>
        <FlexBetween>
            <Typography color={dark} variant='h5' fontWeight="500">
                Sponsored
            </Typography>
            <Typography color={medium}>
                Create Ad
            </Typography>
        </FlexBetween>
        <img width="100%" height="auto" alt='advert' src='http://localhost:3001/assets/info4.jpeg' style={{borderRadius:"0.75rem",margin:"0.75rem 0"}}/>
        <FlexBetween>
            <Typography color={main}>
                MikaCosmentics
            </Typography>
            <Typography color={medium}>
                mikacosmentics.com
            </Typography>
        </FlexBetween>
        <Typography color={medium} m='0.5rem 0'>
                Your pathway to stunning and immaculate beauty and made sure your skin 
                is exfoliating skin and shining like light.
        </Typography>
    </WidgetWrapper>
  )
}

export default AdvertWigdet