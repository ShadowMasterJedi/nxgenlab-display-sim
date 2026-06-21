# NxGenLab Display Simulator

Local **320×172 preview** for **DryBox Clima** (Waveshare ESP32-C6-LCD-1.47) — see all four carousel screens before flashing firmware.

**GitHub:** https://github.com/ShadowMasterJedi/nxgenlab-display-sim  
**Version:** 0.1.0 · see **[delivery_summary.md](delivery_summary.md)** for status and roadmap.

Matches `drybox_clima` layout and `climate_logic` / `ui_theme` tokens.

## Quick start

```bash
cd ~/Projects/nxgenlab-display-sim
chmod +x start.sh
./start.sh
```

Open **http://127.0.0.1:8766/**

## Features (v0.1)

| Feature | Description |
|---------|-------------|
| 4 screens | Metrics · Status · Identity · QR |
| Live controls | Temp, RH, material, DEMO/LIVE, BLE, MCU fault, … |
| RH zones | Warn/alert colors + gauge limit marker (same logic as firmware) |
| BOOT simulation | Next screen · Lock metrics |
| Export PNG | 320×172 screenshot for docs/wiki |

## Project structure

```
nxgenlab-display-sim/
├── index.html
├── start.sh
├── assets/simulator.css
└── js/
    ├── climate.js    # RH limits & zones (port of climate_logic.cpp)
    ├── screens.js    # Screen renderers
    └── app.js        # UI bindings
```

## Roadmap

- [ ] FlowZero 466×466 round profile
- [ ] Filament Clima variant header
- [ ] Paste USB JSON telemetry → update preview
- [ ] SSD1306 128×64 feedled screen

## Related

- [DryBox_Clima](https://github.com/ShadowMasterJedi/DryBox_Clima)
- [UI template](https://github.com/ShadowMasterJedi/DryBox_Clima/blob/main/docs/UI_TEMPLATE.md)

MIT · see [LICENSE](LICENSE).  
Developed for **NxGenLab**.
