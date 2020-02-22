const { randomBytes } = require("crypto");

exports.generateToken = function(size = Math.floor(Math.random() * 64)) {
	return randomBytes(size).toString("hex");
};