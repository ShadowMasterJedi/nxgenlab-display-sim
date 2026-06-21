import { renderScreen, nextScreen, SCREENS, SCREEN_LABELS } from './screens.js';
import { rhLimitForMaterial } from './climate.js';

const defaultState = () => ({
  screen: 'metrics',
  material: 'PETG',
  temp: 24.2,
  rh: 43,
  prevRh: 42.5,
  demoMode: false,
  sensorOk: true,
  locked: false,
  bootHint: true,
  boxName: 'Drybox A',
  deviceId: 'db-001',
  time: '14:32',
  bleConnected: false,
  mqttEnabled: false,
  chipFault: 'none',
  qrUrl: 'https://www.nxgenlab.com',
  scale: 2.5,
});

let state = defaultState();

const els = {
  screen: document.getElementById('screen'),
  material: document.getElementById('material'),
  temp: document.getElementById('temp'),
  tempVal: document.getElementById('temp-val'),
  rh: document.getElementById('rh'),
  rhVal: document.getElementById('rh-val'),
  prevRh: document.getElementById('prev-rh'),
  boxName: document.getElementById('box-name'),
  deviceId: document.getElementById('device-id'),
  time: document.getElementById('time'),
  qrUrl: document.getElementById('qr-url'),
  demoMode: document.getElementById('demo-mode'),
  sensorOk: document.getElementById('sensor-ok'),
  locked: document.getElementById('locked'),
  bootHint: document.getElementById('boot-hint'),
  bleConnected: document.getElementById('ble-connected'),
  mqttEnabled: document.getElementById('mqtt-enabled'),
  chipFault: document.getElementById('chip-fault'),
  screenMeta: document.getElementById('screen-meta'),
  rhLimit: document.getElementById('rh-limit'),
  deviceScreen: document.getElementById('device-screen'),
};

function readForm() {
  state.screen = els.screen.value;
  state.material = els.material.value;
  state.temp = parseFloat(els.temp.value);
  state.rh = parseFloat(els.rh.value);
  state.prevRh = parseFloat(els.prevRh.value);
  state.boxName = els.boxName.value || 'Drybox A';
  state.deviceId = els.deviceId.value || 'db-001';
  state.time = els.time.value || '14:32';
  state.qrUrl = els.qrUrl.value || 'https://www.nxgenlab.com';
  state.demoMode = els.demoMode.checked;
  state.sensorOk = els.sensorOk.checked;
  state.locked = els.locked.checked;
  state.bootHint = els.bootHint.checked;
  state.bleConnected = els.bleConnected.checked;
  state.mqttEnabled = els.mqttEnabled.checked;
  state.chipFault = els.chipFault.value;
}

function syncLabels() {
  els.tempVal.textContent = `${parseFloat(els.temp.value).toFixed(1)} °C`;
  els.rhVal.textContent = `${Math.round(parseFloat(els.rh.value))} %`;
  els.rhLimit.textContent = `${rhLimitForMaterial(els.material.value)} %`;
}

function paint() {
  readForm();
  syncLabels();
  const info = renderScreen(els.deviceScreen, state);
  els.screenMeta.textContent = `Screen ${info.index + 1}/4 · ${info.label} · 320×172`;
}

function bindRange(id, labelId, fmt) {
  const input = document.getElementById(id);
  const label = document.getElementById(labelId);
  input.addEventListener('input', () => {
    if (label) label.textContent = fmt(input);
    paint();
  });
}

document.querySelectorAll('input, select').forEach((node) => {
  node.addEventListener('change', paint);
  node.addEventListener('input', paint);
});

bindRange('temp', 'temp-val', (i) => `${parseFloat(i.value).toFixed(1)} °C`);
bindRange('rh', 'rh-val', (i) => `${Math.round(parseFloat(i.value))} %`);

document.getElementById('btn-next').addEventListener('click', () => {
  state.screen = nextScreen(state.screen);
  els.screen.value = state.screen;
  paint();
});

document.getElementById('btn-lock').addEventListener('click', () => {
  state.locked = true;
  state.screen = 'metrics';
  els.locked.checked = true;
  els.screen.value = 'metrics';
  paint();
});

document.getElementById('btn-reset').addEventListener('click', () => {
  state = defaultState();
  els.screen.value = state.screen;
  els.material.value = state.material;
  els.temp.value = state.temp;
  els.rh.value = state.rh;
  els.prevRh.value = state.prevRh;
  els.boxName.value = state.boxName;
  els.deviceId.value = state.deviceId;
  els.time.value = state.time;
  els.qrUrl.value = state.qrUrl;
  els.demoMode.checked = state.demoMode;
  els.sensorOk.checked = state.sensorOk;
  els.locked.checked = state.locked;
  els.bootHint.checked = state.bootHint;
  els.bleConnected.checked = state.bleConnected;
  els.mqttEnabled.checked = state.mqttEnabled;
  els.chipFault.value = state.chipFault;
  paint();
});

document.getElementById('btn-export').addEventListener('click', async () => {
  if (typeof html2canvas === 'undefined') {
    alert('html2canvas not loaded');
    return;
  }
  const node = els.deviceScreen;
  const prevTransform = node.style.transform;
  const prevMargin = node.style.marginBottom;
  node.style.transform = 'none';
  node.style.marginBottom = '0';
  try {
    const canvas = await html2canvas(node, {
      backgroundColor: '#0a1628',
      scale: 1,
      width: 320,
      height: 172,
    });
    const link = document.createElement('a');
    link.download = `drybox-${state.screen}-${state.deviceId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } finally {
    node.style.transform = prevTransform;
    node.style.marginBottom = prevMargin;
  }
});

SCREENS.forEach((s, i) => {
  const btn = document.getElementById(`jump-${s}`);
  if (btn) {
    btn.addEventListener('click', () => {
      state.screen = s;
      els.screen.value = s;
      paint();
    });
  }
});

paint();
