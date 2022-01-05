//Template and Initial Routing, Redundant once all the other routes are made. Kept for referencing.

var express = require('express');
var router = express.Router();

var monk  =require('monk');

var db=monk('localhost:27017/oms');
var collection=db.get('songs');







/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.redirect('/music')
// });
router.get('/',function(req,res){
    res.render('landing')
})
router.get('/about',function(req,res){
    res.render('about')
})

router.get('/contact',function(req,res){
    res.render('contact')
})





//update the about page
router.get('/music/about',function(req,res){
    res.send('page about the music system')
})



router.get('/music',function(req,res){

    collection.find({},function(err, music){
        if(err) throw err;
        res.render('index',{results:music});
    });

});



//search and filter
router.get('/music/search',function(req,res){
    const search=req.query.search;
    const type = req.query.category;
    if(search=="" && type=="All"){
        res.redirect('/music')
    }
    else if(search=="" && type!="All"){
        collection.find({genre:{$regex:type,$options:'$i'}},function(err,music){
        if(err) throw err;
        // res.send(music);
        res.render('index',{results:music})
        });
    }
    else if(search!="" && type!="All"){
        collection.find({title:{$regex:search,$options:'$i'},genre:{$regex:type,$options:'$i'}},function(err,music){
        if(err) throw err;
        // res.send(music);
        res.render('index',{results:music})
    });
    }
    else{
        collection.find({title:{$regex:search,$options:'$i'}},function(err,music){
        if(err) throw err;
        // res.send(music);
        res.render('index',{results:music})
    });

    }
});


//goto new video page
router.get('/music/new',function(req,res,next){
  res.render('new')
});


//show a video
router.get('/music/:id',function(req,res){
    collection.findOne({ _id : req.params.id },function(err,music){
        if(err) throw err;
        res.render('show',{music:music});
    });

});



//add video
router.post('/music/new',function(req,res){
    collection.insert({
        title: req.body.title,
        genre: req.body.genre,
        description: req.body.desc,
        image:req.body.image
    },function(err,music){
        if(err) throw err;
    });
    res.redirect('/music')
});

//delete video
router.post('/music/:id',function(req,res){
    collection.remove({ _id : req.params.id },function(err,music){
        if(err) throw err;
        // res.json(music);
    });
    res.redirect('/music')
});



//goto edit video page
router.get('/music/:id/edit',function(req,res){
    collection.findOne({ _id : req.params.id },function(err,music){
        if(err) throw err;
        res.render('edit',{music:music});
    });

});

//edit video
router.post('/music/:id/edit',function(req,res){
    collection.update({ _id: req.params.id},
    {   $set:{
        title: req.body.title,
        genre: req.body.genre,
        image:req.body.image,
        description: req.body.desc
    }},
    function(err,music){
        if(err) throw err;
        //if update is successful, return the new video
        // res.json(music)
        res.redirect('/music');
    });


});















module.exports = router;





// <% resul.forEach(function(x){ %>
//     <a class="dropdown-item" href="#">x</a>
//   <% }); %>


// <div class="dropdown">
//   <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//     Choose Genre !
//   </button>
//   <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
//   <% resul.forEach(function(x){ %>
//     <a class="dropdown-item" href="#">x</a>
//   <% }); %>
//   </div>
// </div>


// <a href="/current/<%= id %>/anything"></a>
