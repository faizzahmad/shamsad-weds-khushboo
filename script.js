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

// Scratch-to-reveal interaction using a canvas.
const canvas=document.getElementById('scratchCanvas'), ctx=canvas.getContext('2d');
let drawing=false, scratched=0;
function paintScratch(){
 const rect=canvas.getBoundingClientRect(), ratio=window.devicePixelRatio||1;
 canvas.width=Math.max(1,Math.round(rect.width*ratio));canvas.height=Math.max(1,Math.round(rect.height*ratio));
 ctx.setTransform(ratio,0,0,ratio,0,0);
 const grad=ctx.createLinearGradient(0,0,rect.width,rect.height);grad.addColorStop(0,'#d7b5b5');grad.addColorStop(.5,'#f4e7df');grad.addColorStop(1,'#c89da2');
 ctx.fillStyle=grad;ctx.fillRect(0,0,rect.width,rect.height);
 ctx.fillStyle='#9b6b70';ctx.textAlign='center';ctx.font='12px Georgia';ctx.fillText('✧  SCRATCH HERE  ✧',rect.width/2,rect.height/2);
 ctx.globalAlpha=.28;for(let i=0;i<150;i++){ctx.beginPath();ctx.arc(Math.random()*rect.width,Math.random()*rect.height,Math.random()*1.3,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill()}ctx.globalAlpha=1;
}
function scratch(e){if(!drawing)return;const r=canvas.getBoundingClientRect();const x=(e.clientX-r.left),y=(e.clientY-r.top);ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(x,y,23,0,Math.PI*2);ctx.fill();scratched++;if(scratched>35)canvas.style.opacity='0';}
canvas.addEventListener('pointerdown',e=>{drawing=true;canvas.setPointerCapture(e.pointerId);scratch(e)});
canvas.addEventListener('pointermove',scratch);canvas.addEventListener('pointerup',()=>drawing=false);canvas.addEventListener('pointercancel',()=>drawing=false);
paintScratch();window.addEventListener('resize',()=>{if(canvas.style.opacity!=='0')paintScratch()});

// Wish form opens WhatsApp with the entered message; no data is stored by this static site.
document.getElementById('wishForm').addEventListener('submit',e=>{
 e.preventDefault();const data=new FormData(e.currentTarget);
 const message=`Wedding wishes for Md Shamsad & Khushboo Parween%0AName: ${encodeURIComponent(data.get('name'))}%0AAttendance: ${encodeURIComponent(data.get('attendance'))}%0AEmail: ${encodeURIComponent(data.get('email')||'Not provided')}%0AMessage: ${encodeURIComponent(data.get('message')||'Best wishes and duas!')}`;
 window.open('https://wa.me/917549917851?text='+message,'_blank','noopener');
});
// Sound toggle is intentionally visual-only until an audio file is supplied.
const music=document.getElementById('musicToggle');let musicOn=false;
music.addEventListener('click',()=>{musicOn=!musicOn;music.textContent=musicOn?'♪':'♫';music.style.background=musicOn?'#9c5865':'#762e3d';music.title=musicOn?'No music file added yet':'Toggle music'});
