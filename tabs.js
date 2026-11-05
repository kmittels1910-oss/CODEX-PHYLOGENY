'use strict';
(() => {
  const nav=document.querySelector('nav[aria-label="Lab sections"]');
  const main=document.getElementById('main');
  if(!nav||!main)return;
  const sections=[...main.children].filter(e=>e.tagName==='SECTION');
  const tabs=[...nav.querySelectorAll('a')];
  const pages=new Map(),current=new Map();
  const make=(tag,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;return e};
  // Keep each meaningful task together; split question sets into small batches.
  sections.forEach(section=>{
    const chunks=[];let chunk=[];
    const flush=()=>{if(chunk.length){chunks.push(chunk);chunk=[]}};
    [...section.children].forEach(node=>{
      if(node.matches('.checks')){
        flush();const cards=[...node.children];
        for(let i=0;i<cards.length;i+=2){const grid=make('div','checks');cards.slice(i,i+2).forEach(c=>grid.append(c));chunks.push([grid])}
        return;
      }
      if(node.tagName==='H3')flush();
      if(section.id==='exit'&&node.tagName==='OL'){
        flush();const questions=[...node.children];
        for(let i=0;i<questions.length;i+=5){const list=make('ol');list.start=i+1;questions.slice(i,i+5).forEach(q=>list.append(q));chunks.push([list])}
        return;
      }
      chunk.push(node);
    });flush();
    const title=section.querySelector('h2').textContent;
    section.replaceChildren();const panelPages=[];
    chunks.forEach((nodes,i)=>{
      const page=make('div','lab-page');page.id=`${section.id}-page-${i+1}`;
      if(i>0){const context=make('p','eyebrow');context.textContent=title;page.append(context);if(nodes[0].tagName!=='H3'){const h=make('h3');h.textContent=nodes[0].matches('.checks')?'Reason through the examples':`Questions ${1+(i-1)*5}–${Math.min((i)*5,10)}`;page.append(h)}}
      nodes.forEach(n=>page.append(n));section.append(page);panelPages.push(page);
    });
    pages.set(section.id,panelPages);current.set(section.id,0);
    const stepper=make('div','page-controls');stepper.setAttribute('aria-label','Activity pages');
    const previous=make('button');previous.type='button';previous.textContent='← Previous';
    const status=make('span');status.setAttribute('aria-live','polite');
    const next=make('button');next.type='button';next.textContent='Next →';
    stepper.append(previous,status,next);section.prepend(stepper);
    function step(delta){const at=sections.indexOf(section),n=current.get(section.id)+delta;if(n<0&&at>0)activate(at-1,pages.get(sections[at-1].id).length-1,true);else if(n>=panelPages.length&&at<sections.length-1)activate(at+1,0,true);else activate(at,n,true)}
    previous.addEventListener('click',()=>step(-1));next.addEventListener('click',()=>step(1));
    section._update=(n)=>{
      panelPages.forEach((p,i)=>p.hidden=i!==n);status.textContent=`Page ${n+1} of ${panelPages.length}`;
      previous.disabled=sections.indexOf(section)===0&&n===0;next.disabled=sections.indexOf(section)===sections.length-1&&n===panelPages.length-1;
    };
    section.setAttribute('role','tabpanel');section.tabIndex=0;
  });
  nav.setAttribute('role','tablist');
  tabs.forEach((tab,i)=>{
    tab.id=`tab-${sections[i].id}`;tab.setAttribute('role','tab');tab.setAttribute('aria-controls',sections[i].id);
    sections[i].setAttribute('aria-labelledby',tab.id);
    tab.addEventListener('click',e=>{e.preventDefault();activate(i,current.get(sections[i].id),false)});
    tab.addEventListener('keydown',e=>{
      let target=i;
      if(e.key==='ArrowRight')target=(i+1)%tabs.length;else if(e.key==='ArrowLeft')target=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')target=0;else if(e.key==='End')target=tabs.length-1;else if(e.key===' ')target=i;else return;
      e.preventDefault();activate(target,current.get(sections[target].id),false);tabs[target].focus();
    });
  });
  function activate(index,n=0,focus=false,write=true){
    if(index<0||index>=sections.length)return;
    const id=sections[index].id;n=Number.isFinite(n)?Math.max(0,Math.min(Math.trunc(n),pages.get(id).length-1)):0;current.set(id,n);
    sections.forEach((s,i)=>{s.hidden=i!==index;tabs[i].setAttribute('aria-selected',String(i===index));tabs[i].tabIndex=i===index?0:-1});
    sections[index]._update(n);
    if(write)history.replaceState(null,'',`#${id}${n?'/'+(n+1):''}`);
    if(focus){sections[index].focus({preventScroll:true});nav.scrollIntoView({block:'start'})}
  }
  function route(){const [id,step]=location.hash.slice(1).split('/');const index=sections.findIndex(s=>s.id===id);activate(index<0?0:index,Number(step||1)-1,false,false)}
  window.addEventListener('hashchange',route);
  // Print every activity page, then return to the current on-screen panel.
  let printing=[];
  window.addEventListener('beforeprint',()=>{printing=[...sections,...[...pages.values()].flat()].map(e=>[e,e.hidden]);printing.forEach(([e])=>e.hidden=false)});
  window.addEventListener('afterprint',()=>{printing.forEach(([e,hidden])=>e.hidden=hidden);printing=[]});
  document.body.classList.add('tabbed-lab');route();
})();
