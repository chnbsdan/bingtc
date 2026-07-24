// _worker.js - 首页 + API 合并（完整版）
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const base = `${url.protocol}//${url.host}`;

    // ===== 静态资源放行 =====
    if (
      path.startsWith('/webp/') ||
      path.startsWith('/images/') ||
      path.startsWith('/1080pimages/') ||
      path.startsWith('/json/') ||
      path === '/favicon.ico' ||
      path.endsWith('.css') ||
      path.endsWith('.js') ||
      path.endsWith('.png') ||
      path.endsWith('.jpg') ||
      path.endsWith('.jpeg') ||
      path.endsWith('.webp')
    ) {
      return fetch(request);
    }

    // ===== 首页 =====
    if (path === '/' || path === '/index.html') {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>每日一图 - 留存世间奇景</title>
  <link rel="icon" href="/favicon.ico" type="image/x-icon" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
  <link rel="stylesheet" href="https://fontsapi.zeoseven.com/488/main/result.css" />
  <style>
    :root {
      --bg-body: #121212;
      --bg-hero-overlay: linear-gradient(to top, rgba(0,0,0,0.8), transparent 40%);
      --bg-yiyan: #1e1e1e;
      --bg-history: #1e1e1e;
      --bg-card: #000;
      --bg-modal: rgba(30,30,30,0.9);
      --text-primary: #e0e0e0;
      --text-secondary: #fff;
      --text-muted: #aaa;
      --border-light: rgba(255,255,255,0.1);
      --shadow-card: 0 4px 8px rgba(0,0,0,0.3);
      --shadow-card-hover: 0 8px 16px rgba(0,0,0,0.4);
      --blur-bg: rgba(30,30,30,0.8);
      --menu-hover-border: #fff;
    }
    [data-theme="light"] {
      --bg-body: #f5f5f5;
      --bg-hero-overlay: linear-gradient(to top, rgba(255,255,255,0.85), transparent 40%);
      --bg-yiyan: #ffffff;
      --bg-history: #ffffff;
      --bg-card: #ffffff;
      --bg-modal: rgba(255,255,255,0.95);
      --text-primary: #222222;
      --text-secondary: #111111;
      --text-muted: #555555;
      --border-light: rgba(0,0,0,0.1);
      --shadow-card: 0 4px 8px rgba(0,0,0,0.1);
      --shadow-card-hover: 0 8px 16px rgba(0,0,0,0.2);
      --blur-bg: rgba(255,255,255,0.8);
      --menu-hover-border: #333;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "STDongGuanTi", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      color: var(--text-primary);
      background-color: var(--bg-body);
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      transition: background-color 0.3s, color 0.3s;
    }
    .floating-menu {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1001;
      display: flex;
      background: var(--blur-bg);
      backdrop-filter: blur(10px);
      border-radius: 30px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
      overflow: hidden;
    }
    .floating-menu::after { content: ""; width: 15px; border-radius: 30px; }
    .menu-item {
      display: flex;
      align-items: center;
      padding: 5px 10px;
      color: var(--text-primary);
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s, border-color 0.2s;
    }
    .menu-item:hover { color: var(--text-secondary); border-bottom: 1px solid var(--menu-hover-border); }
    .menu-icon { width: 22px; height: 22px; border-radius: 50%; }
    @media (max-width: 500px) { .floating-menu { display: none; } }
    .theme-toggle {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1002;
      background: var(--blur-bg);
      backdrop-filter: blur(10px);
      border: none;
      border-radius: 50%;
      width: 44px;
      height: 44px;
      font-size: 1.3rem;
      color: var(--text-primary);
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      transition: background 0.3s, color 0.3s, transform 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .theme-toggle:hover { transform: scale(1.05); color: var(--text-secondary); }
    @media (max-width: 500px) { .theme-toggle { top: 15px; right: 15px; width: 40px; height: 40px; font-size: 1.1rem; } }
    .hero { position: relative; width: 100%; height: 100vh; overflow: hidden; }
    .hero img { width: 100%; height: 100%; object-fit: cover; }
    .hero:hover img { transform: scale(1.02); }
    .hero .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--bg-hero-overlay);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 40px;
      color: var(--text-secondary);
      transition: background 0.3s;
    }
    .hero .center-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      width: 100%;
    }
    .hero .center-text h1 { font-size: 3rem; font-weight: 300; margin-bottom: 15px; text-shadow: 0 2px 10px rgba(0,0,0,0.8); }
    .hero .center-text p { font-size: 1.2rem; max-width: 600px; margin: 0 auto; text-shadow: 0 2px 6px rgba(0,0,0,0.8); }
    .hero .overlay .date { font-size: 2rem; margin-bottom: 10px; font-weight: 300; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
    .hero .overlay .copy { font-size: 1.2rem; max-width: 1000px; font-weight: 300; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
    .yiyan {
      background: var(--bg-yiyan);
      color: var(--text-primary);
      padding: 40px 0 20px 0;
      text-align: center;
      font-size: 1.2rem;
      line-height: 1.8;
      border-top: 1px solid var(--border-light);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: relative;
      transition: background 0.3s, color 0.3s, border-color 0.3s;
    }
    .yiyan-content {
      max-width: 800px;
      margin: 0 auto;
      font-weight: 300;
      position: relative;
      padding: 20px 20px;
      margin: 0 20px;
    }
    .yiyan-content::before, .yiyan-content::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      border-color: var(--border-light);
      border-style: solid;
    }
    .yiyan-content::before { top: 0; left: 0; border-width: 2px 0 0 2px; }
    .yiyan-content::after { bottom: 0; right: 0; border-width: 0 2px 2px 0; }
    .yiyan-loading {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid var(--border-light);
      border-radius: 50%;
      border-top-color: var(--text-secondary);
      animation: spin 1s ease-in-out infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .history-container { padding: 40px 20px; background: var(--bg-history); flex: 1; transition: background 0.3s; }
    .history {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin: 0 auto;
      max-width: 1200px;
    }
    @media (max-width: 1200px) { .history { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 768px) { .history { grid-template-columns: 1fr; } }
    .img-loading {
      filter: blur(20px);
      opacity: 0;
      transform: scale(1.1);
      transition: filter 0.8s ease, opacity 0.8s ease, transform 0.8s ease;
      background: #2d2d2d;
    }
    .img-loading.img-loaded { filter: blur(0); opacity: 1; transform: scale(1); }
    .card {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      background: var(--bg-card);
      box-shadow: var(--shadow-card);
      transition: box-shadow 0.3s, transform 0.3s, background 0.3s;
      cursor: pointer;
    }
    .card:hover { transform: translateY(-5px); box-shadow: var(--shadow-card-hover); }
    .card img { width: 100%; height: 250px; object-fit: cover; display: block; transition: transform 0.5s ease; }
    .card:hover img { transform: scale(1.05); }
    .card .date-label {
      position: absolute;
      bottom: 15px;
      left: 15px;
      background: rgba(0,0,0,0.7);
      color: #fff;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 0.8rem;
      border: 1px solid rgba(255,255,255,0.2);
      transition: all 0.3s ease;
    }
    .card .copy-text {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 15px;
      background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
      color: #fff;
      font-size: 0.9rem;
      text-align: center;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    }
    .card:hover .date-label { opacity: 0; transform: translateY(10px); }
    .card:hover .copy-text { opacity: 1; transform: translateY(0); }
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      display: none;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease, background 0.3s ease, backdrop-filter 0.3s ease;
      background: rgba(0,0,0,0);
    }
    .modal.active {
      display: flex;
      opacity: 1;
      visibility: visible;
      background: var(--bg-modal);
      backdrop-filter: blur(10px);
    }
    .modal-content {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 95vw;
      max-height: 95vh;
      transform: scale(0.95);
      transition: transform 0.3s ease, opacity 0.3s ease;
      opacity: 0;
    }
    .modal.active .modal-content { transform: scale(1); opacity: 1; }
    .modal-img {
      display: block;
      max-width: 90vw;
      max-height: 85vh;
      width: auto;
      height: auto;
      object-fit: contain;
      border-radius: 4px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.6);
      user-select: none;
      -webkit-user-drag: none;
      transition: transform 0.1s ease;
      transform-origin: center center;
      cursor: grab;
    }
    .modal-img:active { cursor: grabbing; }
    .modal-close {
      position: fixed;
      top: 24px;
      left: 24px;
      z-index: 1010;
      width: 44px;
      height: 44px;
      border: none;
      border-radius: 50%;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(8px);
      color: rgba(255,255,255,0.9);
      font-size: 1.4rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s ease;
      opacity: 0;
      transform: scale(0.85);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .modal.active .modal-close { opacity: 1; transform: scale(1); }
    .modal-close:hover { background: rgba(200,40,40,0.8); color: #fff; transform: scale(1.08) rotate(90deg); box-shadow: 0 4px 20px rgba(200,40,40,0.4); }
    .modal-close:active { transform: scale(0.92); }
    .modal-nav {
      position: fixed;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0,0,0,0.5);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 1.8rem;
      cursor: pointer;
      z-index: 1010;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s, transform 0.2s;
      backdrop-filter: blur(4px);
      opacity: 0.7;
    }
    .modal-nav:hover { background: rgba(0,0,0,0.8); opacity: 1; transform: translateY(-50%) scale(1.05); }
    .modal-nav-left { left: 20px; }
    .modal-nav-right { right: 20px; }
    .zoom-hint {
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255,255,255,0.6);
      font-size: 0.9rem;
      background: rgba(0,0,0,0.5);
      padding: 6px 18px;
      border-radius: 30px;
      backdrop-filter: blur(4px);
      z-index: 1010;
      pointer-events: none;
      transition: opacity 0.5s;
      opacity: 0;
    }
    .modal.active .zoom-hint { opacity: 1; }
    .modal-caption {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255,255,255,0.8);
      font-size: 1rem;
      background: rgba(0,0,0,0.4);
      padding: 8px 20px;
      border-radius: 30px;
      backdrop-filter: blur(4px);
      z-index: 10;
      pointer-events: none;
      text-align: center;
      max-width: 80%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .modal-img-container:hover .modal-caption { opacity: 1; }
    .modal-img-container {
      position: relative;
      max-width: 90vw;
      max-height: 80vh;
      overflow: auto;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      background: rgba(0,0,0,0.3);
      cursor: grab;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-img-container:active { cursor: grabbing; }
    @media (max-width: 768px) {
      .modal-nav { width: 40px; height: 40px; font-size: 1.2rem; }
      .modal-nav-left { left: 8px; }
      .modal-nav-right { right: 8px; }
      .modal-close { top: 16px; left: 16px; width: 38px; height: 38px; font-size: 1.2rem; }
      .zoom-hint { font-size: 0.7rem; padding: 4px 12px; bottom: 15px; }
      .modal-caption { bottom: 12px; font-size: 0.75rem; padding: 4px 12px; max-width: 85%; white-space: normal; }
      .modal-img { max-width: 95vw; max-height: 80vh; }
    }
    footer {
      background: var(--bg-yiyan);
      color: var(--text-muted);
      padding: 30px 15px;
      text-align: center;
      font-size: 0.9rem;
      transition: background 0.3s, color 0.3s;
    }
    footer a { color: var(--text-primary); text-decoration: none; transition: color 0.2s ease; }
    footer a:hover { color: var(--text-secondary); text-decoration: underline; }
    footer div { margin-bottom: 10px; }
    #vercount_value_site_pv, #vercount_value_site_uv { font-weight: bold; color: var(--text-primary); }
  </style>
</head>
<body>
  <nav class="floating-menu">
    <a href="/" style="display:flex;align-items:center;margin:0 5px 0 5px"><img src="favicon.ico" alt="Icon" class="menu-icon" /></a>
    <a href="https://aoso.hangdn.com/" class="menu-item" target="_blank">站长博客</a>
    <a href="https://aoso.hangdn.com/" class="menu-item" target="_blank">个人主页</a>
    <a href="/api" class="menu-item" target="_blank">接口文档</a>
    <a href="https://github.com/chnbsdan/bingtc" class="menu-item" target="_blank">项目地址</a>
  </nav>
  <button class="theme-toggle" id="themeToggle" aria-label="切换明暗主题"><i class="fas fa-moon"></i></button>
  <div class="hero">
    <img id="hero-img" class="img-loading" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmQyZDJkIi8+PC9zdmc+" alt="Today's Bing Wallpaper" />
    <div class="overlay">
      <div class="center-text">
        <h1>Bing每日一图</h1>
        <p>腾讯EO强力支持，实现每日一图接口，保存最近30天内的bing壁纸</p>
        <p>由清羽飞扬进行维护，每日更新，每日精彩</p>
      </div>
      <div class="date" id="hero-date"></div>
      <div class="copy" id="hero-copy"></div>
    </div>
  </div>
  <div class="yiyan">
    <div class="yiyan-content"><span class="yiyan-loading"></span></div>
    <div class="yiyan-signature">----送给素不相识的陌生人----</div>
  </div>
  <div class="history-container">
    <div class="history" id="history"></div>
  </div>
  <footer>
    <script defer src="https://cn.vercount.one/js"></script>
    <div style="margin-bottom:0.5em">网站总请求量：<span id="vercount_value_site_pv">🤕</span> | 独立访客数：<span id="vercount_value_site_uv">🤕</span></div>
    <div style="margin-bottom:0.5em">本站已运行：<span id="running-days">计算中...</span> | 距离下次更新：<span id="next-update">计算中...</span></div>
    <div style="margin-bottom:0.5em">Powered by <a href="https://github.com/features/actions" target="_blank" rel="nofollow">GitHub Actions</a> | <a href="https://cn.bing.com" target="_blank" rel="nofollow">Bing_CN</a> | <a href="https://console.tencentcloud.com/edgeone/makers" target="_blank" rel="nofollow">EdgeOne</a></div>
    <div>项目地址: <a href="https://github.com/chnbsdan/bingtc" target="_blank" rel="nofollow">bingtc</a> | MIT License &copy; <span id="year"></span> | <a href="https://aoso.hangdn.com/" target="_blank" rel="nofollow">Hangdn Notes</a></div>
    <script>
      document.getElementById("year").textContent = new Date().getFullYear();
      function updateTimes() {
        var startDate = new Date('2026-4-20');
        var now = new Date();
        var runningDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
        document.getElementById("running-days").textContent = runningDays + " 天";
        var tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + (now.getHours() >= 12 ? 1 : 0));
        tomorrow.setHours(12, 0, 0, 0);
        var diff = tomorrow - now;
        var hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * 1000 * 60 * 60;
        var minutes = Math.floor(diff / (1000 * 60));
        diff -= minutes * 1000 * 60;
        var seconds = Math.floor(diff / 1000);
        document.getElementById("next-update").textContent = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
      }
      updateTimes();
      setInterval(updateTimes, 1000);
    </script>
  </footer>
  <div class="modal" id="imageModal">
    <button class="modal-close" id="modalClose" aria-label="关闭预览"><i class="fas fa-times"></i></button>
    <button class="modal-nav modal-nav-left" id="navLeft" aria-label="上一张"><i class="fas fa-chevron-left"></i></button>
    <button class="modal-nav modal-nav-right" id="navRight" aria-label="下一张"><i class="fas fa-chevron-right"></i></button>
    <div class="modal-content">
      <div class="modal-img-container">
        <img class="modal-img" id="modalImage" src="" alt="" />
        <div class="modal-caption" id="modalCaption"></div>
      </div>
    </div>
    <div class="zoom-hint">🖱 滚动缩放 &middot; 拖动平移</div>
  </div>
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      var toggleBtn = document.getElementById('themeToggle');
      var icon = toggleBtn.querySelector('i');
      var currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
      function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
      }
      setTheme(currentTheme);
      toggleBtn.addEventListener('click', function() {
        var current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'light' ? 'dark' : 'light');
      });
      var imageData = [];
      var currentIndex = 0;
      var modal = document.getElementById("imageModal");
      var modalImage = document.getElementById("modalImage");
      var modalCaption = document.getElementById("modalCaption");
      var modalClose = document.getElementById("modalClose");
      var navLeft = document.getElementById("navLeft");
      var navRight = document.getElementById("navRight");
      var imgContainer = document.querySelector('.modal-img-container');
      var scale = 1;
      var translateX = 0;
      var translateY = 0;
      var isDragging = false;
      var startX = 0;
      var startY = 0;
      var lastTranslateX = 0;
      var lastTranslateY = 0;
      function updateTransform() {
        modalImage.style.transform = 'translate(' + translateX + 'px, ' + translateY + 'px) scale(' + scale + ')';
      }
      function resetTransform() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        lastTranslateX = 0;
        lastTranslateY = 0;
        updateTransform();
      }
      function openModal(index) {
        if (!imageData.length) return;
        currentIndex = (index + imageData.length) % imageData.length;
        var item = imageData[currentIndex];
        modalImage.src = item.path;
        modalImage.alt = item.date;
        modalCaption.textContent = item.date + ' - ' + item.copyright;
        resetTransform();
        modal.style.display = "flex";
        void modal.offsetWidth;
        modal.classList.add("active");
      }
      function closeModal() {
        modal.classList.remove("active");
        setTimeout(function() { modal.style.display = "none"; }, 300);
        resetTransform();
      }
      function goTo(delta) {
        var newIndex = (currentIndex + delta + imageData.length) % imageData.length;
        openModal(newIndex);
      }
      modalClose.addEventListener("click", closeModal);
      modal.addEventListener("click", function(e) { if (e.target === modal) closeModal(); });
      document.addEventListener("keydown", function(e) {
        if (!modal.classList.contains("active")) return;
        if (e.key === "Escape") closeModal();
        if (e.key === "ArrowLeft") goTo(-1);
        if (e.key === "ArrowRight") goTo(1);
      });
      navLeft.addEventListener("click", function(e) { e.stopPropagation(); goTo(-1); });
      navRight.addEventListener("click", function(e) { e.stopPropagation(); goTo(1); });
      modalImage.addEventListener('wheel', function(e) {
        e.preventDefault();
        var delta = e.deltaY > 0 ? -0.1 : 0.1;
        var newScale = Math.min(Math.max(scale + delta, 0.5), 5);
        scale = newScale;
        if (scale === 1.0) {
          translateX = 0;
          translateY = 0;
          lastTranslateX = 0;
          lastTranslateY = 0;
        }
        updateTransform();
      }, { passive: false });
      modalImage.addEventListener('mousedown', function(e) {
        if (scale <= 1.0) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        lastTranslateX = translateX;
        lastTranslateY = translateY;
        modalImage.style.cursor = 'grabbing';
      });
      window.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        translateX = lastTranslateX + dx;
        translateY = lastTranslateY + dy;
        updateTransform();
      });
      window.addEventListener('mouseup', function() {
        if (isDragging) { isDragging = false; modalImage.style.cursor = 'grab'; }
      });
      var touchStartX = 0, touchStartY = 0;
      var touchLastX = 0, touchLastY = 0;
      var touchDist = 0;
      modalImage.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1 && scale > 1.0) {
          var touch = e.touches[0];
          touchStartX = touch.clientX;
          touchStartY = touch.clientY;
          touchLastX = translateX;
          touchLastY = translateY;
          isDragging = true;
        } else if (e.touches.length === 2) {
          var t1 = e.touches[0];
          var t2 = e.touches[1];
          touchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        }
      }, { passive: true });
      modalImage.addEventListener('touchmove', function(e) {
        if (e.touches.length === 1 && isDragging && scale > 1.0) {
          var touch = e.touches[0];
          var dx = touch.clientX - touchStartX;
          var dy = touch.clientY - touchStartY;
          translateX = touchLastX + dx;
          translateY = touchLastY + dy;
          updateTransform();
        } else if (e.touches.length === 2) {
          var t1 = e.touches[0];
          var t2 = e.touches[1];
          var newDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
          var delta = (newDist - touchDist) / 200;
          var newScale = Math.min(Math.max(scale + delta, 0.5), 5);
          scale = newScale;
          if (scale === 1.0) {
            translateX = 0;
            translateY = 0;
            touchLastX = 0;
            touchLastY = 0;
          }
          touchDist = newDist;
          updateTransform();
        }
      }, { passive: true });
      modalImage.addEventListener('touchend', function() { isDragging = false; }, { passive: true });
      function loadImage(imgElement, src) {
        var loader = new Image();
        loader.src = src;
        loader.onload = function() { imgElement.src = src; imgElement.classList.add("img-loaded"); };
        loader.onerror = function() { imgElement.classList.remove("img-loading"); console.error("图片加载失败:", src); };
      }
      var yiyanContent = document.querySelector('.yiyan-content');
      fetch('https://v2.xxapi.cn/api/yiyan?type=hitokoto')
        .then(function(response) { return response.json(); })
        .then(function(data) {
          if (data.code === 200 && data.data) {
            yiyanContent.innerHTML = '<span style="opacity:0;transition:opacity 1s ease;">' + data.data + '</span>';
            setTimeout(function() {
              var textSpan = yiyanContent.querySelector('span');
              if (textSpan) textSpan.style.opacity = '1';
            }, 100);
          } else {
            yiyanContent.textContent = '生活，是一场无法回放的电影，我们都是自己的导演。';
          }
        })
        .catch(function() { yiyanContent.textContent = '生活，是一场无法回放的电影，我们都是自己的导演。'; });
      fetch("/picture/index.json")
        .then(function(res) { return res.json(); })
        .then(function(data) {
          if (!Array.isArray(data) || data.length === 0) {
            console.error("index.json 内容不合法");
            return;
          }
          imageData = data;
          var today = data[0];
          var heroImg = document.getElementById("hero-img");
          document.getElementById("hero-date").textContent = today.date;
          document.getElementById("hero-copy").textContent = today.copyright;
          loadImage(heroImg, today.path);
          var historyEl = document.getElementById("history");
          data.forEach(function(item, index) {
            setTimeout(function() {
              var card = document.createElement("div");
              card.className = "card";
              card.style.opacity = "0";
              card.style.transform = "translateY(50px)";
              card.style.transition = "opacity 1.0s cubic-bezier(.4,2,.6,1), transform 1.0s cubic-bezier(.4,2,.6,1)";
              var img = document.createElement("img");
              img.alt = item.date;
              img.className = "img-loading";
              img.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmQyZDJkIi8+PC9zdmc+";
              var dateLabel = document.createElement("div");
              dateLabel.className = "date-label";
              dateLabel.textContent = item.date;
              var copyText = document.createElement("div");
              copyText.className = "copy-text";
              copyText.textContent = item.copyright;
              card.appendChild(img);
              card.appendChild(dateLabel);
              card.appendChild(copyText);
              historyEl.appendChild(card);
              loadImage(img, item.path);
              card.addEventListener("click", function() { openModal(index); });
              setTimeout(function() { card.style.opacity = "1"; card.style.transform = "translateY(0)"; }, 50);
            }, index * 80);
          });
        })
        .catch(function(err) { console.error("加载 index.json 失败", err); });
    });
  </script>
</body>
</html>`;
      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // ===== API 文档 =====
    if (path === '/api') {
      const html = `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>图片 API 服务</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      max-width: 780px;
      margin: 3rem auto;
      padding: 0 1.5rem;
      line-height: 1.8;
      color: #1a1a2e;
      background: #f8f9fa;
    }
    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #16213e;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .subtitle {
      color: #6c757d;
      font-size: 1rem;
      margin-bottom: 2rem;
      border-left: 4px solid #4a90d9;
      padding-left: 1rem;
    }
    .card {
      background: #fff;
      border-radius: 12px;
      padding: 1.5rem 2rem;
      margin-bottom: 1.25rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      border: 1px solid #e9ecef;
      transition: box-shadow 0.2s;
    }
    .card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
    .card h2 {
      font-size: 1.1rem;
      color: #4a90d9;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    .card p { margin: 0.25rem 0; color: #343a40; }
    .card code {
      background: #f1f3f5;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      font-size: 0.85rem;
      color: #d63384;
      word-break: break-all;
    }
    .card .label {
      display: inline-block;
      background: #e9ecef;
      padding: 0.1rem 0.6rem;
      border-radius: 12px;
      font-size: 0.7rem;
      color: #495057;
      margin-left: 0.5rem;
    }
    .footer {
      margin-top: 2.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e9ecef;
      text-align: center;
      color: #868e96;
      font-size: 0.85rem;
    }
    @media (max-width: 500px) {
      body { margin: 1.5rem auto; }
      .card { padding: 1rem 1.25rem; }
      h1 { font-size: 1.5rem; }
    }
  </style>
</head>
<body>
  <h1>📷 图片 API 服务</h1>
  <div class="subtitle">提供随机图像和每日图像接口，基于 Bing 每日壁纸</div>
  <div class="card">
    <h2>🎲 /api/random</h2>
    <p><code>${base}/api/random</code> → 返回随机图片</p>
    <p><code>${base}/api/random?redirect=true</code> → 302 重定向到随机图片</p>
  </div>
  <div class="card">
    <h2>📅 /api/daily</h2>
    <p><code>${base}/api/daily</code> → 返回今日图片 (WebP)</p>
    <p><code>${base}/api/daily?format=jpeg</code> → 返回 JPEG 格式</p>
    <p><code>${base}/api/daily?format=original</code> → 返回原始 JPEG</p>
    <p><code>${base}/api/daily?redirect=true</code> → 302 重定向到今日图片</p>
  </div>
  <div class="card">
    <h2>ℹ️ 使用说明</h2>
    <p>所有图片来自 Bing 每日壁纸，仅限个人使用。</p>
    <p>数据更新时间：每日 12:00 (UTC+8)</p>
  </div>
  <div class="footer">Powered by Cloudflare Workers &middot; <a href="${base}" style="color: #4a90d9; text-decoration: none;">返回首页</a></div>
</body>
</html>`;
      return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    // ===== 随机图片 =====
    if (path === '/api/random') {
      try {
        const resp = await fetch(base + '/webp/index.json');
        if (!resp.ok) {
          return new Response('Failed to load index.json', { status: 502 });
        }
        const data = await resp.json();
        if (!data.images || data.images.length === 0) {
          return new Response('No images found', { status: 404 });
        }
        const randomImage = data.images[Math.floor(Math.random() * data.images.length)];
        const redirect = url.searchParams.get('redirect') === 'true';
        if (redirect) {
          return Response.redirect(randomImage.path, 302);
        }
        const imgResp = await fetch(base + randomImage.path);
        return new Response(imgResp.body, {
          headers: {
            'Content-Type': 'image/webp',
            'Cache-Control': 'public, max-age=10800'
          }
        });
      } catch (error) {
        return new Response('Internal Server Error', { status: 500 });
      }
    }

    // ===== 今日图片 =====
    if (path === '/api/daily') {
      try {
        const format = url.searchParams.get('format') || 'webp';
        const redirect = url.searchParams.get('redirect') === 'true';
        var imagePath;
        if (format === 'jpeg') {
          imagePath = '/webp/daily.jpeg';
        } else if (format === 'original') {
          imagePath = '/webp/original.jpeg';
        } else {
          imagePath = '/webp/latest.webp';
        }
        if (redirect) {
          return Response.redirect(imagePath, 302);
        }
        const imgResp = await fetch(base + imagePath);
        if (!imgResp.ok) {
          return new Response('Failed to fetch image', { status: 502 });
        }
        const contentType = format === 'webp' ? 'image/webp' : 'image/jpeg';
        return new Response(imgResp.body, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=10800'
          }
        });
      } catch (error) {
        return new Response('Internal Server Error', { status: 500 });
      }
    }

    // ===== 其他请求放行 =====
    return fetch(request);
  }
};
