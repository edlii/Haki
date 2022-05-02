// Background image fun

let backgroundGifs = [
    'https://i.pinimg.com/originals/b5/fd/3f/b5fd3fbe984103e08b9482471484394b.gif',
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ebdfada2-c71c-421a-91c7-28daf07be221/de9o2kn-d29293c2-4ea7-4010-9c7b-df6a39c39044.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2ViZGZhZGEyLWM3MWMtNDIxYS05MWM3LTI4ZGFmMDdiZTIyMVwvZGU5bzJrbi1kMjkyOTNjMi00ZWE3LTQwMTAtOWM3Yi1kZjZhMzljMzkwNDQuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.rjwO_-SO0iba-3Fgo3LcubdCPpCgYNmQXuQwnNHbIu8',
    'https://i.pinimg.com/originals/27/57/3e/27573edd5d2c322e3202af554000c780.gif',
    'https://steamuserimages-a.akamaihd.net/ugc/857227184325550393/49CD9231268EDE3E94C8B6937F4AA96C7ACD114D/'
];

let backgroundChoice = Math.floor(Math.random() * backgroundGifs.length);
let chosenGif = backgroundGifs[backgroundChoice];

document.getElementById("MomentumCloneBody").style.backgroundImage = `url(${chosenGif})`;

// For weather and time data

let weatherTitle, weatherDesc, weatherTemp, locationTime, locationTimezone, requestedLocation;

// Retrieves Data from URL for Richmond
function getData() {
    return fetch(`http://api.openweathermap.org/data/2.5/weather?q=richmond+,+ca&appid=f51c373faf134eb299ce32bb41b90f75`)
        .then((data) => data.json())
        .then((response) => {
            return response;
        });
}

// Filters out the needed info
async function useData() {
    let response = await getData();
    let allNeededInfo = {
        title: response.weather[0].main,
        desc: response.weather[0].description,
        temp: Math.floor(response.main.temp - 273.15) + "°C",
        timezone: response.timezone
    }
    return allNeededInfo;
}

// Updates and displays information on the HTML page
async function setEverything() {
    let data = await useData();
    weatherTitle = data.title;
    weatherDesc = data.desc;
    weatherTemp = data.temp;
    locationTimezone = data.timezone;

    // Sets current date and time
    locationTime = new Date(new Date().getTime())
    locationTime.toISOString();


    document.getElementById("WeatherTitle").innerHTML = weatherTitle;
    document.getElementById("WeatherDesc").innerHTML = weatherDesc;
    document.getElementById("WeatherTemp").innerHTML = weatherTemp;
    document.getElementById("CurrentTime").innerHTML = locationTime;
}

// Updates every second
setInterval(() => {
    setEverything()
}, 1000);

//--------------------------------------------------------------------//

// Pomodoro Timer

let audio = new Audio("dingsound.wav");
let count = 1;
let startMins = 25;
let time = startMins * 60;

const countdown = document.getElementById('countdown');

setInterval(updateCountdown, 1000);

function updateCountdown() {

    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (minutes == 0 && seconds == 0) {
        count++;
        audio.play();
        // Break happens every other session (even)
        if (count % 2 == 0) {
            startMins = 5;
            time = startMins * 60 + 1;
        } else {
            startMins = 25;
            time = startMins * 60 + 1;
        }
    }

    seconds = seconds < 10 ? '0' + seconds : seconds;

    countdown.innerHTML = `${minutes}:${seconds}`;

    // Checks the starting minutes of the timer and displays text according to current session
    if (count % 2 == 0) {
        document.getElementById("CurrentPomodoro").innerHTML = "Breaktime";
    } else {
        document.getElementById("CurrentPomodoro").innerHTML = "Worktime";
    }

    time--;
}

//--------------------------------------------------------------------//

// Todo list
const inputBox = document.querySelector(".InputField input");
const addButton = document.querySelector(".InputField button");
const todoList = document.querySelector(".listOfTodos");

inputBox.onkeyup = () => {
    let userData = inputBox.value;
    if (userData.trim() != 0) {
        addButton.classList.add("active");
    } else {
        addButton.classList.remove("active");
    }
}
showTasks();

// Listens for the Enter key for the input
document.getElementById("TodoListTextBox")
    .addEventListener("keyup", function (e) {
        e.preventDefault();
        let userData = inputBox.value;
        if (e.keyCode === 13) {
            if (userData.trim() != 0) {
                addButton.click();
            }
        }
    });

addButton.onclick = () => {
    let userData = inputBox.value;
    if (userData.length >= 30) {
        alert("Max Char limit (30 letters + spaces) reached");
        inputBox.value = "";
    } else {
        let getLocalStorage = localStorage.getItem("New Todo");
        if (getLocalStorage == null) {
            listArr = [];
        } else {
            listArr = JSON.parse(getLocalStorage);
        }
        listArr.push(userData);
        localStorage.setItem("New Todo", JSON.stringify(listArr));
        showTasks();
    }
}

function showTasks() {
    let getLocalStorage = localStorage.getItem("New Todo");
    if (getLocalStorage == null) {
        listArr = [];
    } else {
        listArr = JSON.parse(getLocalStorage);
    }
    let newLiTag = '';
    listArr.forEach((element, index) => {
        newLiTag += `<li>${element} <span onclick="deleteTask(${index})"><i class="fa fa-check"></i></span></li>`
    });
    todoList.innerHTML = newLiTag;
    inputBox.value = "";
}

function deleteTask(index) {
    let getLocalStorage = localStorage.getItem("New Todo");
    listArr = JSON.parse(getLocalStorage);
    listArr.splice(index, 1);

    localStorage.setItem("New Todo", JSON.stringify(listArr));
    showTasks();
}
