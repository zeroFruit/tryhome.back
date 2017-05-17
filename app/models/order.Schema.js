import { mongoose } from '../config/mongodb';

const OrderSchema = new mongoose.Schema({
  siteIndex:  { type: Number, required: true },
  label:      { type: String, required: true},
  color:      { type: String },
  size:       { type: String },
  price:      { type: Number },
  category:   { type: String },
  count:      { type: Number }
})

module.exports = OrderSchema;
