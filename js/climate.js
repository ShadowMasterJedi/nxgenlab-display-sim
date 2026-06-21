/** Port of drybox_clima climate_logic + ui_theme material accents */

export const RH_TREND_THRESHOLD = 0.5;
export const RH_WARN_MARGIN = 3.0;
export const RH_ALERT_DEFAULT = 20.0;

export const MATERIAL_COLORS = {
  PLA: '#4caf50',
  PETG: '#ff6b35',
  ABS: '#f44336',
  TPU: '#ab47bc',
  ASA: '#42a5f5',
  NYLON: '#ffd54f',
  PC: '#90a4ae',
  PVA: '#26c6da',
};

export function rhLimitForMaterial(material) {
  switch (material) {
    case 'PLA': return 20;
    case 'PETG': return 15;
    case 'ABS': return 12;
    case 'TPU': return 12;
    case 'ASA': return 12;
    case 'NYLON': return 10;
    case 'PC': return 10;
    case 'PVA': return 10;
    default: return RH_ALERT_DEFAULT;
  }
}

export function rhZone(rh, material) {
  if (rh == null || Number.isNaN(rh)) return 'ok';
  const limit = rhLimitForMaterial(material);
  if (rh > limit) return 'alert';
  if (rh > limit - RH_WARN_MARGIN) return 'warn';
  return 'ok';
}

export function accentForMaterial(material) {
  return MATERIAL_COLORS[material] || MATERIAL_COLORS.PETG;
}

export function rhTrendGlyph(rh, prevRh) {
  if (prevRh == null || Number.isNaN(prevRh) || rh == null || Number.isNaN(rh)) return '';
  const delta = rh - prevRh;
  if (delta >= RH_TREND_THRESHOLD) return ' ^';
  if (delta <= -RH_TREND_THRESHOLD) return ' v';
  return '';
}

export function statusMessage(state) {
  const zone = rhZone(state.rh, state.material);
  if (state.chipFault === 'fault') {
    return { text: 'MCU overheating — check box', level: 'fault' };
  }
  if (state.chipFault === 'warn') {
    return { text: 'MCU warm — reduce heat load', level: 'warn' };
  }
  if (zone === 'alert') {
    return { text: 'Filament needs drying', level: 'fault' };
  }
  if (zone === 'warn') {
    return { text: 'Humidity rising — check soon', level: 'warn' };
  }
  return { text: 'Filament OK', level: 'ok' };
}

export function statusIcon(state) {
  const zone = rhZone(state.rh, state.material);
  if (state.chipFault === 'fault' || zone === 'alert') return '⚠';
  if (state.chipFault === 'warn' || zone === 'warn') return '+';
  return '✓';
}

export function statusRingClass(state) {
  const zone = rhZone(state.rh, state.material);
  if (state.chipFault === 'fault' || zone === 'alert') return 'fault';
  if (state.chipFault === 'warn' || zone === 'warn') return 'warn';
  return 'ok';
}
