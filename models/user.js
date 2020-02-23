const mongoose = require(`mongoose`);

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true
	},
	email: {
		type: String,
		trim: true,
		unique: true
	},
	active: {
		type: Boolean,
		default: false
	},
	googleid: {
		type: String,
		trim: true,
	},
	facebookid: {
		type: String,
		trim: true
	}
}, {
	timestamps: true,
	strict: false
});


UserSchema.pre(`save`, function(next){
	console.log(this);
    if(this.email || this.googleid || this.facebookid){
		console.log(`email or googleid or facebookid is present!`);
		next();
	}
	else{
		next(new Error(`Invalid credentials! Provide email or login via. social media`));
	}
});


module.exports = mongoose.model(`User`, UserSchema);