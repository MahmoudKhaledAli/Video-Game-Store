function ValidateEmail(mail)
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true);
  }
    return (false);
}

jQuery(document).ready(function() {

    $("#login-form").submit(function(e) {
      e.preventDefault();
      if ($("#login-username").val() == "" || $("#login-password").val() == "") {
        swal('Login failed!', 'Please enter username and password', 'error');
        return;
      }
      $.post("login", { username: $("#login-username").val(), password: $("#login-password").val() }, function(data) {
        console.log(data);;
        if (data == '0') {
          swal('Login failed!', 'Invalid Username and/or Password.', 'error');
        } else if (data == '1') {
          swal('Login failed!', 'This Account is Banned.', 'error');
        } else if (data == '2') {
          window.location.replace('/');
        }
      });
      return false;
    });

    $("#register-form").submit(function(e) {
      e.preventDefault();
      if ($("#form-username-reg").val() == 'Guest') {
        swal('Registration failed!', 'Username can\'t be Guest.', 'error');
        return;
      } else if ($("#form-username-reg").val() == 'Admin') {
        swal('Registration failed!', 'Username can\'t be Admin.', 'error');
        return;
      } else if ($("#form-username-reg").val() == "") {
        swal('Registration failed!', 'Please enter a username.', 'error');
      }
      if (!ValidateEmail($("#form-email").val())) {
        swal('Registration failed!', 'Please enter a valid email address.', 'error');
        return;
      }
      if ($("#form-password-reg").val().length < 6) {
        swal('Registration failed!', 'Password must be at least 6 characters.', 'error');
      }
      if ($("#form-address").val() == '') {
        swal('Registration failed!', 'Please enter your address.', 'error');
      }
      $.post("register",
      { username: $("#form-username-reg").val(),
        password: $("#form-password-reg").val(),
        email: $("#form-email").val(),
        address: $("#form-address").val(),
      },
      function(data) {
        console.log(data);;
        if (data == '0') {
          swal('Registration failed!', 'Username already exists', 'error');
        } else if (data == '1') {
          swal('Registration failed!', 'E-mail is already registered to an account', 'error');
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
