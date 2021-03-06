
document.addEventListener("deviceready", onDeviceReady, false);

	    // device APIs are available
	    //
	    function onDeviceReady() {
		   var options = new ContactFindOptions();
		   options.filter = "";
		   options.multiple = true;
		   fields = ["*"];
		   navigator.contacts.find(fields, contactfindSuccess, contactfindError, options);

		   
		
	    }
            
           function contactfindSuccess(contacts) {
		   // $(".console").html(JSON.stringify(contacts))
		   var output = ''
              for (var i = 0; i < contacts.length; i++) {
			var phone = contacts[i].phoneNumbers[0];
			// alert(contacts[i].displayName+"-"+phone.value);
		      output += '<li class="collection-item avatar">'+
                        '<img src="../icon.png" alt="" class="circle">'+
                        '<span class="title">'+contacts[i].displayName+'</span>'+
                        '<p>'+phone.value+'<br>'+
                        '</p>'+
                        '<a class="secondary-content">'+
                            '<small>Online</small>'+
                        '</a>'+
                    '</li>'
		      
	      }
		   
		   $(".cont-list").html(output)
	   }

	   function contactfindError(message) {
	      alert('Failed because: ' + message);
	   }







$(document).ready(function () {

	var path = "https://savinglifesglobal.com.ng/lc_server/"

	
	var LC = function () {
		
		this.displayUsersDetails = function () {
			var user_details_object = JSON.parse(localStorage.getItem('user_details'))
			$('.name').html('<i class="ti-user"></i> '+user_details_object.surname+" "+user_details_object.firstname)
			$('.email').html('<i class="ti-email"></i> '+user_details_object.email)
			
			
		}

		this.load = function (text) {
			swal({
				title: '<div class="preloader-wrapper small active">'+
					    '<div class="spinner-layer spinner-red-only">'+
					      '<div class="circle-clipper left">'+
					        '<div class="circle"></div>'+
					      '</div><div class="gap-patch">'+
					        '<div class="circle"></div>'+
					      '</div><div class="circle-clipper right">'+
					        '<div class="circle"></div>'+
					      '</div>'+
					    '</div>'+
					  '</div>',
				text: text,
				html: true,
				showConfirmButton : false
			})
		}


		this.onBackKeyDown = function (e) {
			e.preventDefault();
			navigator.notification.confirm("Are you sure you want to exit this app", function() {
				navigator.app.exitApp();
			}, 'Exit!', ['NO','YES'])
			
		}


		this.success = function (text, callback) {
			swal({
				title: '',
				text: '<p>'+text+'</p>',
				html: true,
				type: 'success',
				confirmButtonClass : 'btn red darken-4'
			},
			function () {
		        callback()
		    })
		}


		this.warn = function (text, callback) {
			swal({
				title: '',
				text: '<p>'+text+'</p>',
				html: true,
				type: 'warning',
				confirmButtonClass : 'btn red darken-4'
			},
			function () {
		        callback()
		    })
		}



		this.makeUse = function (formData, file_name, callback, errorCallback = null, type = 'JSON') {
			$.ajax({
				url: path+file_name,
				type: "POST",
				data: formData,
				cache: false,
			    processData: false,
			    contentType: false,
			    dataType: type,
				success: function(r) {
					callback(r)
				},
			    error: function(XMLHttpRequest, textStatus, errorThrown){
			        errorCallback(XMLHttpRequest, textStatus, errorThrown)
			    }
			})
		}
	}
	


	var LC = new LC()
	
	
	$(".hundred").css({
		'min-height': $(window).height()
	})


	$(".height-stay").css({
		'height': $(window).height()-157
	})

	
	
	

	$(".hundred").css({
		'min-height': $(window).height()
	})

//document.addEventListener("backbutton", LC.onBackKeyDown, false);

	$(".show-load").on('click', function () {
		LC.load('Please wait...')
		$(".show-load").on('shown.bs.tab', function(event){
			swal.close()
		})
	})


	$("#register_form").validate({
		rules: {
		    c_password: {
			equalTo: "#password"
		    }
		},
		ignore: ".ignore",
	    	showErrors: function(errorMap, errorList) {
			$(".form-errors").html("All fields must be completed before you submit the form.");
	    	},
		submitHandler: function (form) {

			LC.load('Please wait...')

			var formData = new FormData(form)
			formData.append('key', 'register')

			LC.makeUse(formData, "", function (resp) {
				if (resp.status == '1') {
					$("a[pick=login]").trigger('click')
					swal.close()
					$("#register_form").trigger('reset')
				} else {
					navigator.notification.confirm('Unable to register this acction...Try again', function() {
						$("#register_form").trigger('submit')
					}, '!', 'Try again')
					
					swal.close()
				}
				
			}, function (a, b, c) {
				console.log(a)
			})

			return false
		}
	})


	$("#login_form").validate({
		ignore: ".ignore",
	    showErrors: function(errorMap, errorList) {
	        $(".form-errors").html("All fields must be completed before you submit the form.");
	    },
		submitHandler: function (form) {
			LC.load('Please wait...')

			var formData = new FormData(form)
			formData.append('key', 'login')

			LC.makeUse(formData, "login", function (resp) {
				if (resp.status == '1') {

					window.location = 'data/index.html'
					localStorage.setItem('user_details', JSON.stringify(resp.entry))
		
				} else {
					navigator.notification.confirm('Unable to login...Check your login details', function() {
						//
					}, '!', 'OK')
					swal.close()
				}
			}, function (a, b, c) {
				console.log(a)
			})

			return false
		}
	})


	$('.button-collapse').sideNav({
	      	menuWidth: 300, // Default is 300
	      	edge: 'left', // Choose the horizontal origin
	      	closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
	      	draggable: true
	    }
	);

	$('#tabs-swipe-demo').tabs({ 'swipeable': true });


	$(function () {
		setTimeout(function () { $('.page-loader-wrapper').fadeOut(); }, 50);
	});


	$(".logout").on('click', function () {
		LC.load('Logging out...')
		localStorage.removeItem('user_details')
		location.reload(true)
		return false
	})

	if (localStorage.getItem('user_details') != null) {
		LC.displayUsersDetails()
	}
})
