import React, { useEffect } from 'react';
import {
  View,
  Animated,
  PanResponder
} from 'react-native';
/* Credits to: https://github.com/nikhil-gogineni/react-native-swipe-gesture */
const SwipeGesture = (props: any) => {
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        const x = gestureState.dx;
        const y = gestureState.dy;
        if (Math.abs(x) > Math.abs(y)) {
          if (x >= 0) {
            props.onSwipePerformed('right')
          }
          else {
            props.onSwipePerformed('left')
          }
        }
        else {
          if (y >= 0) {
            props.onSwipePerformed('down')
          }
          else {
            props.onSwipePerformed('up')
          }
        }
      }
    })).current;

  return (
    <Animated.View {...panResponder.panHandlers} style={props.gestureStyle}>
      <View>{props.children}</View>
    </Animated.View>
  )
}

export default SwipeGesture;
