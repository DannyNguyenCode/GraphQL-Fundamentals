var graphql = require('graphql');
const _ = require('lodash');//lodash for handling array with the resolve function

//created new objects
var {GraphQLObjectType,//variable from graphql library
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt} = graphql;

//Start of data
var shop = [
//productId and orderId are used to create a one to many relationship
//shop is parent of both product and order
    { name: 'Brink Grocery', id: '1', productId:'1', orderId:'1' },
    { name: 'The Brick', id: '2', productId:'2', orderId:'2' },
    { name: 'Best Buy',  id: '3', productId: '3', orderId:'3' },
];
//itemId is used to create a one to many relationship with LineItems
//product is parent of ItemLists
var product = [
    { name: 'bread', price: 2, id: '1', itemId: '1' },
    { name: 'Sofa', price: 200, id: '2', itemId: '2' },
    { name: 'Graphic Card', price: 300, id: '3', itemId: '3' }
];
//itemId is used to create a one to many relationship with LineItems
//order is parent of ItemLists
var order = [
    { price: 2, id: '1', itemId: '1' },
    { price: 200, id: '2', itemId: '2' },
    { price: 300, id: '3', itemId: '3' }
];
//LineItems
var ItemList = [
    {quantity: 1, price: 2, id: '1'},
    {quantity: 1, price: 200, id: '2'},
    {quantity: 1, price: 300, id: '3'},
];
//END OF DATA

//Start of objects
var ShopType = new GraphQLObjectType({//new object type
name: 'Shop',
fields: ()=>({//for dependencies
    id: {type:GraphQLID},//types obtained from graphql library
    name: {type: GraphQLString},
    productId: {type: GraphQLID},
    orderId:{type: GraphQLID},
    products:{//productObject as a field
        type:ProductType,
        resolve(parent, args){//args will be the id passed
            //find the data from the arrays based on argument passed
            return _.find(product,{id:parent.productId});//npm install lodash
        }
    },
    orders:{//order object as a field
        type:OrderType,
        resolve(parent, args){
            return _.find(product,{id:parent.orderId});
            }
        },
    })
    });

var ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: ()=>({
        id: {type:GraphQLID},
        name: {type: GraphQLString},
        price: {type: GraphQLInt},
        itemLists:{//itemLists object as a field
            type:ItemListType,
            resolve(parent, args){
                return _.find(ItemList,{id:parent.itemId});
            }
        },
    })
    });

var OrderType = new GraphQLObjectType({
    name: 'Order',
    fields: ()=>({
        id: {type:GraphQLID},
        price: {type: GraphQLInt},
        itemLists:{//itemList object as a field
            type:ItemListType,
            resolve(parent, args){
                return _.find(ItemList,{id:parent.itemId});
            }
        },   
    })
    });

var ItemListType = new GraphQLObjectType({
    name: 'ItemList',
    fields: ()=>({
        id: {type:GraphQLID},
        quantity: {type: GraphQLInt},
        price: {type: GraphQLInt},  
    })
    });
//END OF OBJECTS

//Start of RootQuery
var RootQuery = new GraphQLObjectType({//entry to data
    name:'RootQueryType',
    fields:{//each field will be a type of root query
        shops:{//query shop object and its fields
            type: ShopType,
            args:{id:{type: GraphQLID}},//arguments to determine what to query
            resolve(parent, args){
                //code to get data from db/other source            
                return _.find(shop, { id: args.id }); //npm install lodash
            }
        },
        products:{//query product and its fields
            type:ProductType,
            args:{id:{type: GraphQLID}},
            resolve(parent, args){//parent is used for relationships
                return _.find(product,{id: args.id});//tell 
            }
        },
        orders:{
            type:OrderType,
            args:{id:{type: GraphQLID}},
            resolve(parent, args){
                return _.find(order,{id: args.id});
            }
        },
        itemLists:{
            type:ItemListType,
            args:{id:{type: GraphQLID}},
            resolve(parent, args){
                return _.find(ItemList,{id: args.id});
            }
        },
    }
})
//END OF ROOTQUERY
module.exports = new GraphQLSchema({//export to use as property in server.js
    query: RootQuery//control which query frontend users use
});