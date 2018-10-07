const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const authorSchema = new Schema({
    //describe different data types on books
    name: String,
    age: Number,
    //mongo will autotmatically create id for database
});
//model is a collection in database which is Book
//collection is going to have the authorSchema structure
module.exports = mongoose.model('Author', authorSchema);