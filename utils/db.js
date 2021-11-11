// connect to MongoDB with Mongoose@5.12.13
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
mongoose.connect('mongodb://127.0.0.1:27017/wpu', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})




































// menambah data (debug)
// const contact1 = new Contact( {
//     nama: "Dark Avenger",
//     nohp: "08120029901",
//     email: "wrdabagong@gmail.com",
// });

// // add to collection
// contact1.save().then((contact) => {console.log(contact)});



// connect to MongoDB (manual)
// const {MongoClient} = require('mongodb');
// const ObjectID = require('mongodb').ObjectID;

// const uri = 'mongodb://127.0.0.1:27017';
// const dbName = 'wpu';

// const client = new MongoClient(uri, {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// });

// client.connect((error,client) => {

// 	if (error) {
// 		return console.log('Connection Failed');
// 	}
// 		const db = client.db(dbName);
// }); 