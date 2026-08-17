// glass-card.js
// The card is a window onto a refracted duplicate of the background video.
// Every frame we position an off-screen canvas so its pixels line up 1:1
// with the real video behind the card, draw the current video frame into
// it, and let the CSS `filter: url(#liquid-glass-refraction)` on the
// canvas do the refraction on composite. The card's own overflow:hidden
// + border-radius clip the result to the card's silhouette.

const DUP_PIXEL_RATIO = 1;

const video = document.getElementById('bg-video');
const card = document.querySelector('[data-glass-card]');
const dupContainer = document.getElementById('dup-video-container');
const dupCanvas = document.getElementById('dup-image');

let ctx = null;
let lastW = 0;
let lastH = 0;

function ensureContext() {
  if (!ctx) {
    ctx = dupCanvas.getContext('2d');
  }
  return ctx;
}

function tick() {
  requestAnimationFrame(tick);

  if (!card || !dupContainer || !dupCanvas) return;

  const rect = card.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;
  if (!video.videoWidth || !video.videoHeight) return;

  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  // Position the duplicate so it spans the full viewport, offset into
  // the card's own coordinate space by the card's negative position.
  // Because the container is absolutely positioned inside the card,
  // this negative offset lands it exactly over the viewport origin.
  dupContainer.style.left = `-${rect.left}px`;
  dupContainer.style.top = `-${rect.top}px`;
  dupContainer.style.width = `${vw}px`;
  dupContainer.style.height = `${vh}px`;

  // Sizing the duplicate to the viewport rather than to the card is
  // deliberate. The filter shifts each colour channel by a different
  // amount, so the filtered element's own leading edges show hard
  // channel-separation bands. At viewport size those bands fall
  // outside the card and only clean refraction shows.

  const targetW = Math.round(vw * DUP_PIXEL_RATIO);
  const targetH = Math.round(vh * DUP_PIXEL_RATIO);

  if (targetW !== lastW || targetH !== lastH) {
    dupCanvas.width = targetW;
    dupCanvas.height = targetH;
    dupCanvas.style.width = `${vw}px`;
    dupCanvas.style.height = `${vh}px`;
    lastW = targetW;
    lastH = targetH;
  }

  // The duplicate stays at 1x even on retina: the SVG filter's cost
  // scales with pixel count, and what shows through is a soft
  // refraction where 4x the filter work buys nothing.

  const context = ensureContext();

  try {
    const cover = Math.max(vw / video.videoWidth, vh / video.videoHeight);
    const sw = vw / cover;
    const sh = vh / cover;
    const sx = (video.videoWidth - sw) / 2;
    const sy = (video.videoHeight - sh) / 2;
    context.drawImage(video, sx, sy, sw, sh, 0, 0, targetW, targetH);
  } catch (err) {
    // A frame may not be decodable yet — skip and try again next tick.
  }
}

requestAnimationFrame(tick);
