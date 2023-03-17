"use strict";
// Ada Boilerplate - JavaScript and Computer Vision Teachable Machine,
// Machine Learning & Teachable Machine Models

//for easy lets setup some quick global variables
var genderModelUrl =
  "https://teachablemachine.withgoogle.com/models/-uwvRE19g/"; //variable used to hold path to the model
var hairModelUrl = "https://teachablemachine.withgoogle.com/models/PV9K4gXrK/"; //variable used to hold path to the model
var classifier1; //variable used to hold the classifier1 object
var classifier2; //variable used to hold the classifier2 object

var cam; //variable used to hold the camera object
var male = "",
  confidence0 = 0; //for ease and just because we're only demo'ing with two classes
var female = "",
  confidence1 = 0;
var long = "",
  confidence2 = 0;
var short = "",
  confidence3 = 0;
let camOn = true;
let camToggle;

let img;

function preload() {
  //p5 function - this function is automatically called by the p5 library, once only
  classifier1 = ml5.imageClassifier(genderModelUrl + "model.json"); //load the model!
  classifier2 = ml5.imageClassifier(hairModelUrl + "model.json"); //load the model!
}

function setup() {
  //p5 function - this function is autmaticallt called after the 'preload' function; the function is only executed once
  var viewport = createCanvas(480, 360); //p5 function to create a p5 canvas
  viewport.parent("video_container"); //attach the p5 canvas to the target html div
  frameRate(24); //set the frame rate, we dont need to high performance video

  cam = createCapture(VIDEO); //p5 function, store the video information coming from the camera
  cam.hide(); //hide the cam element

  camToggle = createButton("Toggle Camera");
  camToggle.position(19, 19);
  camToggle.mousePressed(toggleCamera);

  classify(); //start the classifer
}

function toggleCamera() {
  // if camera is off, then turn it on
  // if camera is on, then turn it off
  camOn = !camOn;

  if (camOn) {
    // create one camera object if camOn is true
    cam = createCapture(VIDEO);
  } else {
    cam.remove();
  }
}

function classify() {
  //ml5, classify the current information stored in the camera object
  classifier1.classify(cam, processGenderResults); //once complete execute a callback to the processGenderResults function
  classifier2.classify(cam, processHairResults); //once complete execute a callback to the processHairResults function
}

function processGenderResults(error, results) {
  //a simple way to return the current classification details
  if (error) {
    //something seems to have gone wrong
    console.error("classifier error: " + error);
  } else {
    //no errors detected, so lets grab the label and execute the classify function again
    male = results[0].label;
    confidence0 = results[0].confidence;
    female = results[1].label;
    confidence1 = results[1].confidence;
    classify(); //execute the classify function again
  }
}

function processHairResults(error, results) {
  //a simple way to return the current classification details
  if (error) {
    //something seems to have gone wrong
    console.error("classifier error: " + error);
  } else {
    //no errors detected, so lets grab the label and execute the classify function again
    long = results[0].label;
    confidence2 = results[0].confidence;
    short = results[1].label;
    confidence3 = results[1].confidence;
    classify(); //execute the classify function again
  }
}

function genderResults() {
  //a simple way to return the current classification details
  let result = "Please wait...";
  if (male.length > 0) {
    result =
      male +
      ": " +
      (confidence0 * 100).toFixed(0) +
      "%" +
      ", " +
      female +
      ": " +
      (confidence1 * 100).toFixed(0) +
      "%";
  }
  return result;
}

function hairResults() {
  //a simple way to return the current classification details
  let result = "Please wait...";
  if (long.length > 0) {
    result =
      long +
      ": " +
      (confidence0 * 100).toFixed(0) +
      "%" +
      ", " +
      short +
      ": " +
      (confidence1 * 100).toFixed(0) +
      "%";
  }
  return result;
}

function draw() {
  //p5 function - this function is automatically called every frame
  background("#c0c0c0"); //set the canvas default back colour

  image(cam, 0, 0); //pass the video to the p5 canvas
  document.getElementById("gender_results").innerHTML = genderResults(); //update the result string
  document.getElementById("hair_results").innerHTML = hairResults(); //update the result string
}