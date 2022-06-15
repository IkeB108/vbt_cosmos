function clickBegin(){
  mousepos_at_press = {x:mousepos.x,y:mousepos.y}
  setStarsAtPress();
  setNebulasAtPress();
  textImageLocation_at_press = textImageLocation;
}
function clickEnd(){
  var avg = 0;
  for(var i = 1; i < mousepos_array.length; i ++){
    avg += mousepos_array[i].x - mousepos_array[i-1].x
  }
  avg /= (mousepos_array.length-1)
  starSpeed = avg/width
}
function clickMove(){
  
}
function mouseWheel(){
  
}

function setupCanvas(){
  var h = windowHeight - pxSpacing * 2;
  var w = windowWidth - pxSpacing * 2;
  if(h/w <= 1.5)w = h / 1.5;
  resizeCanvas( round(w), round(h) )
  //Set canvas attribute style to "touch-action: none"
}

function windowResized(){
  setupCanvas();
}

function createCanvasEventListeners(){
  /*
  The default mouse behaviors from P5JS are not working
  very well on mobile and I need good tap and drag functionality
  so I'm coding it myself
  */
  document.body.addEventListener("mousedown", mouseDown)
  document.body.addEventListener("mousemove", mouseMove)
  document.body.addEventListener("mouseup", mouseUp)
  document.body.addEventListener("touchstart", touchStart)
  document.body.addEventListener("touchmove", touchMove)
  document.body.addEventListener("touchend", touchEnd)
  onMobile = false;
  logMouse = false; //Set to true to log mouse/touch movements and positions
  mousepos = {'x':null, 'y':null, 'pressed':false, 'isclick':false}
  mousepos2 = {'x':null, 'y':null, 'pressed':false} //Second finger if on mobile
  mousepos_at_press = {x:null,y:null}
  presses_count = 0;
}



function mouseDown(e){
  if(!onMobile){
    if(logMouse)console.log("Mouse down x" + round(mousepos.x) + " y" + round(mousepos.y) )
    // console.log(mousepos)
    mousepos.pressed = true;
    clickBegin();
  }
}
function mouseUp(e){
  if(!onMobile){
    if(logMouse)console.log("Mouse up x" + round(mousepos.x) + " y" + round(mousepos.y) )
    // console.log(mousepos)
    mousepos.pressed = false;
    clickEnd();
  }
}
function mouseMove(e){
  if(!onMobile){
    getMousePosFromEvent(e);
    if(mousepos.pressed)clickMove();
  }
}
function touchMove(e){
  getMousePosFromEvent(e);
  clickMove();
}
function touchStart(e){
  onMobile = true;
  if(logMouse)console.log("Touch start x" + round(mousepos.x) + " y" + round(mousepos.y) )
  getMousePosFromEvent(e);
  mousepos.pressed = true;
  clickBegin();
}
function touchEnd(e){
  // console.log(e)
  if(logMouse)console.log("Touch end x" + round(mousepos.x) + " y" + round(mousepos.y) )
  getMousePosFromEvent(e);
  mousepos.pressed = false;
  clickEnd();
}
function getMousePosFromEvent(e){
  var canvasBounding = canvas.getBoundingClientRect();
  mousepos.x = e.clientX - canvasBounding.x;
  mousepos.y = e.clientY - canvasBounding.y;
  if(e.touches){ //This is a touch, not a mouse click
    if(e.touches.length > 0){ //This is a touch start event.
      presses_count = e.touches.length
      mousepos.x = e.touches[0].clientX - canvasBounding.x;
      mousepos.y = e.touches[0].clientY - canvasBounding.y;
      if(e.touches.length > 1){ //There are two fingers on the screen
        mousepos2.x = e.touches[1].clientX - canvasBounding.x;
        mousepos2.y = e.touches[1].clientY - canvasBounding.y;
      }
    } else { //This is a touch end event
      presses_count = e.changedTouches.length
      mousepos.x = e.changedTouches[0].clientX - canvasBounding.x;
      mousepos.y = e.changedTouches[0].clientY - canvasBounding.y;
      if(e.changedTouches.length > 1){ //There are two fingers on the screen
        mousepos2.x = e.changedTouches[1].clientX - canvasBounding.x;
        mousepos2.y = e.changedTouches[1].clientY - canvasBounding.y;
      }
    }
  }
}
