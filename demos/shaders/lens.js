var fs = require('fs');
var glslify = require('glslify');
module.exports = glslify({
    inline: true,
    sourceOnly: true,
    vertex: fs.readFileSync(__dirname+'/pass.vert', 'utf8'),
    fragment: fs.readFileSync(__dirname+'/lens.frag', 'utf8'),
});