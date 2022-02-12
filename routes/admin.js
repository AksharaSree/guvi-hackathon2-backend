var express = require('express');
var router = express.Router();

const {dbUrl,mongodb,MongoClient,dbName} = require('../dbConfig');

router.get('/showlist', async(req, res)=> {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db(dbName)
    let showList = await db.collection('shows').find().toArray()
    res.json({
      statusCode:200,
      message:"Shows Fetched Successfully",
      data:showList
    })
  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal Server Error!"
    })
  }
  finally{
    client.close()
  }
});



router.get('/showDetail/:id', async(req, res)=> {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db(dbName)
    let showDetail= await db.collection('shows').findOne({_id: mongodb.ObjectId(req.params.id)})
    res.json({
      statusCode:200,
      message:"Show Fetched Successfully",
      data:showDetail
    })
  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal Server Error!"
    })
  }
  finally{
    client.close()
  }
});

router.route("/createshow").post(async(req,res)=>{

  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db(dbName)
    let shows = await db.collection('shows').findOne({movie:req.body.movie, theatre:req.body.theatre,  screenName:req.body.screenName, showtime: req.body.showtime, date: req.body.date })
    if(shows)
    {
      res.json({
        statusCode:400,
        message: "Shows Already Available",
        data:shows
      })
    }
    else{
      await db.collection('shows').insertOne(req.body)
      res.json({
        statusCode:200,
        message: "Show added Successfully"
      })
    }
  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal Server Error!"
    })
  }
  finally{
    client.close();
  }
})

router.put('/updateshow/:id',async(req,res)=>{
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db(dbName)
    await db.collection('shows').findOneAndReplace({_id:mongodb.ObjectId(req.params.id)},req.body)
    res.json({
      statusCode:200,
      message:"Show updated Successfully"
    })
    
  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal Server Error!"
    })
  }
  finally{
    client.close();
  }
})


router.delete('/deleteshow:id', async(req, res)=> {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = await client.db(dbName)
    await db.collection('shows').deleteOne({_id: mongodb.ObjectId(req.params.id)})
    res.json({
      statusCode:200,
      message:"Show Deleted Successfully"
    })
  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal Server Error!"
    })
  }
  finally{
    client.close()
  }
});



module.exports = router;
