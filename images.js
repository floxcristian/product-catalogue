/* Generador de imágenes SVG que simulan fotos de producto (auto-partes).
   window.partImage(type, variant) -> data URI */
(function () {
  const PALL = {
    metal: ["#8b939c", "#eef1f4", "#c2c9d0", "#eef1f4", "#79818a"],
    gold:  ["#b9852f", "#f4d79a", "#d9a64a", "#f4d79a", "#9c6e22"],
    blue:  ["#2f5f86", "#bcd6ea", "#6f9ec4", "#bcd6ea", "#244c6b"],
    dark:  ["#33383d", "#6b7178", "#454b52", "#6b7178", "#23272b"],
  };

  function grad(id, c) {
    return `<linearGradient id='${id}' x1='0' y1='0' x2='1' y2='0'>
      <stop offset='0' stop-color='${c[0]}'/><stop offset='.22' stop-color='${c[1]}'/>
      <stop offset='.5' stop-color='${c[2]}'/><stop offset='.78' stop-color='${c[3]}'/>
      <stop offset='1' stop-color='${c[4]}'/></linearGradient>`;
  }
  // cilindro / cartucho de filtro
  function cylinder(c, pleat) {
    const lines = pleat
      ? Array.from({ length: 13 }, (_, i) => {
          const x = 80 + i * 6.5;
          return `<line x1='${x}' y1='66' x2='${x}' y2='176' stroke='${c[4]}' stroke-width='1.4' opacity='.45'/>`;
        }).join("")
      : "";
    return `<defs>${grad("g", c)}</defs>
      <rect x='100' y='50' width='40' height='18' rx='4' fill='${c[1]}' stroke='${c[4]}' stroke-width='1.5'/>
      <ellipse cx='120' cy='66' rx='44' ry='13' fill='${c[3]}' stroke='${c[4]}' stroke-width='1.5'/>
      <rect x='76' y='66' width='88' height='110' fill='url(#g)' stroke='${c[4]}' stroke-width='1.5'/>
      ${lines}
      <ellipse cx='120' cy='176' rx='44' ry='13' fill='${c[0]}' stroke='${c[4]}' stroke-width='1.5'/>
      <ellipse cx='120' cy='66' rx='30' ry='8' fill='none' stroke='${c[4]}' stroke-width='1.2' opacity='.5'/>`;
  }
  // canister (secador) — lata con tapa
  function canister(c) {
    return `<defs>${grad("g", c)}</defs>
      <ellipse cx='120' cy='62' rx='46' ry='12' fill='${c[1]}' stroke='${c[4]}' stroke-width='1.5'/>
      <rect x='74' y='62' width='92' height='112' fill='url(#g)' stroke='${c[4]}' stroke-width='1.5'/>
      <ellipse cx='120' cy='174' rx='46' ry='12' fill='${c[0]}'/>
      <rect x='74' y='150' width='92' height='8' fill='${c[4]}' opacity='.25'/>
      <circle cx='120' cy='62' r='9' fill='${c[3]}' stroke='${c[4]}' stroke-width='1.4'/>`;
  }
  // pastillas de freno
  function pad(c) {
    function one(x, y, r) {
      return `<g transform='translate(${x} ${y}) rotate(${r})'>
        <rect x='-46' y='-20' width='92' height='40' rx='6' fill='#2f343a'/>
        <rect x='-46' y='-20' width='92' height='15' rx='6' fill='#9aa1a8'/>
        <rect x='-40' y='8' width='10' height='10' rx='2' fill='#1f2329'/>
        <rect x='30' y='8' width='10' height='10' rx='2' fill='#1f2329'/></g>`;
    }
    return one(120, 86, -10) + one(126, 150, 8);
  }
  // radiador
  function radiator(c) {
    const fins = Array.from({ length: 16 }, (_, i) => {
      const x = 66 + i * 7;
      return `<line x1='${x}' y1='64' x2='${x}' y2='176' stroke='#aab2ba' stroke-width='2'/>`;
    }).join("");
    return `<rect x='60' y='58' width='120' height='124' rx='4' fill='#eef1f4' stroke='#79818a' stroke-width='1.5'/>
      <rect x='60' y='58' width='120' height='14' fill='#c2c9d0' stroke='#79818a'/>
      <rect x='60' y='168' width='120' height='14' fill='#aab2ba' stroke='#79818a'/>
      ${fins}
      <rect x='52' y='66' width='10' height='108' rx='3' fill='#9aa3ad'/>
      <rect x='178' y='66' width='10' height='108' rx='3' fill='#9aa3ad'/>`;
  }

  const TYPES = {
    filterCart: () => cylinder(PALL.gold, true),
    airfilter: () => cylinder(PALL.metal, true),
    canister: () => canister(PALL.metal),
    cartridge: () => cylinder(PALL.metal, true),
    pad: () => pad(PALL.dark),
    radiator: () => radiator(PALL.blue),
    bottle: () => `<defs>${grad("g", PALL.blue)}</defs>
      <rect x='92' y='40' width='18' height='20' rx='2' fill='#2b3138'/>
      <rect x='84' y='58' width='72' height='128' rx='12' fill='url(#g)' stroke='#244c6b' stroke-width='1.5'/>
      <rect x='94' y='92' width='52' height='66' rx='4' fill='#fff' opacity='.92'/>
      <rect x='100' y='102' width='40' height='6' rx='3' fill='#244c6b'/>
      <rect x='100' y='114' width='30' height='5' rx='2.5' fill='#6f9ec4'/>
      <rect x='100' y='124' width='34' height='5' rx='2.5' fill='#6f9ec4'/>`,
    battery: () => `<defs>${grad("g", PALL.dark)}</defs>
      <rect x='66' y='74' width='108' height='104' rx='8' fill='url(#g)' stroke='#23272b' stroke-width='1.5'/>
      <rect x='66' y='74' width='108' height='26' rx='8' fill='#454b52'/>
      <rect x='86' y='62' width='22' height='14' rx='3' fill='#c2c9d0'/>
      <rect x='132' y='62' width='22' height='14' rx='3' fill='#b9852f'/>
      <circle cx='97' cy='62' r='8' fill='#e7ebef'/><circle cx='143' cy='62' r='8' fill='#d9a64a'/>
      <rect x='78' y='112' width='84' height='54' rx='4' fill='#fff' opacity='.9'/>
      <text x='120' y='146' font-family='Arial' font-weight='bold' font-size='22' fill='#23272b' text-anchor='middle'>12V</text>`,
    belt: () => `<g fill='none' stroke='#33383d' stroke-width='17'>
      <ellipse cx='120' cy='120' rx='66' ry='52'/></g>
      <ellipse cx='120' cy='120' rx='66' ry='52' fill='none' stroke='#1f2329' stroke-width='17' stroke-dasharray='3 6'/>
      <ellipse cx='120' cy='120' rx='49' ry='35' fill='#f5f7f9'/>
      <ellipse cx='120' cy='120' rx='49' ry='35' fill='none' stroke='#6b7178' stroke-width='2'/>`,
  };

  window.partImage = function (type, variant) {
    const draw = TYPES[type] || TYPES.canister;
    const rot = [0, -7, 6, -12][(variant || 0) % 4];
    const sc = [1, 0.92, 0.86, 0.95][(variant || 0) % 4];
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'>
      <ellipse cx='120' cy='196' rx='62' ry='12' fill='#000' opacity='.06'/>
      <g transform='translate(120 120) rotate(${rot}) scale(${sc}) translate(-120 -120)'>${draw()}</g>
    </svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  };
})();
