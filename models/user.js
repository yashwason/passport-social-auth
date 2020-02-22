const mongoose = require(`mongoose`);

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		require: true
	},
	email: {
		type: String,
		trim: true,
		unique: true,
		required: true
	},
	contact: {
		type: String,
		required: true,
		trim: true
	},
	admin: {
		type: Boolean,
		default: 0
	},
	active: {
		type: Boolean,
		default: 0
	}
}, {
	timestamps: true,
	new: true
});


module.exports = mongoose.model(`User`, UserSchema);