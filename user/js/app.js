window.onload=function(){
	initApp();
}

function toggleSignout(){
	if (firebase.auth().currentUser) {
        firebase.auth().signOut().then(function() {
		  	location.href = "../login/";
		}).catch(function(error) {
			Swal.fire(
				'Error',
				'Logout error. Please try again!',
				'error'
			)
		});
    }
}

function sendVerifyMail() {
	firebase.auth().currentUser.sendEmailVerification().then(function () {
        Swal.fire(
			'Success',
			'We have send you verification email. Please check you email box!',
			'success'
		)
    });
}

function initApp(){
	firebase.auth().onAuthStateChanged(function(user) {
	  	if (user) {
	  		var displayName = user.displayName;
		    var email = user.email;
		    var emailVerified = user.emailVerified;
		    var photoURL = user.photoURL;
		    var isAnonymous = user.isAnonymous;
		    var uid = user.uid;
		    var providerData = user.providerData;
		    if (!emailVerified) {
		    	Swal.fire(
				  'Warning',
				  'Please verified your email. <a onclick="sendVerifyMail()">Send email verification</a>',
				  'warning'
				)
		    }
		    if (!displayName) {
		    	(async () => {
				const { value: dpName } = await Swal.fire({
				  title: 'Display Name',
				  input: 'text',
				  showCancelButton: false,
				  showConfirmButton: true,
	 			  confirmButtonText: 'Update',
				  inputValidator: (value) => {
				    if (!value) {
				      return 'You need to write something!'
				    }
				  }
				})

				if (dpName) {
				  	updateUsers(dpName)
				}
				})()
		    }
			db.collection('vote-post').where('uid', '==', uid).orderBy('timestamp', 'desc').onSnapshot(snapshot => {
				setupVotes(snapshot.docs);
				setupUI(user);
			}, err => {
				Swal.fire(
				  'Error',
				  err.message,
				  'error'
				)
			});
		} else {
			setupVotes([]);
			setupUI();
			location.href = "../login/";
		}
	});
}

function callData(identifier){
	let attrID = $(identifier).parent().data('id');
	$(identifier).html("");
	$(identifier).html("Loading");
	$(identifier).attr("disabled", true);
	if (attrID) {
		db.collection('vote-post').where(firebase.firestore.FieldPath.documentId(), '==', attrID).where('uid', '==', uid).get().then(snapshot => {
			$(identifier).attr("disabled", false);
			$(identifier).html("Edit");
			updateData(snapshot.docs);
		});
	}else{
		updateData([]);
	}
}

function viewVote(identifier){
	let attrID = $(identifier).parent().data('id');
	$(identifier).html("");
	$(identifier).html("Loading");
	$(identifier).attr("disabled", true);
	if (attrID) {
		db.collection('vote-post').where(firebase.firestore.FieldPath.documentId(), '==', attrID).get().then(snapshotQuery => {
			db.collection('vote-points').where(firebase.firestore.FieldPath.documentId(), '==', attrID).get().then(snapshot => {
				$(identifier).attr("disabled", false);
				$(identifier).html("View");
				viewStatus(snapshot.docs,snapshotQuery.docs,attrID);
			});
		});
	}else{
		viewStatus([]);
	}
}