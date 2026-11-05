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
  function placement(tree,assigned,tip){
    const id=assigned[tip];if(!id)return [];
    const notes=[`Placement: taxon ${id} at tip ${tip+1}.`];
    const leafIndices=t=>typeof t==='number'?[t]:t.flatMap(leafIndices);
    let sister=[];
    function find(t){if(typeof t==='number')return;if(t[0]===tip)sister=leafIndices(t[1]);else if(t[1]===tip)sister=leafIndices(t[0]);else t.forEach(find)}find(tree);
    if(tip===0){
      notes.push(id==='A'?'Good fit to the lab’s rooting assumption: A is the designated outgroup, so its branch separates outside the ingroup. Outgroup comparison helps interpret character polarity [1, 2].':'Poor fit to the lab’s rooting assumption: this is the outgroup branch, but the lab designates A as outgroup. This is a rooting concern rather than proof that the taxon looks “too primitive” or “too advanced” [1, 2].');
    }else if(id==='A')notes.push('Rooting concern: A is now inside the ingroup. To follow this lab’s stated outgroup assumption, place A at tip 1. A living outgroup is a relative, not the literal ancestor of the other taxa [1, 2].');
    else{
      const relatives=sister.map(i=>assigned[i]).filter(Boolean);
      if(!relatives.length)notes.push(`Evidence pending: the sister ${sister.length===1?'tip is':'clade is'} still empty. Place a taxon at ${sister.map(i=>'tip '+(i+1)).join(' or ')} to evaluate the nearest relationship. Visual distance between tips is not the criterion [1].`);
      else{
        const group=[id,...relatives];
        const shared=characters.filter((_,c)=>group.every(t=>data[t].states[c]===1));
        const informative=shared.filter(name=>{const c=characters.indexOf(name);return Object.keys(data).some(t=>t!=='A'&&!group.includes(t)&&data[t].states[c]===0)});
        const differences=characters.filter((_,c)=>relatives.some(t=>data[t].states[c]!==data[id].states[c]));
        notes.push(`Nearest relationship: taxon ${id} is sister to ${relatives.join(', ')}${relatives.length<sister.length?' and the unassigned taxa in that clade':''}.`);
        notes.push(informative.length?`Potential strength: ${group.join(', ')} share ${informative.join('; ')}, absent in A and not present in every other ingroup taxon in this provisional matrix. Such shared candidate derived states may support this grouping; confirm their homology and check all descendants [1, 2].`:'Limited support for this particular split: no shared present state in the five-character model distinguishes these taxa from the rest of the ingroup. A broadly shared ingroup feature can support the ingroup without identifying its closest relatives [1].');
        if(differences.length)notes.push(`Tradeoff: this placement groups taxa differing in ${differences.join('; ')}. Differences alone do not disprove sisterhood, but the tree must account for changes along their branches. Compare a grouping that reduces those changes using the same characters [2].`);
        else notes.push('Tradeoff: their five illustrative scores match, but this coarse coding omits other visible details. More similarity is not automatically more evidence if characters repeat the same underlying feature [2, 3].');
        if(relatives.length<sister.length)notes.push('This assessment is provisional because some descendants in the sister clade are unassigned.');
      }
    }
    if(assigned.every(Boolean)){
      const total=score(tree,assigned),alternatives=[];
      for(let j=0;j<6;j++){if(j===tip||((tip===0||j===0)&&assigned[0]==='A'))continue;const swap=[...assigned];[swap[tip],swap[j]]=[swap[j],swap[tip]];alternatives.push({j,changes:score(tree,swap)})}
      const best=Math.min(total,...alternatives.map(a=>a.changes)),better=alternatives.filter(a=>a.changes===best&&best<total);
      notes.push(better.length?`Parsimony tradeoff: this complete tree requires ${total} minimum changes under the five illustrative characters. Swapping taxon ${id} with ${better.map(a=>assigned[a.j]+' at tip '+(a.j+1)).join(' or ')} gives ${best}, a reduction of ${total-best}. That alternative has stronger support under this limited criterion, not a guaranteed true history [2, 3].`:`Parsimony strength: the complete tree requires ${total} minimum changes; no tested single swap of this taxon reduces that total${assigned[0]==='A'?' while keeping A as outgroup':''}. This is a local comparison, not a search of all trees or proof of correctness [2, 3].`);
    }
    return notes;
  }
  return {data,characters,trees,labels,score,observe,placement};
})();
if(typeof module!=='undefined')module.exports=CaminalculeModel;
if(typeof document!=='undefined')(()=>{
  const root=document.getElementById('cam-explorer');if(!root)return;
  const {data,characters,trees,labels,score,observe,placement}=CaminalculeModel;
  const bank=document.getElementById('cam-bank'),canvas=document.getElementById('cam-canvas'),feedback=document.getElementById('cam-observations');
  const stage=document.createElement('div');stage.className='cam-stage';canvas.before(stage);stage.append(canvas);
  const nearby=document.createElement('aside');nearby.className='cam-nearby';nearby.setAttribute('aria-label','Placement commentary');
  nearby.append(root.querySelector('.cam-feedback-heading'),feedback);stage.append(nearby);
  let assigned=Array(6).fill(null),selected=null,shape=0,inspected=null,lastTip=null;
  const make=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e};
  let tipId=0;
  function selectTaxon(id){
    selected=selected===id?null:id;inspected=id;render();
    root.querySelector(`[data-cam-taxon="${id}"]`).focus();
    document.getElementById('cam-selection-status').textContent=selected?`Taxon ${id} selected. Click another tip space to move it.`:'Selection cleared.';
  }
  function token(id){
    const card=make('div',null,'taxon-card');const b=make('button',null,'taxon-token');b.type='button';b.dataset.camTaxon=id;
    b.setAttribute('aria-pressed',String(selected===id));b.setAttribute('aria-describedby',`cam-desc-${++tipId}`);
    const img=make('img');img.src=`assets/${data[id].image}`;img.alt='';img.draggable=false;b.append(img,make('span',`Taxon ${id}${id==='A'?' · Outgroup':''}`));
    const desc=make('div',data[id].description,'taxon-description');desc.id=`cam-desc-${tipId}`;desc.setAttribute('role','tooltip');
    b.addEventListener('click',()=>selectTaxon(id));
    card.addEventListener('keydown',e=>{if(e.key==='Escape'){card.classList.add('dismissed');e.stopPropagation()}});
    card.addEventListener('pointerenter',()=>card.classList.remove('dismissed'));
    b.addEventListener('focus',()=>card.classList.remove('dismissed'));
    card.append(b,desc);return card;
  }
  function observations(){
    const count=assigned.filter(Boolean).length;let notes=[...(lastTip===null?[]:placement(trees[shape],assigned,lastTip)),`${count} of 6 taxa placed. This is a hypothesis, not a right/wrong score.`];
    if(assigned[0])notes.push(assigned[0]==='A'?'A occupies the outgroup branch, matching the lab’s rooting assumption.':'Consider rooting: the first branch currently holds '+assigned[0]+'. The lab designates A as the outgroup; move A to tip 1 to follow that assumption.');
    function pairs(t){if(typeof t==='number')return;if(t.every(c=>typeof c==='number')){const [a,b]=t.map(i=>assigned[i]);if(a&&b)notes.push(observe(a,b));}t.forEach(pairs)}pairs(trees[shape]);
    if(count===6){const scores=trees.map(t=>score(t,assigned));notes.push(`Illustrative parsimony comparison for these same tip assignments: ${scores.map((s,i)=>labels[i]+': '+s+' changes').join('; ')}. These are minimum changes across five pre-coded binary observations, allowing gains and losses. Fewer changes favor a hypothesis under this criterion, but do not establish a correct tree. Your own character definitions, scores, and uncertain observations may produce different results.`)}
    notes.push('In your external document, identify one strength, one tradeoff, and evidence that could change your hypothesis. Tip order alone does not determine relatedness.');
    const focused=lastTip===null?[]:placement(trees[shape],assigned,lastTip);
    const lead=focused[0]||'Select a taxon, then click a tip space.';
    const strength=focused.find(n=>/^(Good fit|Poor fit|Rooting concern|Evidence pending|Potential strength|Limited support)/.test(n));
    const tradeoff=focused.find(n=>/^Tradeoff/.test(n));
    feedback.replaceChildren(make('p',lead,'cam-placement-lead'));
    if(strength)feedback.append(make('p',strength));
    if(tradeoff)feedback.append(make('p',tradeoff));
    const more=make('details');more.append(make('summary','More evidence and comparisons'));notes.forEach(n=>more.append(make('p',n)));feedback.append(more);
    nearby.style.setProperty('--cam-feedback-offset',`${lastTip===null?0:Math.min(lastTip*36,140)}px`);
  }
  function place(i,id=selected){
    if(!id&&assigned[i]){selectTaxon(assigned[i]);return}
    if(!data[id]){feedback.textContent='Select a taxon first, then choose a tip.';return}
    const displaced=assigned[i];assigned=assigned.map(x=>x===id?null:x);assigned[i]=id;inspected=id;selected=null;lastTip=i;render();observations();canvas.querySelectorAll('.cam-tip-target')[i].focus();document.getElementById('cam-selection-status').textContent=`Taxon ${id} placed at tip ${i+1}. See the placement commentary beside the tree.`;
    if(displaced&&displaced!==id)feedback.prepend(make('p',`Taxon ${displaced} returned to the bank because that tip was occupied.`));
  }
  function render(){
    bank.replaceChildren();Object.keys(data).filter(id=>!assigned.includes(id)).forEach(id=>bank.append(token(id)));
    if(!bank.children.length)bank.append(make('p','All taxa are on the tree. Select a placed taxon to move it.'));
    canvas.replaceChildren();const NS='http://www.w3.org/2000/svg',svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 800 450');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('role','img');svg.setAttribute('aria-label',`${labels[shape]}. Tip 1 is the outgroup branch. Sister relationships are described by the nested tree list below.`);
    function draw(t,depth){if(typeof t==='number')return {x:340,y:35+t*73};const a=draw(t[0],depth+1),b=draw(t[1],depth+1),x=750-depth*90,y=(a.y+b.y)/2;const path=document.createElementNS(NS,'path');path.setAttribute('d',`M${a.x} ${a.y}H${x}V${b.y}H${b.x}`);path.setAttribute('class','cam-branch');svg.append(path);return {x,y};}draw(trees[shape],0);canvas.append(svg);
    assigned.forEach((id,i)=>{const slot=make('div',null,'cam-tip');slot.style.top=`${(35+i*73)/450*100}%`;const b=make('button',`Tip ${i+1}`,'cam-tip-target');b.type='button';b.setAttribute('aria-label',`Assign selected taxon to tip ${i+1}${i===0?', outgroup branch':''}${id?', currently taxon '+id:''}`);b.addEventListener('click',()=>place(i));slot.append(b);if(id)slot.append(token(id));else slot.append(make('span','Empty','cam-empty'));canvas.append(slot)});
    document.getElementById('cam-shape-label').textContent=labels[shape];
    const text=document.getElementById('cam-tree-text');text.replaceChildren();
    function describe(t){const li=make('li');if(typeof t==='number')li.textContent=`Tip ${t+1}: ${assigned[t]?'taxon '+assigned[t]:'unassigned'}`;else{li.append(make('span','Common ancestor of:'));const ul=make('ul');t.forEach(c=>ul.append(describe(c)));li.append(ul)}return li}const ul=make('ul');ul.append(describe(trees[shape]));text.append(ul);
    const detail=document.getElementById('cam-selected-detail');detail.replaceChildren();if(inspected){const enlarged=make('img',null,'cam-detail-specimen');enlarged.src=`assets/${data[inspected].image}`;enlarged.alt=`Enlarged specimen of taxon ${inspected}`;detail.append(enlarged);}detail.append(make('h3',inspected?`Taxon ${inspected} · specimen details`:'Selected taxon details'));detail.append(make('p',inspected?data[inspected].description:'Click a taxon in the palette to display its description here, then click a tip space to place it.'));
  }
  function returnTaxon(id=selected){if(!data[id]){feedback.textContent='Select a taxon to return to the bank.';return}assigned=assigned.map(x=>x===id?null:x);selected=null;render();observations()}
  document.getElementById('cam-return').addEventListener('click',()=>{lastTip=null;returnTaxon()});
  document.getElementById('cam-shape').addEventListener('click',()=>{shape=(shape+1)%trees.length;render();observations()});
  document.getElementById('cam-reset').addEventListener('click',()=>{assigned=Array(6).fill(null);selected=null;inspected=null;lastTip=null;shape=0;render();observations();document.getElementById('cam-selection-status').textContent='Click a taxon, then click a tip space.'});
  root.hidden=false;render();observations();
})();
