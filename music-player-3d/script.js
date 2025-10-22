/* script.js — Updated with localStorage persistence
   Saves: volume, shuffle, repeatMode, autoplay, currentIndex, currentTime
   Keys: stored under 'mp_settings' in localStorage
*/

const STORAGE_KEY = "mp_settings_v1"; // bump version if you change structure

const songs = [
  {
    title: "Song One",
    artist: "Artist A",
    src: "songs/song1.mp3",
    cover: "images/cover1.jpg",
    duration: null,
  },
  {
    title: "Song Two",
    artist: "Artist B",
    src: "songs/song2.mp3",
    cover: "images/cover2.jpg",
    duration: null,
  },
  {
    title: "Song Three",
    artist: "Artist C",
    src: "songs/song3.mp3",
    cover: "images/cover3.jpg",
    duration: null,
  },
];

// --- Elements
const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const titleTop = document.getElementById("title-top");
const artistTop = document.getElementById("artist-top");
const titleBack = document.getElementById("title");
const artistBack = document.getElementById("artist");
const playBtn = document.getElementById("play");
const playIconPath = document.getElementById("playIcon");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationTimeEl = document.getElementById("durationTime");
const volumeEl = document.getElementById("volume");
const listEl = document.getElementById("list");
const countEl = document.getElementById("count");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const autoplayEl = document.getElementById("autoplay");
const card3d = document.getElementById("card3d");

let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0: off, 1: all, 2: one

// --- Persisted settings defaults
const defaultSettings = {
  volume: 1,
  shuffle: false,
  repeatMode: 0,
  autoplay: false,
  currentIndex: 0,
  currentTime: 0,
};

// --- Utilities
function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

// --- Storage helpers
function saveSettings(partial = {}) {
  // read existing to avoid overwriting transient fields unexpectedly
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  const merged = Object.assign({}, stored, partial);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

function loadSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored) return defaultSettings;
    return Object.assign({}, defaultSettings, stored);
  } catch (e) {
    console.warn("Failed to read settings, resetting to defaults", e);
    return defaultSettings;
  }
}

// --- Load & display playlist
function buildPlaylist() {
  listEl.innerHTML = "";
  songs.forEach((s, i) => {
    const item = document.createElement("div");
    item.className = "item";
    item.dataset.index = i;
    item.innerHTML = `
      <div class="thumb"><img src="${s.cover}" alt="${s.title}" style="width:100%;height:100%;object-fit:cover"></div>
      <div class="meta">
        <h4>${s.title}</h4>
        <p>${s.artist}</p>
      </div>
    `;
    item.addEventListener("click", () => {
      loadSong(i);
      playSong();
    });
    listEl.appendChild(item);
  });
  countEl.textContent = songs.length;
}
buildPlaylist();

// --- Load song (and optionally restore time)
function loadSong(index, restoreTime = false, timeToRestore = 0) {
  currentIndex = index;
  const s = songs[index];
  audio.src = s.src;
  cover.src = s.cover;
  titleTop.textContent = s.title;
  artistTop.textContent = s.artist;
  titleBack.textContent = s.title;
  artistBack.textContent = s.artist;

  // highlight active in playlist
  document.querySelectorAll(".item").forEach((it) => {
    it.classList.toggle("active", Number(it.dataset.index) === index);
  });

  // update duration when metadata available
  audio.addEventListener("loadedmetadata", function meta() {
    durationTimeEl.textContent = formatTime(audio.duration);
    // restore playback position if requested and within duration
    if (
      restoreTime &&
      !isNaN(timeToRestore) &&
      timeToRestore > 0 &&
      timeToRestore < audio.duration - 1
    ) {
      audio.currentTime = timeToRestore;
    }
    audio.removeEventListener("loadedmetadata", meta);
  });
}

// --- Play / Pause
function setPlayIconToPause() {
  playIconPath.innerHTML =
    '<path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
}
function setPlayIconToPlay() {
  playIconPath.innerHTML = '<path fill="currentColor" d="M8 5v14l11-7z"/>';
}

function playSong() {
  // attempt play; may reject due to autoplay policies if no user interaction
  audio
    .play()
    .then(() => {
      isPlaying = true;
      card3d.classList.add("playing");
      setPlayIconToPause();
    })
    .catch((err) => {
      console.warn(
        "Play prevented by browser (user interaction required).",
        err
      );
      // fallback: set state but don't crash. UI remains with play button.
      isPlaying = false;
      setPlayIconToPlay();
    });
}
function pauseSong() {
  audio.pause();
  isPlaying = false;
  card3d.classList.remove("playing");
  setPlayIconToPlay();
}

playBtn.addEventListener("click", () => (isPlaying ? pauseSong() : playSong()));

// prev / next
prevBtn.addEventListener("click", () => {
  if (isShuffle) {
    loadSong(Math.floor(Math.random() * songs.length));
  } else {
    loadSong((currentIndex - 1 + songs.length) % songs.length);
  }
  playSong();
});
nextBtn.addEventListener("click", () => {
  if (isShuffle) {
    loadSong(Math.floor(Math.random() * songs.length));
  } else {
    loadSong((currentIndex + 1) % songs.length);
  }
  playSong();
});

// --- Progress updates
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + "%";
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

// Click to seek
progressBar.addEventListener("click", (e) => {
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const pct = clickX / rect.width;
  if (audio.duration) audio.currentTime = pct * audio.duration;
});

// --- Volume
volumeEl.addEventListener("input", () => {
  audio.volume = Number(volumeEl.value);
  saveSettings({ volume: Number(volumeEl.value) });
});

// --- Shuffle
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  updateShuffleUI();
  saveSettings({ shuffle: isShuffle });
});
function updateShuffleUI() {
  shuffleBtn.style.opacity = isShuffle ? "1" : "0.7";
  shuffleBtn.style.transform = isShuffle ? "translateY(-2px)" : "none";
}

// --- Repeat
function updateRepeatUI() {
  if (repeatMode === 0) {
    repeatBtn.style.opacity = "0.7";
    repeatBtn.title = "Repeat: Off";
  } else if (repeatMode === 1) {
    repeatBtn.style.opacity = "1";
    repeatBtn.title = "Repeat: All";
  } else {
    repeatBtn.style.opacity = "1";
    repeatBtn.title = "Repeat: One";
  }
}
repeatBtn.addEventListener("click", () => {
  repeatMode = (repeatMode + 1) % 3;
  updateRepeatUI();
  saveSettings({ repeatMode });
});
updateRepeatUI();

// --- Ended handling (repeat / autoplay / next)
audio.addEventListener("ended", () => {
  if (repeatMode === 2) {
    // repeat one
    audio.currentTime = 0;
    playSong();
  } else if (isShuffle) {
    loadSong(Math.floor(Math.random() * songs.length));
    playSong();
  } else {
    const nextIndex = (currentIndex + 1) % songs.length;
    const reachedEnd = nextIndex === 0;
    if (reachedEnd && !autoplayEl.checked && repeatMode === 0) {
      pauseSong(); // stop if reached end and autoplay off
    } else {
      loadSong(nextIndex);
      playSong();
    }
  }
});

// --- Autoplay
autoplayEl.addEventListener("change", () => {
  autoplayEl.title = autoplayEl.checked ? "Autoplay: On" : "Autoplay: Off";
  saveSettings({ autoplay: autoplayEl.checked });
});

// --- Keyboard shortcuts (space play/pause, left prev, right next)
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    isPlaying ? pauseSong() : playSong();
  }
  if (e.code === "ArrowLeft") {
    prevBtn.click();
  }
  if (e.code === "ArrowRight") {
    nextBtn.click();
  }
});

// --- Initialize and restore settings
function applySettingsToUI(settings) {
  // Volume
  audio.volume = Number(settings.volume ?? defaultSettings.volume);
  volumeEl.value = Number(settings.volume ?? defaultSettings.volume);

  // Shuffle
  isShuffle = Boolean(settings.shuffle);
  updateShuffleUI();

  // Repeat
  repeatMode = Number(settings.repeatMode ?? defaultSettings.repeatMode);
  updateRepeatUI();

  // Autoplay
  autoplayEl.checked = Boolean(settings.autoplay);

  // Last song & position restored after loading metadata
  loadSong(
    Number(settings.currentIndex ?? defaultSettings.currentIndex),
    true,
    Number(settings.currentTime ?? 0)
  );
}

// load settings from storage
const initialSettings = loadSettings();
applySettingsToUI(initialSettings);

// --- Save last-playback state periodically while playing (throttled)
let lastSavedAt = 0;
const SAVE_INTERVAL = 5000; // save every 5s while playing

audio.addEventListener("timeupdate", () => {
  const now = Date.now();
  if (now - lastSavedAt > SAVE_INTERVAL) {
    saveSettings({
      currentIndex,
      currentTime: audio.currentTime,
    });
    lastSavedAt = now;
  }
});

// Also save on song change/load (explicit)
function saveStateNow() {
  try {
    saveSettings({
      volume: Number(volumeEl.value),
      shuffle: isShuffle,
      repeatMode,
      autoplay: autoplayEl.checked,
      currentIndex,
      currentTime: audio.currentTime || 0,
    });
  } catch (e) {
    console.warn("Failed to save settings", e);
  }
}

// Save when user leaves or visibility changes
window.addEventListener("beforeunload", saveStateNow);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") saveStateNow();
});

// Small UX enhancers: double-tap cover to toggle play
cover.addEventListener("dblclick", () =>
  isPlaying ? pauseSong() : playSong()
);

// Mobile: allow swipe on card to next/prev (basic)
let startX = null;
card3d.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});
card3d.addEventListener("touchend", (e) => {
  if (startX === null) return;
  const endX = e.changedTouches[0].clientX;
  const diff = endX - startX;
  if (diff > 40) prevBtn.click();
  else if (diff < -40) nextBtn.click();
  startX = null;
});

// Preload durations - will fill durationTime for initial track
songs.forEach((s, idx) => {
  const a = new Audio();
  a.src = s.src;
  a.addEventListener("loadedmetadata", () => {
    songs[idx].duration = a.duration;
    if (idx === currentIndex && !isNaN(a.duration))
      durationTimeEl.textContent = formatTime(a.duration);
  });
});

// Make sure UI shows active item on start
document.querySelectorAll(".item").forEach((it) => {
  it.classList.toggle("active", Number(it.dataset.index) === currentIndex);
});

// Expose a small API for debugging in console (optional)
window.__MP = {
  saveStateNow,
  loadSettings: () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"),
  clearSettings: () => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  },
};
