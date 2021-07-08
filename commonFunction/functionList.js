const tinycolor = require("tinycolor2");

const colorLuminance = (hex, lum) => {

    // validate hex string
    return tinycolor(hex).lighten(lum).toString();
}

const statusCheck = (status) => {
    return status ? { status: true } : {}
}

const getToFix = (value, decimal) => {
    return value ? value.toFixed(decimal || 2) : 0
}


module.exports = { colorLuminance, statusCheck, getToFix }