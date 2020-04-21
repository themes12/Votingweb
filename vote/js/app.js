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
				const Toast = Swal.mixin({
				  toast: true,
				  position: 'top-end',
				  showConfirmButton: false,
				  timer: 3000,
				  timerProgressBar: true,
				  onOpen: (toast) => {
				    toast.addEventListener('mouseenter', Swal.stopTimer)
				    toast.addEventListener('mouseleave', Swal.resumeTimer)
				  }
				})

				Toast.fire({
				  icon: 'warning',
				  title: 'Please verified your email. <a onclick="sendVerifyMail()">Send email verification</a>'
				})
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
		    var voteID = getAllUrlParams().vote;
		    if (voteID) {
		    	db.collection('vote-post').where(firebase.firestore.FieldPath.documentId(), '==', voteID).onSnapshot(snapshot => {
					setupVotes(snapshot.docs);
					setupUI(user);
				});
		    }else{
		    	setupVotes([],err);
				setupUI(user);
		    	Swal.fire(
					'Error',
					'Vote is not exist. Please try again!',
					'error'
				)
		    }
		} else {
			setupVotes([]);
			setupUI();
			location.href = "../login/";
		}
	});
}

function callData(identifier){
	let attrID = $(identifier).parent().data('id');
	let attrText = $(identifier).parent().data('text');
	let attrUnique = $(identifier).parent().data('unique');
	var user = firebase.auth().currentUser;
	var uid;
	var voteOnce;
	var key, docData, docTimes;
	
	if (user != null) {
	  uid = user.uid;
	}

	if (typeof attrText != "string") {
		attrText = String(attrText);
	}

	db.collection('vote-post').where(firebase.firestore.FieldPath.documentId(), '==', attrID).get().then(snapshot => {
		snapshot.forEach(doc => {
			docData = doc.data();
			docTimes = docData.times;
		});
			if (docTimes == true) {
				db.collection('vote-users').where(firebase.firestore.FieldPath.documentId(), '==', attrID).where(uid, '==', uid).get().then(snapshotUsers => {
					var snapshotU = snapshotUsers.docs;
					if (snapshotU.length == 0) {
						
						if (attrID.length && attrText.length && attrUnique.length) {

							db.collection("vote-points").doc(attrID).update({
								[attrText]: firebase.firestore.FieldValue.increment(1)
							}).then(function() {

								db.collection("vote-users").doc(attrID).update({ //wait for edit
									[uid]: uid
								}).then(function() {

									db.collection("vote-selector").doc(uid).set({
										[attrID]: attrID,
										[attrUnique]: attrText
									}).then(function() {

									}).catch(function(error) {
										Swal.fire(
											'Error',
											error.message,
											'error'
										)
									});

								}).catch(function(error) {
									Swal.fire(
										'Error',
										error.message,
										'error'
									)
								});

							}).catch(function(error) {
								Swal.fire(
									'Error',
									error.message,
									'error'
								)
							});

						}else{
							Swal.fire(
								'Error',
								'Vote data is not exist. Please try again later!',
								'error'
							)
						}
					}else{

						
						db.collection("vote-selector").where(firebase.firestore.FieldPath.documentId(), '==', uid).where(attrID, '==', attrID).get().then(function(snapshotSelect) {
						    snapshotSelect.forEach(function(docSelect) {
						    	const post = docSelect.data();
								key = post[attrUnique];
							});

							if (attrID.length && attrText.length && attrUnique.length) {
								db.collection("vote-points").doc(attrID).update({
									[key]: firebase.firestore.FieldValue.increment(-1)
								}).then(function() {

									db.collection("vote-selector").doc(uid).update({
										[attrUnique]: attrText
									}).then(function() {
										///
										db.collection("vote-points").doc(attrID).update({
											[attrText]: firebase.firestore.FieldValue.increment(1)
										}).then(function() {
											///
										}).catch(function(error) {
											Swal.fire(
												'Error',
												error.message,
												'error'
											)
										});
										////
									}).catch(function(error) {
										Swal.fire(
											'Error',
											error.message,
											'error'
										)
									});

								}).catch(function(error) {
									Swal.fire(
										'Error',
										error.message,
										'error'
									)
								});

							}else{
								Swal.fire(
									'Error',
									'Vote data is not exist. Please try again later!',
									'error'
								)
							}

						}).catch(function(error) {
					        Swal.fire(
								'Error',
								error.message,
								'error'
							)
					    });

					}
				}, function(error) {
					console.log(error);
				}); 
			
			}else{
				if (attrID && attrText) {

					db.collection("vote-points").doc(attrID).update({
						[attrText]: firebase.firestore.FieldValue.increment(1)
					}).then(function() {

						db.collection("vote-users-unique").doc(attrID).update({ //wait for edit
							[uid]: uid
						}).then(function() {
							
						}).catch(function(error) {
							Swal.fire(
								'Error',
								error.message,
								'error'
							)
						});

					}).catch(function(error) {
						Swal.fire(
							'Error',
							error.message,
							'error'
						)
					});

				}else{
					Swal.fire(
						'Error',
						'Vote data is not exist. Please try again later!',
						'error'
					)
				}
			}
	});
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
				$(identifier).html("Vote status");
				viewStatus(snapshot.docs,snapshotQuery.docs);
			});
		});
	}else{
		viewStatus([]);
	}
}

function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      /*paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase(); */

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}