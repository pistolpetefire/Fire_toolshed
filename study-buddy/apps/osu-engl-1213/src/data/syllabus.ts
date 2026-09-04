/**
 * Official Fall 2026 ENGL 1213 in-person syllabus (Hughes).
 * Source: "f26 ENGL 1213 Syllabus - In Person.pdf"
 * Canvas / instructor wins if anything conflicts.
 */

export const COURSE = {
  code: 'ENGL 1213',
  title: 'Composition II: Research, Analysis, and Argument',
  term: 'Fall 2026',
  format: 'In-person · T/H 1:30–2:45 PM',
  room: 'Classroom Building rm 208',
  crn: '',
  school: 'Oklahoma State University',
  department: 'English · First-Year Composition',
  description:
    'Inquiry-based research writing. Read and analyze academic arguments, enter a scholarly conversation, produce a researched argument, and remix it as a multimodal Wix site. Process (peer review, conferences, reflection) is as graded as the final draft.',
};

export const INSTRUCTOR = {
  name: 'Dr. Alex K. Hughes',
  emailNote: 'Message through Canvas — not campus email',
  office: 'Morrill Hall 201b',
  hours: 'Tue 3:00–4:00 · Wed 9:00–11:00 · Thu 3:00–4:00 (in person + Zoom)',
  zoom: 'https://canvas.okstate.edu/',
  zoomNote: 'Zoom link is in Canvas → Important Information. Do not guess a personal Zoom URL.',
};

export const MATERIALS = {
  required: [
    'OpenStax Writing Guide with Handbook (OER, free PDF)',
    'Critical Research, Inquiry, and Communication: Writing Your Way into the Disciplines (OSU FYC OER, free PDF)',
    'Reliable computer + internet (computer labs if needed)',
    'Google Drive account (OSU O-Key Google)',
    'Zotero (free citation manager) — required',
    'Wix.com account — Unit 4 only',
  ],
  oerHint:
    'OSU Comp I/II are commercial-textbook-free. Do not buy a $100 handbook unless Canvas says a print copy is optional.',
};

export const GRADE_ROWS = [
  { item: 'Unit 1 — Rhetorical analysis', detail: '1,100–1,500 words on one peer-reviewed article', pct: '20%' },
  { item: 'Unit 2 — Academic conversation', detail: 'Proposal + annotated bib of four peer-reviewed articles', pct: '25%' },
  { item: 'Unit 3 — Scholarly argument', detail: '1,500–2,000 words · 4–5 sources', pct: '30%' },
  { item: 'Unit 4 — Multimodal remix', detail: 'Wix site + Word doc of the Unit 3 argument (4–5 sources)', pct: '20%' },
  { item: 'Final exam', detail: 'Reflective essay · exam week dropbox', pct: '5%' },
];

export const UNIT3_WEIGHT_NOTE =
  'Cover page lists Unit 3 as 30% (adds to 100%). A later table lists 25% (adds to 95%). This hub uses 30%. Confirm on Canvas.';

export const LETTER_CONTRACT = {
  A: [
    'Major assignment on time and meets all basic requirements',
    '300-word letter of drafting reflection turned in with the final',
    'Met with Hughes during Feedback Week',
    'Online peer review: Describe, Evaluate, Suggest (quality, not a drive-by)',
    'Marked present all weeks of that unit',
  ],
  B: [
    'Major assignment on time and meets all basic requirements',
    'Met with Hughes during Feedback Week',
    'Online peer review: Describe, Evaluate, Suggest',
    'Marked present all weeks of that unit',
    'Missing the 300-word reflection is the usual A→B drop',
  ],
};

export const ATTENDANCE = {
  allowed: 3,
  fourth: '4th absence → 10% reduction of final grade',
  sixth: '6th absence → additional 10% (20% total)',
  eighth: '8th absence → automatic course failure',
  tardy: '3 unexcused tardies = 1 unexcused absence. Roll is at the start of class.',
  illness:
    'Illness, doctor appointments, and emergencies are NOT excused. Use a Forgiveness Day (you have two).',
  forgiveness: 2,
  forgivenessNote:
    'Email Hughes and invoke one of two Forgiveness Days. Then complete the missed work. Full credit for the work and the attendance once it is done. Greek life is not an excused absence. Athletes still turn work in on time.',
};

export const LATE_POLICY = {
  summary: '7% off per calendar day, including weekends, for 2 weeks. After 2 weeks the dropbox closes and the grade is 0.',
  canvas: 'Late work is a 0 in Canvas until it is graded. Do not panic-email the zero.',
  homework: 'Daily homework is due BEFORE the class period starts. After class starts it is a 0 — no late homework.',
};

export const AI_POLICY =
  'Generative AI is not accepted in the writing of any essay. All process work (brainstorming, drafts, revision) must be completed by the student. Using AI on an essay is academic dishonesty.';

export const SUBMISSION = {
  essays: 'Final drafts: Word .docx AND a shared Google Doc link. Both. A Google-only link or a .pages file will get bounced.',
  unit4: 'Unit 4: Word document + Wix site (and author’s note).',
  where: 'Canvas dropboxes only. Email attachments do not count as submitted.',
};

export const DISCLAIMER =
  'This Study Buddy is for personal prep. It is not affiliated with or endorsed by Oklahoma State University or Dr. Hughes as an official assessment. Practice items are original — not your Canvas quizzes or dropbox prompts. Course documents and Canvas are the authority. Do not use this app to generate submitted writing.';

export const STUDY_METHOD = [
  'Read the unit tutorial (10–15 min).',
  'Run the flashcards on terms you will need in peer review and the reflection letter.',
  'Do untimed practice until the explanations feel obvious.',
  'Take the scored unit quiz (70% is mastery).',
  'Open the planner and check off the next due date before class.',
];

export const CAMPUS = [
  { label: 'University Writing Center', href: 'https://writing.okstate.edu/', note: 'Book days ahead. Bring the assignment sheet + draft. They will not proofread for you.' },
  { label: 'Edmon Low Library / RLS', href: 'https://info.library.okstate.edu/RLS', note: 'Scholarly sources live here, not on the first page of Google.' },
  { label: 'Student Accessibility Services', href: 'https://accessibility.okstate.edu/', note: 'SWC · 405-744-7116. Request early — not the night a paper is due.' },
  { label: 'LASSO tutoring', href: 'https://lasso.okstate.edu/', note: 'CLBN 104 · 405-744-3309' },
  { label: 'Academic integrity', href: 'https://academicintegrity.okstate.edu/', note: 'Recycling a Comp I paper is self-plagiarism.' },
  { label: 'Zotero', href: 'https://www.zotero.org/', note: 'Required citation manager. Install the connector this week, not the night the bib is due.' },
  { label: 'Wix', href: 'https://www.wix.com/', note: 'Unit 4 only. Make the account before Week 12.' },
];
