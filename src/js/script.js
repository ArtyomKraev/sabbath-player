let imageIndex = 1;
showImages(imageIndex);

let textIndex = 1;
showText(textIndex);

function Nexto(n) {
  showImages(imageIndex += n);
  showText(textIndex += n);
}

function showImages(n) {
  let i;
  let images = document.getElementsByClassName("image");

  if (n > images.length) 
  {
    imageIndex = 1;
  }

  if (n < 1) 
  {
    imageIndex = images.length;
  }
  for (i = 0; i < images.length; i++) 
  {
    images[i].style.display = "none";  
  }
 
  images[imageIndex-1].style.display = "block";  
}

function showText(n) {
  let i;
  let texts = document.getElementsByClassName("text");

  if (n > texts.length) 
  {
    textIndex = 1;
  }

  if (n < 1) 
  {
    textIndex = texts.length;
  }
  for (i = 0; i < texts.length; i++) 
  {
    texts[i].style.display = "none";  
  }
 
  texts[textIndex-1].style.display = "block";  
}





let track_art = document.querySelector('.track-art');
let track_name = document.querySelector('.track-name');
let track_artist = document.querySelector('.track-artist');

let playpause_btn = document.querySelector('.playpause-track');
let next_btn = document.querySelector('.next-track');
let prev_btn = document.querySelector('.prev-track');

let seek_slider = document.querySelector('.seek_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let curr_track = document.createElement('audio');

let track_index = 0;
let isPlaying = false;
let updateTimer;

const music_list = [
    {
        img : 'src/img/R-11099214-1509832095-1512.jpg',
        name : 'Into the Void',
        artist : 'Black Sabbath',
        music : 'src/audio/Black Sabbath - Into the Void (2014 Remaster).mp3'
    },
    {
        img : 'src/img/Black_Sabbath_-_Paranoid.jpg',
        name : "Fairies Wear Boots",
        artist : 'Black Sabbath',
        music : 'src/audio/Black Sabbath - Fairies Wear Boots (dizer.net).mp3'
    },
    {
        img : 'src/img/img-7.jpg',
        name : "Sabbra Cadabra",
        artist : 'Black Sabbath',
        music : 'src/audio/Black Sabbath - Sabbra Cadabra (dizer.net).mp3'
    }
];

loadTrack(track_index);

function loadTrack(track_index){
    clearInterval(updateTimer);
    reset();

    curr_track.src = music_list[track_index].music;
    curr_track.load();

    track_art.innerHTML = "<img src=" + music_list[track_index].img + ">";
    track_name.innerHTML = music_list[track_index].name;
    track_artist.textContent = music_list[track_index].artist;

    updateTimer = setInterval(setUpdate, 1000);

    curr_track.addEventListener('ended', nextTrack);
}

let num, array, myElements, analyser, src, height, context;

num = 18;

myElements = document.getElementsByClassName('stroke');

function preparation()
{
    context = new AudioContext();
    analyser = context.createAnalyser();
    src = context.createMediaElementSource(curr_track);
    src.connect(analyser);
    analyser.connect(context.destination);
    loop();
}

function loop() 
{
    if(!curr_track.paused)
    {
        window.requestAnimationFrame(loop);
    }

    array = new Uint8Array(num*2);
    analyser.getByteFrequencyData(array);

    for(var i = 0 ; i < num ; i++)
    {
        height = array[i+num];
        myElements[i].style.height = height - 100 + '%';

        if(curr_track.paused)
        {
            myElements[i].style.height = 0 + '%';
        }
    }
}


function reset(){
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

function playpauseTrack(){
    isPlaying ? pauseTrack() : playTrack();
}
function playTrack(){
    if(!context)
    {
        preparation();
    }
    curr_track.play();
    isPlaying = true;
    playpause_btn.innerHTML = '<img class="pause"  src="src/icons/pause.svg"/> ';
    loop();
}
function pauseTrack(){
    curr_track.pause();
    isPlaying = false;
    playpause_btn.innerHTML = '<img class="play" src="src/icons/play.svg"/> ';
}
function nextTrack(){
    if(track_index < music_list.length - 1){
        track_index += 1;
    }else{
        track_index = 0;
    }
    loadTrack(track_index);
    playTrack();
}
function prevTrack(){
    if(track_index > 0){
        track_index -= 1;
    }else{
        track_index = music_list.length -1;
    }
    loadTrack(track_index);
    playTrack();
}
function seekTo(){
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}

function setUpdate(){
    let seekPosition = 0;
    if(!isNaN(curr_track.duration)){
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        if(currentSeconds < 10) {currentSeconds = "0" + currentSeconds; }
        if(durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if(currentMinutes < 10) {currentMinutes = "0" + currentMinutes; }
        if(durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}
