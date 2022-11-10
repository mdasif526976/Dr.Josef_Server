const express = require('express');
const app = express();
const port = process.env.Port || 5000;

// middle wire
// app.use(express.json());

app.get('/', (req, res)=>{
     res.send('all is ok')
})

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`)

})