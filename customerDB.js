const mongoose = require('mongoose');

const credentials = require("./credentials.js");

const dbUrl = 'mongodb+srv://' + credentials.username +
	':' + credentials.password + '@' + credentials.host + '/' + credentials.database;

let connection = null;
let model = null;

let Schema = mongoose.Schema;

let customerSchema = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	phone: String,
    email: { type: String, required: true, unique: true }
}, {
	collection: 'customers'
});

module.exports = {
	getModel: () => {
		if (connection == null) {
			console.log("Creating connection and model...");
			connection = mongoose.createConnection(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
			model = connection.model("CustomerModel",
				customerSchema);
		};
		return model;
	}
};
























