/* Catálogo Implementos — Flipbook */
(function () {
  const C = window.CATALOG;
  const CLP = (n) => "$" + n.toLocaleString("es-CL");

  const LOGO = "https://admin.implementos.cl/assets/img/logo-implementos.png";
  const logoChip = (h) => `<span class="logo-mark"><img class="logo-img" src="${LOGO}" alt="Implementos" style="height:${h}px"><span class="logo-text" style="display:none;font-size:${Math.round(h*0.62)}px"><b>implementos</b><span class="ep">EPYSA</span></span></span>`;

  const ICON = {
    cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h2.2l2.1 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>',
    plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
    star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.5 1.3 6.6L12 17.8 6.1 20.5l1.3-6.6L2.5 9.4l6.6-.8z"/></svg>',
    minus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>',
    up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>',
    down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    stack:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4-8 4-8-4 8-4z"/><path d="M4 12l8 4 8-4M4 17l8 4 8-4"/></svg>',
    left:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    right:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
    pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>',
    phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.8-.8L3 20.5l1.4-4.2A8.4 8.4 0 0 1 3.5 11 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/></svg>',
    store:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1.5-5h15L21 9M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9M4 9h16"/></svg>',
    expand:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',
    close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  };

  /* ---------- estado cotización ---------- */
  const KEY = "implementos_quote_v1";
  let quote = {};
  try { quote = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
  const saveQuote = () => localStorage.setItem(KEY, JSON.stringify(quote));
  const quoteCount = () => Object.values(quote).reduce((a, b) => a + b, 0);

  const totalItems = C.categories.reduce((a, c) => a + c.products.length, 0);
  const PAGE_W = 820;
  const PAGE_H = 1080;
  const SPREAD_W = PAGE_W * 2;

  /* ============================================================
     CONSTRUCCIÓN DE PÁGINAS
     ============================================================ */
  function bandTop() {
    return `<div class="pg__band"><span class="tg">El supermercado del transporte</span><span class="band-mk">implementos<span class="cl">.cl</span></span></div>`;
  }
  function footBar(page) {
    return `<div class="pg__foot"><span>IMPLEMENTOS.CL · 30 tiendas</span><span class="pageno">PÁG · ${page}</span></div>`;
  }

  function specsTable(specs) {
    return '<table class="spec-table"><tbody>' +
      specs.map(([k, v]) =>
        `<tr><td class="k">${k}</td><td class="v">${v}</td></tr>`).join("") +
      '</tbody></table>';
  }

  const ART = { aceite:"filterCart", secadores:"canister", aire:"airfilter", hidraulicos:"cartridge", frenos:"pad", refrigeracion:"radiator", lubricantes:"bottle", electrico:"battery", correas:"belt" };
  function imgSrcs(p, art) {
    const n = Math.max(1, Math.min(4, p.imgs || 3));
    return Array.from({ length: n }, (_, i) => (window.partImage ? window.partImage(art, i) : ""));
  }
  function slotEl(id, src, ph, cls) {
    return `<image-slot id="${id}"${cls ? ` class="${cls}"` : ""} fit="contain" src="${src}" placeholder="${ph || ""}"></image-slot>`;
  }

  function mayorTag(p) {
    if (!p.bulkPrice) return "";
    const off = Math.round((p.price - p.bulkPrice) / p.price * 100);
    const mid = Math.round((p.price + p.bulkPrice) / 2 / 10) * 10;
    const offMid = Math.round((p.price - mid) / p.price * 100);
    const f = p.bulkFrom || 3;
    const rows = `
      <tr><td class="u">1 u</td><td class="pu">${CLP(p.price)} <span>c/u</span></td><td class="d">—</td></tr>
      <tr><td class="u">2 u</td><td class="pu">${CLP(mid)} <span>c/u</span></td><td class="d">-${offMid}%</td></tr>
      <tr class="hot"><td class="u">${f}+ u</td><td class="pu">${CLP(p.bulkPrice)} <span>c/u</span></td><td class="d">-${off}%</td></tr>`;
    return `<span class="flag flag--mayor" tabindex="0">${ICON.stack} Por mayor -${off}%
      <div class="mayor-pop">
        <div class="mayor-pop__head"><span class="mp-tag">${ICON.stack} Por mayor</span><b>Paga menos</b></div>
        <table class="mayor-pop__tbl"><tbody>${rows}</tbody></table>
        <div class="mayor-pop__foot">Aplica para productos seleccionados, mientras dure el stock.</div>
      </div></span>`;
  }

  function mediaHTML(p, slotId, variant, art) {
    const flags = `<div class="pcard__flags" data-flags>${(p.flags || []).map((f) => `<span class="flag flag--${f.toLowerCase().replace(/[^a-z0-9]+/g, "")}">${f}</span>`).join("")}${mayorTag(p)}</div>`;
    const srcs = imgSrcs(p, art);
    const n = srcs.length;
    const zoom = `<button class="gal__zoom" data-zoom title="Ver en grande">${ICON.expand}</button>`;

    // HERO: fila de imágenes (1 = ancho completo, 2–3 lado a lado)
    if (variant === "hero") {
      const tiles = srcs.map((s, i) =>
        `<div class="htile" data-stage>${slotEl(`${slotId}-${i}`, s, "Foto")}${i === 0 ? zoom : ""}</div>`).join("");
      return `<div class="pcard__media gal-row gal-row--${n}">${flags}${tiles}</div>`;
    }

    // VERTICAL: carrusel (controles sólo si hay más de 1 imagen)
    if (variant === "v") {
      const slides = srcs.map((s, i) => slotEl(`${slotId}-${i}`, s, "Foto", "cslide" + (i === 0 ? " on" : ""))).join("");
      const ctrls = n > 1
        ? `<button class="carousel__nav prev" data-cnav="-1" aria-label="Anterior">${ICON.left}</button>
           <button class="carousel__nav next" data-cnav="1" aria-label="Siguiente">${ICON.right}</button>
           <div class="carousel__dots">${srcs.map((_, i) => `<button class="cdot${i === 0 ? " on" : ""}" data-cdot="${i}"></button>`).join("")}</div>`
        : "";
      return `<div class="pcard__media">${flags}<div class="carousel" data-carousel data-idx="0"><div class="carousel__track">${slides}</div>${ctrls}${zoom}</div></div>`;
    }

    // HORIZONTAL: 1 imagen = principal a todo el ancho (sin tira); 2+ = principal + miniaturas
    if (n === 1) {
      return `<div class="pcard__media gal-single">${flags}<div class="gal"><div class="gal__stage" data-stage>${slotEl(`${slotId}-0`, srcs[0], "Foto principal")}${zoom}</div></div></div>`;
    }
    const thumbs = srcs.slice(1).map((s, i) => slotEl(`${slotId}-${i + 1}`, s, "+")).join("");
    const arrows = n - 1 > 2;
    const rail = `<div class="gal__rail" data-rail data-roff="0">
      ${arrows ? `<button class="rail-nav up" data-railnav="-1" aria-label="Subir">${ICON.up}</button>` : ""}
      <div class="rail-view"><div class="rail-track">${thumbs}</div></div>
      ${arrows ? `<button class="rail-nav down" data-railnav="1" aria-label="Bajar">${ICON.down}</button>` : ""}
    </div>`;
    return `<div class="pcard__media gal-thumbs">${flags}<div class="gal"><div class="gal__stage" data-stage>${slotEl(`${slotId}-0`, srcs[0], "Foto principal")}${zoom}</div>${rail}</div></div>`;
  }

  function ratingOf(p) {
    if (p.rating) return { v: (+p.rating).toFixed(1), n: p.reviews || 0 };
    let h = 0; for (const c of p.sku) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return { v: ((40 + (h % 10)) / 10).toFixed(1), n: 15 + (h % 240) };
  }

  function infoHTML(p) {
    const r = ratingOf(p);
    return `
      <div class="pcard__info">
        <div class="pcard__head">
          <span class="idg"><span class="pcard__brand">${p.brand}</span><span class="pcard__sku">${p.sku}</span></span>
          <span class="pcard__rating">${ICON.star}<b>${r.v}</b><i>(${r.n})</i></span>
        </div>
        <h3 class="pcard__title">${p.title}</h3>
        <p class="pcard__sub">${p.subtitle || ""}</p>
        ${specsTable(p.specs)}
      </div>`;
  }

  function addControl(sku) {
    const q = quote[sku] || 0;
    if (!q) return `<button class="add" data-add="${sku}"><span class="ic">${ICON.plus}</span><span class="lbl">Agregar</span></button>`;
    return `<div class="stepper"><button class="step-btn" data-dec="${sku}" aria-label="Quitar uno">${ICON.minus}</button><span class="qty">${q}</span><button class="step-btn" data-inc="${sku}" aria-label="Agregar uno">${ICON.plus}</button></div>`;
  }

  function buyHTML(p) {
    const isOffer = p.listPrice && p.listPrice > p.price;
    const off = isOffer ? Math.round((p.listPrice - p.price) / p.listPrice * 100) : 0;
    const priceMain = isOffer
      ? `<div class="price offer"><span class="amt">${CLP(p.price)}</span><span class="iva">c/iva</span></div>
         <div class="was"><span class="old">${CLP(p.listPrice)}</span><span class="off">-${off}% OFF</span></div>`
      : `<div class="price"><span class="amt">${CLP(p.price)}</span><span class="iva">c/iva</span></div>`;
    return `
      <div class="pcard__buy">
        <div class="prices">${priceMain}</div>
        <div class="addwrap" data-wrap="${p.sku}">${addControl(p.sku)}</div>
      </div>`;
  }

  function card(p, slotId, variant, extra, art) {
    return `<article class="pcard pcard--${variant}${extra ? " " + extra : ""}">${mediaHTML(p, slotId, variant, art)}${infoHTML(p)}${buyHTML(p)}</article>`;
  }

  function categoryPage(cat) {
    const ps = cat.products;
    const n = ps.length;
    const art = ART[cat.id] || "canister";
    const sid = (i) => `slot-${cat.id}-${i}`;
    let cards;
    if (n === 1) {
      cards = card(ps[0], sid(0), "hero", "", art);
    } else if (n === 2) {
      cards = card(ps[0], sid(0), "h", "", art) + card(ps[1], sid(1), "h", "", art);
    } else if (n === 3) {
      cards = card(ps[0], sid(0), "v", "", art) + card(ps[1], sid(1), "v", "", art) + card(ps[2], sid(2), "h", "span-2", art);
    } else {
      cards = ps.map((p, i) => card(p, sid(i), "v", "", art)).join("");
    }
    return `
      <div class="pg">
        ${bandTop()}
        <div class="pg__inner">
          <div class="cat-head">
            <div class="idx">${cat.page}</div>
            <div class="t">
              <span class="kicker">${cat.kicker}</span>
              <h2>${cat.name}</h2>
              <p>${cat.blurb}</p>
            </div>
            <div class="meta"><span class="c">${String(n).padStart(2,"0")}</span><span class="l">ítems</span></div>
          </div>
          <div class="plist plist--${Math.min(n, 4)}">${cards}</div>
        </div>
        ${footBar(cat.page)}
      </div>`;
  }

  function coverPage() {
    return `
      <div class="cover-pg">
        <div class="base"></div>
        <div class="ghost">EPYSA</div>
        <div class="photo"><image-slot id="cover-truck" fit="cover" placeholder="Arrastra la foto del camión"></image-slot></div>
        <div class="scrim"></div>
        <div class="brand">
          ${logoChip(72)}
          <div class="tagline">El supermercado del transporte</div>
          <div class="rule"></div>
        </div>
        <div class="body">
          <div class="tag"><span class="d"></span> Catálogo personalizado · ${totalItems} repuestos</div>
          <h1>Catálogo para<br><span class="l">${C.client.name}</span></h1>
          <div class="sub"><span class="veh">${C.client.vehicle}</span><span class="sku">${C.client.code}</span></div>
        </div>
        <div class="bar">
          <div class="stat"><b>30</b><span>Tiendas</span></div>
          <div class="sep"></div>
          <div class="stat"><b>Arica → P. Arenas</b><span>Cobertura nacional</span></div>
          <div class="sep"></div>
          <div class="stat"><b>${totalItems}</b><span>Productos</span></div>
        </div>
      </div>`;
  }

  function tocPage() {
    const rows = C.categories.map((c) => `
      <div class="row" data-goto-cat="${c.id}">
        <span class="n">${c.page}</span>
        <span class="t">${c.name}</span>
        <span class="k">${c.kicker}</span>
        <span class="ct">${String(c.products.length).padStart(2,"0")} ítems</span>
      </div>`).join("");
    return `
      <div class="toc">
        <div class="head">
          <span class="kicker">Índice del catálogo</span>
          <h2>Contenido</h2>
          <div class="who"><span class="veh">${C.client.name} · ${C.client.vehicle}</span><span class="sku">${C.client.code}</span></div>
        </div>
        <div class="list">${rows}</div>
        <div class="foot">Precios C/IVA referenciales · sujetos a stock · ${totalItems} productos seleccionados</div>
      </div>`;
  }

  function backPage() {
    return `
      <div class="back-pg">
        <div class="ghost">IMPLEMENTOS</div>
        <div class="top">
          ${logoChip(66)}
          <div class="tagline">El supermercado del transporte</div>
          <div class="rule"></div>
        </div>
        <div class="contact">
          <div class="ci"><span class="ico">${ICON.store}</span><div><b>IMPLEMENTOS.CL</b><span>Tienda online</span></div></div>
          <div class="ci"><span class="ico">${ICON.phone}</span><div><b>800 330 088</b><span>Venta telefónica</span></div></div>
          <div class="ci"><span class="ico">${ICON.chat}</span><div><b>+56 9 3263 3571</b><span>WhatsApp</span></div></div>
          <div class="ci"><span class="ico">${ICON.pin}</span><div><b>30 Tiendas</b><span>De Arica a Punta Arenas</span></div></div>
        </div>
        <div class="legal">@implementos.chile · @implementosrepuestos · Catálogo ${C.client.code} · 2026</div>
      </div>`;
  }

  function endpaperHTML() {
    return `<div class="endpaper"><div class="ghost">EPYSA</div>${logoChip(78)}<div class="ep-rule"></div><div class="ep-tag">El supermercado del transporte</div></div>`;
  }

  /* ---------- ensamblar páginas en orden ---------- */
  const pages = [
    { html: coverPage(), kind: "cover", label: "Portada" },
    { html: tocPage(), kind: "toc", label: "Índice" },
  ];
  C.categories.forEach((c) => pages.push({ html: categoryPage(c), kind: "cat", id: c.id, label: c.short || c.name }));
  // guarda (endpaper) para que la contraportada quede como página final centrada
  if ((pages.length + 1) % 2 === 1) pages.push({ html: endpaperHTML(), kind: "endpaper", label: "" });
  pages.push({ html: backPage(), kind: "back", label: "Contacto" });

  // labels dinámicos por vista (spread)
  const NLEAVES = pages.length / 2;
  const labels = [];
  for (let v = 0; v <= NLEAVES; v++) {
    if (v === 0) labels.push(pages[0].label);
    else if (v === NLEAVES) labels.push(pages[pages.length - 1].label || "Contraportada");
    else {
      const lf = pages[2 * v - 1], rt = pages[2 * v];
      labels.push([lf && lf.label, rt && rt.label].filter(Boolean).join(" · "));
    }
  }

  /* ============================================================
     CONSTRUIR HOJAS (leaves)
     ============================================================ */
  const book = document.getElementById("book");
  const N = pages.length / 2; // nº de hojas
  const leaves = [];
  for (let i = 0; i < N; i++) {
    const front = pages[2 * i];
    const back = pages[2 * i + 1];
    const leaf = document.createElement("div");
    leaf.className = "leaf";
    leaf.dataset.i = i;
    leaf.innerHTML = `
      <div class="face front right">${front.html}
        <button class="corner next" data-turn="next" aria-label="Siguiente"></button>
      </div>
      <div class="face back left">${back.html}
        <button class="corner prev" data-turn="prev" aria-label="Anterior"></button>
      </div>
      <div class="sheen"></div>`;
    book.appendChild(leaf);
    leaves.push(leaf);
  }

  /* z-index + estado */
  let current = 0;            // nº de hojas volteadas (0..N)
  let busy = false;

  function applyZ(turningIdx) {
    leaves.forEach((leaf, i) => {
      let z;
      if (i < current) z = i + 1;        // volteadas (izquierda)
      else z = N - i;                    // sin voltear (derecha)
      if (i === turningIdx) z = N + 20;
      leaf.style.zIndex = z;
    });
  }
  function settleStaticPages() {
    leaves.forEach((leaf, i) => {
      leaf.classList.toggle("settled-left", i < current && !leaf.classList.contains("turning"));
    });
  }

  function revealAll() { leaves.forEach((l) => { l.style.visibility = ""; }); }
  /* ocultar hojas apiladas detrás cuando sólo se ve una página (portada/contraportada) */
  function edgeHide() {
    revealAll();
    if (current === 0) { for (let i = 1; i < N; i++) leaves[i].style.visibility = "hidden"; }
    else if (current === N) { for (let i = 0; i < N - 1; i++) leaves[i].style.visibility = "hidden"; }
  }

  function setView(v, animate) {
    v = Math.max(0, Math.min(N, v));
    if (v === current) return;
    if (animate) {
      // un paso a la vez para giros contiguos
    }
    const goingNext = v > current;
    // aplicar instantáneo (para saltos del índice)
    for (let i = 0; i < N; i++) {
      leaves[i].classList.toggle("flipped", i < v);
      leaves[i].classList.toggle("show-back", i < v);
    }
    current = v;
    settleStaticPages();
    applyZ(-1);
    edgeHide();
    updateHud();
  }

  function turn(dir) {
    if (busy) return;
    if (dir === "next" && current >= N) return;
    if (dir === "prev" && current <= 0) return;
    busy = true;
    hideTip();
    revealAll();
    const idx = dir === "next" ? current : current - 1;
    const leaf = leaves[idx];
    leaf.classList.remove("settled-left");
    void leaf.offsetWidth;
    applyZ(idx);
    leaf.classList.add("turning");
    requestAnimationFrame(() => {
      if (dir === "next") leaf.classList.add("flipped");
      else leaf.classList.remove("flipped");
    });
    // cambiar la cara visible a mitad del giro (~90°)
    const halfT = setTimeout(() => {
      if (dir === "next") leaf.classList.add("show-back");
      else leaf.classList.remove("show-back");
    }, 450);
    current += dir === "next" ? 1 : -1;
    const done = () => {
      clearTimeout(halfT);
      if (dir === "next") leaf.classList.add("show-back");
      else leaf.classList.remove("show-back");
      leaf.classList.remove("turning");
      settleStaticPages();
      applyZ(-1);
      edgeHide();
      busy = false;
      updateHud();
      leaf.removeEventListener("transitionend", done);
    };
    leaf.addEventListener("transitionend", done);
    setTimeout(() => { if (busy) done(); }, 1000); // respaldo
    updateHud();
  }

  /* ============================================================
     HUD (dots + flechas + pageno)
     ============================================================ */
  const dotsWrap = document.getElementById("dots");
  for (let v = 0; v <= N; v++) {
    const b = document.createElement("button");
    b.className = "dot";
    b.dataset.v = v;
    b.title = labels[v] || ("Vista " + v);
    b.addEventListener("click", () => setView(v, false));
    dotsWrap.appendChild(b);
  }
  const pageno = document.getElementById("pageno");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  function updateHud() {
    if (!busy) fit();
    [...dotsWrap.children].forEach((d, v) => d.classList.toggle("active", v === current));
    pageno.textContent = (labels[current] || `Vista ${current + 1}`);
    prevBtn.disabled = current <= 0;
    nextBtn.disabled = current >= N;
    // centrar páginas únicas (portada / contraportada)
    let shift = 0;
    if (current === 0) shift = -PAGE_W / 2;        // sólo página derecha (portada)
    else if (current === N) shift = PAGE_W / 2;    // sólo página izquierda (contraportada)
    book.style.transform = `translateX(${shift}px)`;
    // ocultar marca flotante en portada/contraportada (ya muestran el logo grande)
    const bt = document.querySelector(".brand-tab");
    if (bt) bt.style.opacity = (current === 0 || current === N) ? "0" : "1";
  }

  prevBtn.addEventListener("click", () => turn("prev"));
  nextBtn.addEventListener("click", () => turn("next"));
  document.addEventListener("keydown", (e) => {
    if (lb && lb.classList.contains("show")) {
      if (e.key === "Escape") closeLightbox();
      return;
    }
    if (e.key === "ArrowRight" || e.key === "PageDown") turn("next");
    if (e.key === "ArrowLeft" || e.key === "PageUp") turn("prev");
  });

  /* corners + galería */
  book.addEventListener("click", (e) => {
    // ampliar imagen activa (carrusel o galería)
    const z = e.target.closest("[data-zoom]");
    if (z) {
      const car = z.closest("[data-carousel]");
      const slot = car ? car.querySelector(".cslide.on") : z.closest(".gal__stage").querySelector("image-slot");
      openLightbox(slot); return;
    }
    // carrusel: flechas y bullets
    const cnav = e.target.closest("[data-cnav]");
    if (cnav) { carGo(cnav.closest("[data-carousel]"), +cnav.closest("[data-carousel]").dataset.idx + (+cnav.dataset.cnav)); return; }
    const cdot = e.target.closest("[data-cdot]");
    if (cdot) { carGo(cdot.closest("[data-carousel]"), +cdot.dataset.cdot); return; }
    // rail: flechas arriba/abajo de las miniaturas
    const rn = e.target.closest("[data-railnav]");
    if (rn) { railScroll(rn.closest(".gal__rail"), +rn.dataset.railnav); return; }
    // miniatura llena → hacer principal
    const thumb = e.target.closest(".gal__rail image-slot");
    if (thumb && thumb.hasAttribute("data-filled")) { promote(thumb); return; }
    const c = e.target.closest("[data-turn]");
    if (c) { turn(c.dataset.turn); return; }
    const g = e.target.closest("[data-goto-cat]");
    if (g) {
      const id = g.dataset.gotoCat;
      const pi = pages.findIndex((p) => p.id === id);
      if (pi >= 0) setView(Math.floor(pi / 2), false);
      return;
    }
    const add = e.target.closest("[data-add],[data-inc]");
    if (add) { changeQty(add.dataset.add || add.dataset.inc, 1); return; }
    const dec = e.target.closest("[data-dec]");
    if (dec) { changeQty(dec.dataset.dec, -1); return; }
  });

  /* ---------- carrusel (estilo Google Shopping) ---------- */
  function carGo(car, idx) {
    const slides = car.querySelectorAll(".cslide");
    const n = slides.length;
    const i = ((idx % n) + n) % n;
    car.dataset.idx = i;
    slides.forEach((s, j) => s.classList.toggle("on", j === i));
    car.querySelectorAll(".cdot").forEach((d, j) => d.classList.toggle("on", j === i));
  }
  // autoplay al hacer hover sobre la imagen
  document.querySelectorAll("[data-carousel]").forEach((car) => {
    let t;
    car.addEventListener("mouseenter", () => { clearInterval(t); t = setInterval(() => carGo(car, +car.dataset.idx + 1), 1100); });
    car.addEventListener("mouseleave", () => clearInterval(t));
  });

  /* ---------- galería: scroll del rail (2 miniaturas + flechas) ---------- */
  function railScroll(rail, d) {
    const track = rail.querySelector(".rail-track");
    const slots = track.querySelectorAll("image-slot");
    const visible = 2;
    const max = Math.max(0, slots.length - visible);
    let off = Math.max(0, Math.min(max, (+rail.dataset.roff || 0) + d));
    rail.dataset.roff = off;
    const step = slots[0].offsetHeight + 8;
    track.style.transform = `translateY(${-off * step}px)`;
    const up = rail.querySelector(".rail-nav.up"), dn = rail.querySelector(".rail-nav.down");
    if (up) up.disabled = off <= 0;
    if (dn) dn.disabled = off >= max;
  }
  document.querySelectorAll(".gal__rail").forEach((rail) => railScroll(rail, 0));

  /* ---------- galería: promover miniatura a principal ---------- */
  function promote(slot) {
    const gal = slot.closest(".gal");
    const stage = gal.querySelector(".gal__stage");
    const rail = gal.querySelector(".gal__rail");
    const cur = stage.querySelector("image-slot");
    if (cur === slot) return;
    const ref = slot.nextElementSibling;
    stage.insertBefore(slot, stage.firstChild);   // miniatura → principal
    if (ref) rail.insertBefore(cur, ref); else rail.appendChild(cur); // principal → su lugar
  }

  /* ---------- galería: lightbox ---------- */
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  function openLightbox(slot) {
    if (!slot || !slot.hasAttribute("data-filled")) {
      showToast("Arrastra una imagen al producto primero");
      return;
    }
    const im = slot.shadowRoot && slot.shadowRoot.querySelector(".frame img");
    const src = im && im.getAttribute("src");
    if (!src) return;
    lbImg.src = src;
    lb.classList.add("show");
  }
  function closeLightbox() { lb.classList.remove("show"); lbImg.removeAttribute("src"); }
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest("[data-lbclose]")) closeLightbox(); });

  /* ============================================================
     ESCALADO
     ============================================================ */
  const scaler = document.getElementById("bookScale");
  function fit() {
    const stage = document.querySelector(".stage");
    const rect = stage.getBoundingClientRect();
    const visibleW = (current === 0 || current === N) ? PAGE_W : SPREAD_W;
    const sideBreathing = window.innerWidth < 700 ? 20 : 32;
    const availW = Math.max(1, rect.width - sideBreathing);
    const availH = Math.max(1, rect.height);
    // Tan grande como quepa sin recortar. La reserva vertical vive en .stage;
    // aquí sólo medimos la caja real para no duplicar restas y evitar huecos.
    const s = Math.min(availW / visibleW, availH / PAGE_H, 1.5);
    scaler.style.zoom = Math.max(0.1, s);
  }
  window.addEventListener("resize", fit);
  fit();

  /* ============================================================
     COTIZACIÓN
     ============================================================ */
  const countEl = document.getElementById("quoteCount");
  function refreshCount() {
    const n = quoteCount();
    countEl.textContent = n;
    countEl.style.display = n ? "grid" : "none";
  }
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");
  let toastT;
  function showToast(msg) {
    toastMsg.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove("show"), 2000);
  }
  function changeQty(sku, delta) {
    const next = (quote[sku] || 0) + delta;
    if (next <= 0) delete quote[sku]; else quote[sku] = next;
    saveQuote();
    refreshCount();
    const wrap = document.querySelector(`[data-wrap="${sku}"]`);
    if (wrap) wrap.innerHTML = addControl(sku);
    if (delta > 0) showToast(`Agregado · ${quoteCount()} ítem${quoteCount() !== 1 ? "s" : ""} en el carro`);
  }
  document.getElementById("quoteBtn").addEventListener("click", () => {
    const n = quoteCount();
    if (!n) { showToast("Tu carro está vacío"); return; }
    if (confirm(`Tienes ${n} ítem(s) en tu carro.\n\n¿Vaciar el carro?`)) {
      quote = {}; saveQuote(); refreshCount();
      document.querySelectorAll("[data-wrap]").forEach((w) => { w.innerHTML = addControl(w.dataset.wrap); });
      showToast("Carro vaciado");
    }
  });

  /* iconos estáticos del header */
  document.querySelectorAll("[data-icon]").forEach((el) => { el.innerHTML = ICON[el.dataset.icon] || ""; });

  /* fallback del logo si la URL remota no carga */
  document.querySelectorAll(".logo-img").forEach((img) => {
    const swap = () => {
      const t = img.parentNode.querySelector(".logo-text");
      if (t) { img.style.display = "none"; t.style.display = "inline-flex"; }
    };
    if (img.complete && img.naturalWidth === 0) swap();
    img.addEventListener("error", swap);
  });

  /* tip inicial */
  const tip = document.getElementById("tip");
  let tipT = setTimeout(hideTip, 5000);
  function hideTip() { if (tip) tip.classList.add("hide"); clearTimeout(tipT); }

  refreshCount();
  applyZ(-1);
  edgeHide();
  updateHud();
})();
