$(document).ready(function(){

console.log("This has been reached")


var type=document.getElementsByClassName('typechk')[0].id
if(type=="admin"){
   document.getElementById('adminfunctions').style.display="block";

}


})


function likeFunction(item){

var x = $(item).parent().text();



$.post( "./"+x, {title: x } );
}
 console.log("post request is sent")

 function myFunction(x) {
    x.classList.toggle("fas");
  }

// update song as dislike
function dislike(song_name, id){

   $.post( "./liked_songs_page/dislike", {song:song_name , userid : id },function(){
      location.reload();
   });
};


// function to create a playlist
function addPlay(id){

     var playlist = $("#addPlaylist").val();

        $.post( "./liked_songs_page/playlist", {id,playlist },function(){
      location.reload();
   });



}

// function to add a liked song to playlist
function addtoplaylist(playlist, id, songname){

        $.post( "./liked_songs_page/addtoplaylist", {id,playlist,songname},function(){
      location.reload();
   });

}



function removefromplaylist(songname, id, playlistName){


     $.post( "./playlist_songs/remove", {id,songname,playlistName},function(){
      location.reload();
   });



}



function randomcontent(songs){

   for (i in songs){
      console.log(songs[i])
   }
}


function removeplaylist(playlist,userid){

   console.log("here ", playlist , userid)
   $.post('/current/:id/playlist/removeplaylist',{userid,playlist},function(){
      location.reload();
   })
}

function showalert(emailalert){

   alert(emailalert);
}



