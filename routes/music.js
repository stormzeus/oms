//Music APi for the Project

var express = require('express');
var router=express.Router();

var monk  =require('monk');

var db=monk('localhost:27017/oms');
var collection=db.get('songs');

//  api/music
router.get('/',function(req,res){
    collection.find({},function(err, music){
        if(err) throw err;
        res.json(music);
    });

});

//api/music/id

router.get('/:id',function(req,res){
    collection.findOne({ _id : req.params.id },function(err,music){
        if(err) throw err;
        res.json(music);
    });

});



//insert a new video

router.post('/',function(req,res){
    collection.insert({
        title: req.body.title,
        genre: req.body.genre,
        description: req.body.desc
    },function(err,music){
        if(err) throw err;
        //if insert is successful, return the new video
        res.json(music);
    });

});



//update an existing video
// use a put request not get or post

router.put('/:id',function(req,res){
    collection.update({ _id: req.params.id},
    {   $set:{
        title: req.body.title,
        genre: req.body.genre,
        description: req.body.desc
    }},
    function(err,music){
        if(err) throw err;
        //if update is successful, return the new video
        res.json(music);
    });

});


//delete video
router.delete('/:id',function(req,res){
    collection.remove({ _id : req.params.id },function(err,music){
        if(err) throw err;
        res.json(music);
    });

});









module.exports=router;







