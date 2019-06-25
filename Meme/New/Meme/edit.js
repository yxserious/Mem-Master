var config = {
		apiKey: "AIzaSyBB2eUQPa4DhaOP_-BoEXSVc8lhfAlIjoQ",
		authDomain: "mememaster-ecd29.firebaseapp.com",
		databaseURL: "https://mememaster-ecd29.firebaseio.com",
		projectId: "mememaster-ecd29",
		storageBucket: "mememaster-ecd29.appspot.com",
		messagingSenderId: "741162319719"
};
firebase.initializeApp(config);

var btnLogout = document.getElementsByClassName("logoutbtn")[0];
var btnCancel = document.getElementsByClassName("cancelbtn")[0];
var textGreeting = document.getElementById("greeting");

btnLogout.addEventListener('click',e => {
	firebase.auth().signOut();
});

btnCancel.addEventListener('click',e => {
	window.location.href = "homepage.html";
});

// Realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
	if(firebaseUser){
		console.log(firebaseUser);
		textGreeting.innerHTML = "Hi! "+firebaseUser.email;
	}else{
		console.log("Not logged in!");
		window.location.href = "index.html";
	}
});

