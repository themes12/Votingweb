function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function handleSignup(){
	var email = document.getElementById('username').value;
	var password = document.getElementById('pass').value;
	if (validateEmail(email)){
		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			Swal.fire(
				'Error',
				errorMessage ,
				'error'
			)
			console.log(error);
		});
	}else{
		Swal.fire(
		  'Error',
		  email + ' is not valid',
		  'error'
		)
		return;
	}
}
window.onload=function(){
	initApp();
}

function passwordReset(){
	/* const { value: email } = await Swal.fire({
	  title: 'Reset password',
	  input: 'email',
	  inputPlaceholder: 'Enter your email address'
	})

	if (email) {
	  //Swal.fire(`Entered email: ${email}`)
		firebase.auth().sendPasswordResetEmail(email).then(function() {
		  // Email sent.
		}).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			if(errorCode == 'auth/invalid-email'){
				Swal.fire(
					'Error',
					'Email not found. Please try again!' ,
					'error'
				)
			}else if (errorCode == 'auth/user-not-found') {
				Swal.fire(
					'Error',
					'User not found. Please try again!' ,
					'error'
				)
			}else{
				Swal.fire(
					'Error',
					errorMessage + ' Please try again!' ,
					'error'
				)
			}
		});
	} */
}

function toggleSignIn(){
	var email = document.getElementById('username').value;
	var password = document.getElementById('pass').value;
	if (validateEmail(email)){
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		  	var errorCode = error.code;
		  	var errorMessage = error.message;
		  	if (errorCode == 'auth/wrong-password') {
		  		Swal.fire(
					'Error',
					'Wrong password' ,
					'error'
				)
		  	}else{
		  		Swal.fire(
					'Error',
					errorMessage + ' Please try again!',
					'error'
				)
		  	}
		});
	}else{
		Swal.fire(
		  'Error',
		  email + ' is not valid',
		  'error'
		)
		return;
	}
}

function initApp(){
	firebase.auth().onAuthStateChanged(function(user) {
	  	if (user) {
	  		let timerInterval
			Swal.fire({
			  title: 'Logged in',
			  html: 'I will redirect in <b></b> seconds.',
			  icon: 'success',
			  timer: 5000,
			  timerProgressBar: true,
			  onBeforeOpen: () => {
			    Swal.showLoading()
			    timerInterval = setInterval(() => {
			    	var duration = Swal.getTimerLeft()
			    	var seconds = Math.floor((duration / 1000) % 60)
			      	const content = Swal.getContent()
			      	if (content) {
			        	const b = content.querySelector('b')
			        	if (b) {
			          		b.textContent = seconds
			        	}
			      	}
			    }, 1000)
			  },
			  onClose: () => {
			    clearInterval(timerInterval)
			  }
			}).then((result) => {
			  /* Read more about handling dismissals below */
			  if (result.dismiss === Swal.DismissReason.timer) {
			    location.href = "../user/";
			  }
			})
		}
	});
}