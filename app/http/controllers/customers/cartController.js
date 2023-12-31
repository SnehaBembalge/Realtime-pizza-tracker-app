const { json } = require("express")
function cartController() {
    return {
        index(req,res) {
            res.render('customers/cart')

        },
        update(req, res) {

//for the first time creating cart and adding basic object structure
            if(!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
                
            }
            let cart = req.session.cart
            
                //check if iten does not exist in cart
                if(!cart.items[req.body._id]) {
                    cart.items[req.body._id] = {
                        item: req.body,
                        qty: 1
                    }
                    // cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                    cart.totalQty = cart.totalQty + 1
                    cart.totalPrice = cart.totalPrice + req.body.price
                }else {
                    cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                    cart.totalQty = cart.totalQty + 1
                    cart.totalPrice = cart.totalPrice + req.body.price
                }

            return res.json({ totalQty: req.session.cart.totalQty })
        },

        removePizzaFromCart(req, res) {
            const { pizzaId } = req.body;
            const cart = req.session.cart;
      
            if (cart && cart.items[pizzaId]) {
                const removedItem = cart.items[pizzaId];
                removedItem.qty--; // Decrease the quantity by 1
                cart.totalQty--; // Decrease the total quantity by 1
                cart.totalPrice -= removedItem.item.price; // Decrease the total price by the price of the item
            
                if (removedItem.qty === 0) {
                  delete cart.items[pizzaId]; // If the quantity becomes zero, remove the item from the cart
                }
              }
      
            req.flash('success', 'Pizza removed from cart.');
            return res.redirect('/cart');
          }
    }
}

module.exports = cartController