const httpStatus = require('http-status');


const getCart = async (db, data) => {
    try {
        const cart = await db.Cart.findOne({ customerId: data.userId })
        return ({ status: httpStatus.OK, data: cart.items })
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

        return ({ status: httpStatus.OK, data: cart })
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
        const newcart = cart.items.filter((cartItem) => {
            const foundItem = data.items.findIndex((dataItem) =>
                dataItem._id == cartItem._id
            )
            if (foundItem) {
                return false
            }
            return true
        })
        console.log('newcart', newcart);
        const updatedCart = [...newcart, ...data.items]
        console.log('updatedCart', updatedCart);
        await db.Cart.findOneAndUpdate({ customerId: data.userId }, { ...data, items: updatedCart })

        return ({ status: httpStatus.OK, data: updatedCart })
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error })
    }
}

module.exports = {
    getCart, addToCart, removeToCart, transferCart
}