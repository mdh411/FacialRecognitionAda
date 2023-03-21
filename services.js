"use strict";

// MODELS
var genderModelUrl =
  "https://teachablemachine.withgoogle.com/models/elX5kZiHH/"; //variable used to hold path to the model
var baldModelUrl = "https://teachablemachine.withgoogle.com/models/rPzY-4IId/"; // 1000pics 100epcs
var hairColourModelUrl =
  "https://teachablemachine.withgoogle.com/models/m4HaFGUgH/"; // 1000pics 100epcs
var ageModelUrl = "https://teachablemachine.withgoogle.com/models/uQtvya34f/"; // 1000pics 100 epcs

var genderClassifier; //variable used to hold the genderClassifier object
var baldClassifier; 
var colourClassifier;
var ageClassifier;

// var cam; //variable used to hold the camera object
var male = "",
  confidenceMale = 0; //for ease and just because we're only demo'ing with two classes
var female = "",
  confidenceFemale = 0;
var bald = "",
  confidenceBald = 0;
var notBald = "",
  confidenceNotBald = 0;
var dark = "",
  confidenceDark = 0;
var light = "",
  confidenceLight = 0;
var old = "",
  confidenceOld = 0;
var young = "",
  confidenceYoung = 0;

var myImg = document.getElementById("image");

// let camOn = false;
// let camToggle;

var loadFile = function (event) {
  var image = document.getElementById("image");
  image.src = URL.createObjectURL(event.target.files[0]);
};

function preload() {
  //p5 function - this function is automatically called by the p5 library, once only
  genderClassifier = ml5.imageClassifier(genderModelUrl + "model.json"); //load the model!
  baldClassifier = ml5.imageClassifier(baldModelUrl + "model.json"); //load the model!
  colourClassifier = ml5.imageClassifier(hairColourModelUrl + "model.json");
  ageClassifier = ml5.imageClassifier(ageModelUrl + "model.json");
}

function setup() {
  //p5 function - this function is automatically called after the 'preload' function; the function is only executed once
  // var viewport = createCanvas(480, 360); //p5 function to create a p5 canvas
  // viewport.parent("video_container"); //attach the p5 canvas to the target html div
  // frameRate(24); //set the frame rate, we don't need to high performance video

  // cam = createCapture(VIDEO); //p5 function, store the video information coming from the camera
  // cam.hide(); //hide the cam element

  // camToggle = createButton("Toggle Camera");
  // camToggle.position(19, 19);
  // camToggle.mousePressed(toggleCamera);

  classify(); //start the classifier
}

// function toggleCamera() {
//   // if camera is off, then turn it on
//   // if camera is on, then turn it off
//   camOn = !camOn;

//   if (camOn) {
//     // create one camera object if camOn is true
//     cam = createCapture(VIDEO);
// 	cam.hide(); //hide the cam element
//   } else {
//     cam.remove();
//   }
// }

function classify() {
  //ml5, classify the current information stored in the camera object
  genderClassifier.classify(myImg, processGenderResults); //once complete execute a callback to the processGenderResults function
  baldClassifier.classify(myImg, processBaldResults); //once complete execute a callback to the processHairColourResults function
  colourClassifier.classify(myImg, processColourResults);
  ageClassifier.classify(myImg, processAgeResults);
}

function processGenderResults(error, results) {
  //a simple way to return the current classification details
  if (error) {
    //something seems to have gone wrong
    console.error("classifier error: " + error);
  } else {
    //no errors detected, so lets grab the label and execute the classify function again
    male = results[0].label;
    confidenceMale = results[0].confidence;
    female = results[1].label;
    confidenceFemale = results[1].confidence;
    classify(); //execute the classify function again
  }
}

function processBaldResults(error, results) {
  //a simple way to return the current classification details
  if (error) {
    //something seems to have gone wrong
    console.error("classifier error: " + error);
  } else {
    //no errors detected, so lets grab the label and execute the classify function again
    bald = results[0].label;
    confidenceBald = results[0].confidence;
    notBald = results[1].label;
    confidenceNotBald = results[1].confidence;
    classify(); //execute the classify function again
  }
}

function processColourResults(error, results) {
  //a simple way to return the current classification details
  if (error) {
    //something seems to have gone wrong
    console.error("classifier error: " + error);
  } else {
    //no errors detected, so lets grab the label and execute the classify function again
    dark = results[0].label;
    confidenceDark = results[0].confidence;
    light = results[1].label;
    confidenceLight = results[1].confidence;
    classify(); //execute the classify function again
  }
}

function processAgeResults(error, results) {
  //a simple way to return the current classification details
  if (error) {
    //something seems to have gone wrong
    console.error("classifier error: " + error);
  } else {
    //no errors detected, so lets grab the label and execute the classify function again
    old = results[0].label;
    confidenceOld = results[0].confidence;
    young = results[1].label;
    confidenceYoung = results[1].confidence;
    classify(); //execute the classify function again
  }
}

// function genderResults() {
//   //a simple way to return the current classification details
//   let result = "Please wait...";
//   if (male.length > 0) {
//     result =
//       male +
//       ": " +
//       (confidenceMale * 100).toFixed(0) +
//       "%" +
//       ", " +
//       female +
//       ": " +
//       (confidenceFemale * 100).toFixed(0) +
//       "%";
//   }
//   return result;
// }

function genderResults() {
  let result = "Please wait, AI is thinking..."

  if(male && female) {
    let confidenceLevel = `${male}: ${(confidenceMale * 100).toFixed(0)}%, ${female}: ${(confidenceFemale * 100).toFixed(0)}%`

    switch(true) {
      case confidenceMale >= 0.8:
        result = `${confidenceLevel}, Subject is Male`
        break;
      case confidenceMale >= 0.6:
        result = `${confidenceLevel}, Subject is likely to be Male`
        break;
      case confidenceFemale >= 0.5:
        result = `${confidenceLevel}, Subject could be Female`
        break;
      case confidenceFemale >= 0.8:
        result = `${confidenceLevel}, Subject is Female`
        break;
      case confidenceFemale >= 0.6:
        result = `${confidenceLevel}, Subject is likely to be Female`
        break;
      case confidenceFemale >= 0.5:
        result = `${confidenceLevel}, Subject could be Female`
        break;
      default:
        result = `${confidenceLevel}, Could not determine Subject's gender`
        break;
    }
  } else {
    result = `Error: Could not determine Subject's gender`
  }
  return result;
}

function baldResults() {
  let result = "Please wait, AI is thinking..."

  if(bald && notBald) {
    let confidenceLevel = `${bald}: ${(confidenceBald * 100).toFixed(0)}%, ${notBald}: ${(confidenceNotBald * 100).toFixed(0)}%`

    switch(true) {
      case confidenceBald >= 0.8:
        result = `${confidenceLevel}, Subject is bald`
        break;
      case confidenceBald >= 0.6:
        result = `${confidenceLevel}, Subject is likely to be bald`
        break;
      case confidenceBald >= 0.5:
        result = `${confidenceLevel}, Subject could be bald`
        break;
      case confidenceNotBald >= 0.8:
        result = `${confidenceLevel}, Subject is not bald`
        break;
      case confidenceNotBald >= 0.6:
        result = `${confidenceLevel}, Subject is likely to be not bald`
        break;
      case confidenceNotBald >= 0.5:
        result = `${confidenceLevel}, Subject could be not bald`
        break;
      default:
        result = `${confidenceLevel}, Could not determine Subject's baldness`
        break;
    }
  } else {
    result = `Error: Could not determine Subject's baldness`
  }
  return result;
}

function colourResults() {
  let result = "Please wait, AI is thinking..."

  if(dark && light) {
    let confidenceLevel = `${dark}: ${(confidenceDark * 100).toFixed(0)}%, ${light}: ${(confidenceLight * 100).toFixed(0)}%`

    switch(true) {
      case confidenceDark >= 0.8:
        result = `${confidenceLevel}, Subject is dark-haired`
        break;
      case confidenceDark >= 0.6:
        result = `${confidenceLevel}, Subject is likely to be dark-haired`
        break;
      case confidenceDark >= 0.5:
        result = `${confidenceLevel}, Subject could be dark-haired`
        break;
      case confidenceLight >= 0.8:
        result = `${confidenceLevel}, Subject is light-haired`
        break;
      case confidenceLight >= 0.6:
        result = `${confidenceLevel}, Subject is likely to be light-haired`
        break;
      case confidenceLight >= 0.5:
        result = `${confidenceLevel}, Subject could be light-haired`
        break;
      default:
        result = `${confidenceLevel}, Could not determine Subject's hair colour`
        break;
    }
  } else {
    result = `Error: Could not determine Subject's hair colour`
  }
  return result;
}

function ageResults() {
  let result = "Please wait, AI is thinking..."

  if(old && young) {
    let confidenceLevel = `${old}: ${(confidenceMale * 100).toFixed(0)}%, ${young}: ${(confidenceFemale * 100).toFixed(0)}%`

    switch(true) {
      case confidenceOld >= 0.8:
        result = `${confidenceLevel}, Subject is old`
        break;
      case confidenceOld >= 0.6:
        result = `${confidenceLevel}, Subject is likely to be old`
        break;
      case confidenceOld >= 0.5:
        result = `${confidenceLevel}, Subject could be old`
        break;
      case confidenceYoung >= 0.8:
        result = `${confidenceLevel}, Subject is young`
        break;
      case confidenceYoung >= 0.6:
        result = `${confidenceLevel}, Subject is likely to be young`
        break;
      case confidenceYoung >= 0.5:
        result = `${confidenceLevel}, Subject could be young`
        break;
      default:
        result = `${confidenceLevel}, Could not determine Subject's age`
        break;
    }
  } else {
    result = `Error: Could not determine Subject's age`
  }
  return result;
}

function draw() {
  //   //p5 function - this function is automatically called every frame
  //   // background("#c0c0c0"); //set the canvas default back colour

  //   image(cam, 0, 0); //pass the video to the p5 canvas

  document.getElementById("gender_results").innerHTML = genderResults(); //update the result string
  document.getElementById("bald_results").innerHTML = baldResults(); //update the result string
  document.getElementById("colour_results").innerHTML = colourResults(); //update the result string
  document.getElementById("age_results").innerHTML = ageResults(); //update the result string
  
}