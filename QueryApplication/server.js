var express = require('express');//npm install express
var graphqlHTTP = require('express-graphql');//npm install express-graphql
var schema = require('./schema');//imported schema file
var app = express();
app.use('/graphql', graphqlHTTP({
    schema,//created to deal with our entry point and data, middleware
    graphiql: true,//graphiql 
}));
app.listen(3000, ()=>{
    console.log('Running on localhost:3000/graphql');
});


