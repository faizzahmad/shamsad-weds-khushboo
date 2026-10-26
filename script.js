// === Islamic Banner Slideshow ===
(function(){
  const slides = document.querySelectorAll('.banner-slide');
  const dots   = document.querySelectorAll('.slide-dot');
  let current  = 0;
  let timer;

  function goTo(idx){
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next(){ goTo(current + 1); }

  function startAuto(){ timer = setInterval(next, 5000); }

  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    clearInterval(timer);
    goTo(i);
    startAuto();
  }));

  startAuto();
})();

const cover = document.getElementById('cover');
document.getElementById('openInvite').addEventListener('click', () => {
  cover.classList.add('opening');
  setTimeout(() => { cover.classList.add('opened'); document.querySelector('.cover-page').scrollIntoView({behavior:'smooth'}); }, 850);
});
document.querySelectorAll('[data-scroll]').forEach(button => button.addEventListener('click', () => {
  const target=document.querySelector(button.dataset.scroll); if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
}));

// Countdown to the Nikah date (India Standard Time).
function updateCountdown(){
 const distance=Math.max(0,new Date('2026-10-31T00:00:00+05:30').getTime()-Date.now());
 document.getElementById('days').textContent=String(Math.floor(distance/86400000)).padStart(2,'0');
 document.getElementById('hours').textContent=String(Math.floor(distance%86400000/3600000)).padStart(2,'0');
 document.getElementById('minutes').textContent=String(Math.floor(distance%3600000/60000)).padStart(2,'0');
 document.getElementById('seconds').textContent=String(Math.floor(distance%60000/1000)).padStart(2,'0');
}
updateCountdown();setInterval(updateCountdown,1000);

// Scratch-to-reveal — full-cover canvas with decorative heart, requires thorough scratching.
const canvas = document.getElementById('scratchCanvas');
const ctx    = canvas.getContext('2d');
let drawing = false, revealed = false;

function drawHeartOutline(cx, cy, w, h){
  ctx.beginPath();
  const topY = cy - h * 0.25;
  ctx.moveTo(cx, cy + h * 0.35);
  ctx.bezierCurveTo(cx - w*0.55, cy,      cx - w*0.55, topY - h*0.1, cx - w*0.28, topY - h*0.1);
  ctx.bezierCurveTo(cx - w*0.1,  topY - h*0.1, cx, topY + h*0.05, cx, topY + h*0.15);
  ctx.bezierCurveTo(cx,          topY + h*0.05, cx + w*0.1, topY - h*0.1, cx + w*0.28, topY - h*0.1);
  ctx.bezierCurveTo(cx + w*0.55, topY - h*0.1, cx + w*0.55, cy, cx, cy + h*0.35);
  ctx.closePath();
}

function paintScratch(){
  const rect  = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width  = Math.max(1, Math.round(rect.width  * ratio));
  canvas.height = Math.max(1, Math.round(rect.height * ratio));
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const W = rect.width, H = rect.height;
  const cx = W / 2, cy = H / 2;

  // 1. Fill the ENTIRE rectangle — completely hides message underneath
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0,    '#c9716e');
  grad.addColorStop(0.35, '#e8b8b5');
  grad.addColorStop(0.65, '#d9a0aa');
  grad.addColorStop(1,    '#a84f62');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // 2. Fine noise / shimmer
  ctx.globalAlpha = 0.18;
  for(let i = 0; i < 300; i++){
    ctx.beginPath();
    ctx.arc(Math.random()*W, Math.random()*H, Math.random()*1.4 + 0.3, 0, Math.PI*2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 3. Gold decorative heart outline (not a clip — purely visual)
  drawHeartOutline(cx, cy, W * 0.78, H * 0.78);
  const heartGrad = ctx.createLinearGradient(0, 0, W, H);
  heartGrad.addColorStop(0,   '#f0d080');
  heartGrad.addColorStop(0.5, '#c8a040');
  heartGrad.addColorStop(1,   '#f0d080');
  ctx.strokeStyle = heartGrad;
  ctx.lineWidth   = 3;
  ctx.shadowColor = '#b8900080';
  ctx.shadowBlur  = 6;
  ctx.stroke();
  ctx.shadowBlur  = 0;

  // 4. Fill heart with a slightly lighter tint
  drawHeartOutline(cx, cy, W * 0.78, H * 0.78);
  const innerGrad = ctx.createRadialGradient(cx, cy - H*0.05, H*0.05, cx, cy, H*0.5);
  innerGrad.addColorStop(0,   '#e8c0bc55');
  innerGrad.addColorStop(1,   '#b06070aa');
  ctx.fillStyle = innerGrad;
  ctx.fill();

  // 5. Instruction text inside heart
  ctx.fillStyle   = '#fff5ee';
  ctx.textAlign   = 'center';
  ctx.shadowColor = '#80203040';
  ctx.shadowBlur  = 4;
  ctx.font        = 'bold 14px Georgia';
  ctx.fillText('♥  SCRATCH HERE  ♥', cx, cy - 12);
  ctx.font        = '11px Georgia';
  ctx.fillStyle   = '#ffe0d8';
  ctx.fillText('Scratch the whole area to reveal', cx, cy + 10);
  ctx.shadowBlur  = 0;
}

function checkReveal(){
  if(revealed) return;
  // Sample every 8th pixel for performance (covers entire canvas)
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let total = 0, transparent = 0;
  for(let i = 3; i < data.length; i += 32){ // alpha channel, every 8th pixel
    total++;
    if(data[i] < 15) transparent++;
  }
  // Only reveal when 85% of the whole canvas is cleared
  if(total > 0 && transparent / total > 0.85){
    revealed = true;
    canvas.style.transition = 'opacity 1s ease';
    canvas.style.opacity    = '0';
  }
}

function getXY(e){
  const r = canvas.getBoundingClientRect();
  const src = e.touches ? e.touches[0] : e;
  return { x: src.clientX - r.left, y: src.clientY - r.top };
}

function doScratch(e){
  if(!drawing || revealed) return;
  const { x, y } = getXY(e);
  ctx.globalCompositeOperation = 'destination-out';
  // Large brush so user can cover area reasonably
  ctx.beginPath();
  ctx.arc(x, y, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  checkReveal();
}

canvas.addEventListener('pointerdown',  e => { drawing = true; canvas.setPointerCapture(e.pointerId); doScratch(e); });
canvas.addEventListener('pointermove',  doScratch);
canvas.addEventListener('pointerup',    () => drawing = false);
canvas.addEventListener('pointercancel',() => drawing = false);

paintScratch();
window.addEventListener('resize', () => { if(!revealed) paintScratch(); });

// Wish form opens WhatsApp with the entered message; no data is stored by this static site.
document.getElementById('wishForm').addEventListener('submit',e=>{
 e.preventDefault();const data=new FormData(e.currentTarget);
 const message=`Wedding wishes for Md Shamsad & Khushboo Parween%0AName: ${encodeURIComponent(data.get('name'))}%0AAttendance: ${encodeURIComponent(data.get('attendance'))}%0AEmail: ${encodeURIComponent(data.get('email')||'Not provided')}%0AMessage: ${encodeURIComponent(data.get('message')||'Best wishes and duas!')}`;
 window.open('https://wa.me/917549917851?text='+message,'_blank','noopener');
});
// Sound toggle is intentionally visual-only until an audio file is supplied.
const music=document.getElementById('musicToggle');let musicOn=false;
music.addEventListener('click',()=>{musicOn=!musicOn;music.textContent=musicOn?'♪':'♫';music.style.background=musicOn?'#9c5865':'#762e3d';music.title=musicOn?'No music file added yet':'Toggle music'});
