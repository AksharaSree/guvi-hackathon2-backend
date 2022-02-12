var express = require('express');
var router = express.Router();

const {dbUrl,mongodb,MongoClient,dbName} = require('../dbConfig');

router.get('/', async(req, res)=> {
 // const client = await MongoClient.connect(dbUrl);
  try {

    MongoClient.connect(dbUrl,  async(err, db) => {
      if (err) throw err;
      var dbo = await db.db(dbName);
      await dbo.collection('bookingDetail').find()
     
      .toArray(function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.json({
          statusCode:200,
          message:"Booked Shows fetched Successfully",
          data:result
        })

        db.close();
      });
    });


    // const db = await client.db(dbName)
    // let bookedShows = await db.collection('bookingDetail').aggregate([
    //   { $lookup:
    //     {
    //       from: 'shows',
    //       localField: 'showDetailID',
    //       foreignField: '_id',
    //       as: 'showDetail'
    //     }
    //   }
    // ]).find({email:req.body.email }).toArray();
    
    // res.json({
    //   statusCode:200,
    //   message:"Booked Shows fetched Successfully",
    //   data:bookedShows
    // })
  } catch (error) {
    console.log(error)
    res.json({
      statusCode:500,
      message:"Internal Server Error!"
    })
  }
  finally{
  //  client.close()
  }
});




router.route("/").post(async(req,res)=>{

    const client = await MongoClient.connect(dbUrl);
    try {
      const db = await client.db(dbName)
      let shows = await db.collection('bookingDetail').findOne({email:req.body.email ,  showDetailID:req.body.showDetailID, seatsBooked: req.body.seatCount})
      if(shows)
      {
        res.json({
          statusCode:400,
          message: "Shows Already Available",
          data:shows
        })
      }
      else{
        await db.collection('bookingDetail').insertOne(req.body)
        res.json({
          statusCode:200,
          message: "Show booked Successfully"
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



  router.put('/cancel:id',async(req,res)=>{
    const client = await MongoClient.connect(dbUrl);
    try {
      const db = await client.db(dbName)
      await db.collection('bookingDetail').findOneAndReplace({_id:mongodb.ObjectId(req.params.id)},req.body)
      
      res.json({
        statusCode:200,
        message:"Booking cancelled Successfully"
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
  
  module.exports = router;