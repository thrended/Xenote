import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export function useSwipe
(onSwipeLeft?: any, onSwipeRight?: any, 
onSwipeUp?: any, onSwipeDown?: any, rangeOffset = 4) 
{

    let firstTouchX = 0
    let initialY = 0
    // set user touch start position
    function onTouchStart(e: any) {
        firstTouchX = e.nativeEvent.pageX
        initialY = e.nativeEvent.pageY
    }

    // when touch ends check for swipe directions
    function onTouchEnd(e: any){

        // get touch position and screen size
        const positionX = e.nativeEvent.pageX
        const positionY = e.nativeEvent.pageY
        const rangeX = windowWidth / rangeOffset
        const rangeY = windowHeight / rangeOffset
        const dX = positionX - firstTouchX
        const dY = positionY - initialY
        let priorityX = Math.abs(dX) >= Math.abs(dY)
        // check if X-position is growing positively and has reached specified range
        if(priorityX)
            {
            if(positionX - firstTouchX > rangeX){
                console.log("right swipe performed: X = ", firstTouchX, " => ", positionX)
                onSwipeRight && onSwipeRight()
            }
            // check if X-position is growing negatively and has reached specified range
            else if(firstTouchX - positionX > rangeX){
                console.log("left swipe performed: X = ", firstTouchX, " => ", positionX)
                onSwipeLeft && onSwipeLeft()
            }
        }
        // check if Y-position is growing negatively and has reached specified range
        else
        {
            if(initialY - positionY > rangeY){
                console.log("up swipe performed: Y = ", initialY, " => ", positionY)
                onSwipeUp && onSwipeUp()
            }
            // check if Y-position is growing positively and has reached specified range
            else if(positionY - initialY > rangeY){
                console.log("down swipe performed: Y = ", initialY, " => ", positionY)
                onSwipeDown && onSwipeDown()
            }
        }
    }

    return {onTouchStart, onTouchEnd};
} 