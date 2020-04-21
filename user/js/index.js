const votePost = document.querySelector('.container');
const loggedInLinks = document.querySelectorAll('.logged-in');

var uid = "";
var displayName = "";
var email = "";
//var userC;
const setupUI = (user) => {
	if (user) {
		uid = user.uid;
		displayName = user.displayName;
		email = user.email;
		//userC = user;
		loggedInLinks.forEach(item => item.style.display = 'block');
	}else{
		loggedInLinks.forEach(item => item.style.display = 'none');
	}
}

const setupVotes = (data) => {
	if (data.length) {
		let html = '';
		data.forEach(doc => {
			const post = doc.data();
			let time = post.timestamp;
			let date = time.toDate();
  			let shortDT = date.toLocaleString();
  			let voteTimes = post.times;
  			let voteTimesText = "";
  			if (voteTimes == true) {
  				voteTimesText = "Yes";
  			}else{
  				voteTimesText = "No";
  			}
			const card = `
		          <div class="card card-equal-height">
		            <div class="card-image">
		              <figure class="image is-4by3">
		                <img src="${post.photo_url}" alt="image">
		              </figure>
		            </div>
		            <div class="card-content">
		              <p class="title has-text-centered">${post.title}</p>
		              <div class="content" id="card-content">
		                ${post.content}
		                <br>
		                Creator : ${post.user_create}
		                <br>
		                Only once vote : ${voteTimesText}
		                <br>
		                <time id="created-time" datetime="">Created Date : ${shortDT}</time>
		              </div>
		            </div>
		            <div class="card-footer" data-id="${doc.id}">
		                <a class="card-footer-item" id="view-item" onclick="viewVote(this);">View</a>
		                <a class="card-footer-item" id="update-item" onclick="callData(this);">Edit<div style="display: none;" class="dot-flashing" id="loading-spin"></div></a>
		                <a class="card-footer-item" id="delete-item" onclick="deleteData(this);">Delete</a>
		            </div>
		          </div>
			`;
			html += card
		});
		votePost.innerHTML = html;
	}else{
		votePost.innerHTML = '<h5>Create new vote</h5>';
	}
}

  $('.navbar-item').each(function(e) {
    $(this).click(function(){
      if($('#navbar-burger-id').hasClass('is-active')){
        $('#navbar-burger-id').removeClass('is-active');
        $('#navbar-menu-id').removeClass('is-active');
      }
    });
  });

  // Open or Close mobile & tablet menu
  $('#navbar-burger-id').click(function () {
    if($('#navbar-burger-id').hasClass('is-active')){
      $('#navbar-burger-id').removeClass('is-active');
      $('#navbar-menu-id').removeClass('is-active');
    }else {
      $('#navbar-burger-id').addClass('is-active');
      $('#navbar-menu-id').addClass('is-active');
    }
  });

function createvote() {
	(async () => {
	const { value: formValues } = await Swal.fire({
	  title: 'Create vote',
	  html:
	    `
	    <div>
			<label for="title" style="font-size: 20px;">Title</label>
			<input type="text" id="swal-title" class="swal2-input" placeholder="title" required>
		</div>
	    ` 
	    +
	    `
	    <div>
	    	<label for="content" style="font-size: 20px;">Content</label>
	    	<textarea id="swal-content" class="textarea has-fixed-size" rows="3" maxlength="150"></textarea>
	    </div>
	    ` 
	    +
	    `
	    <br>
	    <div id="input-options">
	    	<label for="options" style="font-size: 20px;">Create options</label><br>
	    </div>
	    <button id="create-select" class="button is-success">Add options</button>
	    `
	    +
	     `
	    <div>
	    	<br>
			<label for="times" style="font-size: 25px;">Vote once times?</label>
			<input type="checkbox" id="swal-vote" class="swal2-input" required>
	    </div>
	    ` ,
	  confirmButtonText: 'Create',
	  focusConfirm: false,
	  preConfirm: () => {
	    return [
	      document.getElementById('swal-title').value,
	      document.getElementById('swal-content').value
	    ]
	  }
	})
	var div = document.getElementsByName("swalinput").length;
	var i;
	var swalinput;
	var voteOnce;
	var options = [];
	var optionsInt = [];
	var optionsZero = 0;
	var user = firebase.auth().currentUser;
	var uid;
	var uniqueID = chance.guid();
	var votevalue = document.getElementById('swal-vote');
	if(votevalue.checked == true){
		voteOnce = true;
	}else{
		voteOnce = false;
	}

	for (i = 1; i <= div; i++) {
		  swalinput = document.getElementById('swalinput-'+i).value;
		  options.push(swalinput);
		  optionsInt.push(optionsZero);
		}
	var jsonText = JSON.stringify(options);
	if (user != null) {
	  uid = user.uid;
	}
	if (formValues && options) {
		//may be add somes null check in formsValue
		db.collection('vote-post').add({
			title: formValues[0],
			content: formValues[1],
			select: options,
			times: voteOnce,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			user_create: displayName,
			uid: uid,
			uniqueID: uniqueID
		}).then(function(docRef) {
			//nextinsert
				db.collection('vote-points').doc(docRef.id).set({
					
				}).then(() => {
					db.collection('vote-users').doc(docRef.id).set({
					
					}).then(() => {

						db.collection('vote-users-unique').doc(docRef.id).set({
							[docRef.id]: docRef.id
						}).then(() => {
							Swal.fire(
							  	'Success',
							  	"Great!. Add data successful. You can copy vote link by go to view menu.",
							  	'success'
							 )
						}).catch(err => {
							Swal.fire(
								'Error',
								err.message,
								'error'
							)
						});

					}).catch(err => {
						Swal.fire(
							'Error',
							err.message,
							'error'
						)
					});
				}).catch(err => {
					Swal.fire(
						'Error',
						err.message,
						'error'
					)
				});
			//endinsert
		}).catch(err => {
			Swal.fire(
				'Error',
				err.message,
				'error'
			)
		});
	}else{
		Swal.fire(
			'Error',
			'Error. Please complete form.',
			'error'
		)
	}
	})()
	var counter = 0;
		var btn = document.getElementById('create-select');
		var form = document.getElementById('input-options');
		var input = document.createElement("input");
		counter++;
		input.className = 'swal2-input';
		input.id = 'swalinput-' + counter;
		input.type = 'text';
		input.name = 'swalinput';
		input.placeholder = 'Options ' + counter;
		input.required = 'true';
		form.appendChild(input);
		var addInput = function() {
			var input = document.createElement("input");
			counter++;
			input.className = 'swal2-input';
			input.id = 'swalinput-' + counter;
			input.type = 'text';
			input.name = 'swalinput';
			input.placeholder = 'Options ' + counter;
			form.appendChild(input);
		};
		btn.addEventListener('click', function() {
			addInput();
		}.bind(this));
}

function viewAccount() {
	//maybe fix null
	(async () => {
	const { value: formValues } = await Swal.fire({
	  title: 'Account',
	  html:
	  	`
	  	<div>
	    	<label for="displayname" style="font-size: 20px;">Display Name</label>
			<input id="account-name" class="swal2-input" value="${displayName}">
		</div> 
	  	`
	  	+
	    `
	    <div>
	    	<label for="Email" style="font-size: 20px;">Email</label>
			<input id="account-email" class="swal2-input" value="${email}" disabled>
		</div> 
		`,
	  showCancelButton: false, // There won't be any cancel button
	  showConfirmButton: true,
	  confirmButtonText: 'Update',
	  focusConfirm: false,
	  preConfirm: () => {
	    return [
	      document.getElementById('account-name').value
	    ]
	  }
	})


	if (formValues) {
	  	updateUsers(formValues[0]);
	}
	})()
}

function updateUsers(dpName){
	var user = firebase.auth().currentUser;
	user.updateProfile({
	  displayName: dpName
	}).then(function() {
	  	Swal.fire(
			'Success',
			'Great!. Update profile successful.',
			'success'
		)
	}).catch(function(error) {
	  	Swal.fire(
			'Error',
			error.message,
			'error'
		)
	});
}

function deleteData(identifier) {
	let attrID = $(identifier).parent().data('id');
	var user = firebase.auth().currentUser;
	var uid;
	if (user != null) {
	  uid = user.uid;
	}
	Swal.fire({
		title : 'Delete?',
		text: 'You sure to delete this vote?',
		icon: 'warning',
		allowOutsideClick: false,
		showConfirmButton: true,
  		showCancelButton: true,
  		confirmButtonText: 'Delete',
  		confirmButtonColor: '#FF3860'
	}).then((result) => {
	  	if (result.value) {
	  		db.collection('vote-post').doc(attrID).delete().then(function() {

	  			db.collection('vote-points').doc(attrID).delete().then(function() {

	  				db.collection('vote-users').doc(attrID).delete().then(function() {

		  				db.collection('vote-users-unique').doc(attrID).delete().then(function() {
		  					
		  					Swal.fire(
								'Success',
								'Document successfully deleted!',
								'success'
							)

		  					/*var jobskill_query = db.collection('vote-selector').where(attrID,'==',attrID);
							jobskill_query.get().then(function(querySnapshot) {

							  	/*querySnapshot.forEach(function(doc) {

							  		/*doc.ref.delete().then(() => {

							  			Swal.fire(
											'Success',
											'Document successfully deleted!',
											'success'
										)

							    	}).catch(function(error) {
							    		Swal.fire(
											'Error',
											error.message,
											'error'
										)
							    	}); 
							    	
							  	}); 

					  		}).catch(function(error) {
								Swal.fire(
									'Error removing document!',
									error.message ,
									'error'
								)
							}); */

				  		}).catch(function(error) {
							Swal.fire(
								'Error removing document!',
								error.message ,
								'error'
							)
						});
						
		  			}).catch(function(error) {
						Swal.fire(
							'Error removing document!',
							error.message ,
							'error'
						)
					});
					
	  			}).catch(function(error) {
					Swal.fire(
						'Error removing document!',
						error.message ,
						'error'
					)
				});
			    
			}).catch(function(error) {
				Swal.fire(
					'Error removing document!',
					error.message ,
					'error'
				)
			});
	  	}
	})
}

const updateData = (data) => {
	var updateOptions = "";
	if (data.length) {
		data.forEach(doc => {
		const postUpdate = doc.data();
		updateOptions = postUpdate.select;
		(async () => {
			const { value: formValues } = await Swal.fire({
			  title: 'Edit vote',
			  html:
			  	`
			    <div>
					<label for="title" style="font-size: 20px;">Title</label>
					<input type="text" id="title-update" class="swal2-input" placeholder="title" value="${postUpdate.title}">
				</div>
			    ` 
			    +
			    `
			    <div>
			    	<label for="content" style="font-size: 20px;">Content</label>
			    	<textarea id="content-update" class="textarea has-fixed-size" rows="5" maxlength="200">${postUpdate.content}</textarea>
			    </div>
			    ` 
			    +
			    `
			    <br>
			    <div id="input-options">
			    	<label for="options" style="font-size: 20px;">Create options</label><br>
			    </div>
			    <button id="create-select" class="button is-success">Add option</button>
			    <button id="delete-select" class="button is-danger">Delete option</button>
			    `
			    +
			     `
			    <div>
			    	<br>
					<label for="times" style="font-size: 25px;">Vote once times?</label>
					<input type="checkbox" id="vote-update" class="swal2-input" >
			    </div>
			    `,
			  showCancelButton: false, // There won't be any cancel button
			  showConfirmButton: true,
			  confirmButtonText: 'Update',
			  focusConfirm: false,
			  preConfirm: () => {
			    return [
			      	document.getElementById('title-update').value,
	      			document.getElementById('content-update').value
			    ]
			  }
			})
			var div = document.getElementsByName("swalinput").length;
			var i;
			var swalinput;
			var voteOnce;
			var pointsText;
			var options = [];
			var votevalue = document.getElementById('vote-update');
			if(votevalue.checked == true){
				voteOnce = true;
			}else{
				voteOnce = false;
			}

			for (i = 0; i < div; i++) {
				swalinput = document.getElementById('swalinput-'+i).value;
				options.push(swalinput);
				}
			if (formValues) {
				db.collection('vote-post').doc(doc.id).update({
					title: formValues[0],
					content: formValues[1],
					select: options,
					times: voteOnce,
					Edit_date: firebase.firestore.FieldValue.serverTimestamp(),
					user_create: displayName,
					uid: uid
				}).then(() => {
					Swal.fire(
						'Success',
						'Great!. Add data successful.',
						'success'
					)
				}).catch(err => {
					Swal.fire(
						'Error',
						err.message,
						'error'
					)
				})
			}
			})()

			var counter = 0;
			if (updateOptions) {
				for(counter = 0, len = updateOptions.length; counter < len; counter++){
					var btn = document.getElementById('create-select');
					var form = document.getElementById('input-options');
					var input = document.createElement("input");
					input.className = 'swal2-input';
					input.id = 'swalinput-' + counter;
					input.type = 'text';
					input.name = 'swalinput';
	  				input.value = updateOptions[counter];
					input.placeholder = 'Options ' + counter;
					input.required = 'true';
					form.appendChild(input);
					}
				var addInput = function() {
				var input = document.createElement("input");
				//counter++;
				input.className = 'swal2-input';
				input.id = 'swalinput-' + counter;
				input.type = 'text';
				input.name = 'swalinput';
				input.placeholder = 'New options '+counter;
				form.appendChild(input);
				};
				btn.addEventListener('click', function() {
					addInput();
				}.bind(this));

				var status = postUpdate.times;
				let checkbox = document.getElementById("vote-update");
				if (status == true) {
					checkbox.checked = true;
				}else{
					checkbox.checked = false;
				}
				
				var btnDelete = document.getElementById('delete-select');
				var deleteInput = function() {
					var divCount = document.getElementsByName("swalinput").length-1;
					var deleteElement = 'swalinput-'+divCount;
					$('#'+deleteElement).remove();
				};
				btnDelete.addEventListener('click', function() {
					deleteInput();
				}.bind(this));
			}
		});
	}
}

const viewStatus = (data,post,attrID) => {
	var updateOptions = "";
	var selectOptions = [];
	var pointsData;
	var pointsArray = [];
	var pointsCount;
	var originLink = window.location.origin;
	var copyLink = originLink+'/vote/?vote='+attrID;
	if (data.length) {
		data.forEach(doc => {
		const postView = doc.data();
		(async () => {
			const { value: formValues } = await Swal.fire({
			  title: 'Vote',
			  html:
			  	`
			    <canvas id="vote-chart">
			    </canvas>
			    `
			    +
			    `
			    <div>
			    	<label for="times" style="font-size: 25px;">Vote count</label>
			    	<p style="font-size: 21px;" id="vote-count"></p>
			    </div>
			    `
			    +
			    `
			    <div>
			    	<br>
					<div class="field is-grouped">
					  <p class="control is-expanded">
					    <input class="input" type="text" id="link" value="${copyLink}">
					  </p>
					  <p class="control">
					    <a class="button is-success" onclick="copylink();">
					      Copy
					    </a>
					  </p>
					</div>
			    </div>
			    `
			    ,
			  showCancelButton: false, // There won't be any cancel button
			  showConfirmButton: true,
			  focusConfirm: false
			})
			
			})()
			if (post.length) {
				post.forEach(docPost => {
					const postData = docPost.data();
					selectOptions = postData.select;
				});
			}
			for (var i = 0; i < selectOptions.length; i++) {
				pointsData = postView[selectOptions[i]];
				pointsArray.push(pointsData);
				pointsCount = pointsArray.reduce(function(a, b){
			        return a + b;
			    }, 0);
				$("#vote-count").html(pointsCount);
			}
			var chart = document.getElementById('vote-chart').getContext('2d');
			var myChart = new Chart(chart, {
			    type: 'bar',
			    data: {
			        labels: selectOptions,
			        datasets: [{
			            label: 'Votes',
			            data: pointsArray,
			            backgroundColor: [
			                'rgba(255, 99, 132, 0.2)'
			            ],
			            borderColor: [
			                'rgba(255, 99, 132, 1)'
			            ],
			            borderWidth: 1
			        }]
			    },
			    options: {
			        scales: {
			            yAxes: [{
			                ticks: {
			                    beginAtZero: true
			                }
			            }]
			        }
			    }
			});
		});
	}
}

function copylink(copyText) {
	var copyText = document.getElementById("link");
  	copyText.select();
  	copyText.setSelectionRange(0, 99999)
  	document.execCommand("copy");
  	console.log("Copied the text: " + copyText.value);
}