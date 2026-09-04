import type { UnitId } from '../types';

export interface LessonSection {
  heading: string;
  body?: string;
  bullets?: string[];
  examTip?: string;
}

export interface UnitLesson {
  unitId: UnitId;
  intro: string;
  sections: LessonSection[];
  mustKnow: string[];
  traps: string[];
}

export const unitLessons: Record<UnitId, UnitLesson> = {
  'unit-1': {
    unitId: 'unit-1',
    intro:
      'Unit 1 is a rhetorical analysis, not a book report and not “I agree with Wallace.” You explain how one peer-reviewed academic article tries to move a specific audience in a specific situation, in 1,100–1,500 words.',
    sections: [
      {
        heading: 'Rhetorical situation',
        body: 'Bitzer’s classic trio: exigence (the urgency that calls writing into being), audience (people who can be influenced and who can act), and constraints (beliefs, documents, deadlines, genre rules that shape what you can say). Carroll’s “Backpacks vs. Briefcases” is assigned so you practice seeing every text as a designed attempt, not a container of facts.',
        bullets: [
          'Exigence — why this had to be written now.',
          'Audience — who can do something with the message.',
          'Constraints — length, venue, values, prior texts.',
          'Purpose — what the writer wants the audience to think, feel, or do.',
        ],
        examTip: 'If you only summarize Wallace, you have not analyzed. Name a strategy and show a passage that does it.',
      },
      {
        heading: 'Appeals and fallacies',
        body: 'Ethos is credibility (credentials, fairness, good will). Pathos is emotion and values. Logos is the structure of reasons and evidence. A fallacy is a broken appeal — ad hominem, false dilemma, slippery slope, hasty generalization, straw man. Naming a fallacy only counts if you can show the move in the text.',
        bullets: [
          'Ethos — who is speaking, and why should we trust them?',
          'Pathos — which values or feelings are being pressed?',
          'Logos — what claim is backed by what evidence?',
        ],
      },
      {
        heading: 'Quote, paraphrase, summary',
        body: 'Summary = the whole in your words, much shorter. Paraphrase = a specific passage in your words, about the same length. Quote = the writer’s exact words in quotation marks plus a citation. Patchwriting is swapping synonyms while keeping the original sentence skeleton — it is plagiarism even if you “meant to paraphrase.”',
        examTip: 'Signal phrase + quote + citation. Never drop a quote in as its own sentence with no lead-in.',
      },
      {
        heading: 'Process that is actually graded',
        body: 'Peer-review draft due Thursday Sep 3 before class. Final + 300-word reflection due the week of Sep 7–13 by midnight. Conference and online peer review (Describe, Evaluate, Suggest) sit on the A/B contract. Missing process can tank a decent paper.',
        bullets: [
          'Draft in the dropbox before 1:30 on review day.',
          'Final: .docx AND a shared Google Doc.',
          'Reflection letter: 300 words on what changed and why.',
        ],
      },
    ],
    mustKnow: [
      'Exigence / audience / constraints',
      'Ethos, pathos, logos',
      'Fallacy = broken appeal, shown in a passage',
      'Quote vs paraphrase vs summary vs patchwriting',
      'Peer review Sep 3 before class',
      'A requires the 300-word reflection',
    ],
    traps: [
      'Summarizing Wallace instead of analyzing him.',
      'Uploading the draft after class starts.',
      'Forgetting the Google Doc share permissions.',
      'Using AI to “smooth” the essay.',
    ],
  },
  'unit-2': {
    unitId: 'unit-2',
    intro:
      'Unit 2 is how you enter a scholarly conversation: a focused question, a research proposal, then an annotated bibliography of four peer-reviewed articles from the OSU Library. You are mapping the argument, not writing the big paper yet.',
    sections: [
      {
        heading: 'A question you can actually research',
        body: '“Is social media bad?” is a TED-talk prompt, not a Comp II question. Narrow: population, venue, tension. A good question has at least two smart people already disagreeing in print.',
        bullets: [
          'Too broad — “How does climate change affect us?”',
          'Workable — “How do Oklahoma Extension publications frame drought-resistant wheat for producers vs. researchers?”',
        ],
        examTip: 'If you cannot name two sources that would disagree, the question is still a topic.',
      },
      {
        heading: 'Scholarly vs everything else',
        body: 'Scholarly: peer-reviewed journal or academic press, citations, methods, named scholars writing for other scholars. Professional: trade magazines, industry reports. Popular: newspapers, magazines, reputable journalism. Wikipedia and random blogs are starting points, not the four peer-reviewed articles.',
      },
      {
        heading: 'The annotation has three jobs',
        body: 'Each entry: (1) a correct citation, (2) a summary of the argument in your words, (3) a sentence on how you will use it. “This was interesting” is not an annotation.',
      },
      {
        heading: 'Zotero and the library',
        body: 'Zotero is required. Edmon Low databases beat Google Scholar PDFs you cannot legally keep. Interlibrary loan takes days. Start in week 5.',
      },
    ],
    mustKnow: [
      'Proposal in week 5',
      'Four peer-reviewed articles (OSU Library)',
      'Annotation = citation + summary + use',
      'Zotero is required, not extra credit',
      'They Say / I Say: name the conversation before you add your I',
    ],
    traps: [
      'Picking a topic so late that ILL cannot arrive.',
      'Eight news articles and zero journals.',
      'Annotating the abstract instead of the article.',
    ],
  },
  'unit-3': {
    unitId: 'unit-3',
    intro:
      'Unit 3 is the 1,500–2,000 word researched argument (4–5 sources) and about 30% of the course. Two full drafts, an author’s note, peer review, a conference, then a portfolio. This is the paper people start the night before — do not be those people.',
    sections: [
      {
        heading: 'Thesis that answers the question',
        body: 'A thesis is not “this paper will discuss.” It is a contestable claim that answers your Unit 2 question and can be supported with the sources you already have.',
      },
      {
        heading: 'Claim, evidence, warrant',
        body: 'Claim = what you want the reader to accept. Evidence = data, quotation, example. Warrant = why that evidence counts for that claim. Quote dumps skip the warrant.',
      },
      {
        heading: 'Counterargument is not optional',
        body: 'Steel-man the other side, then rebut. If you cannot imagine a smart objection, the thesis is probably too safe or too vague.',
      },
      {
        heading: 'Two drafts are the assignment',
        body: 'RD1 (week 10): thesis + intro, uploaded before class. RD2 (week 11): fuller draft + author’s note, uploaded before class and brought to workshop. Portfolio final week of Nov 16–22.',
        examTip: 'Author’s note = what you changed after feedback, not a plot summary of your essay.',
      },
    ],
    mustKnow: [
      '1,500–2,000 words, 4–5 sources, thesis-driven',
      'RD1 week 10, RD2 week 11, portfolio week 14',
      'Counterargument + rebuttal',
      'Conference required for A/B',
    ],
    traps: [
      'New topic in week 10 (you just threw away Unit 2).',
      'RD1 that is a title and a hook.',
      'No counterargument.',
    ],
  },
  'unit-4': {
    unitId: 'unit-4',
    intro:
      'Unit 4 remixes the Unit 3 argument for a public audience on Wix, plus a 300-word author’s note. The final exam is a short reflective essay in an exam-week dropbox — 5% of the course, still no AI.',
    sections: [
      {
        heading: 'Remix, do not paste',
        body: 'A public audience does not want your 2,000-word lit review pasted into a text widget. Shorter claims, clearer headings, images with alt text, links that work. Same argument, different medium.',
      },
      {
        heading: 'Wix is a live URL',
        body: 'Create the account in week 12. Submit the live site + a Word document. A screenshot, a PDF, or “it’s on my laptop” is not a site.',
      },
      {
        heading: 'Author’s note',
        body: '300 words: who the new audience is, what you cut or redesigned, and why. This is the same genre as the unit reflection letters.',
      },
      {
        heading: 'Final exam',
        body: 'Reflective essay. Cover sheet: Thursday Dec 10, 2:00–3:50, usual room. Dropbox opens Saturday 8:00 a.m. You may write early or in the period. Confirm the date on Canvas — the PDF disagrees with itself (Thu Dec 10 vs Wed Dec 9/10).',
      },
    ],
    mustKnow: [
      'Same topic as Unit 3',
      'Wix URL + Word doc + 300-word note',
      'Final = reflection, 5%',
      'Confirm final date on Canvas',
    ],
    traps: [
      'Building Wix the night before.',
      'Pasting the academic paper into a text widget.',
      'Using AI on the final reflection.',
    ],
  },
};

export function getLesson(unitId: UnitId): UnitLesson {
  return unitLessons[unitId];
}
