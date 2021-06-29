const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
var dir;
var destination;
async function compressimage(req, res, next) {
    if (req.files) {
        await req.files.map(file => {
            dir = file.destination + '/' + file.filename
            destination = file.destination
        })
    }
    const compress = await imagemin(['./uploaded/Sandwich/itemImage/*.jpg'], {
        destination: './uploaded/Sandwich/',
        plugins: [imageminJpegtran()]
    });
    next()
}

module.exports = compressimage