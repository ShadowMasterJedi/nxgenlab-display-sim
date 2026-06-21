# NxGenLab Display Simulator – Delivery Summary

**Date:** 21 June 2026  
**Project:** `nxgenlab-display-sim`  
**GitHub:** https://github.com/ShadowMasterJedi/nxgenlab-display-sim  
**Version:** 0.1.0  
**Status:** Local web preview working · DryBox Clima 320×172 MVP  
**Part of:** NxGenLab ecosystem (DryBox Clima, FlowZero, wiki)

---

## Project goal

**Preview ESP32 display layouts in the browser** before flashing firmware — no hardware required.

First target: **DryBox Clima** (Waveshare ESP32-C6-LCD-1.47, ST7789, **320×172** landscape) with all four carousel screens from `ui_carousel.cpp`.

---

## Delivered (v0.1.0)

| Feature | Status |
|---------|--------|
| Local static web app (`./start.sh` → port 8766) | ✅ |
| Metrics screen (temp, RH, gauge, trend, limits) | ✅ |
| Status screen (ring icon, alert messages) | ✅ |
| Identity screen (box name, device ID, BLE/MQTT) | ✅ |
| QR screen (live QR via API) | ✅ |
| RH warn/alert logic (port of `climate_logic.cpp`) | ✅ |
| Material accents (port of `ui_theme.h`) | ✅ |
| BOOT simulation (next screen, lock metrics) | ✅ |
| Export PNG at 320×172 | ✅ |
| FlowZero 466×466 profile | 🔲 Planned |
| Paste USB JSON telemetry | 🔲 Planned |
| feedled SSD1306 128×64 | 🔲 Planned |

---

## File layout

```
nxgenlab-display-sim/
├── README.md
├── delivery_summary.md
├── LICENSE
├── index.html
├── start.sh
├── assets/simulator.css
└── js/
    ├── climate.js
    ├── screens.js
    └── app.js
```

---

## Quick start

```bash
git clone https://github.com/ShadowMasterJedi/nxgenlab-display-sim.git
cd nxgenlab-display-sim
chmod +x start.sh
./start.sh
# → http://127.0.0.1:8766/
```

**Note:** Must be served over HTTP (not `file://`) because of ES modules. QR export and PNG export need network for CDN/API.

---

## Related

| Project | Link |
|---------|------|
| DryBox Clima firmware | [DryBox_Clima](https://github.com/ShadowMasterJedi/DryBox_Clima) |
| UI template | `docs/UI_TEMPLATE.md` in DryBox repo |
| NxGenLab Wiki | [perbengtsson/wiki](https://github.com/ShadowMasterJedi/perbengtsson/tree/main/wiki) |

---

## Session history

1. Identified need: preview layouts before flash  
2. Built local HTML/CSS/JS simulator matching drybox carousel  
3. Verified `./start.sh` on NUC  
4. v0.1.0 — GitHub repo created  

---

*NxGenLab · MIT License*
