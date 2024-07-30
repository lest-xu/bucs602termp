const mongoose = require('mongoose');

const credentials = require("./credentials.js");

const dbUrl = 'mongodb+srv://' + credentials.username +
	':' + credentials.password + '@' + credentials.host + '/' + credentials.database;

let connection = null;
let model = null;

let Schema = mongoose.Schema;

let orderSchema = new Schema({
    customerId: String,
    products: [
        {
            id: String,
            quantity: Number
        }
    ],
    date: { type: Date, default: Date.now }
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
























