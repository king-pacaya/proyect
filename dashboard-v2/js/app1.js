//Search
  //Popup
    function searchbtn() {
    document.getElementById("search").classList.toggle("sshow");
    }
  //Multi Search
    let slideIndex = 1;
    showSlides(slideIndex);

    function plusSlides(n) {
      showSlides(slideIndex += n);
    }

    function currentSlide(n) {
      showSlides(slideIndex = n);
    }

    function showSlides(n) {
      let i;
      let slides = document.getElementsByClassName("mySlides");
      let dots = document.getElementsByClassName("dot");
      if (n > slides.length) {slideIndex = 1}    
      if (n < 1) {slideIndex = slides.length}
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
      }
      for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
      }
      slides[slideIndex-1].style.display = "block";  
      dots[slideIndex-1].className += " active";
    }

//Alarm
  //Popup
    function alarmbtn() {
    document.getElementById("alarm").classList.toggle("ashow");
    }
  //App
    window.addEventListener("load", buildIt);
    
    function buildIt() {
      startTime();
      hrsMenu();
      minsMenu();
      secsMenu();
      soundMenu();
      buildAudio();
    }

    function startTime() {
      var today = new Date();
      var h = today.getHours();
      var m = today.getMinutes();
      var s = today.getSeconds();
      var time = checkZero(h) + ":" + checkZero(m) + ":" + checkZero(s);
      document.getElementById("time").innerHTML =
      time;
      var t = setTimeout(startTime, 500);
    }

    function checkZero(i) {
      if (i < 10) {i = "0" + i} 
      return i;
    } 

    function hrsMenu() {
    var select = document.getElementById("alarmHrs");
    var hours = 23;

      for (i=0; i <= hours; i++) {
        select.options[select.options.length] = new Option(i < 10 ? "0" + i : i, i);
      }
    }
      
    function minsMenu() {
    var select = document.getElementById("alarmMins");
    var mins = 59;

      for (i=0; i <= mins; i++) {
        select.options[select.options.length] = new Option(i < 10 ? "0" + i : i, i);  
      }
    }

    function secsMenu() {
    var select = document.getElementById("alarmSecs");
    var secs = 59;

      for (i=0; i <= secs; i++) {
      select.options[select.options.length] = new Option(i < 10 ? "0" + i : i, i);  
      }
    }

    function soundMenu() { 
    var select = document.getElementById("mySelect"); 
      
      var array = [
      {name: "Birds",
      url: "https://www.freespecialeffects.co.uk/soundfx/various/forest.wav"},  
      {name: "Morning",
      url: "https://www.freespecialeffects.co.uk/soundfx/computers/goodmorningfemale.wav"},
      {name: "Bells",
      url: "https://www.freespecialeffects.co.uk/soundfx/bells/church_bells_01.wav"},
      {name: "Laser",
      url: "https://www.freespecialeffects.co.uk/soundfx/scifi/alien_laser_2.wav"},
      {name: "Explosion",
      url: "https://www.freespecialeffects.co.uk/soundfx/explosions/explosion_04.wav"},
      {name: "Piggy",
      url: "http://www.ringelkater.de/Sounds/2geraeusche_tiere/schwein.wav"}, 
      {name: "Rings",
      url: "https://www.freespecialeffects.co.uk/soundfx/telephone/phone_ring_2.wav"}
      ]; 

    for (var i = 0; i < array.length; i++) {
      
     var option = document.createElement("option");
         option.value = array[i].url;
         option.text = array[i].name;
         select.appendChild(option);
    } 
    }
      
    function buildAudio() {
      var myDiv = document.getElementById("myDiv");
      var myAudio = document.createElement("audio");
      
    myAudio.src = "https://www.freespecialeffects.co.uk/soundfx/various/forest.wav";
    myAudio.id = "myAudio";
    myDiv.appendChild(myAudio);
    }

    document.getElementById("mySetButton").addEventListener("click", setAlarm);
    document.getElementById("myClearButton").addEventListener("click", clearAlarm); 
    document.getElementById("mySelect").addEventListener("change", getSrc);
      
    function getSrc() {
    document.getElementById("myAudio").src = document.getElementById("mySelect").value;
      }
      
        
    function setAlarm() {
      
    var hour = document.getElementById("alarmHrs");
    var min = document.getElementById("alarmMins");
    var sec = document.getElementById("alarmSecs");
      
    var selectedHour = hour.options[hour.selectedIndex].value;
    var selectedMin = min.options[min.selectedIndex].value;
    var selectedSec = sec.options[sec.selectedIndex].value;
        
    var alarmTime = addZero(selectedHour) + ":" + addZero(selectedMin) + ":" + addZero(selectedSec);

      document.getElementById('alarmHrs').disabled = true;
      document.getElementById('alarmMins').disabled = true;
      document.getElementById('alarmSecs').disabled = true;
      document.getElementById('mySelect').disabled = true;


    setInterval(function playAlarmSound() { 
      var today = new Date();
      var h = today.getHours();
      var m = today.getMinutes();
      var s = today.getSeconds();
      var time = addZero(h) + ":" + addZero(m) + ":" + addZero(s);
       
    if(time == alarmTime) { 
      myAudio.play();
      myAudio.loop = true;
    }
      }, 1000);
    }
      
    function addZero(i) {
      if (i < 10) {i = "0" + i};
      return i;
    } 
      
    function clearAlarm() {
      document.getElementById("alarmHrs").disabled = false;
      document.getElementById("alarmMins").disabled = false;
      document.getElementById("alarmSecs").disabled = false;
      document.getElementById("mySelect").disabled = false;
      document.getElementById("myAudio").disabled = false;
      myAudio.pause();
      }

//Color
  //Popup
    function colorbtn() {
    document.getElementById("ccolor").classList.toggle("cshow");
    }
  //Change Color Light
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
    //Change Secondary Color Light "SCL" scl
      var scl = document.getElementById('scl');
      function cscl() {
        document.body.style.setProperty('--scl', scl.value);
        localStorage.setItem('scl', scl.value);
      }
      var vscl = localStorage.getItem('scl')
      if (localStorage.getItem('scl')){
        document.body.style.setProperty('--scl', vscl);
      }
    //Change Background Color Light "BGCL" bgcl
      var bgcl = document.getElementById('bgcl');
      function cbgcl() {
        document.body.style.setProperty('--bgcl', bgcl.value);
        localStorage.setItem('bgcl', bgcl.value);
      }
      var vbgcl = localStorage.getItem('bgcl')
      if (localStorage.getItem('bgcl')){
        document.body.style.setProperty('--bgcl', vbgcl);
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
    //Change Secondary Color Night "SCN" scn
      var scn = document.getElementById('scn');
      function cscn() {
        document.body.style.setProperty('--scn', scn.value);
        localStorage.setItem('scn', scn.value);
      }
      var vscn = localStorage.getItem('scn')
      if (localStorage.getItem('scn')){
        document.body.style.setProperty('--scn', vscn);
      }
    //Change Background Color Night "BGCN" bgcn
      var bgcn = document.getElementById('bgcn');
      function cbgcn() {
        document.body.style.setProperty('--bgcn', bgcn.value);
        localStorage.setItem('bgcn', bgcn.value);
      }
      var vbgcn = localStorage.getItem('bgcn')
      if (localStorage.getItem('bgcn')){
        document.body.style.setProperty('--bgcn', vbgcn);
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

//Google Grid
  //Popup
    function googlebtn() {
    document.getElementById("google").classList.toggle("gshow");
    }

//Todo
  //Popup
    function todobtn() {
    document.getElementById("todo").classList.toggle("tshow");
    }
  //App
    const dateElement = document.getElementById('date');
    const list = document.getElementById('list');
    const input = document.getElementById('inputt');
    const addButton = document.querySelector('.fa-plus-circle');

    const CHECK = "fa-check-circle";
    const UNCHECK = "fa-circle-thin";
    const LINE_THROUGH = "lineThrough";
    const CHANGE = "editable";

    var timer = null, delay = 260, click = 0, canFocus = true;//double click

    /* show time */
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const today = new Date();
    dateElement.innerHTML = today.toLocaleDateString("en-US", options);

    let LIST, id;
    let data = localStorage.getItem("TODO");
    //get historical data from localstorage
    if (data) {
        LIST = JSON.parse(data);
        id = LIST.length;
        loadList(LIST);
    }
    else {
        LIST = []
        id = 0;
    }

    function loadList(array) {
        array.forEach(element => {
            add_to_do(element.name, element.id, element.done, element.trash);
        });
    }

    function add_to_do(toDo, id, done, trash) {
        if (trash)
            return;
        const DONE = done ? CHECK : UNCHECK;
        const LINE = done ? LINE_THROUGH : "";

        const item = `<li class="item">
                        <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                        <input class="text ${LINE}" job="edit" value="${toDo}" id="${id}" Blur=""">
                        <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                    </li>
                    `;
        const position = "beforeend";
        list.insertAdjacentHTML(position, item);//可以使用appendchild直接插入dom，效率会更高
    }

    input.addEventListener("keypress", function (even) {
        if (event.keyCode === 13) {
            const toDo = input.value;
            if (toDo) {
                add_to_do(toDo, id, false, false);

                LIST.push({ name: toDo, id: id, done: false, trash: false });

                localStorage.setItem("TODO", JSON.stringify(LIST));
                id++;
                input.value = "";
            }
        }
    });

    addButton.addEventListener('click', function () {
        const toDo = input.value;
        if (toDo) {
            add_to_do(toDo, id, false, false);

            LIST.push({ name: toDo, id: id, done: false, trash: false });

            localStorage.setItem("TODO", JSON.stringify(LIST));
            id++;
            input.value = "";
        }
    });

    list.addEventListener("click", function (event) {
        const element = event.target;
        const elementJob = element.attributes.job.value;

        if (elementJob === 'complete') {
            completeToDo(element);
        } else if (elementJob === 'delete') {
            removeToDo(element);
        }
        else if(elementJob === 'edit'){
            editTodo(element);
        }

        localStorage.setItem("TODO", JSON.stringify(LIST));

    }, false);

    function completeToDo(element) {
        element.classList.toggle(UNCHECK);
        element.classList.toggle(CHECK);
        element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

        LIST[element.id].done = LIST[element.id].done ? false : true;
    }

    function removeToDo(element) {
        element.parentNode.parentNode.removeChild(element.parentNode);
        LIST[element.id].trash = true;
    }

//Greeting
  var dgreeting = new Date();
  var hgreeting = dgreeting.getHours();

  if (hgreeting < 11.9){
    greeting = 'Good Morning ☕';
  }
  else if (hgreeting < 17.9){
    greeting = 'Good Afternoon 🌄';
  }
  else if (hgreeting < 23.9){
    greeting = 'Good Night 🛏️';
  }
  else {
    greeting = "Welcome";
  }
  setTimeout(dgreeting, 1000);
  document.getElementById("col-1").innerHTML = "<h3>" + greeting + " </h3>";

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
      document.getElementById("clock").innerText = tclock;
      document.getElementById("clock").textContent = tclock;
      
      setTimeout(ctime, 1000);
      
  }

  ctime();

//Calendar
  //Popup
    function calendarbtn() {
    document.getElementById("calendar").classList.toggle("cashow");
    }
  //App
    const AVAILABLE_WEEK_DAYS = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    const localStorageName = 'calendar-events';

    class CALENDAR {
        constructor(options) {
            this.options = options;
            this.elements = {
                days: this.getFirstElementInsideIdByClassName('calendar-days'),
                week: this.getFirstElementInsideIdByClassName('calendar-week'),
                month: this.getFirstElementInsideIdByClassName('calendar-month'),
                year: this.getFirstElementInsideIdByClassName('calendar-current-year'),
                eventList: this.getFirstElementInsideIdByClassName('current-day-events-list'),
                eventField: this.getFirstElementInsideIdByClassName('add-event-day-field'),
                eventAddBtn: this.getFirstElementInsideIdByClassName('add-event-day-field-btn'),
                currentDay: this.getFirstElementInsideIdByClassName('calendar-left-side-day'),
                currentWeekDay: this.getFirstElementInsideIdByClassName('calendar-left-side-day-of-week'),
                prevYear: this.getFirstElementInsideIdByClassName('calendar-change-year-slider-prev'),
                nextYear: this.getFirstElementInsideIdByClassName('calendar-change-year-slider-next')
            };

            this.eventList = JSON.parse(localStorage.getItem(localStorageName)) || {};

            this.date = +new Date();
            this.options.maxDays = 37;
            this.init();
        }

    // App methods
        init() {
            if (!this.options.id) return false;
            this.eventsTrigger();
            this.drawAll();
        }

        // draw Methods
        drawAll()
            {
            this.drawWeekDays();
            this.drawMonths();
            this.drawDays();
            this.drawYearAndCurrentDay();
            this.drawEvents();
            }

        drawEvents()
            {
            let calendar = this.getCalendar();
            let eventList = this.eventList[calendar.active.formatted] || ['There is not any events'];
            let eventTemplate = "";
            eventList.forEach(item =>
                {
                eventTemplate += `<li>${item}</li>`;
                });
            this.elements.eventList.innerHTML = eventTemplate;
            }

        drawYearAndCurrentDay()
            {
            let calendar = this.getCalendar();
            this.elements.year.innerHTML = calendar.active.year;
            this.elements.currentDay.innerHTML = calendar.active.day;
            this.elements.currentWeekDay.innerHTML = AVAILABLE_WEEK_DAYS[calendar.active.week];
            }

        drawDays() {
            let calendar = this.getCalendar();

            let latestDaysInPrevMonth = this.range(calendar.active.startWeek).map((day, idx) => {
                return {
                    dayNumber: this.countOfDaysInMonth(calendar.pMonth) - idx,
                    month: new Date(calendar.pMonth).getMonth(),
                    year: new Date(calendar.pMonth).getFullYear(),
                    currentMonth: false
                }
            }).reverse();


            let daysInActiveMonth = this.range(calendar.active.days).map((day, idx) => {
                let dayNumber = idx + 1;
                let today = new Date();
                return {
                    dayNumber,
                    today: today.getDate() === dayNumber && today.getFullYear() === calendar.active.year && today.getMonth() === calendar.active.month,
                    month: calendar.active.month,
                    year: calendar.active.year,
                    selected: calendar.active.day === dayNumber,
                    currentMonth: true
                }
            });


            let countOfDays = this.options.maxDays - (latestDaysInPrevMonth.length + daysInActiveMonth.length);
            let daysInNextMonth = this.range(countOfDays).map((day, idx) => {
                return {
                    dayNumber: idx + 1,
                    month: new Date(calendar.nMonth).getMonth(),
                    year: new Date(calendar.nMonth).getFullYear(),
                    currentMonth: false
                }
            });

            let days = [...latestDaysInPrevMonth, ...daysInActiveMonth, ...daysInNextMonth];

            days = days.map(day => {
                let newDayParams = day;
                let formatted = this.getFormattedDate(new Date(`${Number(day.month) + 1}/${day.dayNumber}/${day.year}`));
                newDayParams.hasEvent = this.eventList[formatted];
                return newDayParams;
            });

            let daysTemplate = "";
            days.forEach(day => {
                daysTemplate += `<li class="${day.currentMonth ? '' : 'another-month'}${day.today ? ' active-day ' : ''}${day.selected ? 'selected-day' : ''}${day.hasEvent ? ' event-day' : ''}" data-day="${day.dayNumber}" data-month="${day.month}" data-year="${day.year}"></li>`
            });

            this.elements.days.innerHTML = daysTemplate;
        }

        drawMonths()
            {
            let availableMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let monthTemplate = "";
            let calendar = this.getCalendar();
            availableMonths.forEach((month, idx) =>
                {
                monthTemplate += `<li class="${idx === calendar.active.month ? 'active' : ''}" data-month="${idx}">${month}</li>`
                });
            this.elements.month.innerHTML = monthTemplate;
            }

        drawWeekDays() {
            let weekTemplate = "";
            AVAILABLE_WEEK_DAYS.forEach(week => {
                weekTemplate += `<li>${week.slice(0, 3)}</li>`
            });

            this.elements.week.innerHTML = weekTemplate;
        }

        // Service methods
        eventsTrigger() {
            this.elements.prevYear.addEventListener('click', e => {
                let calendar = this.getCalendar();
                this.updateTime(calendar.pYear);
                this.drawAll()
            });

            this.elements.nextYear.addEventListener('click', e => {
                let calendar = this.getCalendar();
                this.updateTime(calendar.nYear);
                this.drawAll()
            });

            this.elements.month.addEventListener('click', e => {
                let calendar = this.getCalendar();
                let month = e.srcElement.getAttribute('data-month');
                if (!month || calendar.active.month == month) return false;

                let newMonth = new Date(calendar.active.tm).setMonth(month);
                this.updateTime(newMonth);
                this.drawAll()
            });


            this.elements.days.addEventListener('click', e => {
                let element = e.srcElement;
                let day = element.getAttribute('data-day');
                let month = element.getAttribute('data-month');
                let year = element.getAttribute('data-year');
                if (!day) return false;
                let strDate = `${Number(month) + 1}/${day}/${year}`;
                this.updateTime(strDate);
                this.drawAll()
            });


            this.elements.eventAddBtn.addEventListener('click', e => {
                let fieldValue = this.elements.eventField.value;
                if (!fieldValue) return false;
                let dateFormatted = this.getFormattedDate(new Date(this.date));
                if (!this.eventList[dateFormatted]) this.eventList[dateFormatted] = [];
                this.eventList[dateFormatted].push(fieldValue);
                localStorage.setItem(localStorageName, JSON.stringify(this.eventList));
                this.elements.eventField.value = '';
                this.drawAll()
            });


        }


        updateTime(time) {
            this.date = +new Date(time);
        }

        getCalendar() {
            let time = new Date(this.date);

            return {
                active: {
                    days: this.countOfDaysInMonth(time),
                    startWeek: this.getStartedDayOfWeekByTime(time),
                    day: time.getDate(),
                    week: time.getDay(),
                    month: time.getMonth(),
                    year: time.getFullYear(),
                    formatted: this.getFormattedDate(time),
                    tm: +time
                },
                pMonth: new Date(time.getFullYear(), time.getMonth() - 1, 1),
                nMonth: new Date(time.getFullYear(), time.getMonth() + 1, 1),
                pYear: new Date(new Date(time).getFullYear() - 1, 0, 1),
                nYear: new Date(new Date(time).getFullYear() + 1, 0, 1)
            }
        }

        countOfDaysInMonth(time) {
            let date = this.getMonthAndYear(time);
            return new Date(date.year, date.month + 1, 0).getDate();
        }

        getStartedDayOfWeekByTime(time) {
            let date = this.getMonthAndYear(time);
            return new Date(date.year, date.month, 1).getDay();
        }

        getMonthAndYear(time) {
            let date = new Date(time);
            return {
                year: date.getFullYear(),
                month: date.getMonth()
            }
        }

        getFormattedDate(date) {
            return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
        }

        range(number) {
            return new Array(number).fill().map((e, i) => i);
        }

        getFirstElementInsideIdByClassName(className) {
            return document.getElementById(this.options.id).getElementsByClassName(className)[0];
        }
    }


    (function () {
        new CALENDAR({
            id: "calendar"
        })
    })();