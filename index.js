const express = require('express');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.Port || 5000;

// middle wire
app.use(cors());
app.use(express.json());

// start crud oparation


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@atlascluster.ul3fosw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run=async()=>{
 try{

 const servicesCollection = client.db('dr-Josef-project').collection('services');
 const reviewCollection = client.db('dr-Josef-project').collection('review');
 
app.get('/home',async(req,res)=>{
    const query = {};
    const cursor = servicesCollection.find(query)
    const services = await cursor.limit(3).toArray();
    res.send(services);
})

app.get('/services',async(req,res)=>{
    const query = {};
    const cursor = servicesCollection.find(query) 
    const services = await cursor.toArray(); 
    res.send(services);
})

app.get('/services/:id',async(req,res)=>{
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const service = await servicesCollection.findOne(query);
    res.send(service);

})

app.post('/addService',async(req,res)=>{
  const service = req.body;
  const result = await servicesCollection.insertOne(service) 
  console.log(service)
  res.send(result);
})


app.get('/reviews',async(req,res)=>{
    const query = {};
    const cursor = reviewCollection.find(query);
    const reviews = await cursor.toArray();
    res.send(reviews);
})

app.post('/reviews',async(req,res)=>{
 
    const review = req.body;
    console.log(review)
     const result = await reviewCollection.insertOne(review)

     res.send(result);
})



 }
 finally{

 }
}
run().catch(err => console.error(err))



app.get('/', (req, res)=>{
     res.send('all is ok')
})

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`)

})