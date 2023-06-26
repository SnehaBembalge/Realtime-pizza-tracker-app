const order = require("../../../models/order")
const Order = require('../../../models/order')

function orderController() {
    return {
      index(req, res) {
        Order.find({ status: { $ne: 'completed' } })
          .sort({ createdAt: -1 })
          .populate('customerId', '-password')
          .then((orders) => {
            if (req.xhr) {
              return res.json(orders);
            } else {
              return res.render('admin/orders');
            }
          })
          .catch((error) => {
            console.error(error);
            // Handle the error appropriately (e.g., send an error response)
          });
      }
    };
  }

module.exports = orderController