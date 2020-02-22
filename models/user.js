const mongoose = require(`mongoose`),
	bcrypt = require(`bcrypt`);

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
	password: {
		type: String,
		require: true
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
	token: String,
	tokenExpiration: Date,
	active: {
		type: Boolean,
		default: 0
	},
	orders_placed: {
		type: Number,
		required: true,
		default: 0
	},
	pieces_bought: {
		type: Number,
		required: true,
		default: 0
	},
	wishlist: [{
		type:mongoose.Schema.Types.ObjectId,
		ref: 'Product'
	}]
}, {
	timestamps: true
}
);

UserSchema.methods.hashPassword = function(password){
    return bcrypt.hashSync(password, 10);
}

UserSchema.methods.verifyPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model(`User`, UserSchema);