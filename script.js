const aboutFab = document.getElementById('aboutFab');
const aboutPanel = document.getElementById('aboutPanel');
const cursorGlow = document.getElementById('cursorGlow');

aboutFab?.addEventListener('click', () => {
  aboutPanel.classList.toggle('open');
});

function moveCursor(event) {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
  cursorGlow.style.opacity = '1';
}

window.addEventListener('mousemove', moveCursor);
window.addEventListener('touchmove', (event) => {
  const touch = event.touches[0];
  if (touch) {
    moveCursor({ clientX: touch.clientX, clientY: touch.clientY });
  }
}, { passive: true });

window.addEventListener('mouseleave', () => {
  cursorGlow.style.opacity = '0';
});

window.addEventListener('touchstart', (event) => {
  const touch = event.touches[0];
  if (touch) {
    const ripple = document.createElement('span');
    ripple.className = 'touch-ripple';
    ripple.style.left = `${touch.clientX}px`;
    ripple.style.top = `${touch.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }
}, { passive: true });

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
`;
document.head.appendChild(style);
