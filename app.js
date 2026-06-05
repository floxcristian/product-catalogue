/* Catálogo Implementos — catálogo principal */
(function () {
  const C = window.CATALOG;
  if (!C) return;

  const CLP = (n) => "$" + n.toLocaleString("es-CL");
  const LOGO = "https://admin.implementos.cl/assets/img/logo-implementos.png";
  const KEY = "implementos_quote_v1";

  const ICON = {
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h2.2l2.1 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.5 1.3 6.6L12 17.8 6.1 20.5l1.3-6.6L2.5 9.4l6.6-.8z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',
    stack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4-8 4-8-4 8-4z"/><path d="M4 12l8 4 8-4M4 17l8 4 8-4"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15"/><path d="M10 11v6M14 11v6"/></svg>',
  };

  const ART = {
    aceite: "filterCart",
    secadores: "canister",
    aire: "airfilter",
    hidraulicos: "cartridge",
    frenos: "pad",
    refrigeracion: "radiator",
    lubricantes: "bottle",
    electrico: "battery",
    correas: "belt",
  };

  const app = document.getElementById("app");
  const allItems = C.categories.flatMap((cat) =>
    cat.products.map((product, index) => ({ cat, product, index }))
  );
  const productBySku = new Map(allItems.map((item) => [item.product.sku, item]));
  const totalItems = allItems.length;
  const offerCount = allItems.filter(({ product }) => isOffer(product)).length;
  const bulkCount = allItems.filter(({ product }) => product.bulkPrice).length;

  let quote = {};
  try { quote = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}

  const state = {
    category: "all",
    flag: "all",
    query: "",
    sort: "category",
    cartOpen: false,
  };

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function norm(value) {
    return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function saveQuote() {
    localStorage.setItem(KEY, JSON.stringify(quote));
  }

  function quoteCount() {
    return Object.values(quote).reduce((sum, qty) => sum + qty, 0);
  }

  function quoteTotal() {
    return Object.entries(quote).reduce((sum, [sku, qty]) => {
      const item = productBySku.get(sku);
      return item ? sum + item.product.price * qty : sum;
    }, 0);
  }

  function isOffer(product) {
    const flags = (product.flags || []).map((f) => norm(f));
    return (product.listPrice && product.listPrice > product.price) ||
      flags.includes("oferta") || flags.includes("cyber");
  }

  function ratingOf(product) {
    if (product.rating) return { value: (+product.rating).toFixed(1), count: product.reviews || 0 };
    let h = 0;
    for (const c of product.sku) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return { value: ((40 + (h % 10)) / 10).toFixed(1), count: 15 + (h % 240) };
  }

  function logoChip(height) {
    return `<span class="logo-mark">
      <img class="logo-img" src="${LOGO}" alt="Implementos" style="height:${height}px">
      <span class="logo-text" style="display:none;font-size:${Math.round(height * 0.58)}px"><b>implementos</b><span>EPYSA</span></span>
    </span>`;
  }

  function slotEl(id, src, placeholder, extraClass) {
    const cls = extraClass ? ` class="${extraClass}"` : "";
    return `<image-slot id="${esc(id)}"${cls} fit="contain" src="${esc(src)}" placeholder="${esc(placeholder || "Foto")}"></image-slot>`;
  }

  function imageSources(product, cat) {
    const count = Math.max(1, Math.min(4, product.imgs || 3));
    const art = ART[cat.id] || "canister";
    return Array.from({ length: count }, (_, i) => window.partImage ? window.partImage(art, i) : "");
  }

  function renderShell() {
    app.innerHTML = `
      <div class="catalog-app">
        <header class="topbar">
          <div class="topbar__brand">
            ${logoChip(44)}
            <div class="topbar__client">
              <span>${esc(C.client.vehicle)}</span>
              <b>${esc(C.client.name)}</b>
            </div>
          </div>
          <button class="cart-button" id="quoteBtn" aria-label="Abrir carro de compras">
            ${ICON.cart}
            <span>Carro</span>
            <b id="quoteCount">0</b>
          </button>
        </header>

        <div class="catalog-layout">
          <aside class="sidebar">
            <section class="client-panel">
              <span class="eyebrow">Catálogo personalizado</span>
              <h1>${esc(C.client.vehicle)}</h1>
              <div class="client-panel__meta">
                <span>${esc(C.client.code)}</span>
                <span>${totalItems} productos</span>
              </div>
            </section>

            <nav class="category-nav" id="categoryNav" aria-label="Categorías"></nav>

            <div class="sidebar__stats">
              <span><b>${offerCount}</b> ofertas</span>
              <span><b>${bulkCount}</b> por mayor</span>
              <span><b>30</b> tiendas</span>
            </div>
          </aside>

          <main class="catalog-main">
            <section class="catalog-toolbar" aria-label="Filtros del catálogo">
              <div class="search-box">
                ${ICON.search}
                <input id="searchInput" type="search" placeholder="Buscar por SKU, marca o producto" autocomplete="off">
              </div>
              <div class="filter-row" id="flagFilters" role="group" aria-label="Tipo de producto"></div>
              <label class="sort-box">
                <span>Orden</span>
                <select id="sortSelect">
                  <option value="category">Categoría</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="brand">Marca</option>
                </select>
              </label>
            </section>

            <div class="result-bar">
              <div>
                <span class="eyebrow">Resultados</span>
                <strong id="resultCount">${totalItems} productos</strong>
              </div>
              <button class="text-button" id="clearFilters" type="button">Limpiar filtros</button>
            </div>

            <div class="catalog-results" id="catalogResults"></div>
          </main>
        </div>

        <div class="toast" id="toast" role="status" aria-live="polite">
          <span>${ICON.check}</span><b id="toastMsg">Agregado</b>
        </div>

        <div class="lightbox" id="lightbox" aria-hidden="true">
          <button class="icon-button lightbox__close" data-lbclose aria-label="Cerrar">${ICON.close}</button>
          <img id="lbImg" alt="Imagen de producto">
        </div>

        <div class="drawer-layer" id="drawerLayer" aria-hidden="true">
          <button class="drawer-backdrop" id="drawerBackdrop" aria-label="Cerrar carro"></button>
          <aside class="cart-drawer" id="cartDrawer" aria-label="Carro de compras"></aside>
        </div>
      </div>`;

    renderCategoryNav();
    renderFlagFilters();
    bindEvents();
    hydrateLogoFallbacks();
    refreshQuote();
    renderResults();
  }

  function renderCategoryNav() {
    const nav = document.getElementById("categoryNav");
    nav.innerHTML = [
      `<button class="category-link" type="button" data-category="all">
        <span>Todos</span><b>${totalItems}</b>
      </button>`,
      ...C.categories.map((cat) => `<button class="category-link" type="button" data-category="${esc(cat.id)}">
        <span>${esc(cat.short || cat.name)}</span><b>${cat.products.length}</b>
      </button>`),
    ].join("");
  }

  function renderFlagFilters() {
    const filters = [
      ["all", "Todos"],
      ["offer", "Ofertas"],
      ["original", "Original"],
      ["bulk", "Por mayor"],
    ];
    document.getElementById("flagFilters").innerHTML = filters.map(([id, label]) =>
      `<button class="chip" type="button" data-flag="${id}">${label}</button>`
    ).join("");
  }

  function bindEvents() {
    document.getElementById("searchInput").addEventListener("input", (event) => {
      state.query = event.target.value;
      renderResults();
    });

    document.getElementById("sortSelect").addEventListener("change", (event) => {
      state.sort = event.target.value;
      renderResults();
      scrollCatalogTop();
    });

    document.getElementById("clearFilters").addEventListener("click", () => {
      state.category = "all";
      state.flag = "all";
      state.query = "";
      state.sort = "category";
      document.getElementById("searchInput").value = "";
      document.getElementById("sortSelect").value = "category";
      renderResults();
      scrollCatalogTop();
    });

    document.getElementById("quoteBtn").addEventListener("click", openCart);
    document.getElementById("drawerBackdrop").addEventListener("click", closeCart);

    app.addEventListener("click", (event) => {
      const category = event.target.closest("[data-category]");
      if (category) {
        state.category = category.dataset.category;
        renderResults();
        scrollCatalogTop();
        return;
      }

      const flag = event.target.closest("[data-flag]");
      if (flag) {
        state.flag = flag.dataset.flag;
        renderResults();
        scrollCatalogTop();
        return;
      }

      const add = event.target.closest("[data-add],[data-inc]");
      if (add) {
        changeQty(add.dataset.add || add.dataset.inc, 1);
        return;
      }

      const dec = event.target.closest("[data-dec]");
      if (dec) {
        changeQty(dec.dataset.dec, -1);
        return;
      }

      const thumb = event.target.closest(".media-strip image-slot");
      if (thumb) {
        promoteImageSlot(thumb);
        return;
      }

      const zoom = event.target.closest("[data-zoom]");
      if (zoom) {
        openLightbox(zoom.closest(".product-media").querySelector(".media-main image-slot"));
        return;
      }

      if (event.target.closest("[data-lbclose]") || event.target === document.getElementById("lightbox")) {
        closeLightbox();
        return;
      }

      if (event.target.closest("[data-cart-close]")) {
        closeCart();
        return;
      }

      if (event.target.closest("[data-clear-cart]")) {
        if (quoteCount() && confirm("¿Vaciar el carro de compras?")) {
          quote = {};
          saveQuote();
          refreshQuote();
          showToast("Carro vaciado");
        }
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (document.getElementById("lightbox").classList.contains("show")) closeLightbox();
      else if (state.cartOpen) closeCart();
    });
  }

  function renderResults() {
    const groups = buildResultGroups();
    const count = groups.reduce((sum, group) => sum + group.items.length, 0);

    document.getElementById("resultCount").textContent =
      `${count} producto${count === 1 ? "" : "s"}`;

    document.querySelectorAll("[data-category]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.category === state.category);
    });
    document.querySelectorAll("[data-flag]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.flag === state.flag);
    });

    const results = document.getElementById("catalogResults");
    if (!count) {
      results.innerHTML = `<section class="empty-state">
        <span class="eyebrow">Sin resultados</span>
        <h2>No encontramos productos con esos filtros</h2>
      </section>`;
      return;
    }

    results.innerHTML = groups.map(({ cat, items }) => renderCategorySection(cat, items)).join("");
    refreshQuoteControls();
  }

  function scrollCatalogTop() {
    const main = document.querySelector(".catalog-main");
    if (!main) return;

    const mainStyle = getComputedStyle(main);
    const mainScrolls = mainStyle.overflowY !== "visible" && main.scrollHeight > main.clientHeight + 1;
    const target = mainScrolls ? main : window;
    target.scrollTo({ top: 0, behavior: "smooth" });
  }

  function buildResultGroups() {
    let items = allItems.filter(({ cat, product }) => {
      if (state.category !== "all" && cat.id !== state.category) return false;
      if (state.flag === "offer" && !isOffer(product)) return false;
      if (state.flag === "original" && !(product.flags || []).some((f) => norm(f) === "original")) return false;
      if (state.flag === "bulk" && !product.bulkPrice) return false;

      const q = norm(state.query);
      if (!q) return true;
      const text = norm([
        cat.name,
        cat.kicker,
        product.brand,
        product.sku,
        product.title,
        product.subtitle,
        ...(product.flags || []),
        ...product.specs.flat(),
      ].join(" "));
      return text.includes(q);
    });

    if (state.sort === "price-asc") items = items.slice().sort((a, b) => a.product.price - b.product.price);
    if (state.sort === "price-desc") items = items.slice().sort((a, b) => b.product.price - a.product.price);
    if (state.sort === "brand") items = items.slice().sort((a, b) => a.product.brand.localeCompare(b.product.brand, "es"));

    if (state.category === "all" && state.sort !== "category") {
      return [{
        cat: sortedSectionMeta(),
        items,
      }];
    }

    const groups = [];
    for (const cat of C.categories) {
      const catItems = items.filter((item) => item.cat.id === cat.id);
      if (catItems.length) groups.push({ cat, items: catItems });
    }
    return groups;
  }

  function sortedSectionMeta() {
    const copy = {
      "price-asc": "Productos de todas las categorías ordenados desde el menor precio.",
      "price-desc": "Productos de todas las categorías ordenados desde el mayor precio.",
      brand: "Productos de todas las categorías ordenados por marca.",
    };

    return {
      id: "ordenado",
      kicker: "Vista ordenada",
      name: "Todos los productos",
      blurb: copy[state.sort] || "Productos de todas las categorías.",
      short: "Productos",
    };
  }

  function renderCategorySection(cat, items) {
    return `<section class="category-section" id="cat-${esc(cat.id)}">
      <div class="section-head">
        <div>
          <span class="eyebrow">${esc(cat.kicker)}</span>
          <h2>${esc(cat.name)}</h2>
          <p>${esc(cat.blurb)}</p>
        </div>
        <strong>${String(items.length).padStart(2, "0")}</strong>
      </div>
      <div class="product-grid">
        ${items.map((item) => renderProductCard(item)).join("")}
      </div>
    </section>`;
  }

  function renderProductCard({ cat, product, index }) {
    const rating = ratingOf(product);
    const specs = product.specs.slice(0, 5).map(([key, value]) =>
      `<li><span>${esc(key)}</span><b>${esc(value)}</b></li>`
    ).join("");

    return `<article class="product-card" data-sku="${esc(product.sku)}">
      ${renderProductMedia(cat, product, index)}
      <div class="product-body">
        <div class="product-kicker">
          <span>${esc(product.brand)}</span>
          <b>${esc(product.sku)}</b>
        </div>
        <h3>${esc(product.title)}</h3>
        <p>${esc(product.subtitle || "")}</p>
        <ul class="spec-list">${specs}</ul>
      </div>
      <div class="product-footer">
        <div class="rating">${ICON.star}<b>${rating.value}</b><span>(${rating.count})</span></div>
        ${renderPrice(product)}
        <div class="addwrap" data-wrap="${esc(product.sku)}">${addControl(product.sku)}</div>
      </div>
    </article>`;
  }

  function renderProductMedia(cat, product, index) {
    const sources = imageSources(product, cat);
    const baseId = `slot-${cat.id}-${index}`;
    const main = slotEl(`${baseId}-0`, sources[0], "Foto principal");
    const thumbs = sources.slice(1).map((src, i) =>
      slotEl(`${baseId}-${i + 1}`, src, "Foto", "media-thumb")
    ).join("");
    const flags = renderFlags(product);

    return `<div class="product-media">
      ${flags}
      <div class="media-main">
        ${main}
        <button class="icon-button media-zoom" type="button" data-zoom aria-label="Ver imagen en grande">${ICON.expand}</button>
      </div>
      ${thumbs ? `<div class="media-strip">${thumbs}</div>` : ""}
    </div>`;
  }

  function renderFlags(product) {
    const flags = (product.flags || []).map((flag) =>
      `<span class="flag flag--${norm(flag).replace(/[^a-z0-9]+/g, "")}">${esc(flag)}</span>`
    );
    if (product.bulkPrice) {
      const off = Math.round((product.price - product.bulkPrice) / product.price * 100);
      flags.push(`<span class="flag flag--bulk">${ICON.stack} Mayor -${off}%</span>`);
    }
    return flags.length ? `<div class="product-flags">${flags.join("")}</div>` : "";
  }

  function renderPrice(product) {
    if (product.listPrice && product.listPrice > product.price) {
      const off = Math.round((product.listPrice - product.price) / product.listPrice * 100);
      return `<div class="price-block">
        <strong class="price price--offer">${CLP(product.price)}</strong>
        <span><s>${CLP(product.listPrice)}</s><b>-${off}%</b></span>
      </div>`;
    }
    return `<div class="price-block"><strong class="price">${CLP(product.price)}</strong><span>C/IVA</span></div>`;
  }

  function addControl(sku) {
    const qty = quote[sku] || 0;
    if (!qty) {
      return `<button class="add-button" type="button" data-add="${esc(sku)}">${ICON.plus}<span>Agregar</span></button>`;
    }
    return `<div class="qty-stepper">
      <button type="button" data-dec="${esc(sku)}" aria-label="Quitar uno">${ICON.minus}</button>
      <b>${qty}</b>
      <button type="button" data-inc="${esc(sku)}" aria-label="Agregar uno">${ICON.plus}</button>
    </div>`;
  }

  function changeQty(sku, delta) {
    const item = productBySku.get(sku);
    if (!item) return;

    const next = (quote[sku] || 0) + delta;
    if (next <= 0) delete quote[sku];
    else quote[sku] = next;

    saveQuote();
    refreshQuote();
    if (delta > 0) showToast(`${item.product.brand} agregado`);
  }

  function refreshQuote() {
    const count = quoteCount();
    const countEl = document.getElementById("quoteCount");
    if (countEl) countEl.textContent = count;
    refreshQuoteControls();
    if (state.cartOpen) renderCartDrawer();
  }

  function refreshQuoteControls() {
    document.querySelectorAll("[data-wrap]").forEach((wrap) => {
      wrap.innerHTML = addControl(wrap.dataset.wrap);
    });
  }

  function openCart() {
    state.cartOpen = true;
    document.body.classList.add("drawer-open");
    document.getElementById("drawerLayer").setAttribute("aria-hidden", "false");
    renderCartDrawer();
  }

  function closeCart() {
    state.cartOpen = false;
    document.body.classList.remove("drawer-open");
    document.getElementById("drawerLayer").setAttribute("aria-hidden", "true");
  }

  function renderCartDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const entries = Object.entries(quote)
      .map(([sku, qty]) => ({ item: productBySku.get(sku), qty }))
      .filter(({ item }) => item);

    drawer.innerHTML = `<div class="drawer-head">
      <div>
        <span class="eyebrow">Carro de compras</span>
        <h2>${quoteCount()} ítem${quoteCount() === 1 ? "" : "s"}</h2>
      </div>
      <button class="icon-button" type="button" data-cart-close aria-label="Cerrar">${ICON.close}</button>
    </div>
    <div class="cart-lines">
      ${entries.length ? entries.map(renderCartLine).join("") : `<div class="cart-empty">Tu carro está vacío.</div>`}
    </div>
    <div class="drawer-total">
      <span>Total estimado</span>
      <strong>${CLP(quoteTotal())}</strong>
    </div>
    <div class="drawer-actions">
      <button class="secondary-button" type="button" data-clear-cart>${ICON.trash}<span>Vaciar</span></button>
      <a class="primary-link" href="https://www.implementos.cl/" target="_blank" rel="noreferrer">Ir a implementos.cl</a>
    </div>`;
  }

  function renderCartLine({ item, qty }) {
    const { product, cat } = item;
    return `<article class="cart-line">
      <div>
        <span>${esc(cat.short || cat.name)}</span>
        <h3>${esc(product.title)}</h3>
        <p>${esc(product.sku)} · ${esc(product.brand)}</p>
      </div>
      <div class="cart-line__side">
        <strong>${CLP(product.price * qty)}</strong>
        <div class="qty-stepper qty-stepper--small">
          <button type="button" data-dec="${esc(product.sku)}" aria-label="Quitar uno">${ICON.minus}</button>
          <b>${qty}</b>
          <button type="button" data-inc="${esc(product.sku)}" aria-label="Agregar uno">${ICON.plus}</button>
        </div>
      </div>
    </article>`;
  }

  function promoteImageSlot(slot) {
    const media = slot.closest(".product-media");
    const main = media.querySelector(".media-main");
    const current = main.querySelector("image-slot");
    if (!current || current === slot) return;

    const strip = media.querySelector(".media-strip");
    const before = slot.nextElementSibling;
    main.insertBefore(slot, main.firstChild);
    if (before) strip.insertBefore(current, before);
    else strip.appendChild(current);
  }

  function openLightbox(slot) {
    const img = slot && slot.shadowRoot && slot.shadowRoot.querySelector(".frame img");
    const src = img && img.getAttribute("src");
    if (!src) {
      showToast("Imagen no disponible");
      return;
    }
    document.getElementById("lbImg").src = src;
    document.getElementById("lightbox").classList.add("show");
    document.getElementById("lightbox").setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    document.getElementById("lbImg").removeAttribute("src");
  }

  let toastTimer;
  function showToast(message) {
    const toast = document.getElementById("toast");
    document.getElementById("toastMsg").textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function hydrateLogoFallbacks() {
    document.querySelectorAll(".logo-img").forEach((img) => {
      const swap = () => {
        const fallback = img.parentNode.querySelector(".logo-text");
        if (fallback) {
          img.style.display = "none";
          fallback.style.display = "inline-flex";
        }
      };
      if (img.complete && img.naturalWidth === 0) swap();
      img.addEventListener("error", swap);
    });
  }

  renderShell();
})();
