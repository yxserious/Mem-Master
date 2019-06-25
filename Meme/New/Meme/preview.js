var config = {
		apiKey: "AIzaSyBB2eUQPa4DhaOP_-BoEXSVc8lhfAlIjoQ",
		authDomain: "mememaster-ecd29.firebaseapp.com",
		databaseURL: "https://mememaster-ecd29.firebaseio.com",
		projectId: "mememaster-ecd29",
		storageBucket: "mememaster-ecd29.appspot.com",
		messagingSenderId: "741162319719"
};
var app = firebase.initializeApp(config);
var db = firebase.firestore(app);
const settings = {/* your settings... */ timestampsInSnapshots: true};
db.settings(settings);


var btnLogout = document.getElementsByClassName("logoutbtn")[0];
var btnBack = document.getElementsByClassName("backbtn")[0];
var textGreeting = document.getElementById("greeting");
var displayGrid = document.getElementsByClassName("preview")[0];
//var displayCount = document.getElementsByClassName("currentCount")[0];

btnLogout.addEventListener('click',e => {
	firebase.auth().signOut();
});

btnBack.addEventListener('click',e => {
	window.location.href = "homepage.html";
});



// Realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
	if(firebaseUser){
		console.log(firebaseUser);
		var userDataRef = db.collection("users").doc(firebaseUser.uid);
		
		userDataRef.get().then(function(doc) {
					if (doc.exists) {
						var urls = doc.data().urls;
						textGreeting.innerHTML = "Hi! "+firebaseUser.email;	
						//displayCount.innerHTML = "You have "+urls.length+" memes";
						for (i = 0; i < urls.length; i++) { 
							var divElement = document.createElement("div");
							divElement.className = "imgDisplay";
							var imgElement = document.createElement("img");
							imgElement.src = urls[i];
							imgElement.alt = i;
							imgElement.height = "200";
							var btnElement = document.createElement("button");
							btnElement.className = "gridbtn";
							btnElement.innerHTML = "Edit";
							var btnElement2 = document.createElement("button");
							btnElement2.className = "gridbtn";
							btnElement2.innerHTML = "Delete";	
							divElement.appendChild(imgElement);
							divElement.appendChild(document.createElement("br"));
							divElement.appendChild(btnElement);
							divElement.appendChild(btnElement2);
							displayGrid.appendChild(divElement);
						}					
					} else {
						// doc.data() will be undefined in this case
						console.log("No such document!");
					}
				}).catch(function(error) {
					console.log("Error getting document:", error);
				});
	
	}else{
		console.log("Not logged in!");
		window.location.href = "index.html";
	}
});// JavaScript Document


