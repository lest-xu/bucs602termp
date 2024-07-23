const mongoose = require('mongoose');

const credentials = require("./credentials.js");

const dbUrl = 'mongodb+srv://' + credentials.username +
	':' + credentials.password + '@' + credentials.host + '/' + credentials.database;

let connection = null;
let model = null;

let Schema = mongoose.Schema;

let orderSchema = new Schema({
	customerId: String,
	totalPrice: Number,
	totalItems: Number,
	createdOn: { type: Date, default: Date.now },
	modifiedOn: { type: Date, default: Date.now },
	products: [
		{productId: String, orderedTotal: Number}
	]
}, {
	collection: 'orders'
});

module.exports = {
	getModel: () => {
		if (connection == null) {
			console.log("Creating connection and model...");
			connection = mongoose.createConnection(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
			model = connection.model("OrderModel",
				orderSchema);
		};
		return model;
	}
};
























