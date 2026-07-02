const $ = (id) => document.getElementById(id);
const form = $('previewForm');
const preview = $('sitePreview');
const styleButtons = [...document.querySelectorAll('.style-card')];
const shareToast = $('shareToast');
let currentStyle = 'modern';

const styleTokens = {
  modern: {bg:'#081321',hero:'radial-gradient(circle at 75% 20%,rgba(85,115,255,.38),transparent 35%),linear-gradient(135deg,#081321,#102138)',text:'#fff',muted:'#9eabc0',accent:'#67d6ff',buttonBg:'#fff',buttonText:'#101725',card:'rgba(255,255,255,.06)',border:'rgba(255,255,255,.10)',art1:'#6f54ff',art2:'#37d2ff'},
  industrial: {bg:'#16191d',hero:'linear-gradient(120deg,#181b20,#2c3138)',text:'#fff',muted:'#aab0b8',accent:'#ff8b48',buttonBg:'#ff7b34',buttonText:'#111',card:'#20242a',border:'#343940',art1:'#ff7133',art2:'#6f7782'},
  trade: {bg:'#10243b',hero:'radial-gradient(circle at 75% 20%,rgba(234,180,95,.22),transparent 35%),linear-gradient(135deg,#0e1d31,#173956)',text:'#fff',muted:'#b8c5d7',accent:'#f1bd72',buttonBg:'#f1bd72',buttonText:'#142131',card:'rgba(255,255,255,.07)',border:'rgba(255,255,255,.10)',art1:'#f2be73',art2:'#5f8ea8'},
  professional: {bg:'#f5f0e7',hero:'linear-gradient(135deg,#faf6ef,#e9dfd1)',text:'#27211b',muted:'#6e6255',accent:'#9e7b50',buttonBg:'#27211b',buttonText:'#fff',card:'#fffaf3',border:'#e4d8c9',art1:'#8d7558',art2:'#d6c0a3'}
};

function clean(value, fallback = '') { return value.trim() || fallback; }
function slugify(value) {
  const slug = value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '');
  return slug || 'business';
}
function toast(message) {
  shareToast.textContent = message;
  shareToast.classList.add('show');
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => shareToast.classList.remove('show'), 2200);
}
function getState() {
  return {
    v: 1,
    c: clean($('companyName').value, '您的企业'),
    i: $('industry').value,
    h: clean($('headline').value, '让客户更快看懂您的企业。'),
    d: clean($('intro').value, '清晰的信息、可靠的业务能力和持续支持。'),
    s1: clean($('service1').value, '产品与解决方案'),
    s2: clean($('service2').value, '定制服务'),
    s3: clean($('service3').value, '长期客户支持'),
    m: clean($('market').value, '中国及国际市场'),
    st: currentStyle
  };
}
function encodeState(state) {
  const json = JSON.stringify(state);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
function decodeState(value) {
  try {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch { return null; }
}
function shareUrl() {
  return `${location.origin}${location.pathname}#p=${encodeState(getState())}`;
}
function applyState(state) {
  if (!state || state.v !== 1) return false;
  const map = {companyName:'c', industry:'i', headline:'h', intro:'d', service1:'s1', service2:'s2', service3:'s3', market:'m'};
  Object.entries(map).forEach(([id, key]) => { if (typeof state[key] === 'string') $(id).value = state[key]; });
  if (styleTokens[state.st]) currentStyle = state.st;
  styleButtons.forEach((button) => button.classList.toggle('active', button.dataset.style === currentStyle));
  preview.className = `site-preview style-${currentStyle}`;
  updatePreview();
  return true;
}
function updatePreview() {
  const company = clean($('companyName').value, '您的企业');
  $('previewBrand').textContent = company;
  $('previewAddress').textContent = `${slugify(company)}.preview`;
  $('previewIndustry').textContent = $('industry').value;
  $('previewHeadline').textContent = clean($('headline').value, '让客户更快看懂您的企业。');
  $('previewIntro').textContent = clean($('intro').value, '清晰的信息、可靠的业务能力和持续支持。');
  $('previewService1').textContent = clean($('service1').value, '产品与解决方案');
  $('previewService2').textContent = clean($('service2').value, '定制服务');
  $('previewService3').textContent = clean($('service3').value, '长期客户支持');
  $('previewMarket').textContent = clean($('market').value, '中国及国际市场');
  const query = new URLSearchParams({source:'website-preview', company, industry:$('industry').value, market:clean($('market').value)});
  $('customBuildLink').href = `../contact.html?${query.toString()}`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  updatePreview();
  preview.animate([{opacity:.68,transform:'scale(.993)'},{opacity:1,transform:'scale(1)'}], {duration:260});
});
['companyName','industry','headline','intro','service1','service2','service3','market'].forEach((id) => $(id).addEventListener('input', updatePreview));
styleButtons.forEach((button) => button.addEventListener('click', () => {
  const mobile = preview.classList.contains('mobile');
  styleButtons.forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  currentStyle = button.dataset.style;
  preview.className = `site-preview style-${currentStyle}${mobile ? ' mobile' : ''}`;
  updatePreview();
}));
$('deviceToggle').addEventListener('click', () => preview.classList.toggle('mobile'));

$('copyShareLink').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(shareUrl()); toast('分享链接已复制'); }
  catch { window.prompt('复制下面的分享链接：', shareUrl()); }
});
$('nativeShare').addEventListener('click', async () => {
  const state = getState();
  const data = {title:`${state.c} 企业官网预览`, text:`查看 ${state.c} 的企业官网视觉预览，由 BB369TECH 提供。`, url:shareUrl()};
  if (navigator.share) {
    try { await navigator.share(data); } catch (error) { if (error.name !== 'AbortError') toast('暂时无法调用系统分享'); }
  } else {
    try { await navigator.clipboard.writeText(data.url); toast('设备不支持一键分享，链接已复制'); }
    catch { window.prompt('复制下面的分享链接：', data.url); }
  }
});
function resetForNew() {
  const selectedStyle = currentStyle;
  $('companyName').value = '';
  $('headline').value = '';
  $('intro').value = '';
  $('service1').value = '';
  $('service2').value = '';
  $('service3').value = '';
  $('market').value = '';
  currentStyle = selectedStyle;
  history.replaceState(null, '', location.pathname);
  $('sharedBanner').hidden = true;
  updatePreview();
  document.querySelector('#builder').scrollIntoView({behavior:'smooth'});
  $('companyName').focus();
}
$('createMine').addEventListener('click', resetForNew);
$('createMineTop').addEventListener('click', resetForNew);
$('copyProjectBrief').addEventListener('click', async () => {
  const s = getState();
  const brief = `企业名称：${s.c}\n所属行业：${s.i}\n主标题：${s.h}\n企业简介：${s.d}\n主营业务：${s.s1}、${s.s2}、${s.s3}\n服务区域：${s.m}\n视觉风格：${s.st}\n\n希望咨询 BB369TECH 正式企业官网项目。`;
  try { await navigator.clipboard.writeText(brief); toast('项目需求已复制，可粘贴给 BB369TECH'); }
  catch { window.prompt('复制下面的项目需求：', brief); }
});

$('downloadHtml').addEventListener('click', () => {
  updatePreview();
  const company = clean($('companyName').value, '您的企业');
  const t = styleTokens[currentStyle];
  const returnUrl = 'https://china.bb369tech.com/preview/';
  const html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escapeHtml(company)} 官网预览</title><style>*{box-sizing:border-box}body{margin:0;font-family:Arial,'Microsoft YaHei','PingFang SC',sans-serif;background:${t.bg};color:${t.text}.wrap{max-width:1160px;margin:auto;padding:0 32px}.notice{font-size:12px;text-align:center;padding:12px 20px;background:rgba(127,127,127,.12);color:${t.muted}}.nav{display:flex;justify-content:space-between;align-items:center;padding:26px 0;border-bottom:1px solid ${t.border};font-size:13px}.nav strong{letter-spacing:.08em}.hero{display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:center;min-height:520px;padding:72px 0;background:${t.hero}}.hero-inner{grid-column:1}.k{letter-spacing:.16em;font-size:12px;font-weight:800;color:${t.accent}}h1{font-size:clamp(46px,7vw,76px);line-height:1.08;letter-spacing:-.04em;max-width:820px;margin:22px 0}p{font-size:18px;line-height:1.8;max-width:720px;color:${t.muted}}.btn{display:inline-block;margin-top:26px;padding:15px 20px;border-radius:11px;background:${t.buttonBg};color:${t.buttonText};font-weight:800}.art{position:relative;height:300px}.art i{position:absolute;border-radius:${currentStyle==='industrial'?'18px':'50%'};background:linear-gradient(135deg,${t.art1},${t.art2})}.art i:nth-child(1){width:230px;height:230px;right:10%;top:10%}.art i:nth-child(2){width:120px;height:120px;right:42%;top:42%;opacity:.72}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:54px 0 72px}.card{padding:28px;border:1px solid ${t.border};background:${t.card};border-radius:18px}.card small{font-weight:900;color:${t.accent}}.card h2{font-size:20px;margin:28px 0 10px}.card p{font-size:14px;margin:0}.foot{display:flex;justify-content:space-between;align-items:center;padding:26px 0;border-top:1px solid ${t.border};font-size:13px;color:${t.muted}.foot a{color:inherit;font-weight:800}.share{padding:28px;margin:28px 0 50px;border:1px solid ${t.border};border-radius:18px;text-align:center}.share a{display:inline-block;margin-top:12px;color:${t.accent};font-weight:800}@media(max-width:760px){.hero{grid-template-columns:1fr;min-height:auto;padding:64px 0}.art{display:none}.grid{grid-template-columns:1fr}.nav span{display:none}.foot{gap:20px;flex-direction:column}}</style></head><body><div class="notice">本文件为 BB369TECH 生成的企业官网视觉预览，不是正式发布的网站。</div><div class="wrap"><div class="nav"><strong>${escapeHtml(company)}</strong><span>公司介绍 &nbsp;&nbsp; 产品服务 &nbsp;&nbsp; 联系我们</span></div><section class="hero"><div class="hero-inner"><div class="k">${escapeHtml($('industry').value)}</div><h1>${escapeHtml(clean($('headline').value,'让客户更快看懂您的企业。'))}</h1><p>${escapeHtml(clean($('intro').value,'清晰的信息、可靠的业务能力和持续支持。'))}</p><span class="btn">了解合作</span></div><div class="art"><i></i><i></i></div></section><section class="grid"><article class="card"><small>01</small><h2>${escapeHtml(clean($('service1').value,'产品与解决方案'))}</h2><p>清晰呈现企业能力与真实业务价值。</p></article><article class="card"><small>02</small><h2>${escapeHtml(clean($('service2').value,'定制服务'))}</h2><p>根据业务场景提供稳定、清楚的展示方式。</p></article><article class="card"><small>03</small><h2>${escapeHtml(clean($('service3').value,'长期客户支持'))}</h2><p>持续维护企业信息、页面和联系入口。</p></article></section><div class="share"><strong>喜欢这个网站方向？</strong><p>免费生成您的企业官网预览，或联系 BB369TECH 完成正式网站。</p><a href="${returnUrl}">创建我的企业官网预览 →</a></div><div class="foot"><span>${escapeHtml(clean($('market').value,'中国及国际市场'))}</span><a href="https://china.bb369tech.com/" target="_blank" rel="noopener">Powered by BB369TECH</a></div></div></body></html>`;
  const blob = new Blob([html], {type:'text/html;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${slugify(company)}-官网预览.html`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
function escapeHtml(value = '') { return String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char])); }

const hashMatch = location.hash.match(/^#p=(.+)$/);
if (hashMatch) {
  const state = decodeState(hashMatch[1]);
  if (applyState(state)) {
    $('sharedBanner').hidden = false;
    window.setTimeout(() => document.querySelector('.preview-panel').scrollIntoView({behavior:'smooth', block:'center'}), 250);
  }
} else {
  updatePreview();
}
