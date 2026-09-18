// Particle canvas animation
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let burstParticles = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

// Ambient Blue Particle Class
class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 2.2 + 0.6;
    this.speedX = (Math.random() - 0.5) * 0.45;
    this.speedY = (Math.random() - 0.5) * 0.45;
    this.opacity = Math.random() * 0.55 + 0.2;
    const blueTones = [
      'rgba(56, 189, 248,',  // sky blue
      'rgba(37, 99, 235,',   // royal blue
      'rgba(14, 165, 233,',  // cyan blue
      'rgba(186, 230, 253,'  // icy light blue
    ];
    this.color = blueTones[Math.floor(Math.random() * blueTones.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `${this.color}${this.opacity})`;
    ctx.fill();
  }
}

// Spark / Burst Particle Class (Blue sparks triggered on click)
class BurstParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 4.5 + 2;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 2.5;
    this.speedX = Math.cos(angle) * speed;
    this.speedY = Math.sin(angle) * speed;
    this.opacity = 1;
    this.decay = Math.random() * 0.02 + 0.015;
    const colors = [
      'rgba(56, 189, 248,',  // bright cyan
      'rgba(37, 99, 235,',   // royal electric blue
      'rgba(2, 132, 199,',   // ocean blue
      'rgba(147, 197, 253,', // light baby blue
      'rgba(255, 255, 255,'  // white spark
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedX *= 0.95;
    this.speedY *= 0.95;
    this.opacity -= this.decay;
  }

  draw() {
    if (this.opacity <= 0) return;
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `${this.color}${this.opacity})`;
    ctx.shadowBlur = 12;
    ctx.shadowColor = `${this.color}1)`;
    ctx.fill();
    ctx.restore();
  }
}

// Initialize ambient particles
const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 13000), 80);
for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

// Animation Loop
function animate() {
  ctx.clearRect(0, 0, width, height);

  // Update & draw ambient particles
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  // Update & draw burst particles
  for (let i = burstParticles.length - 1; i >= 0; i--) {
    const bp = burstParticles[i];
    bp.update();
    bp.draw();
    if (bp.opacity <= 0) {
      burstParticles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

animate();

// 3D Card Tilt Effect
const card = document.getElementById('idea-card');

function handleMouseMove(e) {
  const rect = card.getBoundingClientRect();
  const cardCenterX = rect.left + rect.width / 2;
  const cardCenterY = rect.top + rect.height / 2;

  const mouseX = e.clientX - cardCenterX;
  const mouseY = e.clientY - cardCenterY;

  const maxRotate = 9;
  const rotateY = (mouseX / (window.innerWidth / 2)) * maxRotate;
  const rotateX = -(mouseY / (window.innerHeight / 2)) * maxRotate;

  card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px)`;
}

function handleMouseLeave() {
  card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
}

window.addEventListener('mousemove', handleMouseMove);
card.addEventListener('mouseleave', handleMouseLeave);

// Click Burst Effect
function createBurst(x, y, count = 32) {
  for (let i = 0; i < count; i++) {
    burstParticles.push(new BurstParticle(x, y));
  }
}

card.addEventListener('click', (e) => {
  // If clicked directly on the button, let the button handler handle it
  if (e.target.closest('#next-btn')) return;

  createBurst(e.clientX, e.clientY, 40);
  
  // Subtle bounce on click
  card.style.transform = 'perspective(1000px) scale(0.975)';
  setTimeout(() => {
    handleMouseMove(e);
  }, 120);
});

window.addEventListener('click', (e) => {
  if (e.target !== card && !card.contains(e.target)) {
    createBurst(e.clientX, e.clientY, 18);
  }
});

// Motivational Quotes & Next Sentence Handler
const quotes = [
  {
    title: "오늘도 힘내세요!",
    subtitle: "모든 위대한 여정은 작은 생각의 불꽃에서 시작됩니다.",
    badge: "DAILY INSPIRATION"
  },
  {
    title: "당신은 빛나는 사람",
    subtitle: "어둠 속에서도 길을 잃지 않는 별처럼, 스스로를 믿으세요.",
    badge: "SELF BELIEF"
  },
  {
    title: "작은 한 걸음의 힘",
    subtitle: "천 리 길도 한 걸음부터! 오늘 실천한 작은 일이 내일을 바꿉니다.",
    badge: "SMALL STEPS"
  },
  {
    title: "포기하지 마세요",
    subtitle: "가장 어두운 밤이 지나면, 반드시 눈부신 아침 햇살이 찾아옵니다.",
    badge: "HOPE & COURAGE"
  },
  {
    title: "새로운 시작의 날",
    subtitle: "어제의 아쉬움은 털어내고, 오늘을 설렘과 열정으로 채워보세요.",
    badge: "FRESH START"
  },
  {
    title: "스스로를 칭찬하기",
    subtitle: "여기까지 걸어온 것만으로도 당신은 이미 충분히 훌륭합니다.",
    badge: "YOU ARE AMAZING"
  }
];

let currentQuoteIndex = 0;
const titleElement = document.getElementById('idea-title');
const subtitleElement = document.getElementById('idea-subtitle');
const badgeTextElement = document.querySelector('#idea-badge span:last-child');
const nextBtn = document.getElementById('next-btn');

function changeQuote(e) {
  if (e) {
    e.stopPropagation();
    createBurst(e.clientX, e.clientY, 35);
  }

  currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
  const nextQuote = quotes[currentQuoteIndex];

  // Smooth fade transition
  titleElement.style.opacity = '0';
  titleElement.style.transform = 'translateY(-8px)';
  titleElement.style.transition = 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
  
  subtitleElement.style.opacity = '0';
  subtitleElement.style.transform = 'translateY(8px)';
  subtitleElement.style.transition = 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)';

  setTimeout(() => {
    titleElement.innerHTML = `<span class="gradient-text">${nextQuote.title}</span>`;
    subtitleElement.textContent = nextQuote.subtitle;
    if (badgeTextElement) {
      badgeTextElement.textContent = nextQuote.badge;
    }

    titleElement.style.opacity = '1';
    titleElement.style.transform = 'translateY(0)';
    subtitleElement.style.opacity = '1';
    subtitleElement.style.transform = 'translateY(0)';
  }, 220);
}

if (nextBtn) {
  nextBtn.addEventListener('click', changeQuote);
}
