const catchAsync = require('../../utils/catchAsync');
const { cartService } = require('../../services/frontEnd');

const getCart = catchAsync(async (req, res) => {
    const response = await cartService.getCart(global.salons[req.query.salonId], req.query);
    res.status(response.status).send(response);
});

const addToCart = catchAsync(async (req, res) => {
    const response = await cartService.addToCart(global.salons[req.body.salonId], req.body);
    res.status(response.status).send(response);
});

const removeToCart = catchAsync(async (req, res) => {
    const response = await cartService.removeToCart(global.salons[req.body.salonId], req.body);
    res.status(response.status).send(response);
});

const transferCart = catchAsync(async (req, res) => {
    const response = await cartService.transferCart(global.salons[req.body.salonId], req.body);
    res.status(response.status).send(response);
});

const applyCoupon = catchAsync(async (req, res) => {
    const response = await cartService.applyCoupon(global.salons[req.body.salonId], req.body);
    res.status(response.status).send(response);
});


module.exports = {
    getCart, addToCart, removeToCart, transferCart, applyCoupon
};
