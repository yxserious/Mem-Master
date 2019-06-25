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

	
var btnLogout = document.getElementsByClassName("logoutbtn")[0];
var textGreeting = document.getElementById("greeting");
var btnUpload = document.getElementsByClassName("uploadbtn")[0];
var displayNewImage = document.getElementById("newImg");
var btnCopyUrl = document.getElementsByClassName("copyUrl")[1];
var btnUploadUrl = document.getElementsByClassName("copyUrl")[0];
var btnEdit = document.getElementsByClassName("editbtn")[0];
var btnPreview = document.getElementsByClassName("previewbtn")[0];
var textUrl = document.getElementById("newImg");
var uploadDialog = document.getElementsByClassName("uploadDialog")[0];
var uploadOption = true;
var uploadSuccess = false;
var task = null;


btnLogout.addEventListener('click',e => {
	firebase.auth().signOut();
});

btnEdit.addEventListener('click',e => {
	window.location.href = "edit.html";
});

btnPreview.addEventListener('click',e => {
	window.location.href = "preview.html";
});

btnUpload.addEventListener('click',toggleShowUpload);
function toggleShowUpload() {
	uploadDialog = document.getElementsByClassName("uploadDialog")[0];
    if (uploadDialog.style.display === "none") {
        uploadDialog.style.display = "inline";
		btnUpload.innerHTML = "Cancel Upload";
		btnUpload.style.backgroundColor = "darkslategray";
    } else {
		uploadDialog.style.display = "none";
		btnUpload.innerHTML = "Upload New";	
		btnUpload.style.backgroundColor = "black";
	}
}
	
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

btnUploadUrl.addEventListener('click',UploadUrl);
function UploadUrl(){
	uploadOption = false;
	Upload();
}


if(uploadOption){
	input = document.getElementById("uploadLocal");
}
else{
	input =document.getElementById("uploadUrl");
}
input.addEventListener('change',UploadLocal);

function UploadLocal(){
	uploadOption = true;
	Upload();
}

function Upload(){
	var user = firebase.auth().currentUser;
	const imageStorage=firebase.storage().ref(user.uid + "/");
	
	if(uploadOption){
		const file = document.querySelector("#uploadLocal").files[0];
		console.log('In UploadLocal');
		if(file){
			const name = (new Date()) + '-' + file.name;
			const metadata = {contentType: file.type};		
			task = imageStorage.child(file.name).put(file,metadata);
			uploadSuccess = true;
		}
	}
	else{
		var externalImageUrl = document.getElementById("uploadUrl").value;
		task = imageStorage.child(externalImageUrl).putString(externalImageUrl);
		uploadSuccess = true;
		console.log('In UploadUrl');
		
	}
	//Get the upload file
	if(uploadSuccess){
		task.on('state_changed', function(snapshot){
			// Observe state change events such as progress, pause, and resume
			// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
			var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log('Upload is ' + progress + '% done');
			switch (snapshot.state) {
				case firebase.storage.TaskState.PAUSED: // or 'paused'
				console.log('Upload is paused');
				break;
				case firebase.storage.TaskState.RUNNING: // or 'running'
				console.log('Upload is running');
				break;
			}
		}, function(error) {
			// Handle unsuccessful uploads
			console.log(error);
		}, function() {
			// Handle successful uploads on complete
			// For instance, get the download URL: https://firebasestorage.googleapis.com/...
			task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
				console.log(downloadURL);
				var userDataRef = db.collection("users").doc(user.uid);
				
				userDataRef.get().then(function(doc) {
					if (doc.exists) {
						var a = doc.data().urls;
						a.push(downloadURL);
						userDataRef.update({
							urls: a
						});
					} else {
						// doc.data() will be undefined in this case
						console.log("No such document!");
					}
				}).catch(function(error) {
					console.log("Error getting document:", error);
				});


				
				// Update New Img Element
				btnCopyUrl.style.display = "inline";
				displayNewImage.style.display = "inline";
				displayNewImage.value = downloadURL;
				btnEdit.style.display = "block";
				
				var p = document.getElementById("uploadInfo");
				var newDisplay = document.getElementById("newDisplay");
				
				var d = new Date(); 
				p.innerHTML = "Uploaded at <b>"+ d.toLocaleTimeString() +"</b> "+ d.toLocaleDateString('en-US');
				newDisplay.src = downloadURL;
				newDisplay.alt = "Uploaded";
				newDisplay.style = "display: block;";
				});
		});
	}
};


