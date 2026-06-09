const cursorGlow = document.getElementById('cursorGlow');
const mobileCursor = document.getElementById('mobileCursor');
const flipCards = document.querySelectorAll('.flip-card');
const nameSplit = document.querySelector('.name-split');

let mobileCursorTargetX = 0;
let mobileCursorTargetY = 0;
let mobileCursorCurrentX = 0;
let mobileCursorCurrentY = 0;
let mobileCursorRaf = null;

if (nameSplit) {
  nameSplit.innerHTML = Array.from(nameSplit.textContent).map((char, index) => {
    const safeChar = char === ' ' ? '&nbsp;' : char;
    return `<span class="name-char" style="--i:${index}">${safeChar}</span>`;
  }).join('');
}

flipCards.forEach((card) => {
  card.addEventListener('click', () => {
    card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', String(card.classList.contains('is-flipped')));
  });
});

function moveCursor(event) {
  if (!cursorGlow || window.matchMedia('(max-width: 640px)').matches) return;
  const point = event.touches?.[0] || event;
  cursorGlow.style.left = `${point.clientX}px`;
  cursorGlow.style.top = `${point.clientY}px`;
  cursorGlow.style.opacity = '1';
  cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
}

function updateMobileCursor() {
  if (!mobileCursor) return;

  const easing = 0.18;
  mobileCursorCurrentX += (mobileCursorTargetX - mobileCursorCurrentX) * easing;
  mobileCursorCurrentY += (mobileCursorTargetY - mobileCursorCurrentY) * easing;

  mobileCursor.style.left = `${mobileCursorCurrentX}px`;
  mobileCursor.style.top = `${mobileCursorCurrentY}px`;

  if (Math.abs(mobileCursorTargetX - mobileCursorCurrentX) > 0.2 ||
      Math.abs(mobileCursorTargetY - mobileCursorCurrentY) > 0.2) {
    mobileCursorRaf = window.requestAnimationFrame(updateMobileCursor);
  } else {
    mobileCursorRaf = null;
  }
}

function startSmoothMobileCursor(point) {
  if (!mobileCursor) return;

  mobileCursorTargetX = point.clientX;
  mobileCursorTargetY = point.clientY;
  mobileCursorCurrentX = point.clientX;
  mobileCursorCurrentY = point.clientY;

  mobileCursor.classList.add('active');
  if (!mobileCursorRaf) {
    mobileCursorRaf = window.requestAnimationFrame(updateMobileCursor);
  }
}

window.addEventListener('pointermove', moveCursor, { passive: true });
window.addEventListener('touchmove', moveCursor, { passive: true });

window.addEventListener('mouseleave', () => {
  if (cursorGlow) cursorGlow.style.opacity = '0';
});

window.addEventListener('pointerleave', () => {
  if (cursorGlow) cursorGlow.style.opacity = '0';
});

window.addEventListener('blur', () => {
  if (cursorGlow) cursorGlow.style.opacity = '0';
});

window.addEventListener('touchstart', (event) => {
  const touch = event.touches[0];
  if (touch) {
    startSmoothMobileCursor(touch);
    const ripple = document.createElement('span');
    ripple.className = 'touch-ripple';
    ripple.style.left = `${touch.clientX}px`;
    ripple.style.top = `${touch.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }
}, { passive: true });

window.addEventListener('touchmove', (event) => {
  const touch = event.touches[0];
  if (touch && mobileCursor) {
    mobileCursorTargetX = touch.clientX;
    mobileCursorTargetY = touch.clientY;
    mobileCursor.classList.add('active');
    if (!mobileCursorRaf) {
      mobileCursorRaf = window.requestAnimationFrame(updateMobileCursor);
    }
  }
}, { passive: true });

window.addEventListener('touchend', () => {
  if (mobileCursor) {
    mobileCursor.classList.remove('active');
  }
  if (mobileCursorRaf) {
    window.cancelAnimationFrame(mobileCursorRaf);
    mobileCursorRaf = null;
  }
}, { passive: true });

window.addEventListener('pointerdown', (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.transform = 'translate(-50%, -50%) scale(0.92)';
  if (event.pointerType === 'touch') {
    moveCursor(event);
  }
});

window.addEventListener('pointerup', () => {
  if (cursorGlow) cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
});

const style = document.createElement('style');
style.textContent = `
  .touch-ripple {
    position: fixed;
    width: 12px; height: 12px;
    border-radius: 50%;
    background: rgba(125, 211, 252, 0.28);
    border: 1px solid rgba(125, 211, 252, 0.45);
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 9;
    animation: ripple 0.7s ease-out forwards;
  }
  @keyframes ripple {
    from { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
    to { transform: translate(-50%, -50%) scale(18); opacity: 0; }
  }
  @keyframes shimmer {
    100% { transform: translateX(110%); }
  }
`;
document.head.appendChild(style);
