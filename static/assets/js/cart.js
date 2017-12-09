$(document).ready(function() {
  $(".updatei").click(function(e) {
    e.preventDefault();
    var values = {};
    id = this.id.replace('update', '');
    updateItem(id, $("#" + id).serializeArray()[0].value)
  });
  $(".deletei").click(function(e) {
    e.preventDefault();
    var values = {};
    id = this.id.replace('delete', '');
    deleteItem(id);
  });
  $("#placeit").click(function(e) {
    e.preventDefault();
    placeOrder($("#usr").val());
  });
});


function updateItem(id, quantity) {
  $.post('updateitem', { id: id, quantity: quantity }, function(data) {
    console.log("done");
    swal('Item updated', '', 'success', function() {
      window.location.replace("/cart");
    });
  });
}

function deleteItem(id) {
  $.get('deleteitem', { id: id }, function(data) {
    swal({'Item deleted', '', 'success', onClose: function(elem) {
      window.location.replace("/cart");
    }});
  });
}

function placeOrder(name) {
  $.get('coupon', { coupon: name }, function(data) {
    console.log(data);
    if (data == '0' && name != '') {
      swal("Coupon doesn't exist", '', 'error')
    } else {
      $.get('placeorder', { total: (100 - data) * parseInt($("#ordertotal").text().replace("Total: ", '')) / 100 }, function(data) {
        swal({'Order placed', '', 'success', onClose: function(elem) {
          window.location.replace("/cart");
        }});
      });
    };
  });
}
