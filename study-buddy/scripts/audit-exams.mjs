import { build } from 'esbuild';
const result = await build({stdin:{contents:`
export * from './apps/occc-bio-ap/src/data/courseUnits';
export * from './apps/occc-bio-ap/src/data/unitQuestions';
export * from './apps/occc-bio-ap/src/data/flashcardUnits';
export * from './apps/occc-bio-ap/src/data/examPractice';
export * from './apps/occc-bio-ap/src/data/exam1StudyGuide';
export * from './apps/occc-bio-ap/src/data/exam2StudyGuide';
export * from './apps/occc-bio-ap/src/data/exam3StudyGuide';
export * from './apps/occc-bio-ap/src/data/exam4StudyGuide';
export * from './apps/occc-bio-ap/src/data/quizQuestions';
`,resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'esm'});
const d=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
const unique=a=>[...new Map(a.map(x=>[x.id,x])).values()];
for(const b of d.EXAM_BLOCKS){
 const units=d.getUnitsForExam(b.id), qs=unique(units.flatMap(u=>d.getQuestionsForUnit(u.id))), cards=unique(units.flatMap(u=>d.getFlashcardsForUnit(u.id))), diagrams=unique(units.flatMap(u=>d.getDiagramQuestionsForUnit(u.id)));
 const hub=d.quizQuestions.filter(q=>q.type==='multiple-choice'&&units.some(u=>u.systemIds.includes(q.systemId)));
 const matching=b.id===1?d.exam1MatchingQuestions:b.id===2?d.exam2MatchingQuestions:[];
 const all=unique([...qs,...hub,...diagrams,...matching]);
 const runs=Array.from({length:50},()=>d.getExamPracticeDeck(b.id));
 console.log(JSON.stringify({exam:b.id,unitQuestions:qs.length,hubQuestions:hub.length,diagramQuestions:diagrams.length,matchingQuestions:matching.length,totalAvailable:all.length,flashcards:cards.length,unitQuizSizes:units.map(u=>d.buildUnitQuizDeck(u.id).length),examSize:[Math.min(...runs.map(x=>x.length)),Math.max(...runs.map(x=>x.length))],guide:[d.EXAM1_GUIDE_ITEMS.length,d.EXAM2_GUIDE_ITEMS.length,d.UNIT_THREE_STUDY_GUIDE.length,d.EXAM4_STUDY_GUIDE.length,0][b.id-1],newCardsByUnit:units.map(u=>d.getFlashcardsForUnit(u.id).filter(c=>c.id.startsWith('e4-')).length)}));
}
