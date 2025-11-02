const music = new Audio("audio/song3.mp3");
// music.play();
const songs = [
  {
    id: 1,
    songName: ` On my way <br>
              <div class="subtitle">Alan Walker</div>
             `,
    poster: "  imgs/1.jpg",
  },
  {
    id: 2,
    songName: ` Dil Galati <br>
              <div class="subtitle">Jubin</div>
             `,
    poster: " imgs/2.jpg",
  },
  {
    id: 3,
    songName: `Kesariya <br>
              <div class="subtitle">Arjit singh</div>
             `,
    poster: " imgs/3.jpg",
  },
  {
    id: 4,
    songName: ` Azul <br>
              <div class="subtitle">Guru Randhava</div>
             `,
    poster: " imgs/4.jpg",
  },
  {
    id: 5,
    songName: `Shaky <br>
              <div class="subtitle">Sanju Rathod</div>
             `,
    poster: " imgs/5.jpeg",
  },
  {
    id: 6,
    songName: `Jaane Tu <br>
              <div class="subtitle">A R Ranman</div>
             `,
    poster: " imgs/6.jpeg",
  },
  {
    id: 7,
    songName: ` Millioner <br>
              <div class="subtitle">Honer Singh</div>
             `,
    poster: " imgs/7.webp",
  },
  {
    id: 8,
    songName: `Vaaste <br>
              <div class="subtitle">Dhavani</div>
             `,
    poster: " imgs/8.jpeg",
  },
  {
    id: 9,
    songName: `Coca Cola <br>
              <div class="subtitle">Neha Kakkar</div>
             `,
    poster: " imgs/9.jpg",
  },
  {
    id: 10,
    songName: ` Aaj ki raat <br>
              <div class="subtitle">Udit Narayan</div>
             `,
    poster: " imgs/10.jpeg",
  },
  {
    id: 11,
    songName: ` Naina <br>
              <div class="subtitle">Diljit Dosanjh</div>
             `,
    poster: " imgs/11.jpeg",
  },
  {
    id: 12,
    songName: ` On may way <br>
              <div class="subtitle">Alan Walker</div>
             `,
    poster: " imgs/12.jpg",
  },
  {
    id: 13,
    songName: `Lut gaye <br>
              <div class="subtitle">jubin</div>
             `,
    poster: " imgs/13.webp",
  },
  {
    id: 14,
    songName: `Lahore <br>
              <div class="subtitle">Guru Randhava</div>
             `,
    poster: " imgs/14.jpg",
  },
  {
    id: 15,
    songName: `Shaky <br>
              <div class="subtitle">Sanju Rathod</div>
             `,
    poster: " imgs/shaky.jpeg",
  },
  {
    id: 16,
    songName: `Azul <br>
              <div class="subtitle">Guru Randhava</div>
             `,
    poster: " imgs/azul.jpg",
  },
  {
    id: 17,
    songName: ` Naina <br>
              <div class="subtitle">Diljit Dosanjh</div>
             `,
    poster: " imgs/naina.jpeg",
  },
  {
    id: 18,
    songName: `Kesariya <br>
              <div class="subtitle">Arjit singh</div>
             `,
    poster: " imgs/kesariya.jpg",
  },
  {
    id: 19,
    songName: `Vaaste <br>
              <div class="subtitle">Dhavani</div>
             `,
    poster: " imgs/vaaste.jpeg",
  },
  {
    id: 20,
    songName: `Coca Cola <br>
              <div class="subtitle">Neha Kakkar</div>
             `,
    poster: "  imgs/cocacola.jpg",
  },
];

let masterPlay = document.getElementById("masterPlay");
let wave = document.getElementById("wave");

masterPlay.addEventListener("click", () => {
  if (music.paused || music.currentTime <= 0) {
    music.play();
    wave.classList.add("active1");
    masterPlay.classList.add("fa-pause");
  } else {
    music.pause();
    wave.classList.remove("active1");
    masterPlay.classList.remove("fa-pause");
  }
});

let masterPoster = document.getElementById("poster_master_play");
let title = document.getElementById("title");
let index = 0;
console.log(index);

Array.from(document.getElementsByClassName("playlistPplay")).forEach((e) => {
  e.addEventListener("click", (el) => {
    index = el.target.id;
    console.log(index);
    music.src = `audio/song${index}.mp3`;
    music.play();
    wave.classList.add("active1");
    masterPlay.classList.add("fa-pause");
    masterPoster.src = songs[index - 1].poster;
    title.innerHTML = songs[index - 1].songName;
  });
});

Array.from(document.getElementsByClassName("songItem")).forEach((e, i) => {
  e.getElementsByTagName("img")[0].src = songs[i].poster;
  e.getElementsByTagName("h5")[0].innerHTML = songs[i].songName;
});

//////////////// popular song
let pop_song_left = document.getElementById("pop_left");
let pop_song_right = document.getElementById("pop_right");
let pop_song = document.querySelector(".pop_song");

pop_right.addEventListener("click", () => {
  pop_song.scrollLeft += 350;
});

pop_left.addEventListener("click", () => {
  pop_song.scrollLeft -= 350;
});

//// popular artists
let artists_left = document.getElementById("artist_left");
let artists_right = document.getElementById("artist_right");
let item = document.querySelector(".item");

artists_right.addEventListener("click", () => {
  item.scrollLeft += 350;
});

artists_left.addEventListener("click", () => {
  item.scrollLeft -= 350;
});
