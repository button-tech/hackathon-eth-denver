const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Order = new Schema({
    _id: { 
        type: Schema.ObjectId,
        auto: true 
    },
    orders: {
        type: Object,
    },
}, {
    versionKey: false
});

module.exports = mongoose.model('Order', Order);