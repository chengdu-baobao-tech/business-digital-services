(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  let style = 'modern';
  let lastGeneratedUrl = null;

  function getValues(){
    return {
      name: $('name')?.value.trim() || '示例企业',
      industry: $('industry')?.value || '企业服务',
      headline: $('headline')?.value.trim() || '让客户更快了解您的企业。',
      intro: $('intro')?.value.trim() || '我们专注于稳定、专业的产品与服务。',
      s1: $('s1')?.value.trim() || '产品与解决方案',
      s2: $('s2')?.value.trim() || '项目定制服务',
      s3: $('s3')?.value.trim() || '长期客户支持',
      market: $('market')?.value.trim() || '本地及全国客户',
      phone: $('phone')?.value.trim() || '',
      email: $('email')?.value.trim() || '',
      address: $('address')?.value.trim() || '',
      style
    };
  }

  function escapeHTML(value){
    return String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function render(){
    const v = getValues();
    const map = {
      pName:v.name, pIndustry:v.industry, pHeadline:v.headline, pIntro:v.intro,
      pS1:v.s1, pS2:v.s2, pS3:v.s3, pMarket:v.market,
      pPhone:v.phone || '联系电话', pEmail:v.email || '公开邮箱', pAddress:v.address || '服务地点'
    };
    Object.entries(map).forEach(([id,val]) => { const el=$(id); if(el) el.textContent=val; });
    const preview = $('preview');
    if(preview){
      const mobile = preview.classList.contains('mobile');
      preview.className = `preview ${v.style}${mobile ? ' mobile' : ''}`;
    }
  }

  const palette = {
    modern: {primary:'#163b68', accent:'#e9f1fb', line:'#dbe6f2'},
    industrial: {primary:'#2e3946', accent:'#f0f2f4', line:'#d8dde3'},
    trade: {primary:'#0c6964', accent:'#e9f7f5', line:'#d2ece9'},
    professional: {primary:'#593d6d', accent:'#f5eff8', line:'#e8ddee'}
  };

  function buildHTML(){
    const v = getValues();
    const p = palette[v.style] || palette.modern;
    const phoneLink = v.phone ? `<a href="tel:${escapeHTML(v.phone.replace(/\s+/g,''))}">${escapeHTML(v.phone)}</a>` : '<span>欢迎联系咨询</span>';
    const emailLink = v.email ? `<a href="mailto:${escapeHTML(v.email)}">${escapeHTML(v.email)}</a>` : '';
    const contactParts = [
      v.market ? `<div><small>服务区域</small><strong>${escapeHTML(v.market)}</strong></div>` : '',
      v.phone ? `<div><small>联系电话</small><strong>${phoneLink}</strong></div>` : '',
      v.email ? `<div><small>公开邮箱</small><strong>${emailLink}</strong></div>` : '',
      v.address ? `<div><small>地址 / 服务地点</small><strong>${escapeHTML(v.address)}</strong></div>` : ''
    ].filter(Boolean).join('');

    return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHTML(v.name)}｜${escapeHTML(v.industry)}</title>
<meta name="description" content="${escapeHTML(v.intro.slice(0,150))}">
<style>
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",Arial,sans-serif;color:#172033;background:#fff;line-height:1.7}a{color:inherit;text-decoration:none}.wrap{width:min(1160px,88%);margin:auto}.top{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.94);backdrop-filter:blur(14px);border-bottom:1px solid ${p.line}}.top .wrap{min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:24px}.brand{font-weight:800;font-size:18px}.nav{display:flex;gap:24px;font-size:14px;color:#526173}.hero{background:linear-gradient(135deg,${p.primary} 0%,#0e2038 100%);color:white;padding:108px 0 92px}.hero small{display:inline-block;font-weight:700;letter-spacing:.14em;text-transform:uppercase;opacity:.78}.hero h1{font-size:clamp(38px,6vw,68px);line-height:1.08;max-width:900px;margin:18px 0}.hero p{max-width:790px;font-size:18px;color:#e7edf5;margin:0 0 34px}.cta{display:inline-flex;align-items:center;padding:13px 22px;border-radius:10px;background:white;color:${p.primary};font-weight:800}.section{padding:78px 0}.eyebrow{font-size:12px;font-weight:800;letter-spacing:.16em;color:${p.primary}}h2{font-size:clamp(30px,4vw,42px);margin:8px 0 14px}.lead{max-width:760px;color:#627084}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:38px}.card{border:1px solid ${p.line};border-radius:18px;padding:30px;background:#fff;box-shadow:0 12px 34px rgba(23,32,51,.06)}.card span{display:inline-flex;width:42px;height:42px;align-items:center;justify-content:center;border-radius:12px;background:${p.accent};font-weight:800;color:${p.primary}}.card h3{margin:18px 0 8px;font-size:21px}.card p{margin:0;color:#687589}.about{background:${p.accent}}.contact{background:#101826;color:#fff}.contact .lead{color:#c9d2df}.contact-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:28px}.contact-grid div{padding:20px 22px;border:1px solid rgba(255,255,255,.14);border-radius:14px}.contact-grid small{display:block;color:#9fb0c5;margin-bottom:4px}.contact-grid strong{font-size:16px}.footer{background:#08101c;color:#aeb9c7;padding:24px 0}.footer .wrap{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}.footer a{color:white}.badge{display:inline-block;margin-left:8px;padding:2px 8px;border-radius:999px;border:1px solid rgba(255,255,255,.2);font-size:11px}@media(max-width:780px){.nav{display:none}.hero{padding:78px 0 68px}.grid,.contact-grid{grid-template-columns:1fr}.section{padding:58px 0}}
</style>
</head>
<body>
<header class="top"><div class="wrap"><a class="brand" href="#top">${escapeHTML(v.name)}</a><nav class="nav"><a href="#about">关于我们</a><a href="#services">产品服务</a><a href="#contact">联系我们</a></nav></div></header>
<main id="top">
<section class="hero"><div class="wrap"><small>${escapeHTML(v.industry)}</small><h1>${escapeHTML(v.headline)}</h1><p>${escapeHTML(v.intro)}</p><a class="cta" href="#contact">立即咨询</a></div></section>
<section class="section" id="about"><div class="wrap"><span class="eyebrow">ABOUT</span><h2>关于我们</h2><p class="lead">${escapeHTML(v.intro)}</p></div></section>
<section class="section" id="services"><div class="wrap"><span class="eyebrow">SERVICES</span><h2>产品与服务</h2><p class="lead">围绕实际业务需求，提供清楚、稳定、方便沟通的产品与服务信息。</p><div class="grid"><article class="card"><span>01</span><h3>${escapeHTML(v.s1)}</h3><p>展示企业主要产品、业务能力与适用场景。</p></article><article class="card"><span>02</span><h3>${escapeHTML(v.s2)}</h3><p>根据不同项目和客户需求提供专业支持。</p></article><article class="card"><span>03</span><h3>${escapeHTML(v.s3)}</h3><p>保持长期、清楚、方便联系的服务入口。</p></article></div></div></section>
<section class="section about"><div class="wrap"><span class="eyebrow">BUSINESS AREA</span><h2>服务区域</h2><p class="lead">${escapeHTML(v.market)}</p></div></section>
<section class="section contact" id="contact"><div class="wrap"><span class="eyebrow" style="color:#a9c7ed">CONTACT</span><h2>联系我们</h2><p class="lead">欢迎就产品、服务与合作需求与我们联系。</p><div class="contact-grid">${contactParts || '<div><small>联系信息</small><strong>请通过企业官方渠道联系我们</strong></div>'}</div></div></section>
</main>
<footer class="footer"><div class="wrap"><span>© ${new Date().getFullYear()} ${escapeHTML(v.name)}</span><a href="https://china.bb369tech.com/" target="_blank" rel="noopener noreferrer">技术支持：成都保堡智能科技有限公司 <span class="badge">Website Support</span></a></div></footer>
</body></html>`;
  }

  function makeBlobUrl(){
    if(lastGeneratedUrl) URL.revokeObjectURL(lastGeneratedUrl);
    lastGeneratedUrl = URL.createObjectURL(new Blob([buildHTML()], {type:'text/html;charset=utf-8'}));
    return lastGeneratedUrl;
  }

  function openGenerated(){
    const url = makeBlobUrl();
    const win = window.open(url, '_blank');
    if(!win){
      const status=$('status');
      if(status) status.textContent='浏览器阻止了新窗口，请允许弹窗后再试。';
    } else {
      const status=$('status');
      if(status) status.textContent='网站已生成并在新窗口打开。';
    }
  }

  function downloadGenerated(){
    const blob = new Blob([buildHTML()], {type:'text/html;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (getValues().name || 'business-website').replace(/[\\/:*?"<>|]/g,'-') + '.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    const status=$('status');
    if(status) status.textContent='完整网站文件已生成并下载。';
  }

  function encodeState(){
    const raw = encodeURIComponent(JSON.stringify(getValues()));
    return btoa(unescape(raw));
  }

  function decodeState(q){
    return JSON.parse(decodeURIComponent(escape(atob(q))));
  }

  function loadShared(){
    const q = new URLSearchParams(location.search).get('d');
    if(!q) return;
    try{
      const v = decodeState(q);
      ['name','industry','headline','intro','s1','s2','s3','market','phone','email','address'].forEach(k => {
        if($(k) && v[k] != null) $(k).value = v[k];
      });
      if(v.style){
        style = v.style;
        document.querySelectorAll('.style').forEach(btn => btn.classList.toggle('active', btn.dataset.style === style));
      }
    }catch(e){ console.warn('Invalid shared preview state'); }
  }

  function copyShareLink(){
    const base = location.href.split('?')[0].split('#')[0];
    const url = `${base}?d=${encodeURIComponent(encodeState())}`;
    const btn = $('copyLink');
    const done = () => {
      if(btn){ btn.textContent='已复制分享链接'; setTimeout(()=>btn.textContent='复制分享链接',1400); }
    };
    if(navigator.clipboard && window.isSecureContext){
      navigator.clipboard.writeText(url).then(done).catch(()=>{ window.prompt('复制此链接', url); });
    } else {
      window.prompt('复制此链接', url);
    }
  }

  function init(){
    loadShared();
    render();

    $('form')?.addEventListener('submit', (e) => { e.preventDefault(); render(); openGenerated(); });
    document.querySelectorAll('#form input,#form textarea,#form select').forEach(el => {
      el.addEventListener('input', render);
      el.addEventListener('change', render);
    });
    document.querySelectorAll('.style').forEach(btn => btn.addEventListener('click', () => {
      document.querySelectorAll('.style').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      style = btn.dataset.style || 'modern';
      render();
    }));
    $('device')?.addEventListener('click', () => $('preview')?.classList.toggle('mobile'));
    $('generate')?.addEventListener('click', openGenerated);
    $('download')?.addEventListener('click', downloadGenerated);
    $('copyLink')?.addEventListener('click', copyShareLink);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
