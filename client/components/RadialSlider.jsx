/*
TODO: Implement this pseudocode (all these events should be on the entire document)
(THESE ASSUME THE CANVAS IS NOT MOVING RELATIVE TO THE DOCUMENT DURING THE SLIDER SECTIONS)
(THIS SHOULD PROBABLY BE SEPARATE FROM AND OVER THE STARCANVAS BASED ON THE COMPS)
On touch down:
 If there is no active touch:
  If the event is touchdown:
   Find the first e.changedTouches within the circle handle
   If found, set the active touch to its identifier prop
   and offset to the offset from the current handle center
  Else if the event is mousedown:
   If the mouse is within the circle handle, set the active touch to mouse
   and offset to the offset from the current handle center
On touch move:
 If active touch is touchscreen and e.type is touchdown or touchmove and
 one of e.changedTouches has an identifier prop matching the active touch:
  Get rawX and rawY from e.changedTouches of index corresponding to active touch
 Else if active touch is mouse and e.type is mousedown or mousemove:
  Get rawX and rawY from e itself
 If rawX and rawY were determined:
  Use them and the offset to determine the new handle position
On touch up:
 Basically the same as touch move but instead of setting rawX and rawY
 we unset active touch and handle offset
*/

/*
const getMouse = (e) => {
  const mouse = {};
  let rawX;
  let rawY;

  switch (e.type) {
    case 'touchdown':
    case 'touchmove':
      rawX = e.touches[0].pageX;
      rawY = e.touches[0].pageY;
      break;
    case 'mousedown':
    case 'mousemove':
    default:
      rawX = e.pageX;
      rawY = e.pageY;
      break;
  }

  mouse.x = (rawX - canvasEl.offsetLeft)
        * (starCanvasWidth / canvasEl.offsetWidth) - starCanvasWidthHalf;
  mouse.y = (rawY - canvasEl.offsetTop)
        * (starCanvasHeight / canvasEl.offsetHeight) - starCanvasHeightHalf;

  return mouse;
};
*/
