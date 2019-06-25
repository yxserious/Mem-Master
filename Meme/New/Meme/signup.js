// JavaScript Document
// Initialize Firebase
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

// Get var
var btnSignup = document.getElementsByClassName("signupbtn")[0];
var textEmail = document.getElementById('email');
var textPassword = document.getElementById('password');
var textRePassword = document.getElementById('rePassword');
var login = false;
	
// Signup Event
btnSignup.addEventListener('click',e => {
	var email = textEmail.value;
	var password = textPassword.value;
	var repassword = textRePassword.value;
	if (password == repassword){
		var promise = firebase.auth().createUserWithEmailAndPassword(email, password);
		promise.catch(e => alert(e.message));
	} else{
		alert("Oops! The passwords you typed do not match.");
	}
});
	
// Realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
	if(firebaseUser){
		var userDataRef = db.collection("users").doc(firebaseUser.uid);
		userDataRef.set({"urls": []});
		console.log(firebaseUser);
		
		
	} else{
		console.log("Not logged in!");
	}	
});	



   