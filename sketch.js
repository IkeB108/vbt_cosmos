p5.disableFriendlyErrors = true;

function preload(){
  nebulas = [];
  for(var i = 1; i < 8; i ++){
    nebulas.push(
      {
        image:loadImage("nebulas/" + i + ".png"),
      }
    )
  }
  textImage = loadImage("text.png")
}

function setup() {
  pixelDensity(1);
  pxSpacing = 20;
  createCanvas(1,1)
  setupCanvas();
  createCanvasEventListeners();
  logMouse = false;
  
  starCount = 100;
  stars = [];
  stars_at_press = null;
  nebulas_at_press = null;
  for(var i = 0; i < starCount; i ++){
    var x = random(1);
    var y = random(1);
    var z = random(0.002,1);
    var rb = random(-1,1);
    var twinkle_offset = random(1);
    stars.push( {x,y,z,rb,twinkle_offset} )
  }
  
  starSpeed = -0.01;
  
  nebulas = shuffle(nebulas)
  for(var i = 0; i < nebulas.length; i ++){
    nebulas[i].z = (i+1) * 8
    nebulas[i].x = random((-1 * width), width*3)
  }
  
  mg1 = createGraphics(width, height);
  drawMask(mg1);
  
  mg2 = createGraphics(width, height);
  drawMask(mg2);
  
  ng1 = createGraphics(width, height)
  drawNebula(ng1, 255, 0, 255, 0.5);
  
  ng2 = createGraphics(width, height)
  drawNebula(ng2, 207, 17, 89, 0.5);
  
  ng3 = createGraphics(width, height)
  drawNebula(ng3, 129, 79, 255, 0.5 );
  
  ng4 = createGraphics(width, height)
  drawNebula(ng4, 255, 255, 255, 0.4)
  
  mousepos_array = [];
  for(var i = 0; i < 5; i ++)mousepos_array.push({x:0,y:0})
  
  textImageLocation = (width * 1.1);
  
}

function draw() {
  clear();
  background(0);
  image(ng1, 0, 0)
  image(ng2, 0, 0)
  image(ng3, 0, 0)
  image(ng4, 0, 0)
  for(var i = 0; i < nebulas.length; i ++){
    var w = nebulas[i].image.width * (height/nebulas[i].image.height)
    image(nebulas[i].image, nebulas[i].x, 0, w, height )
  }
  drawStars();
  updateStars();
  
  mousepos_array.shift();
  mousepos_array.push( {x:mousepos.x, y:mousepos.y} )
  
  updateTextImage();
  var w = width * 3.5
  var h = textImage.height * (w/textImage.width)
  image(textImage, textImageLocation, height/2, w, h )
}

function drawMask(maskGraphic){
  var cursor = {x:width/2,y:height/2}
  var cursorDirection = 0; //degrees
  maskGraphic.fill(255,0,0); maskGraphic.noStroke();
  maskGraphic.beginShape();
  for(var i = 0; i < 1000; i ++){
    cursor = rotatePoint({x:cursor.x,y:cursor.y-30}, cursorDirection, cursor )
    maskGraphic.vertex(cursor.x, cursor.y)
    cursorDirection += random(-30,30)
  }
  maskGraphic.endShape(CLOSE)
  // maskGraphic.ellipse(width/2 + random(100),height/2 + random(100),300)
}

function drawNebula(nebulaGraphic, r, g, b, threshold, maskGraphicArray){
  var isMask = (maskGraphicArray !== undefined)
  // nebulaGraphic.background(255,0,0)
  var samples = 10000;
  var nscale = 100;
  noiseSeed(random(100))
  // for(var x = 0; x < samples; x ++){
  //   for(var y = 0; y < samples; y ++){
  //     for(var z = 0; z < samples; z ++){
  //       var n = noise(x/nscale,y/nscale,z/nscale)
  //       if(n > 0.6){
  //         var nx = (x/samples) * width;
  //         var ny = (y/samples) * height;
  //         nebulaGraphic.ellipse(nx, ny, n * 20)
  //       }
  //     }
  //   }
  // }
  
  // for(var s = 0; s < samples; s ++){
  //   var x = random(0,width);
  //   var y = random(0, height);
  //   var n = noise(x/nscale, y/nscale);
  //   if(n > 0.3){
  //     nebulaGraphic.ellipse(x, y, n * 20)
  //   }
  // }
  
  nebulaGraphic.loadPixels();
  var p = nebulaGraphic.pixels;
  
  if(isMask){
    var p_arrays = []
    for(var i = 0; i < maskGraphicArray.length; i ++){
      maskGraphicArray[i].loadPixels();
      p_arrays.push( maskGraphicArray[i].pixels )
    }
  }
  for(var i = 0; i < p.length; i += 4){
    var x = floor(i/4) % (nebulaGraphic.width)
    var y = floor( floor(i/4)/nebulaGraphic.width )
    var n = noise(x/nscale, y/nscale);
    n -= (1-threshold);
    if(n < 0)n = 0;
    if(n > 0)n *= 2;
    
    p[i] = n * r;
    p[i + 1] = g;
    p[i + 2] = n * b;
    p[i + 3] = n * 255;
    if(isMask){
      var allAlphas = [];
      for(var j = 0; j < p_arrays.length; j ++){
        allAlphas.push( p_arrays[j][i+3] )
      }
      p[i+3] = lowestVal(allAlphas) * n
    }
  }
  nebulaGraphic.updatePixels();
}

function lowestVal(arrayOfVals){
  var ret = arrayOfVals[0];
  for(var i = 0; i < arrayOfVals.length; i ++){
    if(arrayOfVals[i] < ret)ret = arrayOfVals[i]
  }
  return ret;
}

function setStarsAtPress(){
  stars_at_press = [];
  for(var i = 0; i < stars.length; i ++){
    stars_at_press[i] = {
      x:stars[i].x,
      y:stars[i].y,
      z:stars[i].z
    }
  }
}
function setNebulasAtPress(){
  nebulas_at_press = []
  for(var i = 0; i < nebulas.length; i ++){
    nebulas_at_press.push(nebulas[i].x)
  }
}

function updateTextImage(){
  if(mousepos.pressed){
    var mousepos_x_offset = (mousepos.x - mousepos_at_press.x) * 0.1
    textImageLocation = textImageLocation_at_press + mousepos_x_offset
  }
  if(!mousepos.pressed){
    textImageLocation += (starSpeed * 100)
  }
}

function updateStars(){
  if(mousepos.pressed){
    var mousepos_x_offset = (mousepos.x - mousepos_at_press.x)/width
    // console.log(stars_at_press[0].x)
    for(var i = 0; i < stars_at_press.length; i ++){
      stars[i].x = stars_at_press[i].x + (mousepos_x_offset * stars[i].z)
      stars[i].y = stars_at_press[i].y;
    }
    for(var i = 0; i < nebulas.length; i ++){
      nebulas[i].x = nebulas_at_press[i] + (mousepos_x_offset*nebulas[i].z)
    }
  }
  else {
    for(var i = 0; i < stars.length; i ++){
      stars[i].x += (starSpeed * stars[i].z);
    }
    for(var i = 0; i < nebulas.length; i ++){
      nebulas[i].x += (starSpeed * nebulas[i].z )
    }
  }
  for(var i = 0; i < stars.length; i ++){
    if(stars[i].x < 0){stars[i].x = 1;stars[i].y = random(1);}
    if(stars[i].x > 1){stars[i].x = 0;stars[i].y = random(1);}
  }
  for(var i = 0; i < nebulas.length; i ++){
    var w = nebulas[i].image.width * (height/nebulas[i].image.height)
    if(nebulas[i].x < 0 - w)nebulas[i].x = width;
    if(nebulas[i].x > width)nebulas[i].x = 0 - w
  }
}

function drawStars(){
  var xScaleFactor = width;
  var yScaleFactor = height;
  var twinkle_val = frameCount % 30;
  for(var i = 0; i < stars.length; i ++){
    var col_dist = 100;
    var arb = Math.abs(stars[i].rb)
    if(stars[i].rb < 0)stroke(255 - (arb * col_dist) ,255 - (arb * col_dist) ,255)
    if(stars[i].rb > 0)stroke(255,255 - (arb * col_dist) ,255 - (arb * col_dist) )
    var twinkleMultiplier = Math.sin( (frameCount + (stars[i].twinkle_offset * 300) )/5 )
    twinkleMultiplier = map(twinkleMultiplier, -1, 1, 1, 1.3)
    var sw = (stars[i].z * 2 + 1) * twinkleMultiplier + 2
    strokeWeight( sw * (width/600) )
    point(stars[i].x * xScaleFactor, stars[i].y * yScaleFactor)
  }
  noStroke();
}
