const {test}=require('node:test');
const assert=require('node:assert/strict');
const {data,trees,score,observe,placement}=require('../caminalcules.js');
test('every scaffold is binary and includes each of six tips once',()=>{
  for(const tree of trees){const tips=[];function visit(t){if(typeof t==='number'){tips.push(t);return}assert.equal(t.length,2);t.forEach(visit)}visit(tree);assert.deepEqual(tips.sort(),[0,1,2,3,4,5]);assert.equal(tree[0],0)}
});
test('incomplete assignments do not receive a parsimony comparison',()=>{
  assert.equal(score(trees[0],['A','I',null,'F','E','D']),null);
});
test('parsimony matches exhaustive binary ancestral-state enumeration',()=>{
  function brute(tree,assigned){let count=0;const edges=[];function walk(t){if(typeof t==='number')return 't'+t;const id=count++;for(const c of t)edges.push([id,walk(c)]);return id}walk(tree);let total=0;
    for(let ch=0;ch<5;ch++){let best=Infinity;for(let mask=0;mask<(1<<count);mask++){const state=id=>typeof id==='string'?data[assigned[Number(id.slice(1))]].states[ch]:(mask>>id)&1;best=Math.min(best,edges.filter(([a,b])=>state(a)!==state(b)).length)}total+=best}return total;
  }
  for(const tree of trees)for(const assignment of [['A','I','G','F','E','D'],['F','E','A','D','G','I'],['A','D','I','G','E','F']])assert.equal(score(tree,assignment),brute(tree,assignment));
});
test('observations discuss support and limitations without grading placements',()=>{
  assert.match(observe('I','G'),/pointed head projections/);assert.match(observe('I','G'),/other visible features/);assert.match(observe('E','D'),/small round body spots/);assert.doesNotMatch(observe('A','F'),/incorrect|wrong|Correct\./);assert.match(observe('E','F'),/convergence, reversal/);
});
test('each placement gets context even before a sister taxon is assigned',()=>{
  const empty=['A',null,null,null,null,null];assert.match(placement(trees[0],empty,0).join(' '),/Good fit.*outgroup/);
  assert.match(placement(trees[0],[null,'I',null,null,null,null],1).join(' '),/Evidence pending/);
  assert.match(placement(trees[0],['F',null,null,null,null,null],0).join(' '),/Poor fit.*rooting/);
  assert.match(placement(trees[0],[null,'A',null,null,null,null],1).join(' '),/Rooting concern/);
});
test('specific sister hypotheses receive evidence-based strengths and tradeoffs',()=>{
  const good=placement(trees[0],['A','I','G',null,null,null],1).join(' ');
  assert.match(good,/Potential strength.*pointed head projections/);assert.match(good,/coarse coding/);
  const limited=placement(trees[0],['A','I','F',null,null,null],1).join(' ');
  assert.match(limited,/Limited support/);assert.match(limited,/Tradeoff.*pointed head projections/);
});
test('complete-tree placement feedback tests alternative swaps without asserting a true tree',()=>{
  let strength=false,tradeoff=false;
  for(const a of [['A','I','G','F','E','D'],['A','I','F','G','E','D'],['A','F','E','D','I','G']])for(let i=1;i<6;i++){
    const result=placement(trees[0],a,i).join(' ');strength ||= result.includes('Parsimony strength');tradeoff ||= result.includes('Parsimony tradeoff');
    assert.match(result,/\[1|\[2/);assert.doesNotMatch(result,/guaranteed correct|is the true tree/);
  }
  assert.ok(strength);assert.ok(tradeoff);
});
test('Caminalcule interaction is click-to-place with persistent details and research links',()=>{
  const fs=require('node:fs'),path=require('node:path');
  const js=fs.readFileSync(path.join(__dirname,'../caminalcules.js'),'utf8');
  const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
  assert.doesNotMatch(js,/addEventListener\(['"](?:dragstart|dragend|drop|dragover)/);
  assert.match(html,/id="cam-selected-detail"/);assert.match(html,/id="cam-selection-status"/);
  assert.match(html,/oyc.yale.edu/);assert.match(html,/ableweb.org/);assert.match(js,/x:340/);
});
