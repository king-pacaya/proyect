//Username
  const nameInput = document.querySelector('#name');
  const username = localStorage.getItem('username') || '';

  nameInput.value = username;

  nameInput.addEventListener('change', (e) => {
    localStorage.setItem('username', e.target.value);
  })
  if (localStorage.getItem('username') == null) {
    localStorage.setItem('username', '');
  }

//Greeting
  var dgreeting = new Date();
  var hgreeting = dgreeting.getHours();

  if (hgreeting < 11.9){
    greeting = 'Good Morning ' + localStorage.getItem('username') + ' ☕';
  }
  else if (hgreeting < 17.9){
    greeting = 'Good Afternoon ' + localStorage.getItem('username') + ' 🌄';
  }
  else if (hgreeting < 23.9){
    greeting = 'Good Night ' + localStorage.getItem('username') + ' 🛏️';
  }
  else {
    greeting = "Welcome";
  }
  document.getElementById("col-1").innerHTML = "<p>" + greeting + " </p>";

//Music
  const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  mainAudio = wrapper.querySelector("#main-audio"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = progressArea.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  moreMusicBtn = wrapper.querySelector("#more-music"),
  closemoreMusic = musicList.querySelector("#close");

  let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
  isMusicPaused = true;

  window.addEventListener("load", ()=>{
    loadMusic(musicIndex);
    playingSong(); 
  });

  function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `${allMusic[indexNumb - 1].image}`;
    mainAudio.src = `${allMusic[indexNumb - 1].link}`;
  }

  //play music function
  function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
  }

  //pause music function
  function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
  }

  //prev music function
  function prevMusic(){
    musicIndex--; //decrement of musicIndex by 1
    //if musicIndex is less than 1 then musicIndex will be the array length so the last music play
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong(); 
  }

  //next music function
  function nextMusic(){
    musicIndex++; //increment of musicIndex by 1
    //if musicIndex is greater than array length then musicIndex will be 1 so the first music play
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong(); 
  }

  // play or pause button event
  playPauseBtn.addEventListener("click", ()=>{
    const isMusicPlay = wrapper.classList.contains("paused");
    //if isPlayMusic is true then call pauseMusic else call playMusic
    isMusicPlay ? pauseMusic() : playMusic();
    playingSong();
  });

  //prev music button event
  prevBtn.addEventListener("click", ()=>{
    prevMusic();
  });

  //next music button event
  nextBtn.addEventListener("click", ()=>{
    nextMusic();
  });

  // update progress bar width according to music current time
  mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime; //getting playing song currentTime
    const duration = e.target.duration; //getting playing song total duration
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current-time"),
    musicDuartion = wrapper.querySelector(".max-duration");
    mainAudio.addEventListener("loadeddata", ()=>{
      // update song total duration
      let mainAdDuration = mainAudio.duration;
      let totalMin = Math.floor(mainAdDuration / 60);
      let totalSec = Math.floor(mainAdDuration % 60);
      if(totalSec < 10){ //if sec is less than 10 then add 0 before it
        totalSec = `0${totalSec}`;
      }
      musicDuartion.innerText = `${totalMin}:${totalSec}`;
    });
    // update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){ //if sec is less than 10 then add 0 before it
      currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
  });

  // update playing song currentTime on according to the progress bar width
  progressArea.addEventListener("click", (e)=>{
    let progressWidth = progressArea.clientWidth; //getting width of progress bar
    let clickedOffsetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration; //getting song total duration
    
    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic(); //calling playMusic function
    playingSong();
  });

  //change loop, shuffle, repeat icon onclick
  const repeatBtn = wrapper.querySelector("#repeat-plist");
  repeatBtn.addEventListener("click", ()=>{
    let getText = repeatBtn.innerText; //getting this tag innerText
    switch(getText){
      case "repeat":
        repeatBtn.innerText = "repeat_one";
        repeatBtn.setAttribute("title", "Song looped");
        break;
      case "repeat_one":
        repeatBtn.innerText = "shuffle";
        repeatBtn.setAttribute("title", "Playback shuffled");
        break;
      case "shuffle":
        repeatBtn.innerText = "repeat";
        repeatBtn.setAttribute("title", "Playlist looped");
        break;
    }
  });

  //code for what to do after song ended
  mainAudio.addEventListener("ended", ()=>{
    // we'll do according to the icon means if user has set icon to
    // loop song then we'll repeat the current song and will do accordingly
    let getText = repeatBtn.innerText; //getting this tag innerText
    switch(getText){
      case "repeat":
        nextMusic(); //calling nextMusic function
        break;
      case "repeat_one":
        mainAudio.currentTime = 0; //setting audio current time to 0
        loadMusic(musicIndex); //calling loadMusic function with argument, in the argument there is a index of current song
        playMusic(); //calling playMusic function
        break;
      case "shuffle":
        let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //genereting random index/numb with max range of array length
        do{
          randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        }while(musicIndex == randIndex); //this loop run until the next random number won't be the same of current musicIndex
        musicIndex = randIndex; //passing randomIndex to musicIndex
        loadMusic(musicIndex);
        playMusic();
        playingSong();
        break;
    }
  });

  //show music list onclick of music icon
  moreMusicBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
  });
  closemoreMusic.addEventListener("click", ()=>{
    moreMusicBtn.click();
  });

  const ulTag = wrapper.querySelector("ul");
  // let create li tags according to array length for list
  for (let i = 0; i < allMusic.length; i++) {
    //let's pass the song name, artist from the array
    let liTag = `<li li-index="${i + 1}">
                  <div class="row">
                    <div><img src="${allMusic[i].image}"></div>
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                  </div>
                  <span id="${allMusic[i].src}" class="audio-duration"></span>
                  <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag

    let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
    liAudioTag.addEventListener("loadeddata", ()=>{
      let duration = liAudioTag.duration;
      let totalMin = Math.floor(duration / 60);
      let totalSec = Math.floor(duration % 60);
      if(totalSec < 10){ //if sec is less than 10 then add 0 before it
        totalSec = `0${totalSec}`;
      };
      liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
      liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
    });
  }

  //play particular song from the list onclick of li tag
  function playingSong(){
    const allLiTag = ulTag.querySelectorAll("li");
    
    for (let j = 0; j < allLiTag.length; j++) {
      let audioTag = allLiTag[j].querySelector(".audio-duration");
      
      if(allLiTag[j].classList.contains("playing")){
        allLiTag[j].classList.remove("playing");
        let adDuration = audioTag.getAttribute("t-duration");
        audioTag.innerText = adDuration;
      }

      //if the li tag index is equal to the musicIndex then add playing class in it
      if(allLiTag[j].getAttribute("li-index") == musicIndex){
        allLiTag[j].classList.add("playing");
        audioTag.innerText = "Playing";
      }

      allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
  }

  //particular li clicked function
  function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //updating current song index with clicked li index
    loadMusic(musicIndex);
    playMusic();
    playingSong();
  }

//Slides
  let slideIndex = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
  let slideId = ["app1", "app2", "app3", "app4", "app5", "app6", "app7", "app8",
  "app9", "app10", "app11", "app12", "app13", "app14", "app15", "app16", "app17",
  "app18", "app19", "app20", "app21", "app21", "app23", "app24", "app25", "app26"]
  showSlides(1, 0);
  showSlides(1, 1);
  showSlides(1, 2);
  showSlides(1, 3);
  showSlides(1, 4);
  showSlides(1, 5);
  showSlides(1, 6);
  showSlides(1, 7);
  showSlides(1, 8);
  showSlides(1, 9);
  showSlides(1, 10);
  showSlides(1, 11);
  showSlides(1, 12);
  showSlides(1, 13);
  showSlides(1, 14);
  showSlides(1, 15);
  showSlides(1, 16);
  showSlides(1, 17);
  showSlides(1, 18);
  showSlides(1, 19);
  showSlides(1, 20);
  showSlides(1, 21);
  showSlides(1, 22);
  showSlides(1, 23);
  showSlides(1, 24);
  showSlides(1, 25);

  function plusSlides(n, no) {
    showSlides(slideIndex[no] += n, no);
  }

  function showSlides(n, no) {
    let i;
    let x = document.getElementsByClassName(slideId[no]);
    if (n > x.length) {slideIndex[no] = 1}
    if (n < 1) {slideIndex[no] = x.length}
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";  
    }
    x[slideIndex[no]-1].style.display = "block";  
  }

//Mode
  const btnmode = document.getElementById('mode');

  btnmode.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    btnmode.classList.toggle('mactive');

    // Guardamos el modo en localstorage.
    if(document.body.classList.contains('dark')){
      localStorage.setItem('dark-mode', 'true');
    } else {
      localStorage.setItem('dark-mode', 'false');
    }
  });

  if(localStorage.getItem('dark-mode') === 'true'){
    document.body.classList.add('dark');
    btnmode.classList.add('mactive');
  } else {
    document.body.classList.remove('dark');
    btnmode.classList.remove('mactive');
  }

//Tab Categories
  function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("div-left-nav");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }

  // Get the element with id="defaultOpen" and click on it
  document.getElementById("defaultOpen").click();

//Time
  function ctime(){
      var clock = new Date();
      var ho = clock.getHours(); // 0 - 23
      var mi = clock.getMinutes(); // 0 - 59
      var se = clock.getSeconds(); // 0 - 59
      var session = "AM";
      
      if(ho == 0){
          ho = 12;
      }
      
      if(ho > 12){
          ho = ho - 12;
          session = "PM";
      }
      
      ho = (ho < 10) ? "0" + ho : ho;
      mi = (mi < 10) ? "0" + mi : mi;
      se = (se < 10) ? "0" + se : se;
      
      var tclock = ho + ":" + mi + ":" + se + " " + session;
      document.getElementById("clock").innerHTML = "<p>" + tclock + " </p>";
      setTimeout(ctime, 1000);   
  }
  ctime();

//Popups
  //Settings
    var settingbtn = document.getElementById("settingbtn");
    var settingcontainer = document.getElementById("settingcontainer");
    settingbtn.onclick = function() {
      settingcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == settingcontainer) {
        settingcontainer.style.width = "0%";
      }
    });
  //Language
    var languagebtn = document.getElementById("languagebtn");
    var languagecontainer = document.getElementById("languagecontainer");
    languagebtn.onclick = function() {
      languagecontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == languagecontainer) {
        languagecontainer.style.width = "0%";
      }
    });
  //Google
    var googlebtn = document.getElementById("googlebtn");
    var googlecontainer = document.getElementById("googlecontainer");
    googlebtn.onclick = function() {
      googlecontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == googlecontainer) {
        googlecontainer.style.width = "0%";
      }
    });
  //music
    var musicbtn = document.getElementById("musicbtn");
    var musiccontainer = document.getElementById("musiccontainer");
    musicbtn.onclick = function() {
      musiccontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == musiccontainer) {
        musiccontainer.style.width = "0%";
      }
    });
  //weather
    var weatherbtn = document.getElementById("weatherbtn");
    var weathercontainer = document.getElementById("weathercontainer");
    weatherbtn.onclick = function() {
      weathercontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == weathercontainer) {
        weathercontainer.style.width = "0%";
      }
    });
  //pomodoro
    var pomodorobtn = document.getElementById("pomodorobtn");
    var pomodorocontainer = document.getElementById("pomodorocontainer");
    pomodorobtn.onclick = function() {
      pomodorocontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == pomodorocontainer) {
        pomodorocontainer.style.width = "0%";
      }
    });
  //timer
    var timerbtn = document.getElementById("timerbtn");
    var timercontainer = document.getElementById("timercontainer");
    timerbtn.onclick = function() {
      timercontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == timercontainer) {
        timercontainer.style.width = "0%";
      }
    });
  //alarm
    var alarmbtn = document.getElementById("alarmbtn");
    var alarmcontainer = document.getElementById("alarmcontainer");
    alarmbtn.onclick = function() {
      alarmcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == alarmcontainer) {
        alarmcontainer.style.width = "0%";
      }
    });
  //calculator
    var calculatorbtn = document.getElementById("calculatorbtn");
    var calculatorcontainer = document.getElementById("calculatorcontainer");
    calculatorbtn.onclick = function() {
      calculatorcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == calculatorcontainer) {
        calculatorcontainer.style.width = "0%";
      }
    });
  //dictionary
    var dictionarybtn = document.getElementById("dictionarybtn");
    var dictionarycontainer = document.getElementById("dictionarycontainer");
    dictionarybtn.onclick = function() {
      dictionarycontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == dictionarycontainer) {
        dictionarycontainer.style.width = "0%";
      }
    });
  //translator
    var translatorbtn = document.getElementById("translatorbtn");
    var translatorcontainer = document.getElementById("translatorcontainer");
    translatorbtn.onclick = function() {
      translatorcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == translatorcontainer) {
        translatorcontainer.style.width = "0%";
      }
    });
  //detect
    var detectbtn = document.getElementById("detectbtn");
    var detectcontainer = document.getElementById("detectcontainer");
    detectbtn.onclick = function() {
      detectcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == detectcontainer) {
        detectcontainer.style.width = "0%";
      }
    });
  //ide
    var idebtn = document.getElementById("idebtn");
    var idecontainer = document.getElementById("idecontainer");
    idebtn.onclick = function() {
      idecontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == idecontainer) {
        idecontainer.style.width = "0%";
      }
    });
  //graph
    var graphbtn = document.getElementById("graphbtn");
    var graphcontainer = document.getElementById("graphcontainer");
    graphbtn.onclick = function() {
      graphcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == graphcontainer) {
        graphcontainer.style.width = "0%";
      }
    });
  //path
    var pathbtn = document.getElementById("pathbtn");
    var pathcontainer = document.getElementById("pathcontainer");
    pathbtn.onclick = function() {
      pathcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == pathcontainer) {
        pathcontainer.style.width = "0%";
      }
    });
  //box
    var boxbtn = document.getElementById("boxbtn");
    var boxcontainer = document.getElementById("boxcontainer");
    boxbtn.onclick = function() {
      boxcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == boxcontainer) {
        boxcontainer.style.width = "0%";
      }
    });
  //image
    var imagebtn = document.getElementById("imagebtn");
    var imagecontainer = document.getElementById("imagecontainer");
    imagebtn.onclick = function() {
      imagecontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == imagecontainer) {
        imagecontainer.style.width = "0%";
      }
    });
  //draw
    var drawbtn = document.getElementById("drawbtn");
    var drawcontainer = document.getElementById("drawcontainer");
    drawbtn.onclick = function() {
      drawcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == drawcontainer) {
        drawcontainer.style.width = "0%";
      }
    });
  //picker
    var pickerbtn = document.getElementById("pickerbtn");
    var pickercontainer = document.getElementById("pickercontainer");
    pickerbtn.onclick = function() {
      pickercontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == pickercontainer) {
        pickercontainer.style.width = "0%";
      }
    });
  //pixel
    var pixelbtn = document.getElementById("pixelbtn");
    var pixelcontainer = document.getElementById("pixelcontainer");
    pixelbtn.onclick = function() {
      pixelcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == pixelcontainer) {
        pixelcontainer.style.width = "0%";
      }
    });
  //palette
    var palettebtn = document.getElementById("palettebtn");
    var palettecontainer = document.getElementById("palettecontainer");
    palettebtn.onclick = function() {
      palettecontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == palettecontainer) {
        palettecontainer.style.width = "0%";
      }
    });
  //degraded
    var degradedbtn = document.getElementById("degradedbtn");
    var degradedcontainer = document.getElementById("degradedcontainer");
    degradedbtn.onclick = function() {
      degradedcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == degradedcontainer) {
        degradedcontainer.style.width = "0%";
      }
    });
  //currency
    var currencybtn = document.getElementById("currencybtn");
    var currencycontainer = document.getElementById("currencycontainer");
    currencybtn.onclick = function() {
      currencycontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == currencycontainer) {
        currencycontainer.style.width = "0%";
      }
    });
  //budget
    var budgetbtn = document.getElementById("budgetbtn");
    var budgetcontainer = document.getElementById("budgetcontainer");
    budgetbtn.onclick = function() {
      budgetcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == budgetcontainer) {
        budgetcontainer.style.width = "0%";
      }
    });
  //list
    var listbtn = document.getElementById("listbtn");
    var listcontainer = document.getElementById("listcontainer");
    listbtn.onclick = function() {
      listcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == listcontainer) {
        listcontainer.style.width = "0%";
      }
    });
  //notes
    var notesbtn = document.getElementById("notesbtn");
    var notescontainer = document.getElementById("notescontainer");
    notesbtn.onclick = function() {
      notescontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == notescontainer) {
        notescontainer.style.width = "0%";
      }
    });
  //text
    var textbtn = document.getElementById("textbtn");
    var textcontainer = document.getElementById("textcontainer");
    textbtn.onclick = function() {
      textcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == textcontainer) {
        textcontainer.style.width = "0%";
      }
    });
  //checker
    var checkerbtn = document.getElementById("checkerbtn");
    var checkercontainer = document.getElementById("checkercontainer");
    checkerbtn.onclick = function() {
      checkercontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == checkercontainer) {
        checkercontainer.style.width = "0%";
      }
    });
  //internet
    var internetbtn = document.getElementById("internetbtn");
    var internetcontainer = document.getElementById("internetcontainer");
    internetbtn.onclick = function() {
      internetcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == internetcontainer) {
        internetcontainer.style.width = "0%";
      }
    });
  //speech
    var speechbtn = document.getElementById("speechbtn");
    var speechcontainer = document.getElementById("speechcontainer");
    speechbtn.onclick = function() {
      speechcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == speechcontainer) {
        speechcontainer.style.width = "0%";
      }
    });
  //quote
    var quotebtn = document.getElementById("quotebtn");
    var quotecontainer = document.getElementById("quotecontainer");
    quotebtn.onclick = function() {
      quotecontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == quotecontainer) {
        quotecontainer.style.width = "0%";
      }
    });
  //qr
    var qrbtn = document.getElementById("qrbtn");
    var qrcontainer = document.getElementById("qrcontainer");
    qrbtn.onclick = function() {
      qrcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == qrcontainer) {
        qrcontainer.style.width = "0%";
      }
    });
  //save
    var savebtn = document.getElementById("savebtn");
    var savecontainer = document.getElementById("savecontainer");
    savebtn.onclick = function() {
      savecontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == savecontainer) {
        savecontainer.style.width = "0%";
      }
    });
  //password
    var passwordbtn = document.getElementById("passwordbtn");
    var passwordcontainer = document.getElementById("passwordcontainer");
    passwordbtn.onclick = function() {
      passwordcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == passwordcontainer) {
        passwordcontainer.style.width = "0%";
      }
    });
  //ttt
    var tttbtn = document.getElementById("tttbtn");
    var tttcontainer = document.getElementById("tttcontainer");
    tttbtn.onclick = function() {
      tttcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == tttcontainer) {
        tttcontainer.style.width = "0%";
      }
    });
  //gtetris
    var gtetrisbtn = document.getElementById("gtetrisbtn");
    var gtetriscontainer = document.getElementById("gtetriscontainer");
    gtetrisbtn.onclick = function() {
      gtetriscontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == gtetriscontainer) {
        gtetriscontainer.style.width = "0%";
      }
    });
  //gsnake
    var gsnakebtn = document.getElementById("gsnakebtn");
    var gsnakecontainer = document.getElementById("gsnakecontainer");
    gsnakebtn.onclick = function() {
      gsnakecontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == gsnakecontainer) {
        gsnakecontainer.style.width = "0%";
      }
    });
  //gmc
    var gmcbtn = document.getElementById("gmcbtn");
    var gmccontainer = document.getElementById("gmccontainer");
    gmcbtn.onclick = function() {
      gmccontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == gmccontainer) {
        gmccontainer.style.width = "0%";
      }
    });
  //gmaze
    var gmazebtn = document.getElementById("gmazebtn");
    var gmazecontainer = document.getElementById("gmazecontainer");
    gmazebtn.onclick = function() {
      gmazecontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == gmazecontainer) {
        gmazecontainer.style.width = "0%";
      }
    });
  //gchess
    var gchessbtn = document.getElementById("gchessbtn");
    var gchesscontainer = document.getElementById("gchesscontainer");
    gchessbtn.onclick = function() {
      gchesscontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == gchesscontainer) {
        gchesscontainer.style.width = "0%";
      }
    });
  //gpp
    var gppbtn = document.getElementById("gppbtn");
    var gppcontainer = document.getElementById("gppcontainer");
    gppbtn.onclick = function() {
      gppcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == gppcontainer) {
        gppcontainer.style.width = "0%";
      }
    });
  //grps
    var grpsbtn = document.getElementById("grpsbtn");
    var grpscontainer = document.getElementById("grpscontainer");
    grpsbtn.onclick = function() {
      grpscontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == grpscontainer) {
        grpscontainer.style.width = "0%";
      }
    });
  //gtower
    var gtowerbtn = document.getElementById("gtowerbtn");
    var gtowercontainer = document.getElementById("gtowercontainer");
    gtowerbtn.onclick = function() {
      gtowercontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == gtowercontainer) {
        gtowercontainer.style.width = "0%";
      }
    });
  //gfb
    var gfbbtn = document.getElementById("gfbbtn");
    var gfbcontainer = document.getElementById("gfbcontainer");
    gfbbtn.onclick = function() {
      gfbcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == gfbcontainer) {
        gfbcontainer.style.width = "0%";
      }
    });
  //gsimon
    var gsimonbtn = document.getElementById("gsimonbtn");
    var gsimoncontainer = document.getElementById("gsimoncontainer");
    gsimonbtn.onclick = function() {
      gsimoncontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == gsimoncontainer) {
        gsimoncontainer.style.width = "0%";
      }
    });
  //gdefense
    var gdefensebtn = document.getElementById("gdefensebtn");
    var gdefensecontainer = document.getElementById("gdefensecontainer");
    gdefensebtn.onclick = function() {
      gdefensecontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == gdefensecontainer) {
        gdefensecontainer.style.width = "0%";
      }
    });
  //gbr
    var gbrbtn = document.getElementById("gbrbtn");
    var gbrcontainer = document.getElementById("gbrcontainer");
    gbrbtn.onclick = function() {
      gbrcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == gbrcontainer) {
        gbrcontainer.style.width = "0%";
      }
    });
  //gwg
    var gwgbtn = document.getElementById("gwgbtn");
    var gwgcontainer = document.getElementById("gwgcontainer");
    gwgbtn.onclick = function() {
      gwgcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == gwgcontainer) {
        gwgcontainer.style.width = "0%";
      }
    });
  //gtt
    var gttbtn = document.getElementById("gttbtn");
    var gttcontainer = document.getElementById("gttcontainer");
    gttbtn.onclick = function() {
      gttcontainer.style.width = "100%";
    }
    window.addEventListener("click", function(event) {
      if (event.target == gttcontainer) {
        gttcontainer.style.width = "0%";
      }
    });

//Color
  //Change Principal Color Light "PCL"
    var pcl = document.getElementById('pcl');
    function cpcl() {
      document.body.style.setProperty('--pcl', pcl.value);
      localStorage.setItem('pcl', pcl.value);
    }
    var vpcl = localStorage.getItem('pcl')
    if (localStorage.getItem('pcl')){
      document.body.style.setProperty('--pcl', vpcl);
    }
  //Change Principal Color Night "PCN" pcn
    var pcn = document.getElementById('pcn');
    function cpcn() {
      document.body.style.setProperty('--pcn', pcn.value);
      localStorage.setItem('pcn', pcn.value);
    }
    var vpcn = localStorage.getItem('pcn')
    if (localStorage.getItem('pcn')){
      document.body.style.setProperty('--pcn', vpcn);
    }

//Change Background Image
  var show = document.getElementById('show');

  
  var cimg = localStorage.getItem('background');
  var dcimg = localStorage.getItem('dbackground');










  function mostrarImagen(event) {
    var imgsrc = event.target.result;
    show.setAttribute('src', imgsrc);
    localStorage.setItem('background', imgsrc);
  }

  function procesarArchivo(event) {
    var imagen = event.target.files[0];
    var lector = new FileReader();
    lector.addEventListener('load', mostrarImagen);
    lector.readAsDataURL(imagen);
  }

  if (localStorage.getItem('background')){
    show.setAttribute('src', cimg);
  }

  document.getElementById('file').addEventListener('change', procesarArchivo);










  function dmostrarImagen(event) {
    var dimgsrc = event.target.result;
    dshow.setAttribute('src', dimgsrc);
    localStorage.setItem('dbackground', dimgsrc);
  }

  function dprocesarArchivo(event) {
    var dimagen = event.target.files[0];
    var dlector = new FileReader();
    dlector.addEventListener('load', dmostrarImagen);
    dlector.readAsDataURL(dimagen);
  }

  if (localStorage.getItem('dbackground')){
    dshow.setAttribute('src', dcimg);
  }

  document.getElementById('dfile').addEventListener('change', dprocesarArchivo);

//Change Login Image
  var lshow = document.getElementById('lshow');
  var lcimg = localStorage.getItem('lbackground');


  function lmostrarImagen(event) {
    var limgsrc = event.target.result;
    lshow.setAttribute('src', limgsrc);
    localStorage.setItem('lbackground', limgsrc);
  }

  function lprocesarArchivo(event) {
    var limagen = event.target.files[0];
    var llector = new FileReader();
    llector.addEventListener('load', lmostrarImagen);
    llector.readAsDataURL(limagen);
  }

  if (localStorage.getItem('lbackground')){
    lshow.setAttribute('src', lcimg);
  }

  document.getElementById('lfile').addEventListener('change', lprocesarArchivo);

//Accordion
  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }

//Login
  var setlogin = document.getElementById('setlogin');
  var putlogin = document.getElementById('putlogin');
  var outlogin = document.getElementById('outlogin');
  var sd = document.getElementById('main-container');
  var fd = document.getElementById('login-container');
  var td = document.getElementById('filter');
  var line = document.getElementById('line');
  var login = localStorage.getItem('login');
  var newlogin = localStorage.getItem('newlogin');

  function setLogin () {
    localStorage.setItem('login', setlogin.value);
  }

  function putLogin () {
    localStorage.setItem('newlogin', putlogin.value);
  }

  if (newlogin == login) {
    sd.style.display = "block";
    td.style.display = "block";
    fd.style.display = "none";
  }

  if (localStorage.getItem('login')) {
    outlogin.style.display = "flex";
    line.style.display = "block";
  }

  function outLogin () {
    localStorage.setItem('newlogin', '');
  }

//Quote
  var quoteArray = [
    {
    content: "Mickey mouse is dead",
    author: "Me"
    },
    {
    content: "Chesse Burger Family",
    author: "Me"
    },
    {
    content: "Omg an onion!",
    author: "Me"
    },
    {
    content: "Omg an avocado!",
    author: "Me"
    },
    {
    content: "Everybody dance now 🎶",
    author: "Me"
    },
    {
    content: "Call me fighter",
    author: "Me"
    },
    {
    content: "Yes sir is a frog",
    author: "Me"
    },
    {
    content: "Yaw",
    author: "Me"
    },
    {
    content: "This is useful?",
    author: "Me"
    },
    {
    content: "Yes, today is the day",
    author: "Me"
    },
    {
    content: "Don't worry, everything will be okey",
    author: "Me"
    },
    {
    content: "Bibia be ye ye",
    author: "Me"
    },
    {
    content: "Idk, but you look beautiful today",
    author: "Me"
    },
    {
    content: "Stop, u need zzzzzzzzzleep",
    author: "Me"
    },
    {
    content: "Refresh the page",
    author: "Me"
    },
    {
    content: "XD",
    author: "Me"
    },
    {
    content: "Nothing here for now",
    author: "Me"
    },
    {
    content: "Remember drink water",
    author: "Me"
    },
    {
    content: "Just call me",
    author: "Me"
    },
    {
    content: "How many quotes are here?",
    author: "Me"
    },
    {
    content: "Hi :3",
    author: "Me"
    },
    {
    content: "I just wanna be a potato",
    author: "Me"
    },
    {
    content: "Nvm what r u doing but it's okay",
    author: "Me"
    },
    {
    content: "It's a combo sized meal, it's a family deal",
    author: "Me"
    },
    {
    content: "Keyboardmouse?",
    author: "Me"
    },
    {
    content: "Use ur glasses :D",
    author: "Me"
    },
    {
    content: "You'll get older, and maybe then you'll feel some control",
    author: "Me"
    },
    {
    content: "I can be brown",
    author: "Me"
    },
    {
    content: "I can be blue",
    author: "Me"
    },
    {
    content: "I can be violet sky",
    author: "Me"
    },
    {
    content: "Tomorrow is another day :D",
    author: "Me"
    },
    {
    content: "Blue!",
    author: "Me"
    },
    {
    content: "Yellow!",
    author: "Me"
    },
    {
    content: "Hold my gaze tonight",
    author: "Me"
    },
    {
    content: "The good thing ",
    author: "Me"
    },
    {
    content: "The best of the day is see you smile so bright",
    author: "Me"
    },
    {
    content: "Medicine at midnight",
    author: "Me"
    },
    {
    content: "Be chill",
    author: "Me"
    },
    {
    content: "Chillax",
    author: "Me"
    },
    {
    content: "Just another random quote",
    author: "Me"
    },
    {
    content: "Study",
    author: "Me"
    },
    {
    content: "Do you forget something?",
    author: "Me"
    },
    {
    content: "R u sure?",
    author: "Me"
    },
    {
    content: "Ya, that's okay",
    author: "Me"
    },
    {
    content: "No",
    author: "Me"
    },
    {
    content: "Yes",
    author: "Me"
    },
    {
    content: "U can't use me for your decisions",
    author: "Me"
    },
    {
    content: "Shut up, take a flower 🌹",
    author: "Me"
    },
    {
    content:"Is today your birthday?",
    author: "Me"
    },
    {
    content:"My rule's mark is in 18 cm",
    author: "Me"
    },
    {
    content:"Sorry i'm not okay for now",
    author: "Me"
    },
    {
    content:"Take a coffe and let's go ☕️",
    author: "Me"
    },
    {
    content:"Yes, u can be blue somedays",
    author: "Me"
    },
    {
    content:"After all, you have friends, family, and me, your dashboard :D",
    author: "Me"
    },
    {
    content:"Shine motherf*cker, shine a lot",
    author: "Me"
    },
    {
    content:"Turn off your PC",
    author: "Me"
    },
    {
    content:"No please, today nooooou",
    author: "Me"
    },
    {
    content:"I'm not superstitious, but i'm a little bit stitious",
    author: "Me"
    },
    {
    content:"Wassamassaw",
    author: "Me"
    },
    {
    content: "The planet is fine. The people are fucked",
    author: "George Carlin"
    },
    {
    content: "Stay up and fight",
    author: "Me"
    },
    {
    content: "Once you can accept the universe as matter expanding into nothing that is something, wearing stripes with plaid comes easy.",
    author: "Einstein"
    },
    {
    content: "I'm funny too :c",
    author: "Me"
    },
    {
    content: "What time is it?",
    author: "Me"
    },
    {
    content: "(It's) It's okey but (Is't), Is't okay?",
    author: "Me"
    },
    {
    content: "Close your phone",
    author: "Me"
    },
    {
    content: "Turn on you windows",
    author: "Me"
    },
    {
    content: "The worst religion is....",
    author: "Me"
    },
    {
    content: "01011000 01000100",
    author: "Me"
    },
    {
    content: "I can order to you a coffee or two",
    author: "Me"
    },
    {
    content: "Wala",
    author: "Me"
    },
    {
    content: "I wrote this at 5 a.m.",
    author: "Me"
    },
    {
    content: "Thanks for use me",
    author: "Me"
    },
    {
    content: "The yellow way",
    author: "Me"
    },
    {
    content: "I'd stay here forever looking in your eyes",
    author: "Me"
    },
    {
    content: "24/7, baby, 3-6-5",
    author: "Me"
    },
    {
    content: "The life's just a blink so don't think twice",
    author: "Me"
    },
    {
    content: "We could all be dead tomorrow :D",
    author: "Me"
    },
    {
    content: "It's not the end, 'cause the energy never dies",
    author: "Me"
    },
    {
    content: "You're amazing",
    author: "Me"
    },
    {
    content: "Tomorrow Is a long time away",
    author: "Me"
    },
    {
    content: "This night can last forever",
    author: "Me"
    },
    {
    content: "Someone like me should know better",
    author: "Me"
    },
    {
    content: "This night Is mine, It's only you and I",
    author: "Me"
    },
    {
    content: "Learn rusian",
    author: "Me"
    },
    {
    content: "Never let your best friends get lonely, keep disturbing them.",
    author: "Me"
    },
    {
    content: "Sometimes I wish I was an octopus, so I could slap eight people at once.",
    author: "Me"
    },
    {
    content: "If you’re hotter than me, then that means I’m cooler than you.",
    author: "Me"
    },
    {
    content: "My wallet is like an onion, opening it makes me cry.",
    author: "Me"
    },
    {
    content: "My goal this weekend is to move, just enough so people don’t think I’m dead.",
    author: "Me"
    },
    {
    content: "Lazy people fact #234782730901. You were too lazy to read that number.",
    author: "Me"
    },
    {
    content: "Friends buy you food. Best friends eat your food.",
    author: "Me"
    },
    {
    content: "Papercut: A tree’s final moment of revenge.",
    author: "Me"
    },
    {
    content: "Common sense is like deodorant, those who need it the most never use it.",
    author: "Me"
    },
    {
    content: "I don’t need a hair stylist, my pillow gives me a new hairstyle every morning.",
    author: "Me"
    },
    {
    content: "Life always offers you a second chance. It’s called tomorrow.",
    author: "Me"
    },
    {
    content: "My six pack is protected by a layer of fat.",
    author: "Me"
    },
    {
    content: "When nothing is going right, go left.",
    author: "Me"
    },
    {
    content: "If you have crazy friends you have everything you’ll ever need.",
    author: "Me"
    },
    {
    content: "Silence is golden, unless you have kids, then silence is just plain suspicious.",
    author: "Me"
    },
    {
    content: "I’m not running away from hard work, I’m too lazy to run.",
    author: "Me"
    },
    {
    content: "Don’t make me laugh, I’m trying to be mad at you.",
    author: "Me"
    },
    {
    content: "If I won the award for laziness, I would send somebody to pick it up for me.",
    author: "Me"
    },
    {
    content: "Maybe if we tell people the brain is an app, they’ll start using it.",
    author: "Me"
    },
    {
    content: "My bed is a magical place where I suddenly remember everything I forgot to do.",
    author: "Me"
    },
    {
    content: "A best friend is like a four-leaf clover, hard to find, lucky to have.",
    author: "Me"
    },
    {
    content: "Some people are like clouds. When they go away, it’s a brighter day.",
    author: "Me"
    },
    {
    content: "At night, I can’t fall asleep. In the morning, I can’t get up.",
    author: "Me"
    },
    {
    content: "Seeing a spider in my room isn’t scary. It’s scary when it disappears.",
    author:"Me"
    },
    {
    content: "If we shouldn’t eat at night, why is there a light in the fridge?",
    author:"Me"
    },
    {
    content: "They say ‘don’t try this at home so I’m coming over to your house to try it.",
    author:"Me"
    },
    {
    content: "When you fall, I will be there to catch you with love. Sincerely, the floor.",
    author:"Me"
    },
    {
    content: "I could agree with you, but then we’d both be wrong.",
    author:"Me"
    },
    {
    content: "I didn’t fall, I’m just spending some quality time with the floor.",
    author:"Me"
    },
    {
    content: "Lottery: a tax on people who are bad at math.",
    author:"Me"
    },
    {
    content: "What happens to a frog’s car when it breaks down? It gets toad away.",
    author:"Me"
    },
    {
    content: "I only check my voicemail to get rid of the annoying little icon.",
    author:"Me"
    },
    {
    content: "My windows aren’t dirty, my dog is painting.",
    author:"Me"
    },
    {
    content: "No matter how bad it gets, I’m always rich when I go to the dollar store.",
    author:"Me"
    },
    {
    content: "Today, I laughed until my abs started hurting, so I can skip the gym.",
    author:"Me"
    },
    {
    content: "Brush your teeth",
    author:"Me"
    },
    {
    content: "Wash your hands",
    author:"Me"
    },
    {
    content: "Take 20 minutes",
    author:"Me"
    },
    {
    content: "Lower the brightness of your PC",
    author:"Me"
    },
    {
    content: "Listen music",
    author:"Me"
    },
    {
    content: "Hello there",
    author:"Me"
    },
    {
    content: "Duh, engineering",
    author:"Me"
    },
    {
    content: "Nya",
    author:"Me"
    },
    {
    content: "This is the best place",
    author:"Me"
    },
    {
    content: "Turn up the volume",
    author:"Me"
    },
    {
    content: "Every day is one less day for Christmas",
    author:"Me"
    },
    {
    content: "Synth",
    author:"Me"
    },
    {
    content: "I never finish anyt",
    author:"Me"
    }
  ];

  var quote = document.getElementById('quote-text'),
      author = document.getElementById('quote-author'),
      random;

  window.onload = randomQuote;
  function randomQuote ()
  {
  random = Math.floor(Math.random() * quoteArray.length);
  quote.innerHTML = quoteArray[random].content;
  author.innerHTML = '&mdash; ' + quoteArray[random].author;
  }

//Date
  const ddateElement = document.getElementById("date");

  const doptions = {weekday: "long", month:"short", day:"numeric"};
  const dtoday = new Date();

  ddateElement.innerHTML = "<p>" + dtoday.toLocaleDateString("en-US", doptions) + " </p>";

//Bookmark
  const modal = document.getElementById("modal");
  const modalShow = document.getElementById("show-modal");
  const modalClose = document.getElementById("close-model");
  const bookmarkForm = document.getElementById("bookmark-form");
  const websiteNameEl = document.getElementById("website-name");
  const websiteUrlEl = document.getElementById("website-url");
  const bookmarksContainer = document.getElementById("bookmarks-container");

  let bookmarks = [];

  // Show Modal , focus in Input
  let showModal = () => {
    modal.classList.add("show-modal");
    websiteNameEl.focus();
  };
  // Close Modal
  let closeModal = () => modal.classList.remove("show-modal");

  // Modal Events Listeners
  modalShow.addEventListener("click", showModal);
  modalClose.addEventListener("click", closeModal);
  // close when click outside the modal
  window.addEventListener("click", (e) => (e.target === modal ? closeModal() : false));

  // Validate Form
  let Validate = (nameValue, urlValue) => {
    const expression =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
      alert("please submit values for both fields.");
      return false;
    }
    if (!urlValue.match(regex)) {
      alert("please provide a valid web address");
      return false;
    }
    // Valid
    return true;
  };

  // Build Bookmarks DOM
  let buildBookmarks = () => {
    // Remove all bookmark elements
    bookmarksContainer.textContent = "";
    // Build Items
    bookmarks.forEach((bookmark) => {
      const { name, url } = bookmark;

      //Link Cyan
      const item = document.createElement("div")
      item.classList.add("bitem");

      const link = document.createElement("a");
      link.classList.add("blink");
      link.setAttribute("href", `${url}`);
      link.setAttribute("target", "_blank");
      link.textContent = name;

      //Close Icon PCLN
      const closeIcon = document.createElement("i");
      closeIcon.classList.add("fas", "fa-times");
      closeIcon.setAttribute("title", "Delete Bookmark");
      closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);

      //Favicon Green
      const favicon = document.createElement("img");
      favicon.classList.add("bimg");
      favicon.setAttribute("src", `https://www.google.com/s2/favicons?domain=${url}`);
      favicon.setAttribute("alt", "favicon");


      // Apend bookmark container
      item.append(closeIcon, link, favicon);
      bookmarksContainer.appendChild(item);
    });
  };

  //  Fetch Bookmarks
  let fetchBookmarks = () => {
    // Get Bookmarks from localStorage if available
    if (localStorage.getItem("bookmarks")) {
      bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    } else {
      // Create bookmarks array in localStorage
      bookmarks = [
        {
          name: "Duck Duck Go",
          url: "https://duckduckgo.com",
        },
        {
          name: "Youtube",
          url: "https://www.youtube.com",
        },
        {
          name: "Google",
          url: "https://www.google.com",
        },
        {
          name: "Dashboard v1.0",
          url: "https://king-pacaya.github.io/dashboard-v1.0/",
        },
        {
          name: "Dashboard v2.0",
          url: "https://king-pacaya.github.io/dashboard-v2.0/",
        }
      ];
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
    buildBookmarks();
  };

  // Delete Bookmark
  let deleteBookmark = (url) => {
    bookmarks.forEach((bookmark, i) => {
      if (bookmark.url === url) {
        bookmarks.splice(i, 1);
      }
    });
    //   Update bookmarks array in localStorage, re-populate DOM
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    fetchBookmarks();
  };
  // Handle Data from form
  let storeBookmark = (e) => {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
      urlValue = `https://${urlValue}`;
    }

    if (!Validate(nameValue, urlValue)) {
      return false;
    }
    const bookmark = {
      name: nameValue,
      url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
  };

  // Event Listener
  bookmarkForm.addEventListener("submit", storeBookmark);

  // on Load , Fetch Bookmarks
  fetchBookmarks();

//Search
  let sslideIndex = 1;
  sshowSlides(sslideIndex);

  function splusSlides(n) {
    sshowSlides(sslideIndex += n);
  }

  function scurrentSlide(n) {
    sshowSlides(sslideIndex = n);
  }

  function sshowSlides(n) {
    let i;
    let sslides = document.getElementsByClassName("searchs");
    if (n > sslides.length) {sslideIndex = 1}
    if (n < 1) {sslideIndex = sslides.length}
    for (i = 0; i < sslides.length; i++) {
      sslides[i].style.display = "none";
    }
    sslides[sslideIndex-1].style.display = "block";
    dots[sslideIndex-1].className += " active";
    captionText.innerHTML = dots[sslideIndex-1].alt;
  }

