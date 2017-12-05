$(document).ready(function() {
  $(".ban").click(function(e) {
    e.preventDefault();
    console.log(this);
    banUnBanUser(this);
  });
  $("#updateaddress").click(function(e) {
    e.preventDefault();
    updateAddress($("#form-address").val());
  });
});

function banUnBanUser(button) {
  console.log(button.id);
  $.get('banuser', { username: button.id }, function(data) {
    $(button).toggleClass('btn-danger');
    $(button).toggleClass('btn-info');
    if ($.trim($(button).html()) == 'Ban') {
      swal('User banned', '', 'success');
      console.log('woow');
      $(button).html('Unban');
    } else {
      swal('User unbanned', '', 'success');
      $(button).html('Ban');
    }
  });
}

function logout() {
  $.get("logout", function(data) {
    window.location.replace("/");
  });
}

function updateAddress(newAddress) {
  $.post('updateaddress', { address: newAddress }, function(data) {
    swal('Address updated', '', 'success');
  });
}
