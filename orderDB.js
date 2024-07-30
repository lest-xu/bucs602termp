const mongoose = require('mongoose');

const credentials = require("./credentials.js");

const dbUrl = 'mongodb+srv://' + credentials.username +
	':' + credentials.password + '@' + credentials.host + '/' + credentials.database;

let connection = null;
let model = null;

let Schema = mongoose.Schema;

let orderSchema = new Schema({
	customerId: Schema.Types.ObjectId,
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    items: [
        {
            id: { type: Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number
        }
    ],
    date: { type: Date, default: Date.now },
    customerInfo: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String
    }
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
























