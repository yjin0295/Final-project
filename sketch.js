// array to store all circle objects
let circles = [];
let rotateBigCircles = false;
const maxRadius = 40; // maximum radius for smaller circles
const bigCircleRadius = 70; // radius of big circle

function setup() {
createCanvas(windowWidth, windowHeight); //create a canvas that covers the entire browser
colorMode(HSB); // set color mode to Hue Saturation Brightness
makeCircles(); // call function to create circle objects
}

function makeCircles() {
  circles = []; // clear the array

  // calculate number of columns and rows for big circles based on the canvas width and height
  let cols = floor(width / (bigCircleRadius * 2 + 5));
  let rows = floor(height / (bigCircleRadius * 2 + 5));

  // nested loops to create circle objects for each column and row
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // calculate position for the big circle
      let x = (bigCircleRadius + 2.5) + col * (bigCircleRadius * 2 + 5);
      let y = (bigCircleRadius + 2.5) + row * (bigCircleRadius * 2 + 5);
      let hue = random(360); // random hue for big circle color

      // create big circle object
      let bigCircle = new BigCircle(x, y, bigCircleRadius, color(hue, 5, 90));
      circles.push(bigCircle);

      // loop to create 6 small circles inside each big circle
      for (let j = 0; j < 6; j++) {
        let hueSmall = random(360); // random hue for small circle color
        let radius = maxRadius * (1.0 - j * 0.2) * 0.9; // calculate radius for small circle
        let shade = color(hueSmall, 80, 70, 0.7); // create color with the random hue
        let smallCircle = new SmallCircle(x, y, radius, shade);

        // add small circle to circles array and link to its bigCircle
        circles.push(smallCircle);
        bigCircle.smallCircles.push(smallCircle);
      }

      // create a CircleCenter object
      let hueCenter = random(360); // random hue for center dot color
      let circleCenter = new CircleCenter(x, y, maxRadius * 0.2, color(hueCenter, 100, 50, 0.7));

      // add circle center to circles array and link to its bigCircle
      circles.push(circleCenter);
      bigCircle.circleCenter = circleCenter;
    }
  }
}


function windowResized() {
resizeCanvas(windowWidth, windowHeight); // resize canvas to fit the window
makeCircles(); // recreate circle objects to fit new window size
}

class BigCircle {
// constructor for creating big circle object
constructor(x, y, radius, base) {
this.pos = createVector(x, y); // store position as a vector
this.base = base; // store color
this.radius = radius; // store radius
this.rotationAngle = 0;  // set angle to track the rotation of internal content
this.smallCircles = []; // add this line
this.circleCenter = null; // add this line
}

updateComponents() { // update the center circle's position to match the big circle's position
  if (this.circleCenter) {
      this.circleCenter.pos.x = this.pos.x;
      this.circleCenter.pos.y = this.pos.y;
  }
  this.smallCircles.forEach(smallCircle => {// update all small circles' positions to match the big circle's position
      smallCircle.pos.x = this.pos.x;
      smallCircle.pos.y = this.pos.y;
  });
}

// increase the radius of the big circle
enlarge() {
  this.radius += 10; // increment the circle's radius by 10 units
}

// decrease the radius of the big circle
shrink() {
  this.radius = max(10, this.radius - 10);  // decrease by 10 but don't go below a minimum of 10
}

collideWithOther(other) { // calculate the distance between the centers of this circle and the other circle
  let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);

  if (d < this.radius + other.radius) {
      // calculate the amount of overlap between the circles
      let overlap = 0.1 * (this.radius + other.radius - d);

      // calculate displacement
      let displacementX = overlap * (this.pos.x - other.pos.x) / d;
      let displacementY = overlap * (this.pos.y - other.pos.y) / d;

      // move circles apart
      this.pos.x += displacementX;
      this.pos.y += displacementY;
      other.pos.x -= displacementX;
      other.pos.y -= displacementY;

      // adding an extra push to make the circles bounce more vigorously
      const pushFactor = 20;
      let angleBetweenCircles = atan2(other.pos.y - this.pos.y, other.pos.x - this.pos.x);
      this.pos.x -= pushFactor * cos(angleBetweenCircles);
      this.pos.y -= pushFactor * sin(angleBetweenCircles);
      other.pos.x += pushFactor * cos(angleBetweenCircles);
      other.pos.y += pushFactor * sin(angleBetweenCircles);
  }
}


rotate(centerX, centerY, angle) {
  // calculate the relative position of the circle to the rotation center
  let relativeX = this.pos.x - centerX;
  let relativeY = this.pos.y - centerY;

  // apply rotation transformation
  let rotatedX = relativeX * cos(angle) - relativeY * sin(angle);
  let rotatedY = relativeX * sin(angle) + relativeY * cos(angle);

  // update circle position after rotation
  this.pos.x = rotatedX + centerX;
  this.pos.y = rotatedY + centerY;
}

spin(angleIncrement) {
  this.rotationAngle += angleIncrement;
  // keep the angle between 0 and TWO_PI to prevent it from getting too large
  this.rotationAngle %= TWO_PI;
}


show() {
fill(this.base); // set fill color
stroke(color(hue(this.base), 90, brightness(this.base) - 60)); // set stroke color
strokeWeight(1.5); // set stroke weight
ellipse(this.pos.x, this.pos.y, this.radius * 2); // draw the big circle
let numLines = 50; // number of lines to draw inside big circle
let innerRadius = maxRadius * 0.9; // calculate inner radius for lines
stroke(34, 100, 100); // set color for lines

// loop to draw lines inside the big circle
for (let i = 0; i < numLines; i++) {
let angle = TWO_PI / numLines * i + this.rotationAngle; // calculate angle for each line
let innerX = this.pos.x + cos(angle) * innerRadius; // calculate starting x position for line
let outerX = this.pos.x + cos(angle) * this.radius; // calculate ending x position for line
let innerY = this.pos.y + sin(angle) * innerRadius; // calculate starting y position for line
let outerY = this.pos.y + sin(angle) * this.radius; // calculate ending y position for line
line(innerX, innerY, outerX, outerY); // draw the line
}
}
}

// class for the small circle
class SmallCircle {
// constructor for creating small circle object
constructor(x, y, radius, base) {
this.pos = createVector(x, y); // store position as a vector
this.base = base; // store color
this.radius = radius; // store radius
}

//increase the radius of the small circle
enlarge() {
  this.radius += 5; // increment the circle's radius by 5 units
}

// decrease the radius of the small circle
shrink() {
  this.radius = max(5, this.radius - 5);  // decrease by 5 but don't go below a minimum of 5
}

isInside(x, y) {
  // check if a given point (x, y) is inside the circle
  let distance = dist(this.pos.x, this.pos.y, x, y);
  return distance <= this.radius;
}

// method to display the small circle
show() {
fill(this.base); // set fill color
stroke(255); // set stroke color to white
strokeWeight(0.5); // set stroke weight
ellipse(this.pos.x, this.pos.y, this.radius * 2); // draw the small circle
let innerRadius = this.radius * 0.5; // calculate inner radius for smaller circle inside
ellipse(this.pos.x, this.pos.y, innerRadius * 2); // draw smaller circle inside

// nested loops to draw dots around the small circle
for (let j = 0; j < 6; j++) {
for (let i = 0; i < 24; i++) {
let angle = TWO_PI / 24 * i + j * PI / 12; // calculate angle for each dot
let xOffset = cos(angle) * this.radius * 0.7; // calculate x offset for dot position
let yOffset = sin(angle) * this.radius * 0.7; // calculate y offset for dot position
ellipse(this.pos.x + xOffset, this.pos.y + yOffset, this.radius * 0.15); // draw the dot
}
}

// loop to draw 5 dots around the small circle
for (let i = 0; i < 5; i++) {
let angle = TWO_PI / 5 * i; // calculate angle for each dot
let xOffset = cos(angle) * (this.radius * 2.5); // calculate x offset for dot position
let yOffset = sin(angle) * (this.radius * 2.5); // calculate y offset for dot position
ellipse(this.pos.x + xOffset, this.pos.y + yOffset, this.radius * 0.2); // draw the dot
}
}
}

// class for the circle center of the small circle
class CircleCenter {
// constructor for creating center dot object
constructor(x, y, radius, base) {
this.pos = createVector(x, y); // store position as a vector
this.base = base; // store color
this.radius = radius; // store radius
}

show() {
fill(this.base); // set fill color
stroke(255); // set stroke color to white
strokeWeight(0.5); // set stroke weight
ellipse(this.pos.x, this.pos.y, this.radius * 2); // draw the circle center
}
}

function draw() {
  background(44, 61, 100); // set background color

  if (rotateBigCircles) {
    let rotationIncrement = PI / 180 * 3;  // angle increment for smoother animation
    for (let circle of circles) { // loop through all circle objects and call their show method
      if (circle instanceof BigCircle) {
        circle.spin(rotationIncrement); // update the rotation angle of the big circle
      }
    }
  }
  let attractionRange = 150; // range of mouse attraction
  let moveFactor = 0.2; // uniform factor of how much the circles should move towards the mouse

  for (let circle of circles) {
    let d = dist(mouseX, mouseY, circle.pos.x, circle.pos.y);
    if (d < attractionRange) { // check if the distance is less than the specified attraction range
      let moveX = mouseX - circle.pos.x;
      let moveY = mouseY - circle.pos.y;
      // update the circle's position, moving it a fraction of the distance towards the mouse
      circle.pos.x += moveX * moveFactor;
      circle.pos.y += moveY * moveFactor;
    }
  }

    // Collision detection and response
    for (let i = 0; i < circles.length; i++) {
      if (circles[i] instanceof BigCircle) {
        for (let j = i + 1; j < circles.length; j++) { // loop through remaining circles to check for collisions with other BigCircles
          if (circles[j] instanceof BigCircle) {
              circles[i].collideWithOther(circles[j]); // handle collision between two BigCircles
          }
        }
      }
    }
    
  
    // update components positions and show circles
    for (let circle of circles) {
      if (circle instanceof BigCircle) {
        circle.updateComponents(); // update positions of small circles and center
      }
      circle.show(); // show each circle
    }
  

   // set text characteristics
   textSize(18); 
   fill(255); 
   stroke(0); // set text border color and weight
   strokeWeight(3); 

  // calculate text position
  let lineHeight = 18; 
  let textX = 240; 
  let textY = height - 60; 

  // display text lines
  text("Navigation : Press Space to rotate, press again to stop.", textX, textY);
  text("                 Press E to enlarge circles, press S to shrink circles.", textX, textY + lineHeight);
  text("                 Click mouse to change random color of small circles", textX, textY + 2 * lineHeight); 
  text("                 Double click mouse to reset.", textX, textY + 3 * lineHeight); 
}

function mousePressed() {
  for (let circle of circles) {
    if (circle instanceof SmallCircle && circle.isInside(mouseX, mouseY)) {
      // change color of all small circles to random colors
      for (let allCircle of circles) {
        if (allCircle instanceof SmallCircle) {
          let hueRandom = random(360);
          let newShade = color(hueRandom, 80, 70, 0.7);
          allCircle.base = newShade;
        }
      }
      
      break; // break after finding the clicked circle
    }
  }
}


function keyPressed() {
  if (key === 'E' || key === 'e') {
    for (let circle of circles) { 
      if (circle instanceof BigCircle) {// check if the circle is an instance of the BigCircle class
        circle.enlarge(); // increase size of big circle
      }
      if (circle instanceof SmallCircle) {// check if the circle is an instance of the SmallCircle class
        circle.enlarge(); // increase size of small circle
      }
    }
  } 

  else if (key === 'S' || key === 's') {
    for (let circle of circles) {
      if (circle instanceof BigCircle) {
        circle.shrink(); //decrease size of big circle
      }
      if (circle instanceof SmallCircle) {
        circle.shrink(); //decrease size of small circle
      }
    }
  }

  if (key === ' ') { 
    rotateBigCircles = !rotateBigCircles;  // rotate big circles when press spacebar
  }
}

function doubleClicked() {
  // reset all circles to their original state
  makeCircles();  // recreate the circle objects to their initial positions and sizes
}