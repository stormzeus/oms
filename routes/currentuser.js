// This file handles all the routes after the user had logged in

var express = require('express');
var multer = require('multer');
var router = express.Router();

var monk  =require('monk');

var db=monk('localhost:27017/oms');
var users_collection=db.get('users');
var music_collection = db.get('songs');
var admin_collection = db.get('admin');
var music_library = db.get('music_library')


router.get('/',function(req,res){
    res.send("page of current user")

})



async function get_user_name(id){
    const user=await users_collection.findOne({_id:id},function(err,user){
    })
    const name=user['username']
    return name
}

async function get_user_type(id){
    const user=await users_collection.findOne({_id:id},function(err,user){
    })
    const type=user['type']
    return type
}

async function get_playlists(id){
    const name = await get_user_name(id);

    const liked_songs = await music_library.findOne({'user':id}, function(err,song){

        // return song;
    })

     let plays = [];
       await music_library.findOne({'user':id}, function(err, play){

    for (var i in play['playlists']){
        var x = Object.keys(play['playlists'][i]);
        // console.log(x[0])
        plays.push(x[0])
    }
    console.log(plays)
    console.log(typeof(plays))
    return plays
    // console.log(plays)

});

}//end function






router.get('/:id',async function(req,res){
    const id=req.params.id;
    const name=await get_user_name(id);
    const type = await get_user_type(id);


    const liked_songs = await music_library.findOne({'user':id}, function(err,song){

        // return song;
    })


    var songlist = await music_collection.find({}, function(err,s){


    })
 let plays = [];

   await music_library.findOne({'user':id}, function(err, play){

for (var i in play['playlists']){
    var x = Object.keys(play['playlists'][i]);
    // console.log(x[0])
    plays.push(x[0])
}
 res.render('userpage',{name,id,playlist_names:plays, type, resul:songlist})
});




});


async function get_selectors(){
    const admin=await admin_collection.find({});
    return admin

}







router.get('/:id/show_genre',async function(req,res){
    const id=req.params.id;
    const genre=req.query.genre;
    // console.log(genre)
    const name = await get_user_name(id);
    const admin=await get_selectors();
    const type = await get_user_type(id);



    const liked_songs = await music_library.findOne({'user':id}, function(err,song){

        // return song;
    })
    let plays = [];
    await music_library.findOne({'user':id}, function(err, play){
    for (var i in play['playlists']){
        var x = Object.keys(play['playlists'][i]);
        plays.push(x[0])
    }
    });
    if(genre=="select" ||genre==null){
         music_collection.find({},function(err, music){
            if(err) throw err;
            res.render('show_genre',{resul:admin[0]['genre'],name,results:music,id,playlist_names:plays,type})
        });

    }//no search condition
    else{
        music_collection.find({genre:{$regex:genre,$options:'$i'}},function(err, music){
            if(err) throw err;
            res.render('show_genre',{resul:admin[0]['genre'],name,results:music,id,playlist_names:plays,type})
        });

    }

});



router.get('/:id/anything',async function(req,res){
    const id=req.params.id;
    const genre=req.query.genre;
    console.log(genre)
    const name = await get_user_name(id);
    const admin=await get_selectors();
    const type = await get_user_type(id);

    const liked_songs = await music_library.findOne({'user':id}, function(err,song){


    })
    let plays = [];
    await music_library.findOne({'user':id}, function(err, play){
    for (var i in play['playlists']){
        var x = Object.keys(play['playlists'][i]);

        plays.push(x[0])
    }
    });
    if(genre=="select" ||genre==null){
         music_collection.find({},function(err, music){
            if(err) throw err;
            res.render('anything',{resul:admin[0]['genre'],name,results:music,id,playlist_names:plays,type})
        });

    }//no search condition
    else{
        music_collection.find({genre:{$regex:genre,$options:'$i'}},function(err, music){
            if(err) throw err;
            res.render('anything',{resul:admin[0]['genre'],name,results:music,id,playlist_names:plays,type})
        });

    }

})


router.get('/:id/show_artists',async function(req,res){
    const id=req.params.id;
    const artist=req.query.artist;
    const name = await get_user_name(id);
    const admin=await get_selectors();
    const type = await get_user_type(id);
    const liked_songs = await music_library.findOne({'user':id}, function(err,song){

        // return song;
    })
    let plays = [];
    await music_library.findOne({'user':id}, function(err, play){
    for (var i in play['playlists']){
        var x = Object.keys(play['playlists'][i]);
        plays.push(x[0])
    }
    });

    if(artist=="select" ||artist==null){
         music_collection.find({},function(err, music){
            if(err) throw err;
            res.render('show_artists',{result:admin[0]['artists'],name,results:music,id,playlist_names:plays,type})
        });

    }//no search condition
    else{
        music_collection.find({artist:{$regex:artist,$options:'$i'}},function(err, music){
            if(err) throw err;
            res.render('show_artists',{result:admin[0]['artists'],name,results:music,id,playlist_names:plays,type})
        });

    }

});


router.post("/:id/:title",function(req,res){


var id = req.params.id;
var song_name = req.body.title.trim();

console.log("The value getting pushed into the array is "+ song_name +"and the user id is "+ id);

music_library.findOne({'user':id},function(err,library){
    const present=library['liked_songs'].includes(song_name);
    if(!present){
        console.log("adding the song")
        music_library.update({user:id},
 {$push: { liked_songs : song_name} });
    }
    else{
        console.log("already present")
    }
})






});














router.get('/:id/playlists/:val', async function(req,res){


console.log("you have found the right playlist : ",req.params.val)
const id = req.params.id;
const playlist_name = req.params.val;
const name = await get_user_name(id);
const type = await get_user_type(id);
 let plays = [];


 await music_library.findOne({'user':id}, async function(err, play){
       var playlists = play['playlists'];



       for (var i in playlists){
            var x = Object.keys(playlists[i]);
            if(x[0]==playlist_name){

                break;
            }

        }


        for (var j in play['playlists']){
    var y = Object.keys(play['playlists'][j]);
    plays.push(y[0])
}


        console.log(" the playlist songs is : " ,playlists[i][x[0]])

        var songs = playlists[i][x[0]];

        console.log(songs,name,id,plays,type)

        res.render('playlist_songs',{songs,name,id, playlist_names: plays,type,playlist_name})









       });



});



router.get('/:id/liked_songs_page',async function(req,res){
     const id=req.params.id;
    const name = await get_user_name(id);
    const type = await get_user_type(id);

    const liked_songs = await music_library.findOne({'user':id}, function(err,song){


    })
 let plays = [];
   await music_library.findOne({'user':id}, function(err, play){

for (var i in play['playlists']){
    var x = Object.keys(play['playlists'][i]);

    plays.push(x[0])
}


console.log(plays)
res.render('liked_songs_page',{songs : liked_songs['liked_songs'],name,id, playlist_names: plays,type})




});


});




router.post("/:id/liked_songs_page/dislike",async function(req,res){
    console.log("reached the right delete route");
    let id = req.body.userid;
    music_library.update({user:req.body.userid},
 {$pull: { liked_songs : req.body.song}});

    const liked_songs = await music_library.findOne({'user':req.body.userid}, function(err,song){
        // return song;
    })
    const name = await get_user_name(req.body.userid);



   res.send("./")




});





router.post("/:id/playlists/playlist_songs/remove",async function(req,res){

  const id = req.params.id;
  const name_of_playlist = req.body.playlistName;
  const name_of_song = req.body.songname;

    console.log("reached the place you need to remove the song from the playlist");

    await music_library.findOne({'user':id}, async function(err, play){
       var playlists = play['playlists'];


       for (var i in playlists){
            var x = Object.keys(playlists[i]);
            if(x[0]==name_of_playlist){

             var index = playlists[i][x[0]].indexOf(name_of_song);
    while (index > -1) {
        playlists[i][x[0]].splice(index, 1);
        index = playlists[i][x[0]].indexOf(name_of_song);
    }

            }

        }//end of for loop

 music_library.findOneAndUpdate({user:id},{$set:{playlists:playlists}}).then((updatedDoc)=>{})






       });






     res.send("./")
})









router.post("/:id/liked_songs_page/playlist",async function(req,res){
    console.log("reached the right route for adding to playlist");
    let id = req.body.id;
    let play= req.body.playlist;
    console.log('playlist name is',play)
    const pnames=[]
      await music_library.findOne({'user':id},function(err,plays){


        for(var i in plays['playlists']){

            const pname=Object.keys(plays['playlists'][i])[0]


            pnames.push(pname)


        }


        console.log(pnames)
        var present=pnames.includes(play)

        if(!present){
            var $push_query = {}
        $push_query[play]= [];
        music_library.update({user:id},
     {$push: {playlists : $push_query}});

        const liked_songs =  music_library.findOne({'user':req.body.id}, function(err,song){
            // return song;
        })
       res.send("./")

        }
        else{
            console.log("playlist exists")
            res.send("./")
        }

    })

});


router.post("/:id/liked_songs_page/addtoplaylist",async function(req,res){
    console.log("reached the right route for adding a particular song to a playlist");
       let id = req.body.id;
       let plays= req.body.playlist;
       let song = req.body.songname;
       var t;
       await music_library.findOne({'user':id}, async function(err, play){
       var playlists = play['playlists'];


       for (var i in playlists){
            var x = Object.keys(playlists[i]);
            if(x[0]==plays){
                console.log("to inert into playlist",x[0])

                const present = playlists[i][x[0]].includes(song)


                if(!present){
                     playlists[i][x[0]].push(song)

                }
                else{
                    console.log("song already present")
                }

            }

        }//end of for loop

 music_library.findOneAndUpdate({user:id},{$set:{playlists:playlists}}).then((updatedDoc)=>{})

       }); //end of update main function


       res.send("./")
});//end of route





router.get('/:id/admin_functions',async function(req,res){

    const id=req.params.id;
    const genre=req.query.genre;
    console.log(genre)
    const name = await get_user_name(id);
    const admin=await get_selectors();
    const type = await get_user_type(id);

    const liked_songs = await music_library.findOne({'user':id}, function(err,song){

        // return song;
    })
    let plays = [];
    await music_library.findOne({'user':id}, function(err, play){
    for (var i in play['playlists']){
        var x = Object.keys(play['playlists'][i]);

        plays.push(x[0])
    }
    });
    if(genre=="select" ||genre==null){
         music_collection.find({},function(err, music){
            if(err) throw err;

            res.render('admin_functions',{resul:admin[0]['genre'],name,results:music,id,playlist_names:plays,type})
        });

    }//no search condition
    else{
        music_collection.find({genre:{$regex:genre,$options:'$i'}},function(err, music){
            if(err) throw err;

            res.render('admin_functions',{genre:admin[0]['genre'],artists:admin[0]['artists'],name,results:music,id,playlist_names:plays,type})
        });

    }

})





router.post('/:id', async function(req,res){



var stitle = req.body.name_of_song;
var sgenre = req.body.genre_of_song;
var syear = req.body.year;
var sartist = req.body.artist;
var sfile = req.body.file;

if(stitle==null){

    var song_to_delete=req.body.chosen_song;

    await music_collection.remove({_id:song_to_delete},function(err,del){
        if(err) throw err;
        res.redirect('/current/'+req.params.id)

    })


}
else{



    await music_collection.insert({
    title : stitle,
    genre : sgenre,
    image : sfile,
    year : syear,
    artist : sartist,
    link : "link for song, tbd"

},function(err,song){
    if(err) throw error;

    console.log("you have insterted song successfuly")
    res.redirect('/current/'+req.params.id)
});

}




});






router.post('/:id/edit/title',async function(req,res){

    var chosen_song=req.body.edit_song;
    var stitle = req.body.name_of_song;
    var sgenre = req.body.genre_of_song;
    var syear = req.body.year;
    var sartist = req.body.artist;
    var sfile = req.body.file;


    await music_collection.update({_id:chosen_song},
        {   $set:{
        title: stitle,
        genre: sgenre,
        artists: sartist,
        year:syear,
        image:sfile
    }},
    function(err,del){
    if(err) throw err;
    res.redirect('/current/'+req.params.id)

    });

});



router.post('/:id/playlist/removeplaylist',async function(req,res){
    const id=req.body.userid;

    const playlist_name=req.body.playlist;


    await music_library.findOne({'user':id},function(err,play){


        for(var i in play['playlists']){

            let x=Object.keys(play['playlists'][i])[0];
            if(x==playlist_name){
                play['playlists'].splice(i,1)


            }

        }
        console.log(play['playlists'])
        music_library.findOneAndUpdate({user:id},{$set:{playlists:play['playlists']}}).then((updatedDoc)=>{})

    })
    res.send("./")

})



//code for pagination

router.get('/:id/all_songs', async function(req,res){
    console.log("all songs page")
    const id=req.params.id;
    const genre=req.query.genre;

    const name = await get_user_name(id);
    const admin=await get_selectors();
    const type = await get_user_type(id);


    const page = req.query.page;
    console.log('page is',page);
    const l=7;
    var s=0;

    if(page!=1){
        console.log(page)
        s=(page-1)*l;
    }


    const liked_songs = await music_library.findOne({'user':id}, function(err,song){


    })
    let plays = [];
    await music_library.findOne({'user':id}, function(err, play){
    for (var i in play['playlists']){
        var x = Object.keys(play['playlists'][i]);
        // console.log(x[0])
        plays.push(x[0])
    }
    });

         music_collection.find({},{skip:s,limit:l},function(err, music){
            if(err) throw err;
            res.render('all_songs',{resul:admin[0]['genre'],name,results:music,id,playlist_names:plays,type})
        });




});
















module.exports = router;




