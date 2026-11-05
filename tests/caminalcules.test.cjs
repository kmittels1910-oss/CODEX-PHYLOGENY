const {test}=require('node:test');
const assert=require('node:assert/strict');
const {data,trees,score,observe}=require('../caminalcules.js');
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
