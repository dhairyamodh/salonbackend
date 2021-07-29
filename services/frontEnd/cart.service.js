const httpStatus = require('http-status');


const getCart = async (db, data) => {
    try {
        const cart = await db.Cart.findOne({ customerId: data.userId })
        return ({ status: httpStatus.OK, data: cart && cart.items })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const addToCart = async (db, data) => {
    try {
        if (!data.userId) {
            return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: 'userId is missing' })
        }
        const checkUserCart = await db.Cart.findOne({ customerId: data.userId })
        let cart = [];

        if (checkUserCart) {
            cart = await db.Cart.findOneAndUpdate({ customerId: data.userId }, data)
        } else {
            cart = await db.Cart.create({ ...data, customerId: data.userId })
        }

        return ({ status: httpStatus.OK, data: cart, message: `${data.items[0].name} added to cart` })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const removeToCart = async (db, data) => {
    try {
        if (!data.userId) {
            return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: 'userId is missing' })
        }
        await db.Cart.findOneAndUpdate({ customerId: data.userId }, data)
        const cart = await db.Cart.findOne({ customerId: data.userId })
        return ({ status: httpStatus.OK, data: cart.items })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const transferCart = async (db, data) => {
    try {
        const cart = await db.Cart.findOne({ customerId: data.userId })
        let newcart = []
        data.items.map((dataItem) => {
            const found = cart && cart.items.findIndex((cartItem) => {
                return dataItem._id === cartItem._id
            })
            // console.log(found);
            if (found > -1) {
                dataItem.quantity += cart.items[found].quantity
            }

            newcart = [...newcart, dataItem]
        })
        // console.log('newcart', newcart.map((item) => item.quantity));
        const filteresItems = cart && cart.items.filter((cartItem) => {
            if (data.items.find((dataItems) => dataItems._id === cartItem._id)) {
                return false
            }
            return true
        })
        const updatedCart = [...newcart, ...filteresItems]
        await db.Cart.findOneAndUpdate({ customerId: data.userId }, { ...data, items: updatedCart })
        return ({ status: httpStatus.OK, data: updatedCart, })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

const applyCoupon = async (db, data) => {
    try {
        const checkCouponCode = await db.Deals.findOne({ dealCode: data.coupon })
        if (checkCouponCode) {
            return ({ status: httpStatus.OK, data: checkCouponCode })
        }
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Invalid Code" })

    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

module.exports = {
    getCart, addToCart, removeToCart, transferCart, applyCoupon
}