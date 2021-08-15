const tinycolor = require("tinycolor2");

const colorLuminance = (hex, lum) => {

    // validate hex string
    return tinycolor(hex).lighten(lum).toString();
}

const statusCheck = (status) => {
    return status ? { status: true } : {}
}

const getToFix = (value, decimal) => {
    if (typeof value === "string") {
        return parseFloat(parseFloat(value).toFixed(decimal || 2));
    }
    return value.toFixed(decimal || 2);
}


module.exports = { colorLuminance, statusCheck, getToFix }