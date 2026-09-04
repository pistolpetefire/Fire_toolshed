import type { Flashcard, UnitId } from '../types';

export const builtInFlashcards: Flashcard[] = [
  { id: 'f1-1', unitId: 'unit-1', tags: ['situation'], front: 'What is exigence?', back: 'The urgency or problem that calls a piece of writing into being — why it had to be written now.' },
  { id: 'f1-2', unitId: 'unit-1', tags: ['situation'], front: 'Name Bitzer’s three parts of a rhetorical situation.', back: 'Exigence, audience, constraints.' },
  { id: 'f1-3', unitId: 'unit-1', tags: ['appeals'], front: 'Ethos vs pathos vs logos', back: 'Ethos = credibility / character. Pathos = values and emotion. Logos = reasons and evidence.' },
  { id: 'f1-4', unitId: 'unit-1', tags: ['fallacy'], front: 'What is a straw man?', back: 'Misrepresenting an opponent’s claim as weaker than it is, then knocking that version down.' },
  { id: 'f1-5', unitId: 'unit-1', tags: ['cite'], front: 'Quote vs paraphrase vs summary', back: 'Quote = exact words + marks + citation. Paraphrase = a passage in your words, similar length. Summary = the whole, much shorter, your words.' },
  { id: 'f1-6', unitId: 'unit-1', tags: ['cite'], front: 'What is patchwriting?', back: 'Keeping the original sentence skeleton and swapping synonyms. It is plagiarism, even if you “meant to paraphrase.”' },
  { id: 'f1-7', unitId: 'unit-1', tags: ['process'], front: 'When is the Unit 1 peer-review draft due?', back: 'Thursday, September 3, 2026, BEFORE class (1:30). Complete draft in the dropbox.' },
  { id: 'f1-8', unitId: 'unit-1', tags: ['process'], front: 'What two files go in a Hughes final-draft dropbox?', back: 'A Word .docx AND a shared Google Doc link. Both.' },
  { id: 'f1-9', unitId: 'unit-1', tags: ['contract'], front: 'What extra document turns a B into an A?', back: 'The 300-word letter of drafting reflection, turned in with the final. Conference, peer review, and full-unit presence are required for both A and B.' },
  { id: 'f1-10', unitId: 'unit-1', tags: ['carroll'], front: 'Why is Carroll’s “Backpacks vs. Briefcases” on the syllabus?', back: 'To train you to read every text as a designed attempt aimed at an audience — not a backpack of facts.' },

  { id: 'f2-1', unitId: 'unit-2', tags: ['question'], front: 'What makes a Comp II research question “workable”?', back: 'It is narrow enough to answer in this semester and already has scholars disagreeing. Not “is social media bad?”' },
  { id: 'f2-2', unitId: 'unit-2', tags: ['sources'], front: 'Scholarly vs popular source', back: 'Scholarly: peer-reviewed, methods, citations, experts writing for experts. Popular: journalism or magazines for a general audience.' },
  { id: 'f2-3', unitId: 'unit-2', tags: ['annbib'], front: 'Three parts of an annotation', back: 'Citation + summary of the argument in your words + how you will use it.' },
  { id: 'f2-4', unitId: 'unit-2', tags: ['count'], front: 'Unit 2 source count', back: 'Four peer-reviewed articles, found through the OSU Library, plus a research proposal.' },
  { id: 'f2-5', unitId: 'unit-2', tags: ['tool'], front: 'Which citation manager does Hughes require?', back: 'Zotero (free). Install the desktop app and the browser connector.' },
  { id: 'f2-6', unitId: 'unit-2', tags: ['process'], front: 'What is due in week 5?', back: 'Research proposal (and first-source work). Confirm the weekday on Canvas.' },
  { id: 'f2-7', unitId: 'unit-2', tags: ['conversation'], front: 'What does “entering a conversation” mean?', back: 'You can name what others have claimed, where they agree/disagree, and the gap your project will occupy. They Say before I Say.' },
  { id: 'f2-8', unitId: 'unit-2', tags: ['library'], front: 'Why not only Google?', back: 'Library databases and subject librarians get you to the scholarly conversation. ILL takes days — start early.' },

  { id: 'f3-1', unitId: 'unit-3', tags: ['thesis'], front: 'A thesis in Unit 3 must do what?', back: 'Make a contestable claim that answers your research question. “This paper will discuss” is not a thesis.' },
  { id: 'f3-2', unitId: 'unit-3', tags: ['structure'], front: 'Claim, evidence, warrant', back: 'Claim = what you want believed. Evidence = the support. Warrant = why that evidence counts for that claim.' },
  { id: 'f3-3', unitId: 'unit-3', tags: ['counter'], front: 'Why include a counterargument?', back: 'To show you understand the smartest objection, then rebut it. Ignoring it makes the argument look naive.' },
  { id: 'f3-4', unitId: 'unit-3', tags: ['process'], front: 'Unit 3 draft sequence', back: 'RD1 (week 10, before class) → RD2 + author’s note + peer review (week 11) → portfolio final (week 14, Nov 16–22).' },
  { id: 'f3-5', unitId: 'unit-3', tags: ['note'], front: 'What belongs in an author’s note?', back: 'What you changed after feedback and why — not a plot summary of the essay.' },
  { id: 'f3-6', unitId: 'unit-3', tags: ['weight'], front: 'About what percent is Unit 3?', back: 'Cover page says 30% (the heavy paper). A later table says 25%. Confirm on Canvas; treat it as the biggest unit either way.' },
  { id: 'f3-7', unitId: 'unit-3', tags: ['length'], front: 'Unit 3 length and sources', back: '1,500–2,000 words, 4–5 sources. Not a wall of block quotes.' },

  { id: 'f4-1', unitId: 'unit-4', tags: ['remix'], front: 'What is a remix in Unit 4?', back: 'Same argument as Unit 3, redesigned for a public audience on Wix. Not a paste of the academic paper.' },
  { id: 'f4-2', unitId: 'unit-4', tags: ['submit'], front: 'What do you turn in for Unit 4?', back: 'A live Wix URL + a Word document + a 300-word author’s note.' },
  { id: 'f4-3', unitId: 'unit-4', tags: ['final'], front: 'What is the Comp II final exam?', back: 'A reflective essay in the exam-week Canvas dropbox (5%). Cover sheet: Thu Dec 10, 2:00–3:50. Confirm on Canvas.' },
  { id: 'f4-4', unitId: 'unit-4', tags: ['ai'], front: 'May you use ChatGPT on the final reflection?', back: 'No. Hughes: generative AI is not accepted in the writing of any essay, including process work.' },
  { id: 'f4-5', unitId: 'unit-4', tags: ['attend'], front: '4th unexcused absence does what?', back: '10% reduction of the final course grade. 6th = 20%. 8th = automatic failure.' },
  { id: 'f4-6', unitId: 'unit-4', tags: ['late'], front: 'Late major-assignment penalty', back: '7% per calendar day (weekends included) for two weeks, then the dropbox closes and it is a 0.' },
  { id: 'f4-7', unitId: 'unit-4', tags: ['hw'], front: 'Can daily homework be turned in late?', back: 'No. After the class period starts it is a 0.' },
];

export function unitFlashcardCount(unitId: UnitId): number {
  return builtInFlashcards.filter((c) => c.unitId === unitId).length;
}
