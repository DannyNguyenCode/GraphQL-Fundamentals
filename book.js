const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const bookSchema = new Schema({
    //describe different data types on books
    name: String,
    genre: String,
    authorId: String,
    //mongo will autotmatically create id for database
});
//model is a collection in database which is Book
//collection is going to have the bookSchema structure
module.exports = mongoose.model('Book', bookSchema);