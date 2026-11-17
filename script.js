/* AveStore – logika antarmuka.
 * Data yang dapat disesuaikan berada di config.js.
 */
(() => {
  "use strict";

  const CONFIG = window.AVESTORE_CONFIG || {};
  const STORE = CONFIG.store || { name: "AveStore", tagline: "Temukan suara, ciptakan cerita.", description: "" };
  const CONTACT = CONFIG.contact || {};
  const CATEGORIES = Array.isArray(CONFIG.categories) ? CONFIG.categories : [];
  const PRODUCTS = Array.isArray(CONFIG.products) ? CONFIG.products : [];
  const PROMOTION = CONFIG.promotion || {};
  const STORAGE = {
    cart: "avestore-cart-v1",
    favorites: "avestore-favorites-v1"
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function loadJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      toast("Penyimpanan browser tidak tersedia. Perubahan hanya berlaku sementara.");
      return false;
    }
  }

  function formatPrice(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "Harga belum diatur";
    return new Intl.NumberFormat(CONFIG.locale || "id-ID", {
      style: "currency",
      currency: CONFIG.currency || "IDR",
      maximumFractionDigits: 0
    }).format(number);
  }

  function normalizeWhatsApp(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function validExternalURL(value) {
    if (!value) return "";
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  function whatsappURL(message) {
    const number = normalizeWhatsApp(CONTACT.whatsapp);
    if (!number) return "";
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  const ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    cart: '<path d="M3 4h2.5l2.2 11h10.6L20.5 8H6.2"/><circle cx="9" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
    send: '<path d="M21 3 10 14"/><path d="M21 3l-6.5 18-4-7-7-4z"/>',
    "chev-r": '<path d="m9 6 6 6-6 6"/>',
    "chev-l": '<path d="m15 6-6 6 6 6"/>',
    "chev-d": '<path d="m6 9 6 6 6-6"/>',
    "arrow-r": '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    package: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9M7.5 5.5l9 5"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    message: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
    "list-check": '<path d="m3 6 2 2 4-4M3 14l2 2 4-4M13 6h8M13 14h8M13 19h8"/>',
    guitar: '<path d="M14 5 19 0M16 7l5-5M4 14l7-7M8 18l7-7M5 13c-2 2-3 5-1 7s5 1 7-1l5-5-6-6-5 5Z"/><path d="m10 14 2 2M17 3l4 4"/>',
    truck: '<path d="M2 6h11v10H2z"/><path d="M13 9h4l4 4v3h-8"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    shield: '<path d="M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
    spark: '<path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    pin: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9.5 5 2.5-5 2.5z" fill="currentColor"/>',
    tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.3 2.6 2 4.3 5 4.5"/>',
    facebook: '<path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V9c0-.3.2-.5.5-.5z"/>',
    whatsapp: '<path d="M4 20l1.2-4A8.5 8.5 0 1 1 8.2 19z"/><path d="M9.2 8.8c0 3 2.9 5.9 6 6l1-1.5-2-1-1 .7c-.9-.4-1.6-1.1-2-2l.7-1-1-2.2z"/>'
  };

  function icon(name, size = 20) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
  }

  const LOGO = '<svg class="mark" viewBox="0 0 44 44" fill="none" aria-hidden="true"><path d="M10 30.5V13.5L22 5l12 8.5v17L22 39 10 30.5Z" stroke="currentColor" stroke-width="2.3"/><path d="M17 27V17l12-3v10" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/><circle cx="14" cy="28" r="3" fill="currentColor"/><circle cx="26" cy="25" r="3" fill="currentColor"/></svg>';

  /* Ilustrasi vektor bawaan. Set product.image di config.js untuk memakai foto asli. */
  const ART = {
    guitar: `<svg viewBox="0 0 180 210" aria-hidden="true"><path d="M82 20 140 7l5 15-58 14" fill="#8d542e"/><path d="m131 13 8-8 8 2 2 8-8 9" fill="#d7b17a"/><path d="M76 34c-7 5-8 17-3 26-6 9-5 21 5 30 13 12 33 7 38-7 5-15-2-28-14-34-7-8-17-20-26-15Z" fill="#c9894a" stroke="#7b4829" stroke-width="4"/><path d="m82 38 7 8 50-12" stroke="#edcf9a" stroke-width="3"/><circle cx="91" cy="73" r="13" fill="#4b3022"/><circle cx="91" cy="73" r="7" fill="#d6ad70"/><path d="m90 73 48-39M88 77l48-39M86 80l48-39" stroke="#f6e2bb" stroke-width="1.1"/><path d="m131 32 15-5 3 8-14 5" fill="#d6ad70"/><path d="m71 90-12 16 14 11 13-16" fill="#9d5c32"/></svg>`,
    electricGuitar: `<svg viewBox="0 0 180 210" aria-hidden="true"><path d="M84 26 143 9l5 15-59 18" fill="#242a2a"/><path d="m135 15 8-8 9 2 2 8-8 9" fill="#c99a60"/><path d="M75 40c-14 4-20 20-12 32-13 12-7 34 9 38 15 4 27-5 29-20 16-4 22-22 10-33-7-7-22-9-36-17Z" fill="#bd3e35" stroke="#742c28" stroke-width="4"/><path d="m84 38 8 9 49-14" stroke="#ddd" stroke-width="3"/><rect x="72" y="70" width="30" height="9" rx="3" fill="#e7e5df"/><rect x="72" y="85" width="28" height="7" rx="3" fill="#ddd"/><path d="m89 75 49-40M87 78l49-40M85 81l49-40" stroke="#fff1ce" stroke-width="1"/><circle cx="82" cy="81" r="4" fill="#343a3a"/></svg>`,
    bass: `<svg viewBox="0 0 180 210" aria-hidden="true"><path d="m85 25 58-17 5 15-59 18" fill="#75452c"/><path d="M77 41c-12 5-17 20-10 31-11 12-7 29 7 35 14 7 29-3 31-17 14-6 17-21 6-32-8-8-22-9-34-17Z" fill="#d09a54" stroke="#86542e" stroke-width="4"/><path d="m87 39 7 8 48-14" stroke="#dfc18a" stroke-width="3"/><rect x="78" y="70" width="27" height="8" rx="3" fill="#373737"/><rect x="76" y="86" width="27" height="7" rx="3" fill="#373737"/><path d="m91 74 48-39M89 77l48-39M87 80l48-39M85 83l48-39" stroke="#fff1d6" stroke-width=".9"/></svg>`,
    piano: `<svg viewBox="0 0 230 150" aria-hidden="true"><rect x="12" y="24" width="206" height="103" rx="9" fill="#282d2e"/><rect x="20" y="34" width="190" height="72" rx="3" fill="#f6f4ed"/><path d="M39 34v72M58 34v72M77 34v72M96 34v72M115 34v72M134 34v72M153 34v72M172 34v72M191 34v72" stroke="#aaa" stroke-width="1.4"/><path d="M33 34h12v42H33zM52 34h12v42H52zM90 34h12v42H90zM109 34h12v42h-12zM128 34h12v42h-12zM166 34h12v42h-12zM185 34h12v42h-12z" fill="#242729"/><rect x="24" y="114" width="182" height="5" rx="2" fill="#101516"/></svg>`,
    keyboard: `<svg viewBox="0 0 230 150" aria-hidden="true"><rect x="10" y="24" width="210" height="105" rx="10" fill="#343a3b"/><rect x="20" y="36" width="68" height="22" rx="4" fill="#91b5a6"/><g fill="#f4f3ec"><rect x="20" y="70" width="180" height="46" rx="3"/><path d="M42 70v46M64 70v46M86 70v46M108 70v46M130 70v46M152 70v46M174 70v46" stroke="#9a9a94" stroke-width="1.5"/></g><g fill="#252a2b"><path d="M36 70h12v24H36zM58 70h12v24H58zM102 70h12v24h-12zM124 70h12v24h-12zM146 70h12v24h-12zM190 70h10v24h-10z"/></g><circle cx="174" cy="47" r="6" fill="#c28a4e"/></svg>`,
    drums: `<svg viewBox="0 0 210 180" aria-hidden="true"><path d="M34 45 20 150M176 45l15 105M103 50v105M62 91 34 150M143 91l33 59" stroke="#737c7a" stroke-width="4"/><ellipse cx="105" cy="126" rx="42" ry="35" fill="#b45e43" stroke="#723d31" stroke-width="4"/><ellipse cx="105" cy="126" rx="32" ry="26" fill="#e7e3d8"/><ellipse cx="51" cy="74" rx="35" ry="9" fill="#d6b66f" stroke="#8b7547" stroke-width="3"/><path d="M51 74v18M16 74v16M86 74v16" stroke="#737c7a" stroke-width="3"/><ellipse cx="151" cy="63" rx="31" ry="8" fill="#d6b66f" stroke="#8b7547" stroke-width="3"/><path d="M151 63v20" stroke="#737c7a" stroke-width="3"/><ellipse cx="105" cy="44" rx="25" ry="7" fill="#d6b66f" stroke="#8b7547" stroke-width="3"/><path d="M105 44v20" stroke="#737c7a" stroke-width="3"/></svg>`,
    ukulele: `<svg viewBox="0 0 180 200" aria-hidden="true"><path d="m83 24 52-13 4 12-53 14" fill="#a36a3b"/><path d="m129 13 9-7 8 3 1 7-8 7" fill="#d2a76e"/><path d="M77 38c-11 5-13 18-7 28-10 10-7 26 7 34 13 8 29 0 31-14 12-7 13-21 3-31-8-7-21-9-34-17Z" fill="#d5a46d" stroke="#8b5c36" stroke-width="4"/><circle cx="88" cy="70" r="10" fill="#603d29"/><path d="m90 70 46-35M88 73l46-35M86 76l46-35" stroke="#f8e6c3" stroke-width="1"/></svg>`,
    violin: `<svg viewBox="0 0 170 210" aria-hidden="true"><path d="m78 20 45-13 4 10-45 14" fill="#7a482c"/><path d="M80 29c-13 7-10 18-3 28-15 8-17 24-8 37-6 14 2 29 16 34l6 25 18-5-7-25c13-9 17-24 7-37 8-13 2-28-10-33 2-12-5-23-19-24Z" fill="#a86537" stroke="#633d29" stroke-width="4"/><path d="m88 27 10 14-3 95M82 58l22 70" stroke="#e6c28e" stroke-width="2"/><path d="m76 92 31-8M78 111l27-7" stroke="#402b20" stroke-width="4"/><path d="m89 146 5 18 6-2-2-18" fill="#4d3828"/></svg>`,
    amplifier: `<svg viewBox="0 0 190 170" aria-hidden="true"><rect x="28" y="12" width="134" height="145" rx="12" fill="#272d2c"/><rect x="37" y="22" width="116" height="25" rx="4" fill="#3b4542"/><circle cx="54" cy="34" r="5" fill="#c79353"/><circle cx="75" cy="34" r="5" fill="#c79353"/><circle cx="96" cy="34" r="5" fill="#c79353"/><rect x="39" y="57" width="112" height="88" rx="6" fill="#444b48"/><circle cx="95" cy="101" r="34" fill="#181c1b" stroke="#737d77" stroke-width="4"/><circle cx="95" cy="101" r="19" fill="#303a36"/><circle cx="95" cy="101" r="7" fill="#a77746"/></svg>`,
    audioInterface: `<svg viewBox="0 0 210 150" aria-hidden="true"><rect x="12" y="25" width="186" height="102" rx="13" fill="#303a38"/><rect x="25" y="38" width="47" height="76" rx="7" fill="#202725"/><circle cx="49" cy="60" r="13" fill="#c78c4d"/><circle cx="49" cy="60" r="5" fill="#57402c"/><circle cx="49" cy="93" r="8" fill="#d4d7d0"/><rect x="88" y="44" width="91" height="18" rx="4" fill="#1c2422"/><rect x="88" y="76" width="91" height="12" rx="4" fill="#68736e"/><circle cx="101" cy="105" r="8" fill="#c68c4a"/><circle cx="127" cy="105" r="8" fill="#c68c4a"/><circle cx="153" cy="105" r="8" fill="#c68c4a"/></svg>`,
    default: `<svg viewBox="0 0 180 150" aria-hidden="true"><circle cx="90" cy="75" r="52" fill="#dce7e1"/><path d="M90 42v66M68 64h44M73 97l34-44" stroke="#477267" stroke-width="7" stroke-linecap="round"/></svg>`
  };

  function toast(message) {
    const element = $("#toast");
    if (!element) return;
    element.textContent = message;
    element.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => element.classList.remove("show"), 2600);
  }

  function iconMarkup(key, size = 20) {
    return icon(key, size);
  }

  function artMarkup(productOrKey, image = "") {
    const key = typeof productOrKey === "string" ? productOrKey : productOrKey?.art;
    const source = image || (typeof productOrKey === "object" ? productOrKey?.image : "");
    if (source) {
      return `<img class="instrument-image" src="${escapeHTML(source)}" alt="${escapeHTML(typeof productOrKey === "object" ? productOrKey.name : "Ilustrasi alat musik")}" loading="lazy">`;
    }
    return ART[key] || ART.default;
  }

  function composeArt(items) {
    return items.map(([key, left, bottom, height, z]) =>
      `<span class="ha" style="left:${left}%;bottom:${bottom}px;height:${height}px;z-index:${z}">${artMarkup(key)}</span>`
    ).join("");
  }

  let cartCloseTimer = 0;
  let cart = loadJSON(STORAGE.cart, []);
  if (!Array.isArray(cart)) cart = [];
  cart = cart.filter(item => item && PRODUCTS.some(product => product.id === item.id))
    .map(item => ({ id: item.id, quantity: Math.max(1, Math.min(99, Number(item.quantity) || 1)) }));
  let favorites = loadJSON(STORAGE.favorites, []);
  if (!Array.isArray(favorites)) favorites = [];
  favorites = favorites.filter(id => PRODUCTS.some(product => product.id === id));

  function productById(id) {
    return PRODUCTS.find(product => product.id === id);
  }

  function cartQuantity() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function cartTotal() {
    return cart.reduce((sum, item) => {
      const product = productById(item.id);
      return sum + (product ? Number(product.price || 0) * item.quantity : 0);
    }, 0);
  }

  function persistCart() {
    saveJSON(STORAGE.cart, cart);
    updateCartBadge();
    renderCart();
  }

  function updateCartBadge() {
    const badge = $("#cart-count");
    if (badge) badge.textContent = String(cartQuantity());
    const button = $("#cart-open");
    if (button) button.setAttribute("aria-label", `Buka keranjang, ${cartQuantity()} barang`);
  }

  function addToCart(id) {
    const product = productById(id);
    if (!product) return;
    const existing = cart.find(item => item.id === id);
    if (existing) existing.quantity = Math.min(99, existing.quantity + 1);
    else cart.push({ id, quantity: 1 });
    persistCart();
    toast(`${product.name} ditambahkan ke keranjang.`);
  }

  function changeCartQuantity(id, delta) {
    const item = cart.find(entry => entry.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter(entry => entry.id !== id);
    if (item.quantity > 99) item.quantity = 99;
    persistCart();
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    persistCart();
  }

  function openCart() {
    const overlay = $("#cart-overlay");
    if (!overlay) return;
    clearTimeout(cartCloseTimer);
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    document.body.classList.add("cart-visible");
    $("#cart-close")?.focus();
  }

  function closeCart() {
    const overlay = $("#cart-overlay");
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.body.classList.remove("cart-visible");
    clearTimeout(cartCloseTimer);
    cartCloseTimer = setTimeout(() => { overlay.hidden = true; }, 220);
    $("#cart-open")?.focus();
  }

  function cartHTML() {
    if (!cart.length) {
      return `<div class="cart-empty"><span class="cart-empty-icon">${icon("cart", 34)}</span><strong>Keranjangmu masih kosong.</strong><p>Tambahkan instrumen yang menarik perhatianmu.</p><a class="btn" href="boutique.html">Jelajahi produk</a></div>`;
    }
    return `<div class="cart-items">${cart.map(item => {
      const product = productById(item.id);
      if (!product) return "";
      return `<article class="cart-item" data-cart-item="${escapeHTML(product.id)}">
        <div class="cart-item-art">${artMarkup(product)}</div>
        <div class="cart-item-info">
          <strong>${escapeHTML(product.name)}</strong>
          <span>${formatPrice(product.price)}</span>
          <div class="quantity-control" aria-label="Jumlah ${escapeHTML(product.name)}">
            <button type="button" data-cart-action="decrease" data-id="${escapeHTML(product.id)}" aria-label="Kurangi jumlah">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-cart-action="increase" data-id="${escapeHTML(product.id)}" aria-label="Tambah jumlah">+</button>
            <button type="button" class="remove-item" data-cart-action="remove" data-id="${escapeHTML(product.id)}" aria-label="Hapus ${escapeHTML(product.name)} dari keranjang">Hapus</button>
          </div>
        </div>
        <strong class="cart-line-total">${formatPrice(Number(product.price) * item.quantity)}</strong>
      </article>`;
    }).join("")}</div>`;
  }

  function renderCart() {
    const body = $("#cart-body");
    const total = $("#cart-total");
    const checkout = $("#cart-checkout");
    if (!body || !total || !checkout) return;
    body.innerHTML = cartHTML();
    total.textContent = formatPrice(cartTotal());
    checkout.disabled = cart.length === 0;
    checkout.setAttribute("aria-disabled", String(cart.length === 0));
    updateCartBadge();
  }

  function checkoutCart() {
    if (!cart.length) {
      toast("Keranjang masih kosong.");
      return;
    }
    const lines = cart.map(item => {
      const product = productById(item.id);
      return product ? `- ${product.name} x${item.quantity}: ${formatPrice(Number(product.price) * item.quantity)}` : "";
    }).filter(Boolean);
    const message = `Halo ${STORE.name}, saya ingin menanyakan pesanan berikut:\n${lines.join("\n")}\n\nTotal sementara: ${formatPrice(cartTotal())}\nMohon informasi ketersediaan dan proses pemesanannya.`;
    const url = whatsappURL(message);
    if (!url) {
      toast("Nomor WhatsApp toko belum diatur. Isi contact.whatsapp di config.js.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function headerHTML(page) {
    const active = name => page === name ? ' class="active" aria-current="page"' : "";
    const categories = CATEGORIES.map(category =>
      `<a href="boutique.html?cat=${encodeURIComponent(category.id)}">${escapeHTML(category.label)}</a>`
    ).join("");
    const searchValue = new URLSearchParams(location.search).get("q") || "";
    return `<header class="site-header"><div class="container header-in">
      <a class="logo" href="index.html" aria-label="${escapeHTML(STORE.name)}, beranda">${LOGO}<span>${escapeHTML(STORE.name)}</span></a>
      <nav class="nav" id="nav" aria-label="Navigasi utama">
        <a href="index.html"${active("home")}>Beranda</a>
        <a href="boutique.html"${active("boutique")}>Produk</a>
        <details class="has-menu"><summary>Kategori ${icon("chev-d", 14)}</summary><div class="menu">${categories}</div></details>
        <a href="contact.html#a-propos">Tentang Kami</a>
        <a href="contact.html"${active("contact")}>Kontak</a>
      </nav>
      <form class="search" id="search-form" action="boutique.html" method="get" role="search">
        ${icon("search", 18)}
        <input type="search" name="q" value="${escapeHTML(searchValue)}" placeholder="Cari alat musik..." aria-label="Cari alat musik">
      </form>
      <div class="header-actions">
        <button class="icon-btn cart-open" id="cart-open" type="button" aria-label="Buka keranjang, ${cartQuantity()} barang" aria-controls="cart-overlay">
          ${icon("cart", 24)}<span class="badge-count" id="cart-count">${cartQuantity()}</span>
        </button>
      </div>
      <button class="burger" id="burger" type="button" aria-label="Buka menu" aria-expanded="false" aria-controls="nav">${icon("menu", 24)}</button>
    </div></header>
    <div class="cart-overlay" id="cart-overlay" hidden>
      <button class="cart-backdrop" type="button" data-cart-close aria-label="Tutup keranjang"></button>
      <aside class="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div class="cart-head"><div><span class="eyebrow">AveStore</span><h2 id="cart-title">Keranjang belanja</h2></div><button type="button" class="cart-close" id="cart-close" data-cart-close aria-label="Tutup keranjang">×</button></div>
        <div class="cart-body" id="cart-body"></div>
        <div class="cart-summary"><div class="cart-total-row"><span>Total sementara</span><strong id="cart-total">${formatPrice(0)}</strong></div><p>Biaya pengiriman dan ketersediaan akan dikonfirmasi oleh toko.</p><button class="btn cart-checkout" id="cart-checkout" type="button" disabled>Pesan melalui WhatsApp ${icon("arrow-r", 16)}</button></div>
      </aside>
    </div>`;
  }

  function footerHTML() {
    const socialNames = ["instagram", "tiktok", "facebook", "youtube"];
    const socialLinks = socialNames.map(name => {
      const url = validExternalURL(CONTACT[name]);
      if (!url) return "";
      return `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(name)}">${icon(name, 21)}</a>`;
    }).join("");
    const socialContent = socialLinks || `<p class="social-empty">Akun media sosial dapat ditambahkan melalui config.js.</p>`;
    return `<footer class="site-footer"><div class="container">
      <div class="foot-grid">
        <div class="foot-brand"><a class="logo light" href="index.html">${LOGO}<span>${escapeHTML(STORE.name)}</span></a><p class="tag">${escapeHTML(STORE.tagline || "")}</p><p>${escapeHTML(STORE.description || "")}</p></div>
        <div><h3>Navigasi</h3><ul><li><a href="index.html">Beranda</a></li><li><a href="boutique.html">Semua produk</a></li><li><a href="contact.html#a-propos">Tentang kami</a></li><li><a href="contact.html">Kontak</a></li></ul></div>
        <div><h3>Ikuti AveStore</h3><div class="social">${socialContent}</div></div>
        <div><h3>Butuh bantuan memilih?</h3><p>Konsultasikan kebutuhan alat musik dan perlengkapan audio kepada kami.</p><a class="footer-contact" href="contact.html">Hubungi AveStore ${icon("arrow-r", 16)}</a></div>
      </div>
      <div class="foot-bottom"><span>© ${escapeHTML(STORE.year || new Date().getFullYear())} ${escapeHTML(STORE.name)}. Hak cipta dilindungi.</span><span>${escapeHTML(STORE.tagline || "")}</span></div>
    </div><span class="foot-note" aria-hidden="true">♪</span></footer>`;
  }

  function productCard(product, full = false) {
    const discount = Number(product.oldPrice) > Number(product.price) && Number(product.oldPrice) > 0
      ? Math.round((1 - Number(product.price) / Number(product.oldPrice)) * 100)
      : 0;
    const favorite = favorites.includes(product.id);
    const oldPrice = discount ? `<s>${formatPrice(product.oldPrice)}</s>` : "";
    const details = full
      ? `<p class="desc">${escapeHTML(product.description || "")}</p>
         ${Array.isArray(product.highlights) && product.highlights.length ? `<ul class="perks">${product.highlights.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul>` : ""}
         ${Array.isArray(product.variants) && product.variants.length ? `<div class="variants"><span>Variasi</span><div>${product.variants.map(item => `<span>${escapeHTML(item)}</span>`).join("")}</div></div>` : ""}`
      : "";
    const message = `Halo ${STORE.name}, saya ingin bertanya tentang ${product.name} dengan harga ${formatPrice(product.price)}.`;
    const contactUrl = whatsappURL(message);
    const orderLink = full
      ? `<a class="wa-link" href="${contactUrl ? escapeHTML(contactUrl) : "contact.html"}" ${contactUrl ? 'target="_blank" rel="noopener noreferrer"' : ""}>Tanyakan produk ini ${icon("arrow-r", 14)}</a>`
      : "";
    return `<article class="card" data-product-id="${escapeHTML(product.id)}">
      <div class="card-img ${full ? "large" : ""}">
        ${discount ? `<span class="off">Hemat ${discount}%</span>` : ""}
        <button class="fav" type="button" data-favorite="${escapeHTML(product.id)}" aria-label="${favorite ? "Hapus" : "Tambahkan"} ${escapeHTML(product.name)} ${favorite ? "dari" : "ke"} favorit" aria-pressed="${favorite}">${icon("heart", 19)}</button>
        ${artMarkup(product)}
      </div>
      <div class="card-body">
        <span class="product-category">${escapeHTML(CATEGORIES.find(category => category.id === product.category)?.label || "Alat musik")}</span>
        <h3>${escapeHTML(product.name)}</h3>
        ${details}
        <div class="price"><strong>${formatPrice(product.price)}</strong>${oldPrice}</div>
        <button class="btn-add" type="button" data-add="${escapeHTML(product.id)}">${icon("cart", 16)} Tambah ke keranjang</button>
        ${orderLink}
      </div>
    </article>`;
  }

  const SLIDES = [
    {
      badge: "Mulai dari gitar",
      line1: "Petik nada", line2: "ceritakan kisahmu.",
      description: "Temukan gitar akustik dan elektrik untuk menemani latihan, rekaman, maupun penampilan.",
      button: "Jelajahi gitar", href: "boutique.html?cat=gitar",
      art: [["guitar", 6, 15, 250, 3], ["electricGuitar", 39, 16, 245, 2], ["amplifier", 70, 8, 170, 1]]
    },
    {
      badge: "Untuk tuts dan melodi",
      line1: "Rangkai melodi", line2: "dengan caramu.",
      description: "Jelajahi piano digital dan keyboard untuk belajar, mencipta aransemen, dan tampil.",
      button: "Lihat piano & keyboard", href: "boutique.html?cat=piano-keyboard",
      art: [["piano", 4, 14, 205, 3], ["keyboard", 46, 20, 190, 2]]
    },
    {
      badge: "Bangun ritme",
      line1: "Rasakan irama", line2: "di setiap ketukan.",
      description: "Pilih drum dan instrumen ritme untuk mengisi musik dengan energi dan karakter.",
      button: "Jelajahi drum", href: "boutique.html?cat=drum-perkusi",
      art: [["drums", 20, 10, 250, 3], ["bass", 69, 14, 230, 2]]
    }
  ];

  function initHero() {
    const card = $(".hero-card");
    if (!card) return;
    const dotsBox = $("#hero-dots");
    if (!dotsBox) return;
    let index = 0;
    let interval = 0;
    let fadeTimeout = 0;
    dotsBox.innerHTML = SLIDES.map((slide, i) =>
      `<button type="button" role="tab" aria-label="Tayangan ${i + 1}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"></button>`
    ).join("");
    const dots = $$('button[role="tab"]', dotsBox);

    function show(nextIndex, immediate = false) {
      index = (nextIndex + SLIDES.length) % SLIDES.length;
      const slide = SLIDES[index];
      const apply = () => {
        $("#hero-badge").textContent = slide.badge;
        $("#hero-l1").textContent = slide.line1;
        $("#hero-l2").textContent = slide.line2;
        $("#hero-p").textContent = slide.description;
        const cta = $("#hero-cta");
        cta.href = slide.href;
        cta.firstChild.textContent = `${slide.button} `;
        const heroImage = Array.isArray(STORE.heroImages) ? STORE.heroImages[index] : "";
        $("#hero-art").innerHTML = heroImage
          ? `<img class="hero-photo" src="${escapeHTML(heroImage)}" alt="Pilihan alat musik ${escapeHTML(STORE.name)}">`
          : composeArt(slide.art);
        dots.forEach((dot, i) => {
          dot.setAttribute("aria-selected", String(i === index));
          dot.tabIndex = i === index ? 0 : -1;
        });
        card.classList.remove("is-fading");
      };
      clearTimeout(fadeTimeout);
      if (immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        apply();
        return;
      }
      card.classList.add("is-fading");
      fadeTimeout = setTimeout(apply, 240);
    }

    function start() {
      clearInterval(interval);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        interval = setInterval(() => show(index + 1), 6500);
      }
    }

    $("#hero-prev")?.addEventListener("click", () => { show(index - 1); start(); });
    $("#hero-next")?.addEventListener("click", () => { show(index + 1); start(); });
    dots.forEach((dot, i) => dot.addEventListener("click", () => { show(i); start(); }));
    card.addEventListener("mouseenter", () => clearInterval(interval));
    card.addEventListener("mouseleave", start);
    card.addEventListener("focusin", () => clearInterval(interval));
    card.addEventListener("focusout", event => {
      if (!card.contains(event.relatedTarget)) start();
    });
    show(0, true);
    start();
  }

  function initHome() {
    const grid = $("#cat-grid");
    if (!grid) return;
    grid.innerHTML = CATEGORIES.map(category => `
  <a class="cat" href="boutique.html?cat=${encodeURIComponent(category.id)}">
    <div class="cat-img">
      ${
        category.image
          ? `<img src="${escapeHTML(category.image)}" alt="${escapeHTML(category.label)}" loading="lazy">`
          : artMarkup(category.art)
      }
    </div>
    <span>${escapeHTML(category.label)}</span>
  </a>
`).join("");

    const track = $("#best-track");
    const featured = PRODUCTS.filter(product => product.featured);
    track.innerHTML = featured.length
      ? featured.map(product => productCard(product, false)).join("")
      : `<p class="empty-inline">Produk unggulan akan tampil setelah ditandai pada config.js.</p>`;

    const scrollStep = () => {
      const firstCard = $(".card", track);
      return firstCard ? firstCard.getBoundingClientRect().width + 18 : 280;
    };
    $("#best-prev")?.addEventListener("click", () => track.scrollBy({ left: -scrollStep(), behavior: "smooth" }));
    $("#best-next")?.addEventListener("click", () => track.scrollBy({ left: scrollStep(), behavior: "smooth" }));

    $("#promo-badge").textContent = PROMOTION.badge || "Pilihan AveStore";
    $("#promo-title").textContent = PROMOTION.title || "Temukan instrumen yang tepat,";
    $("#promo-emphasis").textContent = PROMOTION.emphasis || "mulai berkarya hari ini.";
    $("#promo-description").textContent = PROMOTION.description || STORE.description || "";
    $("#promo-link").firstChild.textContent = `${PROMOTION.button || "Jelajahi produk"} `;
    initHero();
  }

  function initShop() {
    const grid = $("#shop-grid");
    if (!grid) return;
    const params = new URLSearchParams(location.search);
    let category = params.get("cat") || "all";
    const query = (params.get("q") || "").trim().toLocaleLowerCase("id-ID");
    if (category !== "all" && !CATEGORIES.some(item => item.id === category)) category = "all";

    const chips = $("#chips");
    chips.innerHTML = [{ id: "all", label: "Semua produk" }, ...CATEGORIES].map(item =>
      `<button class="chip" type="button" data-cat="${escapeHTML(item.id)}" aria-pressed="${item.id === category}">${escapeHTML(item.label)}</button>`
    ).join("");

    function render() {
      const list = PRODUCTS.filter(product => {
        const categoryMatch = category === "all" || product.category === category;
        const haystack = [product.name, product.description, ...(product.highlights || []), ...(product.variants || [])].join(" ").toLocaleLowerCase("id-ID");
        return categoryMatch && (!query || haystack.includes(query));
      });
      grid.innerHTML = list.length ? list.map(product => productCard(product, true)).join("") : "";
      $("#count").textContent = query ? `${list.length} produk ditemukan untuk “${params.get("q") || ""}”` : `${list.length} produk tersedia di katalog`;
      $("#empty").hidden = list.length > 0;
      $$(".chip", chips).forEach(button => button.setAttribute("aria-pressed", String(button.dataset.cat === category)));
    }

    chips.addEventListener("click", event => {
      const button = event.target.closest("[data-cat]");
      if (!button) return;
      category = button.dataset.cat;
      render();
    });
    render();
  }

  function setOptionalLink(element, url, fallback = "#contact-form") {
    if (!element) return;
    if (url) {
      element.href = url;
      element.removeAttribute("aria-disabled");
      if (/^https:\/\//i.test(url)) {
        element.target = "_blank";
        element.rel = "noopener noreferrer";
      }
    } else {
      element.href = fallback;
      element.removeAttribute("target");
      element.removeAttribute("rel");
      element.dataset.notConfigured = "true";
    }
  }

  function initContact() {
    const form = $("#contact-form");
    if (!form) return;
    const address = [CONTACT.address, CONTACT.city].filter(Boolean).join(", ");
    $("#c-address").textContent = address || "Alamat toko belum diatur. Isi contact.address dan contact.city di config.js.";

    const phone = normalizeWhatsApp(CONTACT.whatsapp);
    $("#c-wa-text").textContent = phone ? `+${phone}` : "Nomor WhatsApp belum diatur di config.js.";
    setOptionalLink($("#c-wa"), phone ? `https://wa.me/${phone}` : "");

    const instagram = validExternalURL(CONTACT.instagram);
    $("#c-ig-text").textContent = instagram ? instagram.replace(/^https?:\/\//, "") : "Akun Instagram belum diatur di config.js.";
    setOptionalLink($("#c-ig"), instagram);

    const tiktok = validExternalURL(CONTACT.tiktok);
    $("#c-tt-text").textContent = tiktok ? tiktok.replace(/^https?:\/\//, "") : "Akun TikTok belum diatur di config.js.";
    setOptionalLink($("#c-tt"), tiktok);

    const email = String(CONTACT.email || "").trim();
    $("#c-mail-text").textContent = email || "Alamat email belum diatur di config.js.";
    setOptionalLink($("#c-mail"), email.includes("@") ? `mailto:${email}` : "");

    const ctaURL = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(`Halo ${STORE.name}, saya ingin bertanya tentang produk AveStore.`)}` : (email.includes("@") ? `mailto:${email}` : "");
    setOptionalLink($("#c-cta"), ctaURL);
    if (CONTACT.businessHours) {
      $("#c-hours").hidden = false;
      $("#c-hours").textContent = `Jam operasional: ${CONTACT.businessHours}`;
    }
    $("#about-description").textContent = STORE.description || `${STORE.name} menyediakan alat musik dan perlengkapan audio untuk menemani perjalanan bermusikmu.`;

    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const message = `Halo ${STORE.name},\nNama: ${data.get("name")}\nSubjek: ${data.get("subject") || "-"}\n\n${data.get("message")}`;
      const wa = whatsappURL(message);
      if (wa) {
        window.open(wa, "_blank", "noopener,noreferrer");
        return;
      }
      if (email.includes("@")) {
        const subject = encodeURIComponent(data.get("subject") || `Pesan dari ${data.get("name")}`);
        window.location.href = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(message)}`;
        return;
      }
      toast("Kontak toko belum diatur. Isi nomor WhatsApp atau email di config.js.");
    });
  }

  function hydrate(root = document) {
    $$('[data-icon]', root).forEach(element => {
      element.innerHTML = iconMarkup(element.dataset.icon, Number(element.dataset.size) || 20);
    });
  }

  function initGlobalInteractions() {
    const burger = $("#burger");
    const nav = $("#nav");
    burger?.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(isOpen));
      burger.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
    });

    $("#cart-open")?.addEventListener("click", openCart);
    $("#cart-checkout")?.addEventListener("click", checkoutCart);

    document.addEventListener("click", event => {
      const close = event.target.closest("[data-cart-close]");
      if (close) {
        closeCart();
        return;
      }

      const addButton = event.target.closest("[data-add]");
      if (addButton) {
        addToCart(addButton.dataset.add);
        return;
      }

      const favoriteButton = event.target.closest("[data-favorite]");
      if (favoriteButton) {
        const id = favoriteButton.dataset.favorite;
        if (favorites.includes(id)) favorites = favorites.filter(item => item !== id);
        else favorites.push(id);
        saveJSON(STORAGE.favorites, favorites);
        const active = favorites.includes(id);
        favoriteButton.setAttribute("aria-pressed", String(active));
        const product = productById(id);
        favoriteButton.setAttribute("aria-label", `${active ? "Hapus" : "Tambahkan"} ${product?.name || "produk"} ${active ? "dari" : "ke"} favorit`);
        toast(active ? "Produk ditambahkan ke favorit." : "Produk dihapus dari favorit.");
        return;
      }

      const cartAction = event.target.closest("[data-cart-action]");
      if (cartAction) {
        const { id, cartAction: action } = cartAction.dataset;
        if (action === "increase") changeCartQuantity(id, 1);
        else if (action === "decrease") changeCartQuantity(id, -1);
        else if (action === "remove") removeFromCart(id);
        return;
      }

      const categoryMenu = $(".has-menu");
      if (categoryMenu?.open && !categoryMenu.contains(event.target)) categoryMenu.open = false;

      const unconfigured = event.target.closest("[data-not-configured]");
      if (unconfigured) {
        event.preventDefault();
        toast("Tautan ini belum diatur. Lengkapi data toko di config.js.");
      }

      if (nav?.classList.contains("open") && !event.target.closest("#nav") && !event.target.closest("#burger")) {
        nav.classList.remove("open");
        burger?.setAttribute("aria-expanded", "false");
        burger?.setAttribute("aria-label", "Buka menu");
      }
    });

    document.addEventListener("keydown", event => {
      const overlay = $("#cart-overlay");
      if (event.key === "Escape") {
        if (overlay && !overlay.hidden) closeCart();
        if (nav?.classList.contains("open")) {
          nav.classList.remove("open");
          burger?.setAttribute("aria-expanded", "false");
          burger?.setAttribute("aria-label", "Buka menu");
        }
      }
      if (event.key === "Tab" && overlay && !overlay.hidden) {
        const focusable = $$('button:not([disabled]), a[href], input:not([disabled])', overlay).filter(el => el.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  function initBocchiEasterEgg() {
  const form = $("#search-form");
  if (!form) return;

  let isPlaying = false;

  const popup = document.createElement("div");
  popup.className = "bocchi-popup";
  popup.innerHTML = `
    <img
      src="assets/gif/bocchi-the-rock-bocchi.gif"
      alt="Bocchi the Rock!"
    >
  `;

  document.body.appendChild(popup);

  form.addEventListener("submit", event => {
    const input = form.querySelector('input[name="q"]');
    const query = input?.value.trim().toLowerCase();

    if (query !== "bocchi" || isPlaying) return;

    event.preventDefault();
    isPlaying = true;

    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");

      setTimeout(() => {
        form.submit();
      }, 300);
    }, 2800);
  });
}

  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;
    const header = $("#site-header");
    const footer = $("#site-footer");
    if (header) header.innerHTML = headerHTML(page);
    if (footer) footer.innerHTML = footerHTML();

    updateCartBadge();
    renderCart();
    initHome();
    initShop();
    initContact();
    hydrate();
    initGlobalInteractions();
    initBocchiEasterEgg();
  });
})();