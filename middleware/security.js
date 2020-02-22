const xss = require(`xss`);

exports.escapeBodyHTML = (req, res, next) => {
    if(req.body && Object.keys(req.body).length){
        for(let key in req.body){
            req.body[key] = xss(req.body[key]);
        }
    }
    next();
};