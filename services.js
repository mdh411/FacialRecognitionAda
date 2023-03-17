"use strict";
// Ada Boilerplate - JavaScript and Computer Vision Teachable Machine,
// Machine Learning & Teachable Machine Models

//for easy lets setup some quick global variables
var genderModelUrl = 'https://teachablemachine.withgoogle.com/models/-uwvRE19g/'; //variable used to hold path to the model
// var hairModelUrl = 'https://teachablemachine.withgoogle.com/models/PV9K4gXrK/'; //variable used to hold path to the model
var classifier1; //variable used to hold the classifier object
// var classifier2;

var cam; //variable used to hold the camera object
var male = "", confidence0 = 0; //for ease and just because we're only demo'ing with two classes
var female = "", confidence1 = 0;
// var longHair = "", confidence2 = 0;
// var shortHair = "", confidence3 = 0;


function preload() {
	//p5 function - this function is automatically called by the p5 library, once only
	classifier1 = ml5.imageClassifier(genderModelUrl + 'model.json'); //load the model!
	// classifier2 = ml5.imageClassifier(hairModelUrl + 'model.json'); //load the model!
}


function setup() {
	//p5 function - this function is automatically called after the 'preload' function; the function is only executed once
	var viewport = createCanvas(480, 360);//p5 function to create a p5 canvas 
	viewport.parent('video_container'); //attach the p5 canvas to the target html div
	frameRate(24); //set the frame rate, we don't need to high performance video

	cam = createCapture(VIDEO);//p5 function, store the video information coming from the camera
	cam.hide();//hide the cam element

	classifyGender(); //start the classifier
}


function classifyGender() {
	//ml5, classify the current information stored in the camera object
	classifier1.classify(cam, processGenderResults); //once complete execute a callback to the processresults function
}

// function classifyHair() {
// 	//ml5, classify the current information stored in the camera object
// 	classifier2.classify(cam, processHairResults); //once complete execute a callback to the processresults function
// }


function processGenderResults(error, results) {
	//a simple way to return the current classification details
	if (error) { //something seems to have gone wrong
		console.error("classifier error: " + error);
	} else { //no errors detected, so lets grab the label and execute the classify function again
		male = results[0].label; confidence0 = results[0].confidence;
		female = results[1].label; confidence1 = results[1].confidence;
		// longHair = results[1].label; confidence2 = results[2].confidence;
		// shortHair = results[1].label; confidence3 = results[3].confidence;
		classify(); //execute the classify function again
	}
}

// function processHairResults(error, results) {
// 	//a simple way to return the current classification details
// 	if (error) { //something seems to have gone wrong
// 		console.error("classifier error: " + error);
// 	} else { //no errors detected, so lets grab the label and execute the classify function again
// 		longHair = results[1].label; confidence2 = results[2].confidence;
// 		shortHair = results[1].label; confidence3 = results[3].confidence;
// 		classify(); //execute the classify function again
// 	}
// }


function genderResults() {
	//a simple way to return the current classification details
	let result = "Please wait...";
	if(male.length > 0) {
		result = male + ": " + (confidence0*100).toFixed(0) + "%" + ", " + female + ": " + (confidence1*100).toFixed(0) + "%";
	}
	return result;
}

// function hairResults() {
// 	//a simple way to return the current classification details
// 	let result = "Please wait...";
// 	if(longHair.length > 0) {
// 		result = longHair + ": " + (confidence2*100).toFixed(0) + "%" + ", " + shortHair + ": " + (confidence3*100).toFixed(0) + "%";
// 	}
// 	return result;
// }


function draw() {
	//p5 function - this function is automatically called every frame
	background("#c0c0c0"); //set the canvas default back colour

	image(cam, 0, 0); //pass the video to the p5 canvas
	document.getElementById("gender_results").innerHTML = genderResults(); //update the result string
	// document.getElementById("hair_results").innerHTML = hairResults(); //update the result string
}