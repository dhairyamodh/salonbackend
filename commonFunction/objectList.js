const statusCheck = (status) => {
    return status ? { status: true } : {}
}

const getToFix = (value, decimal) => {
    return value ? value.toFixed(decimal || 2) : 0
}

const DATEFORMAT = 'DD/MM/YYYY';
const DATETIMEFORMAT = 'DD/MM/YYYY HH:mm';

module.exports = { statusCheck, DATEFORMAT, DATETIMEFORMAT, getToFix }