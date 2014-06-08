var fs = require('fs');

module.exports = {
    vertex: fs.readFileSync(__dirname+'/pass.vert', 'utf8'),
    fragment: fs.readFileSync(__dirname+'/grain.frag', 'utf8'),
};