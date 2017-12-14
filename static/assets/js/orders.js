$(document).ready(function() {
  $(".update").click(function(e) {
    e.preventDefault();
    console.log(this);
    orderid = this.id.replace('up', '')
    updateOrder(orderid, $("#"+orderid+"st").val());
  });
  $(".deleteo").click(function(e) {
    deleteOrder(this.id.replace('del', ''))
  });
});

function updateOrder(id, newStatus) {
  console.log(newStatus);
  $.get('/updateorder', { idorder: id, newStatus: newStatus }, function(data) {
    swal('Order status updated', '', 'success');
  });
}

function deleteOrder(id) {
  $.get('/deleteorder', { id: id }, function(data) {
    console.log("row" + id + "-1");
    $("#row" + id + "-1").remove();
    $("#row" + id + "-2").remove();
    swal('Order deleted', '', 'success');
  });
}
