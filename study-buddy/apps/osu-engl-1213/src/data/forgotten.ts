/** Things knucklehead students forget in Hughes’s Comp II. */

export interface ForgottenItem {
  id: string;
  title: string;
  body: string;
  when: string;
  severity: 'lethal' | 'expensive' | 'annoying';
}

export const FORGOTTEN: ForgottenItem[] = [
  {
    id: 'hw-before-class',
    title: 'Homework is due BEFORE class starts',
    body: 'Not 1:35. Not “I’ll upload after.” Once the period starts, daily work is a 0. There is no late homework.',
    when: 'Every T/H 1:30',
    severity: 'lethal',
  },
  {
    id: 'peer-review',
    title: 'The draft you bring to peer review IS the assignment',
    body: 'Unit 1 draft is due Thu Sep 3 before class. Showing up with notes in your head skips the A/B contract item “participated in online peer review.”',
    when: 'Each unit’s review day',
    severity: 'lethal',
  },
  {
    id: 'reflection-letter',
    title: '300-word drafting reflection = the A',
    body: 'A and B both need the major paper, the conference, peer review, and full attendance. The A also needs the 300-word letter with the final. People skip it and wonder why they got a B.',
    when: 'Every unit final',
    severity: 'expensive',
  },
  {
    id: 'conference',
    title: 'Feedback-week conference is required',
    body: 'Sign up. Show up. The PDF still says “Apr 6–10” from spring — that is leftover. Use the Canvas signup. Missing it knocks the unit off the A/B list.',
    when: 'Each unit’s feedback week',
    severity: 'lethal',
  },
  {
    id: 'docx-and-gdoc',
    title: 'Final drafts: .docx AND a shared Google Doc',
    body: 'Both. A Google-only link, a .pages file, or “I emailed it” does not count. Sharing must be set so Hughes can actually open it.',
    when: 'Every major final',
    severity: 'annoying',
  },
  {
    id: 'attendance-bank',
    title: 'You get 3 absences. The 4th costs 10% of the COURSE',
    body: '4th absence = 10% off the semester. 6th = 20%. 8th = automatic F. Illness is not excused. 3 tardies = 1 absence. Roll is at the start of class.',
    when: 'All semester',
    severity: 'lethal',
  },
  {
    id: 'forgiveness',
    title: 'Two Forgiveness Days — you have to invoke them',
    body: 'Email Hughes and say you are using one. Then finish the work. They do not auto-apply. Greek life is not an excused absence. Athletes still turn work in.',
    when: 'When you are actually sick or traveling',
    severity: 'expensive',
  },
  {
    id: 'late-7',
    title: 'Late majors: 7% per day, 2-week cap',
    body: 'Weekends count. After two weeks the dropbox closes and it is a 0. Canvas will show 0 until it is graded — that is normal, not a glitch.',
    when: 'Any late major',
    severity: 'expensive',
  },
  {
    id: 'ai',
    title: 'AI may not write any essay',
    body: 'Not the draft, not the “just clean up my sentences,” not the reflection. Hughes is explicit: all process work is yours. This app is for studying, not for generating submissions.',
    when: 'Every dropbox',
    severity: 'lethal',
  },
  {
    id: 'self-plagiarism',
    title: 'Do not recycle your Comp I paper',
    body: 'That is self-plagiarism. New question, new research, new draft.',
    when: 'Topic choice, week 4–5',
    severity: 'lethal',
  },
  {
    id: 'zotero',
    title: 'Install Zotero this week',
    body: 'Required. The night the annotated bib is due is a bad time to learn a citation manager. Also install the browser connector.',
    when: 'Week 1–2',
    severity: 'annoying',
  },
  {
    id: 'wix',
    title: 'Make the Wix account before Week 12',
    body: 'Unit 4 is a live site plus a Word doc plus a 300-word author’s note. A PDF export or a screenshot is not a website.',
    when: 'Before Unit 4',
    severity: 'annoying',
  },
  {
    id: 'ill',
    title: 'Interlibrary loan is not instant',
    body: 'Scholarly PDFs you cannot download today may take days. Start Unit 2 sources in week 5, not the night of week 7.',
    when: 'Unit 2',
    severity: 'expensive',
  },
  {
    id: 'writing-center',
    title: 'Book the Writing Center 2–3 days ahead',
    body: 'Bring the assignment sheet, the draft, and a specific question. They will not proofread. Hours: writing.okstate.edu. Midterm week fills up.',
    when: 'Before every major',
    severity: 'annoying',
  },
  {
    id: 'canvas-message',
    title: 'Contact Hughes through Canvas messages',
    body: 'That hits email AND Canvas. Campus email alone is how messages get lost. Do not submit work via message.',
    when: 'Any question',
    severity: 'annoying',
  },
  {
    id: 'okey-email',
    title: 'okstate.edu email has to actually arrive',
    body: 'If you do not use OSU mail, forward it in O-Key. Lost email is not an excuse for a missed announcement.',
    when: 'Week 1',
    severity: 'annoying',
  },
  {
    id: 'final-conflict',
    title: 'Final exam date: confirm on Canvas',
    body: 'Cover sheet says Thu Dec 10, 2:00–3:50. A table says Wed Dec 10. The last schedule page says Wed Dec 9 by 11:59. Use the official final-exam grid + Canvas. Dropbox opens Saturday 8am; you may submit early.',
    when: 'December',
    severity: 'expensive',
  },
  {
    id: 'unit3-weight',
    title: 'Unit 3 is the heavy one (~30%)',
    body: 'Cover page: 20 / 25 / 30 / 20 / 5. A later table lists Unit 3 as 25% (math does not add to 100). Treat Unit 3 as the biggest paper either way.',
    when: 'Weeks 8–14',
    severity: 'expensive',
  },
  {
    id: 'present-all-weeks',
    title: '“Present all weeks of a unit” is on the A and B lists',
    body: 'Burning your 3 absences inside one unit can knock that unit off A/B even if the paper is fine. Spread absences or use a Forgiveness Day.',
    when: 'Every unit',
    severity: 'lethal',
  },
  {
    id: 'describe-evaluate-suggest',
    title: 'Peer review has a formula: Describe, Evaluate, Suggest',
    body: '“Looks good” is not feedback. Hughes wants those three moves. Drive-by comments can fail the contract item.',
    when: 'Every peer review',
    severity: 'expensive',
  },
];
