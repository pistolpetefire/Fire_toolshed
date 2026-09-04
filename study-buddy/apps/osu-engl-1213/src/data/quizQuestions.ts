import type { ExamBlockId, MCQuestion, MatchingQuestion, QuizQuestion, QuizType, UnitId } from '../types';

const mcQuestions: MCQuestion[] = [
  {
    id: 'u1-mc-1',
    type: 'multiple-choice',
    unitId: 'unit-1',
    kind: 'vocab',
    prompt: 'In Bitzer’s rhetorical situation, exigence is:',
    options: [
      'The page count of the assignment',
      'The urgency or problem that calls the writing into being',
      'The writer’s favorite appeal',
      'The list of sources on a works cited page',
    ],
    correctIndex: 1,
    explanation: 'Exigence is the situation’s “now what?” — why this text had to exist. Audience and constraints are the other two parts.',
  },
  {
    id: 'u1-mc-2',
    type: 'multiple-choice',
    unitId: 'unit-1',
    kind: 'concept',
    prompt: 'A rhetorical analysis should mainly:',
    options: [
      'Summarize the article so the teacher knows you read it',
      'Agree or disagree with the author’s thesis',
      'Explain how the text tries to move a specific audience in a specific situation',
      'List every fallacy you can name, whether or not they appear',
    ],
    correctIndex: 2,
    explanation: 'Analysis ≠ summary and ≠ “I agree.” You show how the writing works on an audience.',
  },
  {
    id: 'u1-mc-3',
    type: 'multiple-choice',
    unitId: 'unit-1',
    kind: 'vocab',
    prompt: 'Pathos is best described as:',
    options: [
      'The writer’s credentials',
      'Appeals to values, identity, and emotion',
      'Statistics and syllogisms only',
      'A citation style',
    ],
    correctIndex: 1,
    explanation: 'Pathos is not “being emotional.” It is how a text presses on what an audience already cares about.',
  },
  {
    id: 'u1-mc-4',
    type: 'multiple-choice',
    unitId: 'unit-1',
    kind: 'application',
    prompt: 'A writer quotes an opponent as saying “we should ban all cars,” when the opponent argued for congestion pricing. That is:',
    options: ['Logos', 'A straw man', 'Ethos', 'A fair paraphrase'],
    correctIndex: 1,
    explanation: 'Straw man = knocking down a weaker claim than the one actually made.',
  },
  {
    id: 'u1-mc-5',
    type: 'multiple-choice',
    unitId: 'unit-1',
    kind: 'concept',
    prompt: 'Patchwriting is:',
    options: [
      'Quoting with a signal phrase and a page number',
      'Keeping the original sentence structure and swapping synonyms',
      'Summarizing a whole article in three sentences',
      'Using Zotero to store PDFs',
    ],
    correctIndex: 1,
    explanation: 'Patchwriting is plagiarism. Close the source and write the idea in a new structure, then check.',
  },
  {
    id: 'u1-mc-6',
    type: 'multiple-choice',
    unitId: 'unit-1',
    kind: 'policy',
    prompt: 'The Unit 1 peer-review draft is due:',
    options: [
      'Friday night after you think about it',
      'Thursday, September 3, before class starts',
      'With the final in week 4',
      'Only if you want extra credit',
    ],
    correctIndex: 1,
    explanation: 'Hughes’s schedule: complete draft in the dropbox before Thursday’s class. Empty-handed review fails the contract item.',
  },
  {
    id: 'u1-mc-7',
    type: 'multiple-choice',
    unitId: 'unit-1',
    kind: 'policy',
    prompt: 'A Hughes final draft must be submitted as:',
    options: [
      'A Google Doc link only',
      'A .pages file from a Mac',
      'A Word .docx AND a shared Google Doc link',
      'An email attachment to Hughes',
    ],
    correctIndex: 2,
    explanation: 'Both files. Email does not count. Share settings have to let the instructor open the Doc.',
  },
  {
    id: 'u1-mc-8',
    type: 'multiple-choice',
    unitId: 'unit-1',
    kind: 'policy',
    prompt: 'Daily homework uploaded at 1:40 on a 1:30 class day is:',
    options: ['Late, −7% per day', 'A 0 — daily work cannot be late', 'On time if you were in your seat', 'Half credit'],
    correctIndex: 1,
    explanation: 'Homework is due BEFORE the period. After class starts, daily work is a 0. The 7%/day rule is for majors, for two weeks.',
  },
  {
    id: 'u1-mc-9',
    type: 'multiple-choice',
    unitId: 'unit-1',
    kind: 'application',
    prompt: 'Which sentence correctly introduces a quote?',
    options: [
      '“Lobsters are boiled alive.” (Wallace 56)',
      'Wallace notes that the animal “behaves very much like you or I would” in the pot (56).',
      'Wallace 56 says lobsters.',
      'As the article says, lobsters (Wallace).',
    ],
    correctIndex: 1,
    explanation: 'Signal phrase + quote + citation. A floating quotation with no lead-in is the usual first-year miss.',
  },
  {
    id: 'u1-mc-10',
    type: 'multiple-choice',
    unitId: 'unit-1',
    kind: 'policy',
    prompt: 'Which item is required for an A on a unit but not for a B?',
    options: [
      'The major assignment on time',
      'Feedback-week conference',
      'The 300-word letter of drafting reflection',
      'Online peer review',
    ],
    correctIndex: 2,
    explanation: 'A and B share paper + conference + peer review + presence. The 300-word reflection is the extra A item.',
  },
  {
    id: 'u1-mc-11',
    type: 'multiple-choice',
    unitId: 'unit-1',
    kind: 'concept',
    prompt: 'Carroll’s backpack vs briefcase metaphor is mainly about:',
    options: [
      'What to pack for a library visit',
      'Reading texts as designed attempts rather than bags of facts',
      'Why students should buy a briefcase',
      'MLA vs APA headings',
    ],
    correctIndex: 1,
    explanation: 'You are learning to read like a rhetor: who is trying to do what, to whom, with what moves.',
  },
  {
    id: 'u1-mc-12',
    type: 'multiple-choice',
    unitId: 'unit-1',
    kind: 'policy',
    prompt: 'May you use ChatGPT to write Unit 1?',
    options: [
      'Yes, if you cite it',
      'Yes, for the reflection letter only',
      'No. Generative AI is not accepted in the writing of any essay',
      'Yes, if you only use it to outline',
    ],
    correctIndex: 2,
    explanation: 'Hughes is explicit: all process work and essays are the student’s. AI on the essay is academic dishonesty.',
  },

  {
    id: 'u2-mc-1',
    type: 'multiple-choice',
    unitId: 'unit-2',
    kind: 'application',
    prompt: 'Which is the most workable Comp II research question?',
    options: [
      'Is social media bad?',
      'How has climate change affected the world?',
      'How do Oklahoma Extension publications frame drought-tolerant wheat for producers versus researchers?',
      'What is love?',
    ],
    correctIndex: 2,
    explanation: 'Narrow population + venue + tension. The first two are TED-talk topics; you cannot finish them in one unit.',
  },
  {
    id: 'u2-mc-2',
    type: 'multiple-choice',
    unitId: 'unit-2',
    kind: 'vocab',
    prompt: 'A peer-reviewed journal article is typically a:',
    options: ['Popular source', 'Scholarly source', 'Primary interview you conducted', 'Wikipedia stub'],
    correctIndex: 1,
    explanation: 'Peer review + methods + citations + scholars writing for scholars = scholarly.',
  },
  {
    id: 'u2-mc-3',
    type: 'multiple-choice',
    unitId: 'unit-2',
    kind: 'concept',
    prompt: 'An annotated bibliography entry should include:',
    options: [
      'Citation only',
      'Citation, a two-word reaction (“very good”), and a URL',
      'Citation, a summary of the argument, and how you will use it',
      'The abstract copied from the database',
    ],
    correctIndex: 2,
    explanation: 'Three jobs: cite, summarize in your words, and position the source in your project.',
  },
  {
    id: 'u2-mc-4',
    type: 'multiple-choice',
    unitId: 'unit-2',
    kind: 'policy',
    prompt: 'Unit 2 asks for about how many sources?',
    options: ['3 total, any kind', 'Four peer-reviewed articles', '20 websites', 'Whatever Zotero auto-imports'],
    correctIndex: 1,
    explanation: 'Unit 2: annotated bibliography of four peer-reviewed articles via the OSU Library. News-only bibliographies fail the unit.',
  },
  {
    id: 'u2-mc-5',
    type: 'multiple-choice',
    unitId: 'unit-2',
    kind: 'policy',
    prompt: 'Hughes requires which research tool?',
    options: ['EasyBib paid', 'Zotero', 'ChatGPT browsing', 'A paper notecard box'],
    correctIndex: 1,
    explanation: 'Zotero is on the required-materials list. Install it in week 1, not the night the bib is due.',
  },
  {
    id: 'u2-mc-6',
    type: 'multiple-choice',
    unitId: 'unit-2',
    kind: 'concept',
    prompt: '“They Say / I Say” in this unit means:',
    options: [
      'You only quote famous people',
      'You map the existing conversation before adding your claim',
      'You write in first person about your feelings',
      'You avoid citing anyone',
    ],
    correctIndex: 1,
    explanation: 'Enter the conversation: name agreements, disagreements, and a gap. Then your I Say has somewhere to stand.',
  },
  {
    id: 'u2-mc-7',
    type: 'multiple-choice',
    unitId: 'unit-2',
    kind: 'application',
    prompt: 'You need an article Edmon Low does not have as a PDF. Best next step?',
    options: [
      'Skip it and cite the abstract',
      'Ask ChatGPT to reconstruct it',
      'Place an interlibrary loan request immediately — it can take days',
      'Cite it anyway; nobody checks',
    ],
    correctIndex: 2,
    explanation: 'ILL is normal and slow. That is why Unit 2 starts in week 5, not the night of week 7.',
  },
  {
    id: 'u2-mc-8',
    type: 'multiple-choice',
    unitId: 'unit-2',
    kind: 'policy',
    prompt: 'The week-5 research proposal is mainly so that:',
    options: [
      'Hughes can approve a question before you waste a month',
      'You skip the annotated bib',
      'You satisfy the final exam',
      'You practice Wix',
    ],
    correctIndex: 0,
    explanation: 'Proposal first, then sources. A late or missing proposal makes Units 2 and 3 both slip.',
  },
  {
    id: 'u2-mc-9',
    type: 'multiple-choice',
    unitId: 'unit-2',
    kind: 'vocab',
    prompt: 'A trade magazine for fire-protection engineers is usually:',
    options: ['Scholarly', 'Professional / trade', 'A primary experiment', 'An annotated bibliography'],
    correctIndex: 1,
    explanation: 'Useful, but it is not a substitute for peer-reviewed research when the assignment requires scholarly sources.',
  },
  {
    id: 'u2-mc-10',
    type: 'multiple-choice',
    unitId: 'unit-2',
    kind: 'application',
    prompt: 'Copying the database abstract into your annotation is:',
    options: ['Fine if you change two words', 'A summary', 'Patchwriting / plagiarism of the abstract', 'What Zotero is for'],
    correctIndex: 2,
    explanation: 'Read the article. Write the argument in your own structure. Abstracts are already someone else’s sentences.',
  },
  {
    id: 'u2-mc-11',
    type: 'multiple-choice',
    unitId: 'unit-2',
    kind: 'concept',
    prompt: 'If you cannot name two sources that would disagree, your “question” is probably still a:',
    options: ['Thesis', 'Topic', 'Warrant', 'Multimodal remix'],
    correctIndex: 1,
    explanation: 'A topic is a subject area. A question has a live disagreement you can enter.',
  },
  {
    id: 'u2-mc-12',
    type: 'multiple-choice',
    unitId: 'unit-2',
    kind: 'policy',
    prompt: 'May you recycle last year’s Comp I research paper for Unit 2?',
    options: ['Yes, it is your work', 'Yes, if you rewrite the intro', 'No — that is self-plagiarism', 'Only if you got an A'],
    correctIndex: 2,
    explanation: 'New question, new research. Re-submitting old work without permission is academic dishonesty.',
  },

  {
    id: 'u3-mc-1',
    type: 'multiple-choice',
    unitId: 'unit-3',
    kind: 'concept',
    prompt: 'Which is a thesis, not a topic sentence in disguise?',
    options: [
      'This paper will discuss drought.',
      'Drought is an important issue in Oklahoma.',
      'Oklahoma wheat producers should treat Extension drought bulletins as advocacy documents, not as neutral science, because their trial designs omit rangeland operations.',
      'There are many views on drought.',
    ],
    correctIndex: 2,
    explanation: 'A thesis is contestable, specific, and answerable with evidence. The others announce a subject.',
  },
  {
    id: 'u3-mc-2',
    type: 'multiple-choice',
    unitId: 'unit-3',
    kind: 'vocab',
    prompt: 'A warrant is:',
    options: [
      'The arrest document for plagiarists',
      'The reason your evidence actually supports your claim',
      'A block quote',
      'The page count',
    ],
    correctIndex: 1,
    explanation: 'Claim + evidence is not enough. You have to show why that evidence counts.',
  },
  {
    id: 'u3-mc-3',
    type: 'multiple-choice',
    unitId: 'unit-3',
    kind: 'concept',
    prompt: 'A good counterargument section should:',
    options: [
      'Insult people who disagree',
      'Steel-man the smartest objection, then rebut it',
      'Be one sentence: “Some people disagree.”',
      'Go in the works cited only',
    ],
    correctIndex: 1,
    explanation: 'If you cannot imagine a smart objection, the thesis is too safe or too vague.',
  },
  {
    id: 'u3-mc-4',
    type: 'multiple-choice',
    unitId: 'unit-3',
    kind: 'policy',
    prompt: 'Unit 3 Rough Draft 1 is supposed to be:',
    options: [
      'A title and a hook, emailed to Hughes',
      'Thesis + introduction, uploaded to Canvas before class in week 10',
      'The entire 2,000 words, no sources',
      'The Wix site',
    ],
    correctIndex: 1,
    explanation: 'Schedule: RD1 working thesis and intro, Canvas, prior to class, week 10.',
  },
  {
    id: 'u3-mc-5',
    type: 'multiple-choice',
    unitId: 'unit-3',
    kind: 'policy',
    prompt: 'Week 11 asks you to bring RD2 to class because:',
    options: [
      'Hughes wants to print it for you',
      'In-class peer review — laptop/device required',
      'The Writing Center is in the classroom',
      'It is the final exam',
    ],
    correctIndex: 1,
    explanation: 'Upload before class AND bring it. Author’s note travels with RD2.',
  },
  {
    id: 'u3-mc-6',
    type: 'multiple-choice',
    unitId: 'unit-3',
    kind: 'policy',
    prompt: 'About how much of the course grade is Unit 3 on the cover sheet?',
    options: ['5%', '20%', '30%', '50%'],
    correctIndex: 2,
    explanation: 'Cover: 20 / 25 / 30 / 20 / 5. A later table lists 25% for Unit 3 (math fails). Treat it as the heavy paper.',
  },
  {
    id: 'u3-mc-7',
    type: 'multiple-choice',
    unitId: 'unit-3',
    kind: 'application',
    prompt: 'Starting a brand-new topic in week 10 is a bad idea because:',
    options: [
      'Zotero will delete your account',
      'You throw away the Unit 2 conversation you already built',
      'MLA forbids new ideas after Halloween',
      'Wix cannot remix a new topic',
    ],
    correctIndex: 1,
    explanation: 'Units 2–4 are one research arc. A new topic in week 10 is a new class.',
  },
  {
    id: 'u3-mc-8',
    type: 'multiple-choice',
    unitId: 'unit-3',
    kind: 'policy',
    prompt: 'Late Unit 3 final, 3 days late, still inside two weeks. Penalty:',
    options: ['0% — forgiveness automatic', '7% × 3 = 21% off that assignment', 'Letter grade of F for the course', 'Only a warning'],
    correctIndex: 1,
    explanation: '7% per calendar day including weekends, for two weeks. After two weeks the dropbox closes.',
  },
  {
    id: 'u3-mc-9',
    type: 'multiple-choice',
    unitId: 'unit-3',
    kind: 'concept',
    prompt: 'An author’s note should explain:',
    options: [
      'The plot of your essay',
      'What you changed after feedback and why',
      'Your life story',
      'Why you hate peer review',
    ],
    correctIndex: 1,
    explanation: 'Process writing. Same family as the 300-word drafting reflection.',
  },
  {
    id: 'u3-mc-10',
    type: 'multiple-choice',
    unitId: 'unit-3',
    kind: 'policy',
    prompt: 'Missing the feedback-week conference usually means:',
    options: [
      'Nothing; it is optional',
      'You cannot hit the written A or B contract for that unit',
      'You get extra credit',
      'Hughes emails you a recording',
    ],
    correctIndex: 1,
    explanation: 'A and B lists both include “met with your instructor during Feedback Week.”',
  },
  {
    id: 'u3-mc-11',
    type: 'multiple-choice',
    unitId: 'unit-3',
    kind: 'application',
    prompt: 'A page of block quotes with one sentence of yours is a problem because:',
    options: [
      'MLA bans block quotes',
      'The warrant and your argument went missing — it is a quote dump',
      'Zotero cannot format block quotes',
      'Unit 3 forbids quotations',
    ],
    correctIndex: 1,
    explanation: 'Sources support your claim. They do not replace it.',
  },
  {
    id: 'u3-mc-12',
    type: 'multiple-choice',
    unitId: 'unit-3',
    kind: 'policy',
    prompt: 'Peer-review comments should follow which moves?',
    options: [
      'Like, subscribe, share',
      'Describe, Evaluate, Suggest',
      'Grade, roast, ghost',
      'Only “looks good”',
    ],
    correctIndex: 1,
    explanation: 'Hughes’s formula. Drive-by praise can fail the contract item.',
  },

  {
    id: 'u4-mc-1',
    type: 'multiple-choice',
    unitId: 'unit-4',
    kind: 'concept',
    prompt: 'Unit 4 asks you to:',
    options: [
      'Write a second 2,000-word paper on a new topic',
      'Remix the Unit 3 argument for a public audience on Wix',
      'Sit a multiple-choice grammar test',
      'Translate Unit 1 into Latin',
    ],
    correctIndex: 1,
    explanation: 'Same research, new medium and audience. Paste-the-PDF is not a remix.',
  },
  {
    id: 'u4-mc-2',
    type: 'multiple-choice',
    unitId: 'unit-4',
    kind: 'policy',
    prompt: 'Unit 4 submission includes:',
    options: [
      'A screenshot of Wix',
      'A live Wix URL, a Word doc, and a 300-word author’s note',
      'Only the Word doc',
      'A Canva story posted to Instagram',
    ],
    correctIndex: 1,
    explanation: 'Live site + Word + note. A screenshot is not a website.',
  },
  {
    id: 'u4-mc-3',
    type: 'multiple-choice',
    unitId: 'unit-4',
    kind: 'policy',
    prompt: 'The Comp II final exam is:',
    options: [
      'A 200-question grammar scantron',
      'A reflective essay in the exam-week dropbox (5%)',
      'An oral defense in Morrill 201b',
      'Optional if you have an A',
    ],
    correctIndex: 1,
    explanation: 'Reflection, 5%. Cover sheet: Thu Dec 10 2:00–3:50. Confirm — the PDF also says Wed Dec 9/10.',
  },
  {
    id: 'u4-mc-4',
    type: 'multiple-choice',
    unitId: 'unit-4',
    kind: 'policy',
    prompt: 'You may submit the final reflection:',
    options: [
      'Only in handwriting during the period',
      'Starting Saturday 8am in the dropbox, or during the exam period',
      'Anytime in January',
      'Via Canvas message to Hughes',
    ],
    correctIndex: 1,
    explanation: 'Dropbox opens Saturday 8:00 a.m. and stays open through the exam period. Hughes hosts the period in the usual room.',
  },
  {
    id: 'u4-mc-5',
    type: 'multiple-choice',
    unitId: 'unit-4',
    kind: 'policy',
    prompt: 'Fourth unexcused absence in this T/H class:',
    options: [
      'A warning email',
      '10% off the final course grade',
      'Nothing; you have five freebies',
      'Automatic F',
    ],
    correctIndex: 1,
    explanation: '3 free. 4th = 10% of the COURSE. 6th = 20%. 8th = fail. Illness is not excused — use a Forgiveness Day.',
  },
  {
    id: 'u4-mc-6',
    type: 'multiple-choice',
    unitId: 'unit-4',
    kind: 'policy',
    prompt: 'Three unexcused tardies equal:',
    options: ['Nothing', 'One unexcused absence', 'A Forgiveness Day', 'Extra credit'],
    correctIndex: 1,
    explanation: 'Roll is at the start of class. Walk in late three times and you have spent one of your three absences.',
  },
  {
    id: 'u4-mc-7',
    type: 'multiple-choice',
    unitId: 'unit-4',
    kind: 'policy',
    prompt: 'To use a Forgiveness Day you must:',
    options: [
      'Do nothing; Hughes tracks them automatically',
      'Email Hughes, invoke the day, then complete the missed work',
      'Bring a doctor’s note next August',
      'Post in the peer-review forum',
    ],
    correctIndex: 1,
    explanation: 'You have two. They do not auto-apply. Greek life is not an excused absence.',
  },
  {
    id: 'u4-mc-8',
    type: 'multiple-choice',
    unitId: 'unit-4',
    kind: 'policy',
    prompt: 'How should you contact Hughes about the class?',
    options: [
      'Only a handwritten note',
      'Canvas message (hits email and Canvas)',
      'Instagram DM',
      'The department Facebook page',
    ],
    correctIndex: 1,
    explanation: 'Syllabus: Canvas messages. Do not submit assignments that way.',
  },
  {
    id: 'u4-mc-9',
    type: 'multiple-choice',
    unitId: 'unit-4',
    kind: 'application',
    prompt: 'A Wix page that is a single 8,000-word paste of Unit 3 is weak because:',
    options: [
      'Wix has a word limit of 500',
      'You did not remix for a public audience (headings, images, shorter claims)',
      'MLA forbids websites',
      'Hughes only accepts PowerPoint',
    ],
    correctIndex: 1,
    explanation: 'Multimodal = new design for a new audience, not a new URL on the same wall of text.',
  },
  {
    id: 'u4-mc-10',
    type: 'multiple-choice',
    unitId: 'unit-4',
    kind: 'policy',
    prompt: 'The Writing Center will:',
    options: [
      'Guarantee you an A if you go twice',
      'Proofread the whole paper while you wait',
      'Help you revise if you bring the assignment sheet, draft, and a specific question',
      'Submit the paper to Canvas for you',
    ],
    correctIndex: 2,
    explanation: 'Book ahead. They teach you to edit; they do not edit for you.',
  },
  {
    id: 'u4-mc-11',
    type: 'multiple-choice',
    unitId: 'unit-4',
    kind: 'policy',
    prompt: 'Office hours are in Morrill 201b at:',
    options: [
      'Monday 8am only',
      'Tue 3–4, Wed 9–11, Thu 3–4, in person and on Zoom',
      'By Calendly, 15 minutes, once a semester',
      'Never — message only',
    ],
    correctIndex: 1,
    explanation: 'Four hours across three days. Zoom runs at the same time. Feedback-week conferences are still a separate signup.',
  },
  {
    id: 'u4-mc-12',
    type: 'multiple-choice',
    unitId: 'unit-4',
    kind: 'policy',
    prompt: 'If Canvas shows a 0 the morning after you submitted a late paper:',
    options: [
      'The file vanished; resend via email',
      'Normal — late work is a 0 until it is graded',
      'You failed the course',
      'The 7% per day does not apply',
    ],
    correctIndex: 1,
    explanation: 'Hughes warns that late work sits at 0 until grading. Do not panic-email; do not miss the 2-week window.',
  },
];

const matchingQuestions: MatchingQuestion[] = [
  {
    id: 'match-1-situation',
    type: 'matching',
    unitId: 'unit-1',
    prompt: 'Match the term to its job in a rhetorical analysis.',
    pairs: [
      { left: 'Exigence', right: 'The urgency that calls the text into being' },
      { left: 'Audience', right: 'People who can be influenced and can act' },
      { left: 'Constraint', right: 'Genre, values, deadlines that shape the text' },
      { left: 'Ethos', right: 'Credibility and perceived character' },
      { left: 'Logos', right: 'Reasons and evidence' },
    ],
    explanation: 'Situation first (exigence, audience, constraints), then appeals (ethos/pathos/logos).',
  },
  {
    id: 'match-1-cite',
    type: 'matching',
    unitId: 'unit-1',
    prompt: 'Match the move to the definition.',
    pairs: [
      { left: 'Quote', right: 'Exact words + quotation marks + citation' },
      { left: 'Paraphrase', right: 'A passage in new words, similar length' },
      { left: 'Summary', right: 'The whole argument, much shorter, your words' },
      { left: 'Patchwriting', right: 'Synonym swap on the original skeleton' },
      { left: 'Signal phrase', right: 'Lead-in that names the source before the quote' },
    ],
    explanation: 'If you keep the original syntax, you have not paraphrased.',
  },
  {
    id: 'match-2-sources',
    type: 'matching',
    unitId: 'unit-2',
    prompt: 'Match the source type.',
    pairs: [
      { left: 'Peer-reviewed journal', right: 'Scholarly' },
      { left: 'Fire Engineering magazine', right: 'Professional / trade' },
      { left: 'New York Times feature', right: 'Popular / journalistic' },
      { left: 'Your interview with a source', right: 'Primary (you created it)' },
      { left: 'Wikipedia', right: 'Starting point, not a Unit 2 source' },
    ],
    explanation: 'Unit 2 requires four peer-reviewed articles. Trade and news can supplement later units, not replace the four.',
  },
  {
    id: 'match-3-process',
    type: 'matching',
    unitId: 'unit-3',
    prompt: 'Match the Unit 3 artifact to when it shows up.',
    pairs: [
      { left: 'RD1 thesis + intro', right: 'Week 10, before class' },
      { left: 'RD2 + author’s note', right: 'Week 11, before class + bring to workshop' },
      { left: 'Portfolio final', right: 'Week 14 (Nov 16–22)' },
      { left: 'Feedback conference', right: 'Required for A and B' },
      { left: '300-word reflection', right: 'A-contract extra with the final' },
    ],
    explanation: 'Process is the grade as much as the pages.',
  },
  {
    id: 'match-4-policy',
    type: 'matching',
    unitId: 'unit-4',
    prompt: 'Match the rule.',
    pairs: [
      { left: '4th absence', right: '10% off the course' },
      { left: '8th absence', right: 'Automatic failure' },
      { left: '3 tardies', right: '1 absence' },
      { left: 'Late major, per day', right: '−7% for up to 2 weeks' },
      { left: 'Daily homework after 1:30', right: '0 — no late daily work' },
    ],
    explanation: 'These are the expensive traps. Forgiveness Days must be invoked in writing.',
  },
];

export const quizQuestions: QuizQuestion[] = [...mcQuestions, ...matchingQuestions];

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function shuffleMc(q: MCQuestion): MCQuestion {
  const pairs = q.options.map((opt, i) => ({ opt, correct: i === q.correctIndex }));
  const shuffled = shuffle(pairs);
  return {
    ...q,
    options: shuffled.map((p) => p.opt),
    correctIndex: shuffled.findIndex((p) => p.correct),
  };
}

export function shuffleQuizItem(q: QuizQuestion): QuizQuestion {
  return q.type === 'multiple-choice' ? shuffleMc(q) : q;
}

export function getQuestionsByType(type: QuizType): QuizQuestion[] {
  return quizQuestions.filter((q) => q.type === type);
}

export function getMcForUnit(unitId: UnitId): MCQuestion[] {
  return mcQuestions.filter((q) => q.unitId === unitId);
}

export function getQuestionsForUnit(unitId: UnitId): MCQuestion[] {
  return getMcForUnit(unitId);
}

export function buildUnitQuizDeck(unitId: UnitId, n = 12): MCQuestion[] {
  const bank = getMcForUnit(unitId);
  return shuffle(bank).slice(0, Math.min(n, bank.length)).map(shuffleMc);
}

export function getMatchingForUnit(unitId: UnitId): MatchingQuestion[] {
  return matchingQuestions.filter((q) => q.unitId === unitId);
}

export function getExamPracticeDeck(blockId: ExamBlockId): QuizQuestion[] {
  const unit = courseUnitForBlock(blockId);
  const mc = shuffle(mcQuestions.filter((q) => q.unitId === unit));
  const matching = shuffle(matchingQuestions.filter((q) => q.unitId === unit));
  const pool = shuffle([...mc, ...matching]);
  return pool.slice(0, Math.min(20, pool.length)).map(shuffleQuizItem);
}

function courseUnitForBlock(blockId: ExamBlockId): UnitId {
  if (blockId === 1) return 'unit-1';
  if (blockId === 2) return 'unit-2';
  if (blockId === 3) return 'unit-3';
  return 'unit-4';
}

export function examBlockLabel(blockId: ExamBlockId): string {
  if (blockId === 1) return 'Unit 1 practice — rhetorical analysis';
  if (blockId === 2) return 'Unit 2 practice — academic conversation';
  if (blockId === 3) return 'Unit 3 practice — scholarly argument';
  return 'Unit 4 + policy practice — multimodal & the rules';
}
