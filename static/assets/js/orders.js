$(document).ready(function() {
  $(".update").click(function(e) {
    e.preventDefault();
    console.log(this);
    orderid = this.id.replace('up', '')
    updateOrder(orderid, $("#"+orderid+"st").val());
  });
});

function updateOrder(id, newStatus) {
  console.log(newStatus);
  $.get('updateorder', { idorder: id, newStatus: newStatus }, function(data) {
    swal('Order status updated', '', 'success');
  });
}
