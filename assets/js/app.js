(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  let style = 'executive';

  const demos = {
    home:{
      name:'锦城门窗家居',industry:'本地服务',headline:'让家更安静、更明亮，也更安心。',
      intro:'专注系统门窗、阳光房与安装服务，为住宅与商业空间提供清晰、可靠的门窗解决方案。',
      s1:'系统门窗',s2:'阳光房',s3:'安装与售后',market:'成都及周边',phone:'028-8888-8888',email:'service@example.com',address:'成都市高新区',style:'executive'
    },
    manufacturing:{
      name:'华川精工制造',industry:'制造企业',headline:'稳定制造能力，服务长期合作。',
      intro:'面向工程、设备与专业采购客户提供制造、加工与项目配套服务。',
      s1:'定制加工',s2:'工程配套',s3:'质量与交付支持',market:'全国及项目客户',phone:'028-6666-6666',email:'sales@example.com',address:'成都制造基地',style:'industrial'
    },
    trade:{
      name:'川联国际贸易',industry:'贸易公司',headline:'把清晰的产品和服务带给更远的客户。',
      intro:'提供产品采购、供应链沟通与国际业务支持，服务国内外合作伙伴。',
      s1:'产品采购',s2:'供应链服务',s3:'国际业务支持',market:'中国及国际客户',phone:'028-6999-6999',email:'trade@example.com',address:'成都市',style:'global'
    }
  };

  function getData(){
    return {
      name:$('name').value.trim()||'示例企业',
      industry:$('industry').value||'企业服务',
      headline:$('headline').value.trim()||'让客户一眼看懂你的企业。',
      intro:$('intro').value.trim()||'我们专注于稳定、专业的产品与服务。',
      s1:$('s1').value.trim()||'产品与解决方案',
      s2:$('s2').value.trim()||'项目定制服务',
      s3:$('s3').value.trim()||'长期客户支持',
      market:$('market').value.trim()||'本地及全国客户',
      phone:$('phone').value.trim()||'',
      email:$('email').value.trim()||'',
      address:$('address').value.trim()||'',
      style
    };
  }

  function setData(v){
    ['name','industry','headline','intro','s1','s2','s3','market','phone','email','address'].forEach(k=>{
      if($(k) && v[k]!=null) $(k).value=v[k];
    });
    style=v.style||'executive';
    document.querySelectorAll('.style').forEach(b=>b.classList.toggle('active',b.dataset.style===style));
    render();
  }

  function render(){
    const v=getData();
    $('pName').textContent=v.name;
    $('pIndustry').textContent=v.industry;
    $('pHeadline').textContent=v.headline;
    $('pIntro').textContent=v.intro;
    $('pS1').textContent=v.s1;$('pS2').textContent=v.s2;$('pS3').textContent=v.s3;
    $('pMarket').textContent=v.market;
    $('pPhone').textContent=v.phone||'联系电话';
    $('pEmail').textContent=v.email||'公开邮箱';
    $('pAddress').textContent=v.address||'服务地点';
    const mobile=$('preview').classList.contains('mobile');
    $('preview').className=`preview ${style}${mobile?' mobile':''}`;
  }

  function hashFor(v){ return '#site=' + encodeURIComponent(JSON.stringify(v)); }
  function generatedUrl(v){ return new URL('generated.html'+hashFor(v), location.href).href; }

  function openGenerated(){
    location.href='generated.html'+hashFor(getData());
  }

  async function copyLink(){
    const url=generatedUrl(getData());
    try{
      await navigator.clipboard.writeText(url);
      const b=$('copyLink'); const old=b.textContent; b.textContent='已复制'; setTimeout(()=>b.textContent=old,1300);
    }catch(e){ window.prompt('复制此链接',url); }
  }

  function makeStandalone(v){
    const payload=encodeURIComponent(JSON.stringify(v));
    return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(v.name)}</title><style>html,body{margin:0;height:100%}iframe{border:0;width:100%;height:100vh;display:block}</style></head><body><iframe src="${new URL('generated.html',location.href).href}#site=${payload}"></iframe></body></html>`;
  }

  function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

  function download(){
    const v=getData();
    const blob=new Blob([makeStandalone(v)],{type:'text/html;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download=(v.name||'business-website').replace(/[\\/:*?"<>|]/g,'-')+'.html';
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);
  }

  function loadHash(){
    if(location.hash.startsWith('#site=')){
      try{setData(JSON.parse(decodeURIComponent(location.hash.slice(6))));}catch(e){}
    }
  }

  document.addEventListener('DOMContentLoaded',()=>{
    loadHash();render();
    $('siteForm').addEventListener('submit',e=>{e.preventDefault();openGenerated();});
    document.querySelectorAll('#siteForm input,#siteForm textarea,#siteForm select').forEach(el=>{
      el.addEventListener('input',render);el.addEventListener('change',render);
    });
    document.querySelectorAll('.style').forEach(b=>b.addEventListener('click',()=>{style=b.dataset.style;document.querySelectorAll('.style').forEach(x=>x.classList.remove('active'));b.classList.add('active');render();}));
    $('device').addEventListener('click',()=>{$('preview').classList.toggle('mobile');});
    $('copyLink').addEventListener('click',copyLink);
    $('download').addEventListener('click',download);
    document.querySelectorAll('[data-demo]').forEach(b=>b.addEventListener('click',()=>{setData(demos[b.dataset.demo]);location.hash='builder';}));
  });
})();