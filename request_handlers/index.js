var user = require('./user.js')
var admin = require('./admin.js')

module.exports = {
  register: user.register,
  login: user.login,
  homepage: user.homepage,
  viewUsers: admin.viewUsers,
  logout: user.logout,
  ban: user.ban,
  viewOrders: admin.viewOrders,
  myOrders: user.myOrders,
  updateOrder: admin.updateOrder,
}
