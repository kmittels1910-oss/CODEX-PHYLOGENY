'use strict';
const KEY = 'bio106-phylogeny-v1';
const taxa = ['Lancelet','Lamprey','Bass','Frog','Turtle','Leopard'];
const traits = ['Vertebral column','Hinged jaws','Four walking legs','Amnion','Hair'];
const camTaxa = ['A','I','G','F','E','D'];
const expectedMatrix = [[0,0,0,0,0],[1,0,0,0,0],[1,1,0,0,0],[1,1,1,0,0],[1,1,1,1,0],[1,1,1,1,1]];
const $ = id => document.getElementById(id);
const make = (tag, text, cls) => { const e = document.createElement(tag); if(text !== undefined)e.textContent=text;if(cls)e.className=cls;return e; };
let forest = camTaxa.map(x=>x), history = [], storageOK = true;
function createMatrix(id, names, columns, prefix, uncertain=false) {
  const t = $(id), head=make('thead'), tr=make('tr');
  const first=make('th','Taxon');first.scope='col';tr.append(first);
  columns.forEach(x=>{const th=make('th',x);th.scope='col';tr.append(th)});head.append(tr);t.append(head);
  const body=make('tbody');
  names.forEach((name,r)=>{const row=make('tr'), th=make('th',name);th.scope='row';row.append(th);
    columns.forEach((col,c)=>{const td=make('td'), s=make('select');s.id=`${prefix}-${r}-${c}`;s.dataset.save='';s.setAttribute('aria-label',`${name}, ${col}`);
      [['','—'],['0','0'],['1','1'],...(uncertain?[['?','?']]:[])].forEach(([v,l])=>{const o=make('option',l);o.value=v;s.append(o)});td.append(s);row.append(td)});body.append(row)});t.append(body);
}
createMatrix('vertebrate-matrix',taxa,traits,'v');
createMatrix('cam-matrix',camTaxa,Array.from({length:8},(_,i)=>`Character ${i+1}`),'c',true);
const checks = [
 ['tree-checks','outgroup','Which taxon is the outgroup?',['Lancelet','Lamprey','Leopard'],0,'The lancelet branches outside the vertebrate ingroup. It helps polarize the character states.'],
 ['tree-checks','path-a','On the root-to-lancelet path, do any of the five mapped derived traits arise?',['Yes','No'],1,'None of the five changes is mapped on that path in this simplified tree.'],
 ['tree-checks','path-b','Does a vertebral column arise along the root-to-bass path?',['Yes','No'],0,'The bass lineage passes through the vertebral-column change.'],
 ['tree-checks','path-f','Does an amnion arise along the root-to-frog path?',['Yes','No'],1,'The frog branches before the amnion change in this tree.'],
 ['tree-checks','legs','How should lamprey be scored for four walking legs?',['0: absent','1: present'],0,'Lamprey retains state 0 for this character in the worksheet dataset.'],
 ['tree-checks','sisters','Which taxon is sister to leopard in this tree?',['Frog','Turtle','Bass'],1,'Turtle and leopard share the most recent branching node shown. Tip position alone does not determine relatedness.'],
 ['group-checks','mono','Other even-toed ungulates + hippopotamuses + cetaceans, including their ancestor:',['Monophyletic','Paraphyletic','Polyphyletic'],0,'This includes the ancestor and all descendants of that node in the example.'],
 ['group-checks','para','That same ancestral group with cetaceans excluded:',['Monophyletic','Paraphyletic','Polyphyletic'],1,'The grouping retains the ancestor but leaves out a descendant lineage.'],
 ['group-checks','poly','Cetaceans + seals grouped by independently evolved aquatic adaptations:',['Monophyletic','Paraphyletic','Polyphyletic'],2,'This grouping combines separate lineages using homoplastic features and excludes their most recent common ancestor as a group member.'],
 ['group-checks','homology','Hair inherited by humans and dogs from their common ancestor is:',['Homology','Homoplasy'],0,'Their hair is similar because of inheritance from a shared ancestor.'],
 ['group-checks','reversal','A lineage loses a derived feature and returns to an earlier state. This is:',['A reversal, a form of homoplasy','Proof it is the outgroup'],0,'An ancestral-looking state can arise through reversal. Outgroup status depends on relationships, not appearance alone.']
];
checks.forEach(([container,id,q,options,answer,explanation])=>{
  const box=make('div',undefined,'check'), fs=make('fieldset'), legend=make('legend',q);fs.append(legend);
  options.forEach((option,i)=>{const l=make('label',undefined,'option'), input=make('input');input.type='radio';input.name=id;input.id=`${id}-${i}`;input.value=String(i);input.dataset.save='';l.append(input,document.createTextNode(option));fs.append(l)});
  const b=make('button','Check answer');b.type='button';const f=make('p',undefined,'feedback');f.id=`${id}-feedback`;f.setAttribute('role','status');
  b.addEventListener('click',()=>{const selected=fs.querySelector('input:checked');f.textContent=!selected?'Choose an answer first.':`${Number(selected.value)===answer?'Correct.':'Reconsider your answer.'} ${explanation}`;});
  box.append(fs,b,f);$(container).append(box);
});
const specimenFiles={A:'image7.png',I:'image8.png',G:'image10.png',F:'image9.png',E:'image11.png',D:'image12.png'};
camTaxa.forEach(name=>{const fig=make('figure',undefined,'specimen'),im=make('img');im.src=`assets/${specimenFiles[name]}`;im.alt=`Caminalcule ${name}. See the text observation guide immediately after the specimens for a feature description.`;im.loading='lazy';fig.append(im,make('figcaption',`Taxon ${name}${name==='A'?' · Outgroup':''}`));$('specimens').append(fig)});
for(let n=1;n<=8;n++){const row=make('div',undefined,'char-row');row.append(make('strong',String(n)));['Character name','State 0 definition','State 1 definition'].forEach((name,i)=>{const label=make('label',name),input=make('input');input.id=`char-${n}-${i}`;input.dataset.save='';input.setAttribute('aria-label',`Character ${n}, ${name}`);label.append(input);row.append(label)});$('characters').append(row)}
const exitQuestions=[
 ['exit-bc','Which node is the most recent common ancestor of B and C?'],
 ['exit-ab','Which node is the most recent common ancestor of A and B?'],
 ['exit-out','Which species is the outgroup? Explain how you know.'],
 ['exit-trait1','List all species that inherit trait 1.'],
 ['exit-trait2','List all species that inherit trait 2.'],
 ['exit-e','Which species is/are most closely related to E? Explain using the node relationships.'],
 ['exit-f','Which species is/are most closely related to F? Explain why tip spacing does not determine the answer.'],
 ['exit-mono','Define a monophyletic group on this tree. List every taxon and labeled node included, and explain its boundary.'],
 ['exit-para','Define a paraphyletic group on this tree. List its taxa and included nodes, and identify the excluded descendant lineage(s).'],
 ['exit-poly','Propose a polyphyletic grouping on this tree. List its taxa and any included nodes, identify the excluded common ancestral node, and explain your reasoning.']
];
exitQuestions.forEach(([id,q],i)=>{const l=make('label',`${i+1}. ${q}`);l.htmlFor=id;const t=make('textarea');t.id=id;t.rows=3;t.dataset.save='';$('exit-prompts').append(l,t)});
const leaves = tree => typeof tree === 'string' ? [tree] : tree.flatMap(leaves);
const notation = tree => typeof tree === 'string' ? tree : `(${tree.map(notation).join(',')})`;
function renderTree(){
  $('clade-options').replaceChildren();forest.forEach((tree,i)=>{const l=make('label',undefined,'option'),input=make('input');input.type='checkbox';input.value=String(i);input.name='clade';l.append(input,document.createTextNode(` ${notation(tree)}`));$('clade-options').append(l)});
  $('cam-tree').replaceChildren();
  const p=make('p',forest.length===1?`Completed topology: ${notation(forest[0])}`:`Current groups: ${forest.map(notation).join(' · ')}`);$('cam-tree').append(p);
  function branch(tree){const li=make('li');if(typeof tree==='string'){li.textContent=`Taxon ${tree}${tree==='A'?' (outgroup)':''}`;}else{li.append(make('span',`Node: ${leaves(tree).join(', ')}`,'tree-node'));const ul=make('ul');tree.forEach(child=>ul.append(branch(child)));li.append(ul)}return li}
  const ul=make('ul');forest.forEach(tree=>ul.append(branch(tree)));$('cam-tree').append(ul);$('join').disabled=forest.length===1;$('undo').disabled=!history.length;
}
$('join').addEventListener('click',()=>{
  const indices=[...document.querySelectorAll('input[name=clade]:checked')].map(e=>Number(e.value));
  if(indices.length!==2){$('builder-feedback').textContent='Select exactly two taxa or clades to join.';return}
  if(forest.length>2 && indices.some(i=>leaves(forest[i]).includes('A'))){$('builder-feedback').textContent='Keep A separate until the final join so it remains the outgroup.';return}
  history.push(structuredClone(forest));const joined=indices.map(i=>forest[i]);forest=forest.filter((_,i)=>!indices.includes(i));forest.push(joined);renderTree();save();$('builder-feedback').textContent=forest.length===1?'Tree complete. Now map character changes and compare an alternative hypothesis.':'Pair joined. Choose another pair, or undo to revise.';
});
$('undo').addEventListener('click',()=>{if(history.length){forest=history.pop();renderTree();save();$('builder-feedback').textContent='Last join undone.'}});
function state(){const fields={};document.querySelectorAll('[data-save]').forEach(e=>{fields[e.id]=e.type==='radio'?e.checked:e.value});return {format:'bio106-phylogeny',version:1,fields,forest,history};}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state()));storageOK=true;$('save-status').textContent='Responses saved locally in this browser. Download a copy before leaving.'}catch{storageOK=false;$('save-status').textContent='Local saving is unavailable. Keep this tab open and download your responses before leaving.'}}
function validTree(t,depth=0){return depth<12 && (typeof t==='string'?camTaxa.includes(t):Array.isArray(t)&&t.length===2&&t.every(c=>validTree(c,depth+1)))}
function validForest(f){return Array.isArray(f)&&f.length>=1&&f.length<=6&&f.every(t=>validTree(t))&&leaves(f).length===6&&new Set(leaves(f)).size===6;}
function applyState(s){
  if(!s||s.format!=='bio106-phylogeny'||s.version!==1||!s.fields||typeof s.fields!=='object'||!validForest(s.forest)||!Array.isArray(s.history)||s.history.length>5||!s.history.every(validForest))throw Error('Not a valid Lab 5 backup.');
  document.querySelectorAll('[data-save]').forEach(e=>{const v=s.fields[e.id];if(e.type==='radio')e.checked=v===true;else e.value=typeof v==='string'?v:''});forest=s.forest;history=s.history;renderTree();
  document.querySelectorAll('.feedback').forEach(e=>e.textContent='');$('matrix-feedback').textContent='';$('ranks-feedback').textContent='';
}
try{const raw=localStorage.getItem(KEY);if(raw)applyState(JSON.parse(raw));$('save-status').textContent=raw?'Saved responses restored from this browser. Download a copy regularly.':'Responses will save locally in this browser as you work.';}catch{storageOK=false;$('save-status').textContent='Saved work could not be loaded. Use response downloads and editable backups.'}
renderTree();
document.addEventListener('input',e=>{if(e.target.matches('[data-save]'))save()});document.addEventListener('change',e=>{if(e.target.matches('[data-save]'))save()});
$('check-matrix').addEventListener('click',()=>{let blanks=0,wrong=[];taxa.forEach((taxon,r)=>traits.forEach((trait,c)=>{const v=$(`v-${r}-${c}`).value;if(v==='')blanks++;else if(Number(v)!==expectedMatrix[r][c])wrong.push(`${taxon}: ${trait}`)}));$('matrix-feedback').textContent=blanks?`${blanks} unscored cell(s). Complete the matrix, then check again.`:wrong.length?`Revisit ${wrong.length} cell(s): ${wrong.join('; ')}. Trace each lineage through the mapped character changes.`:'All 30 character states match this simplified tree. Use the same evidence-based approach for your Caminalcules.';});
$('check-ranks').addEventListener('click',()=>{const actual=$('ranks').value.toLowerCase().match(/[a-z]+/g)||[];const expected=['domain','kingdom','phylum','class','order','family','genus','species'];$('ranks-feedback').textContent=actual.join(',')===expected.join(',')?'Correct: Domain → Kingdom → Phylum → Class → Order → Family → Genus → Species.':'Compare your sequence with: Domain → Kingdom → Phylum → Class → Order → Family → Genus → Species.';});
function download(content,type,name){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=make('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);$('export-status').textContent=`Download requested: ${name}. Check your downloads, then upload the file to Canvas.`;}
function responseText(){
  let lines=['BIO 106 — Lab 5: Phylogeny','Student response record',`Exported: ${new Date().toLocaleString()}`,'Practice responses are self-check work; this record is not a Canvas submission.',''];
  document.querySelectorAll('section').forEach(section=>{
    lines.push(`\n${section.querySelector('h2').textContent}\n${'='.repeat(45)}`);
    section.querySelectorAll('textarea[data-save],input[data-save]:not([type=radio])').forEach(e=>{const label=e.getAttribute('aria-label')||document.querySelector(`label[for="${e.id}"]`)?.textContent||e.parentElement.textContent;lines.push(`${label.trim()}:\n${e.value||'[No response]'}\n`)});
    section.querySelectorAll('.check').forEach(box=>{const selected=box.querySelector('input:checked');lines.push(`${box.querySelector('legend').textContent}\n${selected?selected.parentElement.textContent.trim():'[No response]'}\n`)});
    if(section.id==='read'){lines.push(['Taxon',...traits].join('\t'));taxa.forEach((t,r)=>lines.push([t,...traits.map((_,c)=>$(`v-${r}-${c}`).value||'—')].join('\t')))}
    if(section.id==='build'){lines.push(['Taxon',...Array.from({length:8},(_,i)=>`Character ${i+1}`)].join('\t'));camTaxa.forEach((t,r)=>lines.push([t,...Array.from({length:8},(_,c)=>$(`c-${r}-${c}`).value||'—')].join('\t')));lines.push(`Tree: ${forest.map(notation).join(' | ')}${forest.length>1?' [Incomplete: multiple groups remain]':''}`)}
  });return lines.join('\n');
}
$('download').addEventListener('click',()=>download(responseText(),'text/plain;charset=utf-8','lab-5-phylogeny-responses.txt'));
$('backup').addEventListener('click',()=>download(JSON.stringify(state(),null,2),'application/json','lab-5-phylogeny-backup.json'));
$('restore').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>1000000)throw Error('Backup is too large.');const parsed=JSON.parse(await file.text());applyState(parsed);save();$('export-status').textContent='Backup restored. Review your responses before continuing.'}catch(err){$('export-status').textContent=`Could not restore the backup: ${err.message}`}e.target.value='';});
let printNodes=[];let detailStates=[];
function preparePrint(){if(printNodes.length)return;document.querySelectorAll('textarea').forEach(t=>{const p=make('div',t.value||'[No response]','print-answer');t.after(p);t.hidden=true;printNodes.push([t,p])});detailStates=[...document.querySelectorAll('details')].map(d=>[d,d.open]);detailStates.forEach(([d])=>d.open=true)}
function finishPrint(){printNodes.forEach(([t,p])=>{t.hidden=false;p.remove()});printNodes=[];detailStates.forEach(([d,open])=>d.open=open);detailStates=[]}
window.addEventListener('beforeprint',preparePrint);window.addEventListener('afterprint',finishPrint);$('print').addEventListener('click',()=>window.print());
$('clear').addEventListener('click',()=>{if(!$('confirm-clear').checked){$('export-status').textContent='Select the confirmation checkbox before clearing.';return}document.querySelectorAll('[data-save]').forEach(e=>{if(e.type==='radio')e.checked=false;else e.value=''});forest=[...camTaxa];history=[];try{localStorage.removeItem(KEY)}catch{}renderTree();document.querySelectorAll('.feedback').forEach(e=>e.textContent='');$('matrix-feedback').textContent='';$('ranks-feedback').textContent='';$('builder-feedback').textContent='';$('save-status').textContent='Responses cleared from this browser.';$('export-status').textContent='Responses cleared.';$('confirm-clear').checked=false;});
