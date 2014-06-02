var fs = require('fs');

module.exports = {
    vertexShader: fs.readFileSync(__dirname+'/fxaa.vert', 'utf8'),
    fragmentShader: fs.readFileSync(__dirname+'/fxaa.frag', 'utf8'),
};