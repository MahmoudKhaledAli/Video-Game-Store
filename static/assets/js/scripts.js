
jQuery(document).ready(function() {

    /*
        Login form validation
    */
    $('.login-form input[type="text"], .login-form input[type="password"], .login-form textarea').on('focus', function() {
    	$(this).removeClass('input-error');
    });

    $('.login-form').on('submit', function(e) {

    	$(this).find('input[type="text"], input[type="password"], textarea').each(function(){
    		if( $(this).val() == "" ) {
    			e.preventDefault();
    			$(this).addClass('input-error');
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});

    });

    /*
        Registration form validation
    */
    $('.registration-form input[type="text"], .registration-form textarea').on('focus', function() {
    	$(this).removeClass('input-error');
    });

    $("#login-form").submit(function() {
      $.post("login", { username: $("#login-username").val(), password: $("#login-password").val() }, function(data) {
        console.log(data);;
        if (data == '0') {
          alert('Invalid Username and/or Password.');
        } else if (data == '1') {
          alert('This Account is Banned.');
        } else if (data == '2') {
          window.location.replace('/');
        }
      });
      return false;
    });

    $("#register-form").submit(function() {
      $.post("register",
      { username: $("#form-username-reg").val(),
        password: $("#form-password-reg").val(),
        email: $("#form-email").val(),
        address: $("#form-address").val(),
      },
      function(data) {
        console.log(data);;
        if (data == '0') {
          alert('Username already exists');
        } else if (data == '1') {
          alert('This E-mail is already registered to an account.');
        } else if (data == '2') {
          window.location.replace('/');
        }
      });
      return false;
    });

    // $('#login-button').click(function(e) {
    //   $.post("login", { username: $("#login-username").val(), password: $("#login-password").val() } function(data) {
    //     if (data == '0') {
    //       alert("Incorret username and/or password");
    //     } else {
    //       $.get("homepage");
    //     }});
    //   });
    // 	// $(this).find('input[type="text"], textarea').each(function(){
    	// 	if( $(this).val() == "" ) {
    	// 		e.preventDefault();
    	// 		$(this).addClass('input-error');
    	// 	}
    	// 	else {
    	// 		$(this).removeClass('input-error');
    	// 	}
    	// });
  });
