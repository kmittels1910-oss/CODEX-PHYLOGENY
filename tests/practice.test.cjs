// Exercise the shipped event handlers with a small DOM stand-in.
// This verifies activity behavior; it does not replace browser/accessibility QA.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../lab.js'),'utf8');
function setup(){
  class Element{
    constructor(){this.children=[];this.dataset={};this.attrs={};this.handlers={};this.classes=new Set();this.classList={toggle:(k,on)=>on?this.classes.add(k):this.classes.delete(k)};}
    append(e){this.children.push(e)}
    replaceChildren(){this.children=[]}
    setAttribute(k,v){this.attrs[k]=v}
    addEventListener(k,f){this.handlers[k]=f}
    focus(){focused=this}
    querySelector(sel){return this.parts[sel]}
    fire(type,event={}){this.handlers[type]?.(event)}
  }
  let focused;
  const ids=Object.fromEntries(['trait-bank','trait-feedback','trait-progress','return-trait','reset-traits','trait-practice-controls'].map(id=>[id,new Element()]));
  const zones=Array.from({length:5},()=>{const e=new Element();e.parts=Object.fromEntries(['.placed-trait','.placement-status','.slot-target'].map(k=>[k,new Element()]));return e});
  const allTokens=()=>[...ids['trait-bank'].children,...zones.flatMap(z=>z.parts['.placed-trait'].children)].filter(e=>e.dataset.trait);
  const token=id=>allTokens().find(e=>e.dataset.trait===id);
  const document={getElementById:id=>ids[id],createElement:()=>new Element(),querySelectorAll:()=>zones,querySelector:sel=>token(sel.match(/"([^"]+)"/)[1])};
  vm.runInNewContext(source,{document,Map});
  return {ids,zones,token,allTokens,focused:()=>focused,choose:id=>token(id).fire('click'),place:i=>zones[i].parts['.slot-target'].fire('click'),reset:()=>ids['reset-traits'].fire('click'),feedback:()=>ids['trait-feedback'].textContent,progress:()=>ids['trait-progress'].textContent};
}
const answer={column:0,jaws:1,legs:2,amnion:3,hair:4};
test('all five characteristics begin outside the tree, without selected answers',()=>{
  const s=setup();assert.equal(s.ids['trait-bank'].children.length,5);assert.equal(s.progress(),'0 of 5 traits correctly placed.');assert.ok(s.zones.every(z=>z.parts['.placed-trait'].children.length===0));assert.equal(s.ids['trait-practice-controls'].hidden,false);
});
test('all 25 trait/position combinations give correct biological feedback',()=>{
  for(const [id,correct] of Object.entries(answer))for(let i=0;i<5;i++){
    const s=setup();s.choose(id);assert.equal(s.focused(),s.token(id));assert.equal(s.token(id).attrs['aria-pressed'],'true');s.place(i);
    assert.match(s.feedback(),i===correct?/^Correct\./:/^Not yet\./);assert.equal(s.zones[i].parts['.placed-trait'].children[0].dataset.trait,id);assert.equal(s.allTokens().length,5);
    if(i!==correct)assert.match(s.feedback(),/does not show|leaves out/);
  }
});
test('placed traits can move, displace occupants, and return to the bank',()=>{
  const s=setup();s.choose('hair');s.place(0);s.choose('column');s.place(0);
  assert.ok(s.ids['trait-bank'].children.includes(s.token('hair')));assert.match(s.feedback(),/Hair returned to the bank/);
  s.choose('column');s.place(1);assert.equal(s.zones[0].parts['.placed-trait'].children.length,0);
  s.choose('column');s.ids['return-trait'].fire('click');assert.ok(s.ids['trait-bank'].children.includes(s.token('column')));assert.equal(s.allTokens().length,5);
});
test('drag/drop gives feedback and reset clears every placement',()=>{
  const s=setup();let payload;const dataTransfer={setData:(type,value)=>payload=value,getData:()=>payload};let prevented=false;
  s.token('hair').fire('dragstart',{dataTransfer});s.zones[4].fire('drop',{dataTransfer,preventDefault:()=>prevented=true});
  assert.ok(prevented);assert.match(s.feedback(),/^Correct/);
  for(const [id,i] of Object.entries(answer)){if(id!=='hair'){s.choose(id);s.place(i)}}
  assert.match(s.feedback(),/All five fit/);assert.equal(s.progress(),'5 of 5 traits correctly placed.');
  s.reset();assert.equal(s.ids['trait-bank'].children.length,5);assert.equal(s.progress(),'0 of 5 traits correctly placed.');assert.ok(s.zones.every(z=>z.parts['.placed-trait'].children.length===0));
});
test('empty selection is explained and reload starts fresh',()=>{
  const s=setup();s.place(0);assert.match(s.feedback(),/Select a trait/);s.choose('hair');s.place(4);assert.equal(setup().progress(),'0 of 5 traits correctly placed.');
});
test('lab retains no written-answer controls or persistence APIs',()=>{
  const h=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
  assert.doesNotMatch(h,/<(?:input|textarea|select|form)\b|contenteditable/i);
  assert.doesNotMatch(source,/localStorage|sessionStorage|fetch\(|XMLHttpRequest/);
  const ids=[...h.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
  for(const [,target] of h.matchAll(/(?:href|src)="([^"]+)"/g)){
    if(target.startsWith('#'))assert.ok(ids.includes(target.slice(1)),target);
    else if(!target.includes(':'))assert.ok(fs.existsSync(path.join(__dirname,'..',target)),target);
  }
});
