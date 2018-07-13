/**
 * Created by Admin on 2017/8/24.
 */
module.exports = function (req, res, next) {
    req.method = "GET";
    next();
}