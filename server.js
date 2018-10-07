var express = require('express');
var graphqlHTTP = require('express-graphql');
var schema = require('./schema');
//npm install mongoose
const mongoose = require('mongoose');
var app = express();

//connect to mlab database
//make sure replace my db string & creds with your own
mongoose.connect('mongodb://TestTemp:Rushhour2@ds135592.mlab.com:35592/gql-ninja');
//once opened call back function to show connection
mongoose.connection.once('open', ()=>{
    console.log('connected to database');
});

app.use('/graphql', graphqlHTTP({
    schema,//this defines object and objects type in schema
    //mongo schema is for the data
    graphiql: true,
}));


app.listen(4000, ()=>{
    console.log('Running on localhost:4000/graphql');
});


