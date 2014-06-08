var fs = require('fs');

module.exports = {
    vertex: fs.readFileSync(__dirname+'/fxaa.vert', 'utf8'),
    fragment: fs.readFileSync(__dirname+'/fxaa.frag', 'utf8'),
};