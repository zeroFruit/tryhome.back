import './env/env';
import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = { mongoose };
