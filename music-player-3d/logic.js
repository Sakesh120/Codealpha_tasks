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
