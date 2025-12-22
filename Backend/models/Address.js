const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    ward: { type: String, required: true },           
    street: { type: String, required: true },         
    municipality: { type: String, required: true },   
    district: { type: String, required: true },       
    province: { type: String, required: true },
    country: { type: String, required: true }
}, { _id: false });

module.exports = addressSchema;
