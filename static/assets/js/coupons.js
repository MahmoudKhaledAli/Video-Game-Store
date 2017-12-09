$(document).ready(function() {
  $(".updateo").submit(function(e) {
    e.preventDefault();
    var values = {};
    $.each($(this).serializeArray(), function(i, field) {
    values[field.name] = parseFloat(field.value);
    });
    values['id'] = this.id;
    console.log(values);
    updateProduct(values);
  });
  $(".delete").click(function(e) {
    deleteProduct(this.id.replace('delete', ''))
  });
});


function updateProduct(values) {
  $.post('updatecoupon', { amount: values['amount'], discount: values['discount'], id: values['id'] }, function(data) {
    swal('Coupon updated', '', 'success');
  });
}

function deleteProduct(id) {
  $.get('deletecoupon', { id: id }, function(data) {
    $("#row" + id).remove();
    swal('Coupon deleted', '', 'success');
  });
}
