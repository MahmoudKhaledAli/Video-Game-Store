$(document).ready(function() {
  $(".ban").click(function() {
    banUnBanUser(this)
  })
});

function banUnBanUser(button) {
  console.log(button.id);
  $.get('banuser', { username: button.id }, function(data) {
    $(button).toggleClass('btn-danger');
    $(button).toggleClass('btn-info');
    console.log();
    if ($.trim($(button).html()) == 'Ban') {
      alert('User banned');
      $(button).html('Unban');
    } else {
      alert('User unbanned');
      $(button).html('Ban');
    }
  });
}

function logout() {
  $.get("logout", function(data) {
    window.location.replace("/")
  });
}
