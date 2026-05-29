let currentScreen = 1;
let currentPhoto = 1;
let musicStarted = false;
let typingStarted = false;

let gameStarted = false;
let score = 0;
let heartTimer = null;

const totalScreens = 7;
const totalPhotos = 6;

const messageText =
  "Пап, с днём рождения. Твой день рождения был 22-го, а отмечаем мы 30-го, но для нас главное не дата, а то, что сегодня ты рядом. Мы очень рады, что ты приехал домой в отпуск. Для нас важно просто видеть тебя, слышать твой голос и понимать, что ты дома. Спасибо тебе за силу, терпение, поддержку и за всё, что ты делаешь для нашей семьи. Мы гордимся тобой. Мы ценим тебя. Мы тебя очень любим.";

const captions = [
  "22-го был день рождения, а 30-го мы отмечаем главное — что ты рядом.",
  "Есть моменты, которые хочется сохранить навсегда.",
  "Семья — это место, где тебя всегда ждут.",
  "Сегодня не просто праздник. Сегодня папа дома.",
  "Спасибо за всё, что ты делаешь для нас.",
  "Папа, мы тобой гордимся."
];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("screen-1").classList.add("show");
  updateProgress();
  startParticles();
});

function startGift() {
  startMusicSoft();
  nextScreen();
}

function startMusicSoft() {
  const music = document.getElementById("music");

  music.volume = 0;

  music.play().then(() => {
    musicStarted = true;
    fadeMusicTo(0.45, 1800);
  }).catch(() => {
    musicStarted = false;
  });
}

function fadeMusicTo(targetVolume, duration) {
  const music = document.getElementById("music");
  const steps = 30;
  const stepTime = duration / steps;
  const volumeStep = targetVolume / steps;

  let currentStep = 0;

  const fade = setInterval(() => {
    currentStep++;
    music.volume = Math.min(targetVolume, volumeStep * currentStep);

    if (currentStep >= steps) {
      clearInterval(fade);
      music.volume = targetVolume;
    }
  }, stepTime);
}

function toggleMusic() {
  const music = document.getElementById("music");

  if (!musicStarted) {
    startMusicSoft();
    return;
  }

  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
}

function nextScreen() {
  if (currentScreen >= totalScreens) return;

  const oldScreen = document.getElementById(`screen-${currentScreen}`);
  oldScreen.classList.add("hide");

  setTimeout(() => {
    oldScreen.classList.remove("active", "show", "hide");

    currentScreen++;

    const newScreen = document.getElementById(`screen-${currentScreen}`);
    newScreen.classList.add("active");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    setTimeout(() => {
      newScreen.classList.add("show");
    }, 20);

    updateProgress();

    if (currentScreen === 2 && !typingStarted) {
      typingStarted = true;
      typeMessage();
    }

    if (currentScreen === 7) {
      setTimeout(() => {
        comboEffect();
      }, 700);
    }
  }, 380);
}

function goToFinal() {
  if (heartTimer) {
    clearInterval(heartTimer);
    heartTimer = null;
  }

  const oldScreen = document.getElementById(`screen-${currentScreen}`);
  oldScreen.classList.add("hide");

  setTimeout(() => {
    oldScreen.classList.remove("active", "show", "hide");

    currentScreen = 7;

    const finalScreen = document.getElementById("screen-7");
    finalScreen.classList.add("active");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    setTimeout(() => {
      finalScreen.classList.add("show");
    }, 20);

    updateProgress();

    setTimeout(() => {
      comboEffect();
    }, 700);
  }, 380);
}

function updateProgress() {
  const percent = Math.round(((currentScreen - 1) / (totalScreens - 1)) * 100);
  document.getElementById("progressFill").style.width = percent + "%";
  document.getElementById("progressPercent").textContent = percent + "%";
}

function typeMessage() {
  const element = document.getElementById("typingText");
  element.textContent = "";

  let index = 0;

  const timer = setInterval(() => {
    element.textContent += messageText[index];
    index++;

    if (index >= messageText.length) {
      clearInterval(timer);
    }
  }, 28);
}

function nextPhoto() {
  currentPhoto++;

  if (currentPhoto > totalPhotos) {
    currentPhoto = 1;
  }

  updatePhoto();
}

function prevPhoto() {
  currentPhoto--;

  if (currentPhoto < 1) {
    currentPhoto = totalPhotos;
  }

  updatePhoto();
}

function updatePhoto() {
  const img = document.getElementById("photo");
  const placeholder = document.getElementById("placeholder");
  const caption = document.getElementById("caption");

  img.style.display = "block";
  placeholder.style.display = "none";

  img.src = `assets/photo${currentPhoto}.jpg?time=${Date.now()}`;
  caption.textContent = captions[currentPhoto - 1];

  img.style.animation = "none";
  img.offsetHeight;
  img.style.animation = "photoIn .45s ease";
}

function showPlaceholder() {
  const img = document.getElementById("photo");
  const placeholder = document.getElementById("placeholder");

  img.style.display = "none";
  placeholder.style.display = "flex";
}

function startMiniGame() {
  if (gameStarted) return;

  gameStarted = true;
  score = 0;

  document.getElementById("score").textContent = score;
  document.getElementById("gameStatus").textContent = "Игра идёт";

  const field = document.getElementById("gameField");
  field.innerHTML = "";

  spawnHeart();

  heartTimer = setInterval(() => {
    spawnHeart();
  }, 900);
}

function spawnHeart() {
  const field = document.getElementById("gameField");

  const heart = document.createElement("button");
  heart.className = "game-heart";
  heart.textContent = "❤️";

  const size = 54;
  const maxX = Math.max(10, field.clientWidth - size);
  const maxY = Math.max(10, field.clientHeight - size);

  heart.style.left = Math.random() * maxX + "px";
  heart.style.top = Math.random() * maxY + "px";

  heart.onclick = () => {
    score++;
    document.getElementById("score").textContent = score;

    heart.classList.add("collected");

    setTimeout(() => {
      heart.remove();
    }, 180);

    if (score >= 10) {
      finishMiniGame();
    }
  };

  field.appendChild(heart);

  setTimeout(() => {
    if (heart && heart.parentElement) {
      heart.remove();
    }
  }, 1700);
}

function finishMiniGame() {
  if (heartTimer) {
    clearInterval(heartTimer);
    heartTimer = null;
  }

  document.getElementById("gameStatus").textContent = "Финал открыт";

  setTimeout(() => {
    goToFinal();
  }, 700);
}

function skipMiniGame() {
  goToFinal();
}

function heartRain() {
  const box = document.getElementById("fireworks");

  for (let i = 0; i < 55; i++) {
    const heart = document.createElement("div");
    heart.className = "fall-heart";
    heart.textContent = randomHeart();

    heart.style.left = Math.random() * window.innerWidth + "px";
    heart.style.animationDuration = 2.5 + Math.random() * 2.5 + "s";
    heart.style.fontSize = 22 + Math.random() * 28 + "px";

    box.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 5500);
  }
}

function fireworks() {
  createBurst(window.innerWidth / 2, window.innerHeight / 2);

  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      createBurst(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight * 0.65 + 80
      );
    }, i * 350);
  }
}

function comboEffect() {
  heartRain();

  setTimeout(() => {
    fireworks();
  }, 450);

  setTimeout(() => {
    heartRain();
  }, 1300);
}

function createBurst(x, y) {
  const box = document.getElementById("fireworks");

  for (let i = 0; i < 90; i++) {
    const spark = document.createElement("div");
    spark.className = "spark";

    spark.style.left = x + "px";
    spark.style.top = y + "px";

    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 280;

    spark.style.setProperty("--x", Math.cos(angle) * distance + "px");
    spark.style.setProperty("--y", Math.sin(angle) * distance + "px");
    spark.style.background = randomColor();

    box.appendChild(spark);

    setTimeout(() => {
      spark.remove();
    }, 1300);
  }
}

function randomColor() {
  const colors = ["#f2d77e", "#ffffff", "#9ed36b", "#d5c07a", "#ff7b61"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function randomHeart() {
  const hearts = ["❤️", "💛", "🤍", "⭐", "✨"];
  return hearts[Math.floor(Math.random() * hearts.length)];
}

function startParticles() {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");

  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particles = [];

    const count = window.innerWidth < 768 ? 45 : 85;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.45 + 0.15,
        opacity: Math.random() * 0.45 + 0.15
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 205, 145, ${p.opacity})`;
      ctx.fill();

      p.y -= p.speed;

      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);

  resize();
  draw();
}
