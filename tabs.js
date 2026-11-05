'use strict';
(() => {
  const nav=document.querySelector('nav[aria-label="Lab sections"]');
  const main=document.getElementById('main');
  if(!nav||!main)return;
  const tabs=[...nav.querySelectorAll('a')];
  const sections=tabs.map(tab=>document.getElementById(tab.getAttribute('href').slice(1)));
  const pages=new Map(),current=new Map();
  const pageNames={start:['Guide','Concepts'],read:['Tree','Practice 1','Practice 2','Practice 3','Matrix','Explain'],practice:['NOVA'],build:['Explore','Define traits','Matrix','TA check-in','Record tree','Test hypothesis'],groups:['Groups','Practice 1','Practice 2','Practice 3','Apply'],exit:['Questions 1–5','Questions 6–10'],submit:['Submit']};
  const make=(tag,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;return e};
  // Keep each meaningful task together; split question sets into small batches.
  sections.forEach(section=>{
    const chunks=[];let chunk=[];
    const flush=()=>{if(chunk.length){chunks.push(chunk);chunk=[]}};
    [...section.children].forEach(node=>{
      if(node.matches('p.eyebrow'))return;
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
    if(section.id==='exit'){
      const reference=chunks[0],questionChunks=chunks.slice(1);
      const combined=questionChunks.map((questions,i)=>{
        const layout=make('div','exit-layout'),chart=make('div','exit-chart'),prompts=make('div','exit-questions');
        reference.forEach(node=>{
          if(node.matches('h2'))return;
          const clone=node.cloneNode(true),ids=new Map();
          clone.querySelectorAll('[id]').forEach(e=>{const old=e.id;e.id=`${old}-copy-${i+1}`;ids.set(old,e.id)});
          clone.querySelectorAll('[aria-labelledby],[aria-describedby]').forEach(e=>['aria-labelledby','aria-describedby'].forEach(attr=>{if(e.hasAttribute(attr))e.setAttribute(attr,e.getAttribute(attr).split(' ').map(id=>ids.get(id)||id).join(' '))}));
          if(node.matches('figure,details'))chart.append(clone);else prompts.append(clone);
        });
        const heading=make('h3');heading.textContent=pageNames.exit[i];prompts.prepend(heading);
        questions.forEach(q=>prompts.append(q));layout.append(chart,prompts);return [layout];
      });
      chunks.splice(0,chunks.length,...combined);
    }
    const title=section.querySelector('h2').textContent;
    section.replaceChildren();const panelPages=[];
    chunks.forEach((nodes,i)=>{
      const page=make('div','lab-page');page.id=`${section.id}-page-${i+1}`;
      if(i>0&&nodes[0].tagName!=='H3'){const h=make('h3','sr-only');h.textContent=pageNames[section.id]?.[i]||'Activity';page.append(h)}
      nodes.forEach(n=>page.append(n));section.append(page);panelPages.push(page);
    });
    pages.set(section.id,panelPages);current.set(section.id,0);
    const stepper=make('nav','page-controls');stepper.setAttribute('aria-label','Activities in this tab');
    const pageButtons=panelPages.map((p,i)=>{const b=make('button');b.type='button';b.textContent=pageNames[section.id]?.[i]||`Activity ${i+1}`;b.setAttribute('aria-controls',p.id);b.addEventListener('click',()=>activate(sections.indexOf(section),i,false));stepper.append(b);return b});
    if(panelPages.length>1)section.prepend(stepper);
    section._update=(n)=>{
      panelPages.forEach((p,i)=>p.hidden=i!==n);pageButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===n)));
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
