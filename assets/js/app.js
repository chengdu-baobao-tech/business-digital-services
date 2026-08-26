(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  let style = 'modern';

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

  function render(){
    const v = getValues();
    const map = {
      pName:v.name, pIndustry:v.industry, pHeadline:v.headline, pIntro:v.intro,
      pS1:v.s1, pS2:v.s2, pS3:v.s3, pMarket:v.market,
      pPhone:v.phone || '联系电话', pEmail:v.email || '公开邮箱',
      pAddress:v.address || '服务地点'
    };
    Object.entries(map).forEach(([id,val]) => {
      const el=$(id);
      if(el) el.textContent=val;
    });

    const preview = $('preview');
    if(preview){
      const mobile = preview.classList.contains('mobile');
      preview.className = `preview ${v.style}${mobile ? ' mobile' : ''}`;
    }
  }

  function encodeState(values){
    return encodeURIComponent(JSON.stringify(values));
  }

  function decodeState(value){
    return JSON.parse(decodeURIComponent(value));
  }

  function generatedUrl(){
    return `generated.html?d=${encodeState(getValues())}`;
  }

  function openGenerated(){
    render();
    const status = $('status');
    if(status) status.textContent = '网站已生成，正在打开…';
    window.location.href = generatedUrl();
  }

  function downloadGenerated(){
    const v = getValues();
    const url = generatedUrl();
    const absolute = new URL(url, window.location.href).href;

    fetch(absolute)
      .then(r => r.text())
      .then(page => {
        const a = document.createElement('a');
        const blob = new Blob([page], {type:'text/html;charset=utf-8'});
        const blobUrl = URL.createObjectURL(blob);
        a.href = blobUrl;
        a.download = (v.name || 'business-website').replace(/[\\/:*?"<>|]/g,'-') + '-preview.html';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        const status=$('status');
        if(status) status.textContent='预览页面已下载。正式独立网站请联系企业建站服务。';
      })
      .catch(() => {
        window.location.href = url;
      });
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
        document.querySelectorAll('.style').forEach(btn =>
          btn.classList.toggle('active', btn.dataset.style === style)
        );
      }
    } catch(e) {
      console.warn('Invalid shared preview state');
    }
  }

  function copyShareLink(){
    const url = new URL(generatedUrl(), window.location.href).href;
    const btn = $('copyLink');
    const done = () => {
      if(btn){
        btn.textContent='已复制生成网站链接';
        setTimeout(()=>btn.textContent='复制分享链接',1400);
      }
    };
    if(navigator.clipboard && window.isSecureContext){
      navigator.clipboard.writeText(url).then(done).catch(()=>window.prompt('复制此链接', url));
    } else {
      window.prompt('复制此链接', url);
    }
  }

  function init(){
    loadShared();
    render();

    $('form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      openGenerated();
    });

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
