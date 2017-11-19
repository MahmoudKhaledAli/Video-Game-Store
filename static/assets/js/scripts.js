
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
  });
