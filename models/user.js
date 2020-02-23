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
	active: {
		type: Boolean,
		default: 0
	},
	google_id: {
		type: String,
		trim: true,
		unique: true
	},
	facebook_id: {
		type: String,
		trim: true,
		unique: true
	}
}, {
	timestamps: true,
	new: true
});


module.exports = mongoose.model(`User`, UserSchema);