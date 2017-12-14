$(document).ready(function() {
  $(".updateo").submit(function(e) {
    e.preventDefault();
    var values = {};
    $.each($(this).serializeArray(), function(i, field) {
    values[field.name] = parseFloat(field.value);
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
  if (values['price'] < 0) {
    swal('Update failed!', 'Please enter a valid price.', 'error');
    return;
  }
  if (values['stock'] < 0) {
    swal('Update failed!', 'Please enter a valid value for stock.', 'error');
    return;
  }
  if (values['sale'] > 100 || values['sale'] < 0) {
    swal('Update failed!', 'Please enter a valid sale percentage', 'error');
    return;
  }
  $.post('/updateproduct', { price: values['price'], stock: values['stock'], sale: values['sale'], id: values['id'] }, function(data) {
    swal('Product updated', '', 'success');
  });
}

function deleteProduct(id) {
  $.get('/deleteproduct', { id: id }, function(data) {
    $("#row" + id).remove();
    swal('Product deleted', '', 'success');
  });
}
