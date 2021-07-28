

const DATEFORMAT = 'DD/MM/YYYY';
const DATETIMEFORMAT = 'DD/MM/YYYY HH:mm';

const getToFix = (value, decimal) => {
    return value ? value.toFixed(decimal || 2) : 0
}
module.exports = { DATEFORMAT, DATETIMEFORMAT, getToFix }
