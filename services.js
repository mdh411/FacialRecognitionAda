"use strict";

// MODELS
var genderModelUrl =
  "https://teachablemachine.withgoogle.com/models/K8cnk2ejP/"; //500 images 100 epochs 26/3/12
var baldModelUrl = "https://teachablemachine.withgoogle.com/models/x2hsOmfd_/"; // 250 images 50 epochs 26/3/23
var colourModelUrl =
  "https://teachablemachine.withgoogle.com/models/njbYh4Ml3/"; // 500 images 50 epochs 26/3/23
var ageModelUrl = "https://teachablemachine.withgoogle.com/models/IIwgyZAh-/"; // 500 images 50 epochs 26/3/23

var genderClassifier; //variable used to hold the genderClassifier object
var baldClassifier;
var colourClassifier;
var ageClassifier;

// var cam; //variable used to hold the camera object

var male = "",
  confidenceMale = 0;
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

var hideBaldMessage =
  "Subject is likely to be bald, cannot display hair colour results";
var hideColour = true;

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
  colourClassifier = ml5.imageClassifier(colourModelUrl + "model.json");
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
    if (results[0].label == "Male") {
      male = results[0].label;
      confidenceMale = results[0].confidence;
      female = results[1].label;
      confidenceFemale = results[1].confidence;
    } else {
      male = results[1].label;
      confidenceMale = results[1].confidence;
      female = results[0].label;
      confidenceFemale = results[0].confidence;
    }
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
    if (results[0].label == "Bald") {
      bald = results[0].label;
      confidenceBald = results[0].confidence;
      notBald = results[1].label;
      confidenceNotBald = results[1].confidence;
    } else {
      bald = results[1].label;
      confidenceBald = results[1].confidence;
      notBald = results[0].label;
      confidenceNotBald = results[0].confidence;
    }
    console.log("bald: " + confidenceBald);
    confidenceBald >= 0.6 ? hideColour : !hideColour;
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
    if (results[0].label == "Dark Hair") {
      dark = results[0].label;
      confidenceDark = results[0].confidence;
      light = results[1].label;
      confidenceLight = results[1].confidence;
    } else {
      dark = results[1].label;
      confidenceDark = results[1].confidence;
      light = results[0].label;
      confidenceLight = results[0].confidence;
    }
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
    if (results[0].label == "Old") {
      old = results[0].label;
      confidenceOld = results[0].confidence;
      young = results[1].label;
      confidenceYoung = results[1].confidence;
    } else {
      old = results[1].label;
      confidenceOld = results[1].confidence;
      young = results[0].label;
      confidenceYoung = results[0].confidence;
    }
    classify(); //execute the classify function again
  }
}

function genderResults() {
  let result = "Please wait, AI is thinking...";

  if (male && female) {
    let confidenceLevel = `${male}: ${(confidenceMale * 100).toFixed(
      0
    )}%, ${female}: ${(confidenceFemale * 100).toFixed(0)}%`;

    if (confidenceMale >= 0.8) {
      result = `${confidenceLevel}, Subject is male`;
    } else if (confidenceMale >= 0.6) {
      result = `${confidenceLevel}, Subject is likely to be male`;
    } else if (confidenceMale >= 0.5) {
      result = `${confidenceLevel}, Subject could be male`;
    } else if (confidenceFemale >= 0.8) {
      result = `${confidenceLevel}, Subject is female`;
    } else if (confidenceFemale >= 0.6) {
      result = `${confidenceLevel}, Subject is likely to be female`;
    } else if (confidenceFemale >= 0.5) {
      result = `${confidenceLevel}, Subject could be female`;
    } else {
      result = `${confidenceLevel}, Could not determine subject's gender`;
    }
  } else {
    result = `Error: Could not determine subject's gender`;
  }
  return result;
}

function baldResults() {
  let result = "Please wait, AI is thinking...";

  if (bald && notBald) {
    let confidenceLevel = `${bald}: ${(confidenceBald * 100).toFixed(
      0
    )}%, ${notBald}: ${(confidenceNotBald * 100).toFixed(0)}%`;

    if (confidenceBald >= 0.8) {
      result = `${confidenceLevel}, Subject is bald`;
    } else if (confidenceBald >= 0.6) {
      result = `${confidenceLevel}, Subject is likely to be bald`;
    } else if (confidenceBald >= 0.5) {
      result = `${confidenceLevel}, Subject could be bald`;
    } else if (confidenceNotBald >= 0.8) {
      result = `${confidenceLevel}, Subject is not bald`;
    } else if (confidenceNotBald >= 0.6) {
      result = `${confidenceLevel}, Subject is likely to be not bald`;
    } else if (confidenceNotBald >= 0.5) {
      result = `${confidenceLevel}, Subject could be not bald`;
    } else {
      result = `${confidenceLevel}, Could not determine Subject's baldness`;
    }
  } else {
    result = `Error: Could not determine Subject's baldness`;
  }
  return result;
}

function colourResults() {
  let result = "Please wait, AI is thinking...";

  if (dark && light) {
    let confidenceLevel = `${dark}: ${(confidenceDark * 100).toFixed(
      0
    )}%, ${light}: ${(confidenceLight * 100).toFixed(0)}%`;

    if (confidenceDark >= 0.8) {
      result = `${confidenceLevel} Subject is dark-haired`;
    } else if (confidenceDark >= 0.6) {
      result = `${confidenceLevel}, Subject is likely to be dark-haired`;
    } else if (confidenceDark >= 0.5) {
      result = `${confidenceLevel}, Subject could be dark-haired`;
    } else if (confidenceLight >= 0.8) {
      result = `${confidenceLevel}, Subject is light-haired`;
    } else if (confidenceLight >= 0.6) {
      result = `${confidenceLevel}, Subject is likely to be light-haired`;
    } else if (confidenceLight >= 0.5) {
      result = `${confidenceLevel}, Subject could be light-haired`;
    } else {
      result = `${confidenceLevel}, Could not determine subject's hair colour`;
    }
  } else {
    result = `Error: Could not determine subject's hair colour`;
  }
  return result;
}

function ageResults() {
  let result = "Please wait, AI is thinking...";

  if (old && young) {
    let confidenceLevel = `${old}: ${(confidenceOld * 100).toFixed(
      0
    )}%, ${young}: ${(confidenceYoung * 100).toFixed(0)}%`;

    if (confidenceOld >= 0.8) {
      result = `${confidenceLevel} Subject is old`;
    } else if (confidenceOld >= 0.6) {
      result = `${confidenceLevel}, Subject is likely to be old`;
    } else if (confidenceOld >= 0.5) {
      result = `${confidenceLevel}, Subject could be old`;
    } else if (confidenceYoung >= 0.8) {
      result = `${confidenceLevel}, Subject is young`;
    } else if (confidenceYoung >= 0.6) {
      result = `${confidenceLevel}, Subject is likely to be young`;
    } else if (confidenceYoung >= 0.5) {
      result = `${confidenceLevel}, Subject could be young`;
    } else {
      result = `${confidenceLevel}, Could not determine Subject's age`;
    }
  } else {
    result = `Error: Could not determine Subject's age`;
  }
  return result;
}

function draw() {
    //p5 function - this function is automatically called every frame
    // background("#c0c0c0"); //set the canvas default back colour
  if (hideColour) {
    document.getElementById("gender_results").innerHTML = genderResults(); //update the result string
    document.getElementById("bald_results").innerHTML = baldResults(); //update the result string
    document.getElementById("colour_results").innerHTML = hideBaldMessage; //update the result string
    document.getElementById("age_results").innerHTML = ageResults(); //update the result string
  } else {
    document.getElementById("gender_results").innerHTML = genderResults(); //update the result string
    document.getElementById("bald_results").innerHTML = baldResults(); //update the result string
    document.getElementById("colour_results").innerHTML = colourResults(); //update the result string
    document.getElementById("age_results").innerHTML = ageResults(); //update the result string
  }
}
