'use strict';
(() => {
  const traits = [
    {id:'hair',label:'Hair',taxa:['Leopard'],slot:4},
    {id:'legs',label:'Four walking legs',taxa:['Frog','Turtle','Leopard'],slot:2},
    {id:'column',label:'Vertebral column',taxa:['Lamprey','Bass','Frog','Turtle','Leopard'],slot:0},
    {id:'amnion',label:'Amnion',taxa:['Turtle','Leopard'],slot:3},
    {id:'jaws',label:'Hinged jaws',taxa:['Bass','Frog','Turtle','Leopard'],slot:1}
  ];
  const descendants = [traits[2].taxa,traits[4].taxa,traits[1].taxa,traits[3].taxa,traits[0].taxa];
  const letters = ['A','B','C','D','E'];
  const positions = new Map();
  let selected = null;
  const bank = document.getElementById('trait-bank');
  const feedback = document.getElementById('trait-feedback');
  const progress = document.getElementById('trait-progress');
  const zones = [...document.querySelectorAll('[data-trait-slot]')];
  if (!bank || zones.length !== 5) return;
  function announce(message) { feedback.textContent = message; }
  function token(trait) {
    const b=document.createElement('button');
    b.type='button'; b.className='trait-token'; b.textContent=trait.label;
    b.draggable=true; b.dataset.trait=trait.id;
    b.setAttribute('aria-pressed',String(selected===trait.id));
    b.setAttribute('aria-label',`${trait.label}. ${positions.has(trait.id)?'Currently at position '+letters[positions.get(trait.id)]+'. ':''}Select to move.`);
    b.addEventListener('click',()=>{
      selected=selected===trait.id?null:trait.id;render();
      document.querySelector(`[data-trait="${trait.id}"]`).focus();
      announce(selected?`${trait.label} selected. Activate a position A through E, or return it to the bank.`:'Selection cleared.');
    });
    b.addEventListener('dragstart',e=>{selected=trait.id;e.dataTransfer.setData('text/plain',trait.id);e.dataTransfer.effectAllowed='move'});
    b.addEventListener('dragend',()=>{selected=null;render()});
    return b;
  }
  function render() {
    bank.replaceChildren();traits.filter(t=>!positions.has(t.id)).forEach(t=>bank.append(token(t)));
    if(!bank.children.length){const p=document.createElement('p');p.textContent='All traits are on the tree. You can still move any trait.';bank.append(p)}
    zones.forEach((zone,i)=>{
      const holder=zone.querySelector('.placed-trait');holder.replaceChildren();
      const trait=traits.find(t=>positions.get(t.id)===i);
      zone.classList.toggle('placement-correct',!!trait && trait.slot===i);
      zone.classList.toggle('placement-incorrect',!!trait && trait.slot!==i);
      if(trait)holder.append(token(trait));
      zone.querySelector('.placement-status').textContent=trait?(trait.slot===i?'✓ Correct':'↻ Try another branch'):'Empty';
    });
    progress.textContent=`${traits.filter(t=>positions.get(t.id)===t.slot).length} of 5 traits correctly placed.`;
  }
  function place(i,id=selected) {
    const trait=traits.find(t=>t.id===id);
    if(!trait){announce('Select a trait from the bank or tree first, then choose a position.');return}
    const occupant=traits.find(t=>positions.get(t.id)===i && t.id!==id);
    if(occupant)positions.delete(occupant.id);
    positions.set(id,i);selected=null;render();
    const observed=trait.taxa,predicted=descendants[i];
    const extra=predicted.filter(t=>!observed.includes(t)),missing=observed.filter(t=>!predicted.includes(t));
    let message=trait.slot===i?`Correct. ${trait.label} at ${letters[i]} is inherited by ${predicted.join(', ')}.`:
      `Not yet. At ${letters[i]}, ${trait.label} would be inherited by ${predicted.join(', ')}. `+
      (extra.length?`But the evidence does not show this trait in ${extra.join(', ')}. `:'')+
      (missing.length?`This placement also leaves out ${missing.join(', ')}, which have the trait. `:'')+
      'Choose this trait again and try another branch.';
    if(occupant)message+=` ${occupant.label} returned to the bank because that position was occupied.`;
    if(traits.every(t=>positions.get(t.id)===t.slot))message+=' All five fit the evidence! Reset to try again, or continue to Part 1.';
    announce(message);
  }
  zones.forEach((zone,i)=>{
    zone.querySelector('.slot-target').addEventListener('click',()=>place(i));
    zone.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='move'});
    zone.addEventListener('drop',e=>{e.preventDefault();place(i,e.dataTransfer.getData('text/plain'))});
  });
  function returnToBank(id=selected){
    const trait=traits.find(t=>t.id===id);
    if(!trait){announce('Select a trait first, then return it to the bank.');return}
    positions.delete(id);selected=null;render();announce(`${trait.label} returned to the bank.`);
  }
  document.getElementById('return-trait').addEventListener('click',()=>returnToBank());
  bank.addEventListener('dragover',e=>e.preventDefault());
  bank.addEventListener('drop',e=>{e.preventDefault();returnToBank(e.dataTransfer.getData('text/plain'))});
  document.getElementById('reset-traits').addEventListener('click',()=>{
    positions.clear();selected=null;render();announce('Practice reset. All characteristics are outside the tree in the trait bank.');
  });
  document.getElementById('trait-practice-controls').hidden=false;render();
})();
