let circles = []; //use array to store all the circles we have
const maxRadius = 40; //the maximum radius for our smaller circle inside the big one
const bigCircleRadius = 70; //set the big circle radius


//set up the initial things
function setup() {
 createCanvas(windowWidth, windowHeight); //create a canvas, using window height and width
 colorMode(HSB); //set the color mode to HSB to let us easy set the brightness and saturation, get a better color
 makeCircles();  //call the function to create our circle.
}


//create a function to draw our circles
function makeCircles() {
 circles = []; //clear existing circles


 //calculate the number of columns and rows according to our big circle's radius and space
 let cols = floor(width / (bigCircleRadius * 2 + 5)); //columns in canvas
 let rows = floor(height / (bigCircleRadius * 2 + 5)); //rows in canvas


 //loop over each row and column to create circles.
 for (let row = 0; row < rows; row++) {
   for (let col = 0; col < cols; col++) {
    
     //calculate position of each big circle
     let x = (bigCircleRadius + 2.5) + col * (bigCircleRadius * 2 + 5); //x-coordinate
     let y = (bigCircleRadius + 2.5) + row * (bigCircleRadius * 2 + 5); //y-coordinate
     let hue = random(360); //pick a random color for our big circle


     //create a big circle and add it to the array
     circles.push(new Circle(x, y, bigCircleRadius, color(hue, 5, 90), true));


     //loop to create 6 smaller circles within each large circle
     for (let j = 0; j < 6; j++) {


       let brightness = 70; //set the brightness level for small circle
       let reducedSaturation = 80; //set the saturation level for small circle
       let hueSmall = random(360); //get a color for small circle
       let shade = color(hueSmall, reducedSaturation, brightness, 0.7); //get a color with the defined hue, saturation, brightness, and let an opacity to 0.7.
       //calculate the radius of the smaller circle.
       //each consecutive circle will be smaller due to the factor (1 - j * 0.2).
       let radius = maxRadius * (1.0) * (1 - j * 0.2) * 0.9;
       //make a new Circle object with the calculated properties and add it to the 'circles' array.
       //'False' argument signifies this is not one of the main larger circles.


       circles.push(new Circle(x, y, radius, shade, false));
     }


     //make a really small circle in every big circle
     let hueCenter = random(360); //pick a random color for our center circle
     circles.push(new Circle(x, y, maxRadius * 0.2, color(hueCenter, 100, 50, 0.7), false));
   }
 }
}


//make a function to help us resize the canvas and create new circle while the windows change
function windowResized() {
 resizeCanvas(windowWidth, windowHeight);
 makeCircles();
}


function draw() {
 background(44, 61, 100); //set our background color to light yellow using HSB color mode
 //loop through all the circles and show them
 for (let circle of circles) {
   circle.show();
 }
}


//define our circle here
class Circle {
 //use constructor here, initializes properties of the circle object
 constructor(x, y, radius, base, isBigCircle) {
   this.pos = createVector(x, y); //give a position to x and y coordinate
   this.base = base;  //store 'base' color to circle object 'base'
   this.radius = radius; //store the size of the circle in the 'radius' property
   this.isBigCircle = isBigCircle; //a boolean to check if it's a big circle
 }


 //method to show circle
 show() {
   fill(this.base); //fill the color


   //if it is a big circle, set the stroke color and stroke weight
   if (this.isBigCircle) {


     let strokeCol = color(hue(this.base), 90, brightness(this.base) - 60);
     stroke(strokeCol);
     strokeWeight(1.5);


   } else { //if it is not a big circle, small circle, the stroke will be white
     stroke(255); //
     strokeWeight(0.5); //set the stroke weight here
   }


   //draw ellipse
   ellipse(this.pos.x, this.pos.y, this.radius * 2);


//if it's a big circle, the draw some line between the area of big circle and the biggest small circle
  if (this.isBigCircle) {
    let numLines = 50;  //set the number of the line
    let innerRadius = maxRadius * 0.9;  //set the biggest inner circle's radius
    stroke(34, 100, 100);  //set the color of the lines


    for (let i = 0; i < numLines; i++) {


      let angle = TWO_PI / numLines * i;//calculate the angle
      let innerX = this.pos.x + cos(angle) * innerRadius;
      let innerY = this.pos.y + sin(angle) * innerRadius;
      let outerX = this.pos.x + cos(angle) * this.radius;
      let outerY = this.pos.y + sin(angle) * this.radius;
      line(innerX, innerY, outerX, outerY);  //draw lines
    }
  }
 //if it's not a big circle, draw additional details
 if (!this.isBigCircle) {


   //draw inner circle, smaller circles, and an outer circle
   let innerRadius = this.radius * 0.5;
   ellipse(this.pos.x, this.pos.y, innerRadius * 2);//draw an ellipse at the center with the calculated inner radius to create an inner circle




   for (let j = 0; j < 6; j++) {
     //outer loop, iterating from 0 to 5,create patterns in six different directions
     for (let i = 0; i < 24; i++) {


       //inner loop, iterating from 0 to 23, create a series of small ellipses within each direction
       let angle = TWO_PI / 24 * i + j * PI / 12; //calculate the angle to evenly space the small ellipses in the current direction
       let xOffset = cos(angle) * this.radius * 0.7; //calculate the horizontal offset using the cosine of the angle
       let yOffset = sin(angle) * this.radius * 0.7; //calculate the vertical offset using the sine of the angle
       //draw a small ellipse at the adjusted position to create a detailed pattern within the direction
       ellipse(this.pos.x + xOffset, this.pos.y + yOffset, this.radius * 0.15);
     }
   }
   //loop from 0 to 4 (five times) to create a set of ellipses
   for (let i = 0; i < 5; i++) {


     let angle = TWO_PI / 5 * i; //calculate the angle for evenly spacing the ellipses in a circle
     let xOffset = cos(angle) * (this.radius * 2.5); //calculate the horizontal offset based on the cosine of the angle
     let yOffset = sin(angle) * (this.radius * 2.5); //calculate the vertical offset based on the sine of the angle
     ellipse(this.pos.x + xOffset, this.pos.y + yOffset, this.radius * 0.2);// draw an ellipse at the adjusted position to create a decorative pattern


   }
 }
}
}
    
    
    
    
    

