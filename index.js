const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 5000
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.send('Car Sale Service')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gzjd3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db("careSale");
        const carCollection = database.collection("car");


        // get explore page cars
        app.get('/cars', async (req, res) => {
            const cursor = carCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })
        // get home page products
        app.get('/homeCars', async (req, res) => {
            const cursor = carCollection.find({})
            const result = await cursor.limit(6).toArray()
            res.send(result)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, (req, res) => {
    console.log('server running port', port);
})