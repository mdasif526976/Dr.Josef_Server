const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.Port || 5000;

// middle wire
app.use(cors());
app.use(express.json());

// jet middlewire
function VerifyJwt(req,res,next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        res.send({message:'UnAuthorized access Denied'})
    }
    const token = authHeader.split(' ')[1];
     jwt.verify(token,process.env.ACCESS_TOKEN,function(err,decoded){
      if (err) {
        return res.status(403).send({message:'forbidden access Denied'})
      }
      req.decoded = decoded;
      next();
     })
}


// start crud oparation


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@atlascluster.ul3fosw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run=async()=>{
 try{

 const servicesCollection = client.db('dr-Josef-project').collection('services');
 const reviewCollection = client.db('dr-Josef-project').collection('review');
 const userCollection = client.db('dr-Josef-project').collection('users');
 
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

// save user
app.post('/user',(req,res)=>{
    const user = req.body;
    const result = userCollection.insertOne(user)
    res.send(result)

})

// app.get('/',VerifyJwt,(req,res)=>{
//     res.send('ok')
// })

// jwt sign 
app.get('/jwt',async(req,res)=>{
    const email = req.query.email;
    console.log(email)
    const query = {email:email};
    const user = await userCollection.findOne(query);
    if(user){
        const token= jwt.sign({email},process.env.ACCESS_TOKEN,{expiresIn:'12h'})
        return res.send({accessToken:token})
    }
    res.status(403).send({accessToken:''})
})

// not recomend
// app.get('/addPrice',async(req,res)=>{
//    const filter ={};
//    const options = {upsert:true};
//    const updeteDoc ={$set:{
//     price:99
//    }}
//    const result  = await servicesCollection.updateMany(filter,updeteDoc,options);
//    res.send(result);
// })
// for review user
app.get('/review',VerifyJwt,async(req,res)=>{
    const email = req.query.email;
    const query = {email:email};
    const reviews = await reviewCollection.find(query).toArray();
    res.send(reviews)
})

// get all review
app.get('/reviews',async(req,res)=>{
    const query = {};
    const cursor = reviewCollection.find(query);
    const reviews = await cursor.toArray();
    res.send(reviews);
})


// find single servie review
app.get('/review/:id',async(req,res)=>{
    const service = req.params.id;
    const query = {service:service};
    const result = await reviewCollection.find(query).toArray();
    res.send(result);
})

// for input a review
app.post('/reviews',async(req,res)=>{
    const review = req.body;
    console.log(review)
     const result = await reviewCollection.insertOne(review)

     res.send(result);
})

//update user review
app.put('/update/:id',async(req,res)=>{
    const details = req.body.details;
    const id = req.params.id;
    const filter = {_id: ObjectId(id)};
     const options = {upsert:true};
    const updateDoc= {
      $set:{
        details:details
      }
     
    }
    const result = await reviewCollection.updateOne(filter,updateDoc,options);
    res.send(result)
})

// delete a user review
app.delete('/delete/:id',async(req,res)=>{
   const id = req.params.id;
   const query = {_id:ObjectId(id)};
   const result = await reviewCollection.deleteOne(query);
   res.send(result)
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