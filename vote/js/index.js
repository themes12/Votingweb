const votePost = document.querySelector('.logged-in-card');
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
	var optionSelect = "";
	var docID;
	var uniqueID;
	var uniqueHash;
	if (data.length) {
		let html = '';
		data.forEach(doc => {
			const post = doc.data();
			optionSelect = post.select;
			docID = doc.id;
			uniqueID = post.uniqueID;
			let time = post.timestamp;
			let date = time.toDate();
  			let shortDT = date.toLocaleString();
			const card = 
			`
			<div class="col card s10 pull-s1 m6 pull-m3 l4 pull-l4 ">
				<div class="card-content">
			        <div class="card-image">
					    <img class="responsive-img" src="${post.photo_url}">
					</div>
			        <span class="card-title center-align">${post.title}</span>
					<p class="center-align">${post.content}</p>
			    </div>
			    <div class="card-action" id="card-action">
					
			    </div>
			    <div class="center-align" data-id="${doc.id}">
			    	<a class="waves-effect waves-light btn" onclick="viewVote(this);">Vote status</a>
			    </div>
			    <p class="center-align">Creator : ${post.user_create} <p class="center-align" id="created-time">Created Date : ${shortDT}</p></p>
			</div>
			`;
			html += card
		});
		votePost.innerHTML = html;

		var counter = 0;
		if (optionSelect) {
			for(counter = 0, len = optionSelect.length; counter < len; counter++){
				var form = document.getElementById('card-action');
				var p = document.createElement("p");
				var label = document.createElement("label");
				var input = document.createElement("input");
				var span = document.createElement("span");
				input.className = 'with-gap';
				input.id = 'radiovote-' + counter;
				input.type = 'radio';
				input.name = 'group1';
	  			input.value = optionSelect[counter];
	  			input.onclick = function() {
    				callData(this);
				};
	  			label.id = 'labelvote-' + counter;
	  			span.textContent = optionSelect[counter];
				form.appendChild(p).appendChild(label).appendChild(input);
				var formSpan = document.getElementById("labelvote-"+counter);
				formSpan.appendChild(span);
				$('#labelvote-'+counter).attr('data-id' , docID);
				$('#labelvote-'+counter).attr('data-text' , optionSelect[counter]);
				$('#labelvote-'+counter).attr('data-unique' , uniqueID);
				//$('#labelvote-'+counter).attr('data-refupdate' , counter);
			}
		}
	}else{
		votePost.innerHTML = '<h5>Login to view details</h5>';
	} 
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

const viewStatus = (data,post) => {
	var updateOptions = "";
	var selectOptions = [];
	var pointsData;
	var pointsArray = [];
	var pointsCount;
	if (data.length) {
		data.forEach(doc => {
		const postView = doc.data();
		(async () => {
			const { value: formValues } = await Swal.fire({
			  title: 'Vote count',
			  html:
			    `
			    <div>
			    	<p style="font-size: 21px;" id="vote-count"></p>
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
		});
	}
}