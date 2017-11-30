$(document).ready(function() {
  $(".updateo").submit(function(e) {
    e.preventDefault();
    var values = {};
    $.each($(this).serializeArray(), function(i, field) {
    values[field.name] = parseInt(field.value);
    });
    values['id'] = parseInt(this.id);
    console.log(values);
    updateProduct(values);
  });
  $(".delete").click(function(e) {
    deleteProduct(this.id.replace('delete', ''))
  });
});


function updateProduct(values) {
  $.post('updateproduct', { price: values['price'], stock: values['stock'], sale: values['sale'], id: values['id'] }, function(data) {
    swal('Product updated', '', 'success');
  });
}

function deleteProduct(id) {
  $.get('deleteproduct', { id: id }, function(data) {
    $("#row" + id).remove();
    swal('Product deleted', '', 'success');
  });
}
