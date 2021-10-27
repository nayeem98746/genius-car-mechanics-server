const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId


const app = express();
const port= process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t8ils.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run () {
    try{
        await client.connect()
        const database = client.db('carMechanic')
        const servicesCollection = database.collection('services')

        // GET api
        app.get('/services', async(req, res)=> {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })


        //GET Single Service
        app.get('/services/:id' , async(req, res)=> {
            const id = req.params.id;
            console.log('geting specific service', id)
            const quary = { _id: ObjectId(id)}
            const service = await servicesCollection.findOne(quary)
            res.json(service)
        })

        // POST API
        app.post('/services', async(req, res)=> {
            const service = req.body
            console.log('hit the post api', service)
            // const service ={
            //     "name": "ENGINE DIAGNOSTIC",
            //     "price": "300",
            //     "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
            //     "img": "https://i.ibb.co/dGDkr4v/1.jpg"
            // }

            const result = await servicesCollection.insertOne(service)
            console.log(result)

            res.json(result)

        })
        // DELETE API
        app.delete('/services/:id', async(req, res) => {
            const id = req.params.id
            const quary = {_id:ObjectId(id)};
            const result = await servicesCollection.deleteOne(quary)
            res.json(result)
        })


    }
    finally{
        // await client.close
    }

}

run().catch(console.dir)





app.get('/', (req, res) => {
    res.send('Running Genius Server')
});

app.listen(port, ()=> {
    console.log('Running Genius Server on Port', port)
})