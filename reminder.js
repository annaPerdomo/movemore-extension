const stretchList = document.getElementById("stretchList");
const timerDisplay = document.getElementById("timer");
const timerRing = document.getElementById("timerRing");
const timerGlow = document.getElementById("timerGlow");
const startBtn = document.getElementById("startBtn");
const skipBtn = document.getElementById("skipBtn");
const activeScreen = document.getElementById("activeScreen");
const doneScreen = document.getElementById("doneScreen");
const doneMessage = document.getElementById("doneMessage");
const motivationalEl = document.getElementById("motivational");
const closeBtn = document.getElementById("closeBtn");

const CIRCUMFERENCE = 2 * Math.PI * 84;

const MOTIVATIONAL_QUOTES = [
  "Small breaks lead to big breakthroughs.",
  "You can't pour from an empty cup. Rest refills it.",
  "Movement is medicine for the mind.",
  "The best code is written by people who take care of themselves.",
  "Your posture today is your health tomorrow.",
  "A 2-minute break now saves hours of back pain later.",
  "Sitting is the new smoking. You just put it out.",
  "Your future self just sent a thank-you note.",
  "Consistency beats intensity. One stretch at a time.",
  "You showed up for yourself. That's the hardest part.",
];

let totalSeconds = 120;
let remainingSeconds = totalSeconds;
let timerInterval = null;

// Build a stretch card — uses video if available, SVG illustration otherwise
function buildStretchCard(stretch) {
  const card = document.createElement("div");
  card.className = "stretch-card";

  const videoId = getVideoId(stretch.name);

  const infoHTML = `
    <div class="stretch-info">
      <div class="stretch-header">
        <span class="stretch-name">${stretch.name}</span>
        <span class="stretch-duration">${stretch.duration}</span>
      </div>
      <div class="stretch-focus">${stretch.focus}</div>
      <p class="stretch-description">${stretch.description}</p>
    </div>
  `;

  if (videoId) {
    card.classList.add("has-video");
    card.innerHTML = `
      <div class="video-wrapper" data-video-id="${videoId}">
        <img
          class="video-thumb"
          src="https://img.youtube.com/vi/${videoId}/mqdefault.jpg"
          alt="${stretch.name} demonstration"
        >
        <div class="video-play">
          <div class="video-play-circle">
            <svg viewBox="0 0 24 24" fill="#2d6b6b"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
      ${infoHTML}
    `;

    // Open video in new tab (iframes blocked on chrome-extension:// pages)
    const wrapper = card.querySelector(".video-wrapper");
    wrapper.addEventListener("click", () => {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
    });
  } else {
    card.innerHTML = `
      <div class="stretch-illustration">${getStretchSVG(stretch.name)}</div>
      ${infoHTML}
    `;
  }

  return card;
}

// Load stretches from storage
chrome.storage.local.get("currentStretches", (data) => {
  const stretches = data.currentStretches || [];

  let totalTime = 0;
  stretches.forEach((s) => {
    const match = s.duration.match(/(\d+)/);
    if (match) totalTime += parseInt(match[1], 10);
  });
  totalSeconds = Math.max(totalTime + 15, 60);
  remainingSeconds = totalSeconds;
  updateTimerDisplay();

  stretches.forEach((stretch) => {
    stretchList.appendChild(buildStretchCard(stretch));
  });
});

function updateTimerDisplay() {
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;

  const progress = (totalSeconds - remainingSeconds) / totalSeconds;
  const offset = CIRCUMFERENCE * (1 - progress);
  timerRing.style.strokeDashoffset = offset;
  timerGlow.style.strokeDashoffset = offset;
}

function startTimer() {
  startBtn.textContent = "Stretching...";
  startBtn.disabled = true;
  startBtn.style.opacity = "0.6";
  startBtn.style.cursor = "default";

  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      showDone();
    }
  }, 1000);
}

function showDone() {
  activeScreen.classList.add("fade-out");

  setTimeout(() => {
    activeScreen.style.display = "none";
    doneScreen.style.display = "block";
    launchConfetti();
  }, 400);

  chrome.storage.local.get("streak", (data) => {
    const streak = data.streak || 0;
    doneMessage.textContent = `That's ${streak} stretch break${streak === 1 ? "" : "s"} completed today. Keep it going!`;
  });

  motivationalEl.textContent =
    MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}

// Confetti — green / pink / gold theme
function launchConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = [
    "#5eaaa8", "#a8d8d8", "#d4eded",
    "#e8929a", "#f2b5c8", "#f8d0dc",
    "#c9a8b8", "#fefaf6",
  ];
  const particles = [];

  for (let i = 0; i < 100; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 9 + 4;
    particles.push({
      x: canvas.width / 2,
      y: canvas.height * 0.38,
      vx: Math.cos(angle) * speed * (0.6 + Math.random() * 0.8),
      vy: Math.sin(angle) * speed - 3,
      w: Math.random() * 8 + 4,
      h: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 14,
      gravity: 0.12 + Math.random() * 0.06,
      opacity: 1,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.99;
      p.rotation += p.rotSpeed;
      p.opacity -= 0.007;

      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    }

    if (alive) requestAnimationFrame(animate);
    else canvas.remove();
  }

  requestAnimationFrame(animate);
}

startBtn.addEventListener("click", startTimer);

skipBtn.addEventListener("click", () => {
  chrome.storage.local.get("streak", (data) => {
    const streak = Math.max((data.streak || 1) - 1, 0);
    chrome.storage.local.set({ streak });
  });
  window.close();
});

closeBtn.addEventListener("click", () => {
  window.close();
});
