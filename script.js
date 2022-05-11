// fix the input type range error

document.querySelectorAll('input[type="range"]').forEach((input) => {
  input.addEventListener("mousedown", () =>
    window.getSelection().removeAllRanges()
  );
});

let audioTag = document.querySelector(".audio");

let musicContainer = document.querySelector(".music-container");
let songName = document.querySelector(".song-name");
let artistName = document.querySelector(".artist-name");
let disk = document.querySelector(".disk");
let diskCircle = document.querySelector(".disk-circle");
let seekBar = document.querySelector(".seek-bar");
let songCurrentTime = document.querySelector(".current-time");
let songDuration = document.querySelector(".song-duration");
let soundOff = document.querySelector(".sound-off");
let volumeHigh = document.querySelector(".volume-high");
let soundOn = document.querySelector(".sound-on");
let volumeSlider = document.querySelector(".volume");
let volumePercentage = document.querySelector(".volume-percentage");
let xTag = document.querySelector(".x");
let yTag = document.querySelector(".y");

let playBtn = document.querySelector(".play-btn");
let backwardBtn = document.querySelector(".backward-btn");
let forwardBtn = document.querySelector(".forward-btn");
let restartBtn = document.querySelector(".restart-btn");
let randomBtn = document.querySelector(".random-btn");
let repeatNormalBtn = document.querySelector(".repeatNormal-btn");

let musicBox = document.querySelector(".music-box");
let beatBox = document.querySelector(".beat-box");

let currentPlayingIndex = 0;

//circle text

//volume
function checkVolume() {
  let value = document.querySelector(".volume").value;
  if (value <= 0) {
    soundOn.classList.add("active");
    soundOff.classList.remove("active");
    volumeHigh.classList.add("active");
  }
  if (value < 70 && value >= 55) {
    soundOn.classList.remove("active");
    soundOff.classList.add("active");
    volumeHigh.classList.add("active");
  }
  if (value >= 75) {
    soundOn.classList.add("active");
    soundOff.classList.add("active");
    volumeHigh.classList.remove("active");
  }
  volumePercentage.textContent = value;
}

volumeSlider.addEventListener("change", () => {
  audioTag.volume = volumeSlider.value / 100;
});

//play btn
playBtn.addEventListener("click", () => {
  if (playBtn.className.includes("pause")) {
    audioTag.play();
  } else {
    audioTag.pause();
  }
  disk.classList.toggle("playing");
  playBtn.classList.toggle("pause");
  musicBox.classList.toggle("hg");
  beatBox.classList.toggle("stop");
});

const setMusic = (i) => {
  seekBar.value = 0;
  currentPlayingIndex = i;

  artistName.textContent = tracks[i].artist;
  songName.textContent = tracks[i].title;
  disk.style.backgroundImage = `url(
      '${tracks[i].cover}')`;
  audioTag.src = tracks[i].path;

  audioTag.addEventListener("loadeddata", () => {
    let duration = audioTag.duration;
    seekBar.max = duration;
    songDuration.textContent = formatTime(duration);
  });

  audioTag.addEventListener("timeupdate", () => {
    let current = audioTag.currentTime;
    seekBar.value = current;
    songCurrentTime.textContent = formatTime(current);
    if (current === audioTag.duration) {
      forwardBtn.click();
    }
    seekBar.addEventListener("change", () => {
      audioTag.currentTime = seekBar.value;
    });
  });

  const text = document.querySelector(".text p");
  text.innerHTML =
    "P l a y i n g M u s i c " +
    (currentPlayingIndex + 1) +
    " of " +
    tracks.length;

  text.innerHTML = text.innerText
    .split("")
    .map((e, i) => {
      return `<span style="transform: rotate(${i * 6}deg)">${e}</span>`;
    })
    .join("");
};
setMusic(0);

const playMusic = () => {
  disk.classList.add("playing");
  playBtn.classList.remove("pause");
  beatBox.classList.remove("stop");
  musicBox.classList.add("hg");
  audioTag.play();
};

//forward btn
forwardBtn.addEventListener("click", () => {
  if (currentPlayingIndex < tracks.length - 1 && isNormalMode === true) {
    currentPlayingIndex++;
  } else if (
    currentPlayingIndex < tracks.length - 1 &&
    isNormalMode === false
  ) {
    let random_index = Number.parseInt(Math.random() * tracks.length - 1);
    currentPlayingIndex = random_index;
  } else {
    currentPlayingIndex = 0;
  }
  setMusic(currentPlayingIndex);
  playMusic();
  gradient_BgColor();
});

//previous btn
backwardBtn.addEventListener("click", () => {
  if (currentPlayingIndex === 0) {
    currentPlayingIndex = tracks.length - 1;
  } else {
    currentPlayingIndex--;
  }
  setMusic(currentPlayingIndex);
  playMusic();
  gradient_BgColor();
});

//restart btn
restartBtn.addEventListener("click", () => {
  seekBar.value = 0;
  audioTag.currentTime = seekBar.value;
  playMusic();
});

//shuffle and normal mode
let isNormalMode = true;

function normalMode() {
  repeatNormalBtn.style.display = "block";
  randomBtn.style.display = "none";
}

function randomMode() {
  repeatNormalBtn.style.display = "none";
  randomBtn.style.display = "block";
}
//show repeat normal btn
repeatNormalBtn.addEventListener("click", () => {
  isNormalMode = false;
  isNormalMode ? normalMode() : randomMode();
});
//show random mode show
randomBtn.addEventListener("click", () => {
  isNormalMode = true;
  isNormalMode ? normalMode() : randomBtn();
});

//formatted time
const formatTime = (time) => {
  let min = Math.floor(time / 60);
  let minText = min < 10 ? "0" + min.toString() : min;
  let sec = Math.floor(time % 60);
  let secText = sec < 10 ? "0" + sec.toString() : sec;

  return minText + ":" + secText;
};

//change background gradient color
function gradient_BgColor() {
  let colors = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
  ];

  function combine(sign) {
    for (let i = 0; i < 6; i++) {
      let randomNum = Math.floor(Math.random() * 14);
      let hexCode = colors[randomNum];
      sign += hexCode;
    }
    return sign;
  }

  let color_stop1 = combine("#");
  let color_stop2 = combine("#");
  var angle = "to right";

  let gradient = `linear-gradient(${angle}, ${color_stop1}, ${color_stop2})`;
  musicContainer.style.background = gradient;
  diskCircle.style.background = gradient;
}
