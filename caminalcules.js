'use strict';
// Illustrative observations, not an instructor answer key or a student matrix.
const CaminalculeModel = (()=>{
  const data={
    A:{image:'image7.png',description:'Elongated oval body; narrow stalk with a rectangular tip; small side protrusion; short curved body mark; dotted edge; no visible rear flippers.',states:[0,0,0,0,0]},
    I:{image:'image8.png',description:'Oval body; long pointed head projections around a spotted central head; short curved body mark; dotted edge; broad divided rear appendage.',states:[1,1,0,0,0]},
    G:{image:'image10.png',description:'Pointed head projections around a spotted central head; short curved body mark; dotted edge; two narrow pointed rear appendages.',states:[1,1,0,0,0]},
    F:{image:'image9.png',description:'Two large dark body bars and small round spots; round-tipped stalk and one branching head appendage; dotted edge; small lobed rear appendages.',states:[1,0,1,1,0]},
    E:{image:'image11.png',description:'Two large dark body bars and small round spots; branching appendages on both sides of the head; dotted edge; small lobed rear appendages.',states:[1,0,1,1,1]},
    D:{image:'image12.png',description:'Two large dark body bars and irregular dark patches; branching appendages on both sides of the head; dotted edge; small lobed rear appendages.',states:[1,0,1,0,1]}
  };
  const characters=['visible rear appendages','pointed head projections','two large dark body bars','small round body spots','branching appendages on both sides of the head'];
  const trees=[[0,[[1,2],[3,[4,5]]]],[0,[[[1,2],3],[4,5]]],[0,[1,[2,[3,[4,5]]]]]];
  const labels=['Two main ingroup branches','Alternative ingroup split','Successive branching'];
  function score(tree,assigned){
    if(assigned.some(x=>!x))return null;
    let changes=0;
    function visit(t,c){if(typeof t==='number')return new Set([data[assigned[t]].states[c]]);const a=visit(t[0],c),b=visit(t[1],c),same=new Set([...a].filter(x=>b.has(x)));if(same.size)return same;changes++;return new Set([...a,...b]);}
    characters.forEach((_,c)=>visit(tree,c));return changes;
  }
  function observe(a,b){
    const shared=characters.filter((_,i)=>data[a].states[i]===1&&data[b].states[i]===1);
    const different=characters.filter((_,i)=>data[a].states[i]!==data[b].states[i]);
    return `Taxa ${a} and ${b}: ${shared.length?'shared observations include '+shared.join(', '):'none of the five illustrative traits is present in both'}. ${different.length?'Compare their differences in '+different.join(', ')+'.':'Their five illustrative scores match, but other visible features may distinguish them.'} Shared features can support a sister hypothesis; convergence, reversal, or differently defined characters could change that interpretation.`;
  }
  return {data,characters,trees,labels,score,observe};
})();
if(typeof module!=='undefined')module.exports=CaminalculeModel;
if(typeof document!=='undefined')(()=>{
  const root=document.getElementById('cam-explorer');if(!root)return;
  const {data,characters,trees,labels,score,observe}=CaminalculeModel;
  const bank=document.getElementById('cam-bank'),canvas=document.getElementById('cam-canvas'),feedback=document.getElementById('cam-observations');
  let assigned=Array(6).fill(null),selected=null,shape=0;
  const make=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e};
  let tipId=0;
  function token(id){
    const card=make('div',null,'taxon-card');const b=make('button',null,'taxon-token');b.type='button';b.draggable=true;b.dataset.camTaxon=id;
    b.setAttribute('aria-pressed',String(selected===id));b.setAttribute('aria-describedby',`cam-desc-${++tipId}`);
    const img=make('img');img.src=`assets/${data[id].image}`;img.alt='';b.append(img,make('span',`Taxon ${id}${id==='A'?' · Outgroup':''}`));
    const desc=make('div',data[id].description,'taxon-description');desc.id=`cam-desc-${tipId}`;desc.setAttribute('role','tooltip');
    b.addEventListener('click',()=>{selected=selected===id?null:id;render();root.querySelector(`[data-cam-taxon="${id}"]`).focus();feedback.textContent=selected?`Taxon ${id} selected. Choose a tip on the tree, or return it to the bank.`:'Selection cleared.'});
    b.addEventListener('dragstart',e=>{selected=id;e.dataTransfer.setData('text/plain',id);e.dataTransfer.effectAllowed='move'});
    b.addEventListener('dragend',()=>{selected=null;root.querySelectorAll('[data-cam-taxon]').forEach(el=>el.setAttribute('aria-pressed','false'))});
    card.addEventListener('keydown',e=>{if(e.key==='Escape'){card.classList.add('dismissed');e.stopPropagation()}});
    card.addEventListener('pointerenter',()=>card.classList.remove('dismissed'));
    b.addEventListener('focus',()=>card.classList.remove('dismissed'));
    card.append(b,desc);return card;
  }
  function observations(){
    const count=assigned.filter(Boolean).length;let notes=[`${count} of 6 taxa placed. This is a hypothesis, not a right/wrong score.`];
    if(assigned[0])notes.push(assigned[0]==='A'?'A occupies the outgroup branch, matching the lab’s rooting assumption.':'Consider rooting: the first branch currently holds '+assigned[0]+'. The lab designates A as the outgroup; move A to tip 1 to follow that assumption.');
    function pairs(t){if(typeof t==='number')return;if(t.every(c=>typeof c==='number')){const [a,b]=t.map(i=>assigned[i]);if(a&&b)notes.push(observe(a,b));}t.forEach(pairs)}pairs(trees[shape]);
    if(count===6){const scores=trees.map(t=>score(t,assigned));notes.push(`Illustrative parsimony comparison for these same tip assignments: ${scores.map((s,i)=>labels[i]+': '+s+' changes').join('; ')}. These are minimum changes across five pre-coded binary observations, allowing gains and losses. Fewer changes favor a hypothesis under this criterion, but do not establish a correct tree. Your own character definitions, scores, and uncertain observations may produce different results.`)}
    notes.push('In your external document, identify one strength, one tradeoff, and evidence that could change your hypothesis. Tip order alone does not determine relatedness.');
    feedback.replaceChildren(...notes.map(n=>make('p',n)));
  }
  function place(i,id=selected){
    if(!data[id]){feedback.textContent='Select a taxon first, then choose a tip.';return}
    const displaced=assigned[i];assigned=assigned.map(x=>x===id?null:x);assigned[i]=id;selected=null;render();observations();
    if(displaced&&displaced!==id)feedback.prepend(make('p',`Taxon ${displaced} returned to the bank because that tip was occupied.`));
  }
  function render(){
    bank.replaceChildren();Object.keys(data).filter(id=>!assigned.includes(id)).forEach(id=>bank.append(token(id)));
    if(!bank.children.length)bank.append(make('p','All taxa are on the tree. Select a placed taxon to move it.'));
    canvas.replaceChildren();const NS='http://www.w3.org/2000/svg',svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 800 450');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('role','img');svg.setAttribute('aria-label',`${labels[shape]}. Tip 1 is the outgroup branch. Sister relationships are described by the nested tree list below.`);
    function draw(t,depth){if(typeof t==='number')return {x:570,y:35+t*73};const a=draw(t[0],depth+1),b=draw(t[1],depth+1),x=50+depth*90,y=(a.y+b.y)/2;const path=document.createElementNS(NS,'path');path.setAttribute('d',`M${a.x} ${a.y}H${x}V${b.y}H${b.x}`);path.setAttribute('class','cam-branch');svg.append(path);return {x,y};}draw(trees[shape],0);canvas.append(svg);
    assigned.forEach((id,i)=>{const slot=make('div',null,'cam-tip');slot.style.top=`${(35+i*73)/450*100}%`;const b=make('button',`Tip ${i+1}`,'cam-tip-target');b.type='button';b.setAttribute('aria-label',`Assign selected taxon to tip ${i+1}${i===0?', outgroup branch':''}${id?', currently taxon '+id:''}`);b.addEventListener('click',()=>place(i));slot.append(b);if(id)slot.append(token(id));else slot.append(make('span','Empty','cam-empty'));slot.addEventListener('dragover',e=>e.preventDefault());slot.addEventListener('drop',e=>{e.preventDefault();place(i,e.dataTransfer.getData('text/plain'))});canvas.append(slot)});
    document.getElementById('cam-shape-label').textContent=labels[shape];
    const text=document.getElementById('cam-tree-text');text.replaceChildren();
    function describe(t){const li=make('li');if(typeof t==='number')li.textContent=`Tip ${t+1}: ${assigned[t]?'taxon '+assigned[t]:'unassigned'}`;else{li.append(make('span','Common ancestor of:'));const ul=make('ul');t.forEach(c=>ul.append(describe(c)));li.append(ul)}return li}const ul=make('ul');ul.append(describe(trees[shape]));text.append(ul);
  }
  function returnTaxon(id=selected){if(!data[id]){feedback.textContent='Select a taxon to return to the bank.';return}assigned=assigned.map(x=>x===id?null:x);selected=null;render();observations()}
  document.getElementById('cam-return').addEventListener('click',()=>returnTaxon());bank.addEventListener('dragover',e=>e.preventDefault());bank.addEventListener('drop',e=>{e.preventDefault();returnTaxon(e.dataTransfer.getData('text/plain'))});
  document.getElementById('cam-shape').addEventListener('click',()=>{shape=(shape+1)%trees.length;render();observations()});
  document.getElementById('cam-reset').addEventListener('click',()=>{assigned=Array(6).fill(null);selected=null;shape=0;render();observations()});
  root.hidden=false;render();observations();
})();
