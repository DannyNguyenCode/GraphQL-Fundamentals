var graphql = require('graphql');
const _ = require('lodash');
//module book.js
const Book = require('./book');
//module author.js
const Author = require('./author');

var {GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull} = graphql;
//removing dummy data for database
//using mlab/MongoDB
// dummy data
// var books = [
//     { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId:'1' },
//     { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId:'2' },
//     { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
//     { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
//     { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
//     { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' },
// ];
// var authors = [
//     { name: 'Patrick Rothfuss', age: 44, id: '1' },
//     { name: 'Brandon Sanderson', age: 42, id: '2' },
//     { name: 'Terry Pratchett', age: 66, id: '3' }
// ];



  //update to interact with database from MongoDB
var BookType = new GraphQLObjectType({
name: 'Book',
fields: ()=>({
    id: {type:GraphQLID},
    name: {type: GraphQLString},
    genre: {type: GraphQLString},
    author:{
        type:AuthorType,
        resolve(parent, args){
           // return _.find(authors,{id:parent.authorId});
           //interacting with the author collection
           //passed for authorId parent
           return Author.findById(parent.authorId);
        }
    }
})
});

var AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: ()=>({//wrap in a function
        //if not wrapped in function
        //BookType not defined error
        //because we wrapped it in a function, the code does not execute until all
        //the file has been ran
        id: {type:GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: GraphQLList(BookType),
            resolve(parent, args){
                //removed to prepare for extracting data from MongoDB
               // return _.filter(books, {authorId: parent.id});//tier list from GraphQLList object

               return Book.find({//find all book records based on criteria
                    authorId: parent.id
               });
            }
        }
    })
    });

var RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        book:{
            type: BookType,
            args:{id:{type: GraphQLID}},
            resolve(parent, args){
                //code to get data from db/other source
                //npm install lodash
               // return _.find(books, { id: args.id });
               return Book.findById(args.id);
            }
        },
     author:{
        type:AuthorType,
        args:{id:{type: GraphQLID}},
        resolve(parent, args){
           // return _.find(authors,{id: args.id});
           return Author.findById(args.id);
        }
     },
     //set up a root query to display all books
     //used to get a list of books without arguments passed
     //will also show authors
     books:{
        type: new GraphQLList(BookType),
        resolve(parent, args){
          //  return books
          //reutrn all material if we pass empty object
          return Book.find({});
        }
     },
     authors:{
         type: new GraphQLList(AuthorType),
         resolve(parent, args){
           //  return authors
           return Author.find({});
         }
     },
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addAuthor:{
            type: AuthorType,
            //user uses mutation query, expect to send data
            args: {
                //validating input by enforcing a non null by using new GraphQLNonNull
                name: {type:new GraphQLNonNull(GraphQLString)},
                age:{type: new GraphQLNonNull (GraphQLInt)},
            },
          
            resolve(parent, args){
                //create data type locally called author
                let author = new Author({
                    //setting properties
                    name: args.name,
                    age: args.age,
                });
                //MongoDB has a save method
                //returns object back
                return author.save();
            }
        },
        addBook:{
            type: BookType,
            args:{
                name:{type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId:{type: new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId,
                });
                return book.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    //allows for query mutation
    mutation: Mutation,
});


//Mutate or change our data, delete, update, added