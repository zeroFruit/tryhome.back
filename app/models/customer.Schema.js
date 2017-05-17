import { mongoose } from '../config/mongodb';

const CustomerSchema = new mongoose.Schema({
  name:         { type: String },
  address:      { type: String },
  phonenumber:  { type: String },
  email: { type: String }
})

module.exports = CustomerSchema;
