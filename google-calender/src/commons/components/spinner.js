import React from 'react';
import { keyframes, Box, styled } from '@sparrowengg/twigs-react';

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' }
});

const StyledBox = styled(Box, {
  borderRradius: '50%',
  width: '$7',
  height: '$7',
  borderRadius: '$round',
  borderStyle: 'solid',
  borderWidth: '$md',
  borderBottomColor: `$neutral300`,
  borderRightColor: '$neutral300',
  borderTopColor: '$neutral900',
  borderLeftColor: '$neutral900',
  animationDuration: '600ms',
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite',
  willChange: 'transform',
  animationName: `${spin}`,
  variants: {
    size: {
      sm: {
        width: '$5',
        height: '$5'
      },
      md: {
        width: '$7',
        height: '$7'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
});


export const Spinner = ({size}) =>{
  return (<StyledBox size={size} />)
}