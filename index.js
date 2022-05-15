const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5xamg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     console.log('Warehouse Management db connected');
//     // perform actions on the collection object
//     client.close();
// });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db("fusionWarehouse").collection("Products");
        const clientProductCollection = client.db("fusionWarehouse").collection("Client Products");

        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })
        // Client Products
        app.get('/clientproducts/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            // const query = {};
            const cursor = clientProductCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })
        // Delete api
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })

        // Post Api
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })

        //Client Post Api
        app.post('/clientproducts', async (req, res) => {
            const newProduct = req.body;
            const result = await clientProductCollection.insertOne(newProduct);
            res.send(result);
        })

        // Client Delete api
        app.delete('/clientproducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await clientProductCollection.deleteOne(query);
            res.send(result);
        })


        // Put api
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const update = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: update.decreaseQuantity

                }
            };
            const result = await productCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        })
    }

    finally {

    }
}


run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running Warehouse Management Server')
})

app.listen(port, () => {
    console.log('Listening to port', port);
})