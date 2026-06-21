import {
  accentForMaterial,
  rhLimitForMaterial,
  rhTrendGlyph,
  rhZone,
  statusIcon,
  statusMessage,
  statusRingClass,
} from './climate.js';

const SCREENS = ['metrics', 'status', 'identity', 'qr'];
const SCREEN_LABELS = ['Metrics', 'Status', 'Identity', 'QR'];

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

function dotsFull(activeIndex) {
  const wrap = el('div', 'dots-full');
  for (let i = 0; i < 4; i++) {
    const d = el('div', `dot ${i === activeIndex ? 'md active' : 'sm'}`);
    wrap.appendChild(d);
  }
  return wrap;
}

function dotsAuto(onStatus) {
  const wrap = el('div', 'dots-auto');
  for (let i = 0; i < 2; i++) {
    const active = i === 1 ? onStatus : !onStatus;
    const d = el('div', `dot ${active ? 'md active' : 'sm'}`);
    wrap.appendChild(d);
  }
  return wrap;
}

function miniHeader(state) {
  const h = el('div', 'mini-header');
  const mat = el('span', 'mat', state.material);
  mat.style.color = accentForMaterial(state.material);
  const box = el('span', 'box', state.boxName);
  h.appendChild(mat);
  h.appendChild(box);
  if (state.locked) {
    h.appendChild(el('span', 'badge badge-lock', 'LOCK'));
  } else {
    const badge = el('span', `badge ${state.demoMode ? 'badge-demo' : 'badge-live'}`, state.demoMode ? 'DEMO' : 'LIVE');
    h.appendChild(badge);
  }
  return h;
}

function renderMetrics(root, state) {
  root.appendChild(el('div', 'screen-bg'));
  root.appendChild(miniHeader(state));

  if (!state.sensorOk) {
    root.appendChild(el('div', 'center-msg', state.demoMode ? 'SENSOR FAULT' : 'INITIALIZING'));
    if (state.bootHint) root.appendChild(el('div', 'boot-hint', 'BOOT: next  |  long=lock'));
    root.appendChild(dotsAuto(false));
    return;
  }

  const body = el('div', 'metrics-body');
  const zone = rhZone(state.rh, state.material);
  const rhClass = zone === 'alert' ? 'alert' : zone === 'warn' ? 'warn' : '';
  const limit = rhLimitForMaterial(state.material);
  const trend = rhTrendGlyph(state.rh, state.prevRh);

  const tempLabel = el('div', 'metrics-label');
  tempLabel.style.cssText = 'position:absolute;top:22px;left:0;right:0;';
  tempLabel.textContent = 'TEMPERATURE';
  body.appendChild(tempLabel);

  const tempVal = el('div', `metrics-value`);
  tempVal.style.cssText = 'position:absolute;top:38px;left:0;right:0;font-size:28px;';
  tempVal.textContent = `${state.temp.toFixed(1)} C`;
  body.appendChild(tempVal);

  body.appendChild(el('div', 'metrics-divider'));

  const rhLabel = el('div', 'metrics-label');
  rhLabel.style.cssText = 'position:absolute;top:90px;left:0;right:0;';
  rhLabel.textContent = 'HUMIDITY';
  body.appendChild(rhLabel);

  const rhVal = el('div', `metrics-value ${rhClass}`);
  rhVal.style.cssText = 'position:absolute;top:106px;left:0;right:0;font-size:24px;';
  rhVal.textContent = `${Math.round(state.rh)} %${trend}`;
  body.appendChild(rhVal);

  const gauge = el('div', 'rh-gauge');
  const fillPct = Math.min(100, Math.max(0, state.rh));
  const fill = el('div', 'rh-gauge-fill');
  fill.style.width = `${fillPct}%`;
  fill.style.background = rhClass === 'alert' ? 'var(--fault)' : rhClass === 'warn' ? 'var(--cta)' : 'var(--text)';
  gauge.appendChild(fill);
  const limitLine = el('div', 'rh-gauge-limit');
  limitLine.style.left = `${limit}%`;
  gauge.appendChild(limitLine);
  body.appendChild(gauge);

  const limitText = el('div', 'limit-text');
  limitText.textContent = `limit ${limit}%`;
  body.appendChild(limitText);

  root.appendChild(body);
  if (state.bootHint) root.appendChild(el('div', 'boot-hint', 'BOOT: next  |  long=lock'));
  root.appendChild(dotsAuto(false));
}

function renderStatus(root, state) {
  root.appendChild(el('div', 'screen-bg'));
  const hdr = el('div', 'status-header');
  hdr.appendChild(el('span', null, 'STATUS'));
  hdr.appendChild(el('span', null, state.time));
  root.appendChild(hdr);

  const ringWrap = el('div', 'status-ring-wrap');
  const ring = el('div', `status-ring ${statusRingClass(state)}`, statusIcon(state));
  ringWrap.appendChild(ring);
  root.appendChild(ringWrap);

  const msg = statusMessage(state);
  root.appendChild(el('div', `status-msg ${msg.level}`, msg.text));

  const limit = rhLimitForMaterial(state.material);
  root.appendChild(el('div', 'status-detail', `RH ${Math.round(state.rh)}%  ${state.material} limit ${limit}%`));

  root.appendChild(dotsAuto(true));
}

function renderIdentity(root, state) {
  root.appendChild(el('div', 'screen-bg'));
  root.appendChild(el('div', 'identity-title', 'DRYBOX'));
  root.appendChild(el('div', 'identity-name', state.boxName));

  const card = el('div', 'identity-card');
  card.appendChild(el('div', 'id-label', 'DEVICE ID'));
  card.appendChild(el('div', 'id-value', state.deviceId));
  root.appendChild(card);

  if (state.mqttEnabled) {
    root.appendChild(el('div', 'identity-footer a', 'MQTT · publish 10 min'));
  }

  const ble = el('div', `identity-footer b${state.bleConnected ? ' connected' : ''}`);
  ble.textContent = state.bleConnected ? 'BLE connected' : 'BLE advertising';
  root.appendChild(ble);

  root.appendChild(dotsFull(2));
}

function renderQr(root, state) {
  root.appendChild(el('div', 'screen-bg'));
  const hdr = el('div', 'qr-header');
  hdr.appendChild(el('span', null, 'SCAN'));
  hdr.appendChild(el('span', null, 'NxGenLab'));
  root.appendChild(hdr);
  root.appendChild(el('div', 'qr-brand', 'NxGenLab'));

  const wrap = el('div', 'qr-img-wrap');
  const img = document.createElement('img');
  const url = encodeURIComponent(state.qrUrl);
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=72x72&data=${url}`;
  img.alt = 'QR';
  wrap.appendChild(img);
  root.appendChild(wrap);

  root.appendChild(el('div', 'qr-url', state.qrUrl.replace(/^https?:\/\//, '')));
  root.appendChild(dotsFull(3));
}

export function renderScreen(container, state) {
  container.innerHTML = '';
  const idx = SCREENS.indexOf(state.screen);
  switch (state.screen) {
    case 'metrics':
      renderMetrics(container, state);
      break;
    case 'status':
      renderStatus(container, state);
      break;
    case 'identity':
      renderIdentity(container, state);
      break;
    case 'qr':
      renderQr(container, state);
      break;
    default:
      renderMetrics(container, state);
  }
  return { index: idx >= 0 ? idx : 0, label: SCREEN_LABELS[idx] || 'Metrics' };
}

export function nextScreen(current) {
  const i = SCREENS.indexOf(current);
  if (i < 0 || i >= SCREENS.length - 1) return SCREENS[0];
  return SCREENS[i + 1];
}

export { SCREENS, SCREEN_LABELS };
