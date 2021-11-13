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
        const orderCollection = database.collection("orders");
        const usersCollection = database.collection("users");
        const reviewCollection = database.collection("review");


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

        // find single product
        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await carCollection.findOne(query)
            res.send(result)
        })
        // order place
        app.post('/order', async (req, res) => {
            const order = req.body
            const result = await orderCollection.insertOne(order)
            res.json(result)
        })

        // get orders
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({})
            const order = await cursor.toArray()
            res.send(order)
        })

        // post registration info
        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user)
            console.log(result)
            res.json(result)
        })

        // post review
        app.post('/review', async (req, res) => {
            const user = req.body
            const result = await reviewCollection.insertOne(user)
            res.json(result)
        })

        // add product
        app.post('/product', async (req, res) => {
            const product = req.body
            const result = await carCollection.insertOne(product)
            res.json(result)
        })

        // make admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body
            const filter = { email: user.email }
            const updateDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.json(result)
        })


        // get admin
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const user = await usersCollection.findOne(query)
            let isAdmin = false
            if (user?.role === 'admin') {
                isAdmin = true
            }
            res.json({ admin: isAdmin })
        })

        // delete order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.json(result)
        })
        // manageOrders
        app.delete('/cars/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await carCollection.deleteOne(query)
            res.json(result)
        })



    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, (req, res) => {
    console.log('server running port', port);
})