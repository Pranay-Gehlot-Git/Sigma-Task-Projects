require('dotenv').config();
const express=require('express');
const bodyParser= require ('body-parser');
const mongoose= require('mongoose');

const app=express();
const port=4000;

// connect to MongoDB

app.use('/', express.static("public",{extensions:["html"]}));

mongoose.connect(process.env.DB_URL);


// define data schema

 const dataSchema = new mongoose.Schema({
      srN: { type: String, unique: true},
      name: { type: String},
      number: {type: String, unique: true},
      email: { type: String, unique: true},
      city: { type: String}
});  

// Schema For Activity Log

// const activityLogSchema= new mongoose.Schema({

//       eventType: String,
//       oldData: {
//             type: mongoose.Schema.Types.Mixed,
//             default: null
//       },

//       newData: {
//             type: mongoose.Schema.Types.Mixed,
//             default: null
//       },

//       timestamp:{
//             type: Date,
//             default: Date.now
//       }

// });

// const ActivityLog= mongoose.model('ActivityLog', activityLogSchema);

//create data model
const Data=mongoose.model('Data', dataSchema);

// use body-parser middeleware to parse incoming request bodies
app.use(bodyParser.json());




// app.post('/data/addlog', async (res, req) => {

//       try{
            
//       const newData = req.body;

//       const result = await db.collection('myCollection').insertOne(newData);

//       const activityLog= new ActivityLog({
//             eventType: 'add',
//             newData: newData
//       });

//       await activityLog.save();

//       res.json(result.ops[0]);

//       } catch(err){
//              res.json({error: err});
//       }
// })



// Add Api
app.post('/data', async(req,res)=> {
      const newData = new Data(req.body);
   try {
            await newData.save();
            // await ActivityLog.create({newData: newData, eventType:'User Added'});
            res.status(201).json({success:true,data:newData});
    } catch (err){
         res.json({success:false,error:err});
       }
});

app.get('/data', async (req, res) => {
     try{
         
      const allData= await Data.find();
      res.json(allData);
     }catch (err)
     {
            res.status(500).send(err);
     }
});


app.get('/data/:id', async(req,res)  => {
     try{
        
      const singleData=await Data.findById(req.params.id);
      if(!singleData){
            return res.status(404).send('Data not Found');
      }
      res.send(singleData);
     }catch(err)
     {
      res.status(500).send(err);
     }
});


app.patch('/data/:id', async (req,res) => {

   const allowedUpdates=['srN', 'name', 'number', 'email', 'city'];
   const updates = Object.keys(req.body);
   const isValidupdate= updates.every((update) => allowedUpdates.includes(update));
    
   if(!isValidupdate){
      return res.json({ error: 'Invalid Updates'});

   }
     
   try{
       const dataToUpdate = await Data.findByIdAndUpdate(req.params.id, req.body, { new: true, runValiddators: true});
       if(!dataToUpdate){
            
            return res.status(404).send('Data Not Found');
       }

       res.send(dataToUpdate);
   } catch(err)
   {
      console.log(err);
      res.status(400).send(err);

   }

});


app.delete('/data/:id', async (req,res) => {
      try {
            const dataToDelete= await Data.findByIdAndDelete(req.params.id);
            if(!dataToDelete){
                  return res.status(404).send('Data not Found');
            }

            res.json(dataToDelete);

      } catch (err) {
            res.status(500).send(err);
      }
});


app.listen(port, ()=> {
            console.log("App is running");
    });
