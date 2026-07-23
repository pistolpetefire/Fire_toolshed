/**
 * Plain-language walkthrough of every control in the RSET tool.
 * Written for first-time users (aim: a bright 12-year-old could follow it).
 */

export interface WalkStep {
  id: string
  title: string
  /** Short label for the side TOC */
  tocLabel: string
  /** What on the screen this step is about */
  pointsTo: string
  body: string[]
  tip?: string
  warning?: string
}

export const WALKTHROUGH_INTRO = {
  title: 'Start here — how this tool works',
  paragraphs: [
    'Imagine a fire starts in a building. People need enough time to get out safely before the smoke and heat become too dangerous.',
    'RSET means Required Safe Egress Time. In plain words: “How long do we think people need, from the start of the fire, until they reach a safe place?”',
    'This tool does not hide the answer. It splits the total into four pieces you can see and change. You add them up. That sum is your RSET.',
    'There is no magic. Every number is either one you type, or a starting idea from research that you must still check. When you finish, the tool remembers what you chose in an Assumptions Log so other people can see how you got there.',
  ],
  recipe: [
    { label: 'Detection', color: 'var(--detection)', plain: 'How long until something notices the fire?' },
    { label: 'Notification', color: 'var(--notification)', plain: 'How long until people actually get a clear warning?' },
    { label: 'Pre-movement', color: 'var(--premovement)', plain: 'How long until people start moving on purpose?' },
    { label: 'Movement', color: 'var(--movement)', plain: 'How long to walk / queue / reach safety?' },
  ],
  formula: 'RSET = Detection + Notification + Pre-movement + Movement',
}

export const WALKTHROUGH_STEPS: WalkStep[] = [
  {
    id: 'project-name',
    title: 'Project name box',
    tocLabel: '1. Project name',
    pointsTo: 'Top of the page — text box that says “Project name (optional)”',
    body: [
      'This is just a label for your work, like writing a title on a worksheet.',
      'Type the building or job name if you want. It shows up on exports and printouts so people know which project the numbers belong to.',
      'You can leave it blank. The tool still works. Exports will say “untitled”.',
    ],
    tip: 'Use a short clear name, like “Warehouse B — draft RSET”.',
  },
  {
    id: 'load-session',
    title: 'Load Session button',
    tocLabel: '2. Load Session',
    pointsTo: 'Top of the page — “Load Session” button',
    body: [
      'This is how you open work you saved earlier.',
      'When you export, the tool downloads a JSON file (a small text file full of your numbers and log). Later, click Load Session, pick that file, and everything comes back.',
      'After loading, you must open the guides again before you can export. That is on purpose — so you re-check the ideas, not just re-use old numbers without thinking.',
    ],
    tip: 'Only load files that came from this tool (or the same format). Random JSON files will show an error.',
  },
  {
    id: 'export-print',
    title: 'Export JSON and Print Summary',
    tocLabel: '3. Export & Print',
    pointsTo: 'Top of the page — “Export JSON” and “Print Summary” buttons',
    body: [
      'Export JSON saves your whole session: all four times, the assumptions log, project name, and optional tenability limit. Share that file with teammates or reload it later.',
      'Print Summary opens a clean page with tables and a disclaimer, then asks your browser to print (or save as PDF).',
      'Both stay locked (greyed out) until you finish two things: open each of the four short component guides, and check the “I have reviewed…” box.',
      'Why lock them? Because this is a teaching tool. We do not want people downloading official-looking numbers they never understood.',
    ],
    warning: 'Exporting does not make the numbers “correct.” It only records what you chose. A fire protection engineer still has to own them.',
  },
  {
    id: 'disclaimer',
    title: 'Orange disclaimer box',
    tocLabel: '4. Disclaimer',
    pointsTo: 'Orange/warning strip near the top under the header',
    body: [
      'Read this every time you open the tool.',
      'It says the honest thing: numbers here are starting points or your own typing. They are not automatic truth. They are not legal or stamped engineering advice.',
      'If you use this on a real building, a qualified fire protection engineer must review, justify, and accept every value.',
    ],
  },
  {
    id: 'guide-gate',
    title: 'Guide Review Required section',
    tocLabel: '5. Guide checklist',
    pointsTo: 'Panel titled “Guide Review Required Before Export”',
    body: [
      'Before Export and Print unlock, you must open each of these four mini-guides: Detection, Notification, Pre-movement, and Movement.',
      'Click each button. When you open one, it turns green with a check mark. That means “you opened it,” not “you are an expert now.”',
      'After all four are green, check the big confirmation box. That is you saying: “I looked at the guides, I know these are starting points, and I own how I use the results.”',
      'You can also use this Full Guide (the page you are reading) and finish with the button at the bottom to mark all four as reviewed.',
    ],
    tip: 'Open the guides even if you think you already know. Pre-movement is where most people make dangerous guesses.',
  },
  {
    id: 'timeline',
    title: 'Colour timeline bar',
    tocLabel: '6. Timeline bar',
    pointsTo: 'Section “RSET Timeline (live)” — the coloured horizontal bar',
    body: [
      'This bar is a picture of your total time. Each colour is one piece:',
    ],
    tip: 'Click a colour to jump to that piece’s suggestive values below.',
  },
  {
    id: 'timeline-legend',
    title: 'Timeline colours (what each piece means)',
    tocLabel: '7. Four pieces',
    pointsTo: 'Coloured chips under the bar (Detection, Notification, Pre-movement, Movement)',
    body: [
      'Orange — Detection: from “fire starts” until something notices it (detector, sprinkler waterflow, or a person).',
      'Purple — Notification: from “noticed” until people get a clear warning they can actually use (tone, voice message, etc.).',
      'Red — Pre-movement: from “I heard the warning” until “I start moving on purpose toward an exit.” This is thinking and deciding time, not walking.',
      'Green — Movement: from “I start moving” until “I reach a safe place.” Walking, stairs, and waiting in lines all live here.',
      'Click any chip or segment to select it. The suggestive list below will switch to match.',
    ],
    warning: 'These four happen one after another. Making one piece tiny does not erase a huge piece next to it.',
  },
  {
    id: 'total-rset',
    title: 'Total RSET number',
    tocLabel: '8. Total RSET',
    pointsTo: 'Big “Total RSET” number under the timeline',
    body: [
      'This is just addition. Add the four times (in seconds). That sum is Total RSET.',
      'Example: 60 + 15 + 60 + 120 = 255 seconds (about 4 minutes 15 seconds).',
      'If you change any box, this number updates live. There are no secret multipliers hiding underneath.',
    ],
  },
  {
    id: 'margin',
    title: 'Margin vs Tenability',
    tocLabel: '9. Margin',
    pointsTo: 'Big “Margin vs Tenability” number next to Total RSET',
    body: [
      'Tenability means “how long until the building becomes too smoky or hot for people.” That other time is often called ASET (Available Safe Egress Time).',
      'This tool does not calculate ASET. You may type a tenability limit later in the optional box. Then margin = that limit minus your RSET.',
      'Green / positive margin: your RSET is shorter than the limit you typed (looks safer on paper — still check the assumptions).',
      'Red / negative margin: your RSET is longer than the limit you typed. That means “not enough time” under those numbers. Fix the design or fix bad assumptions — do not just shrink numbers to make the screen happy.',
    ],
    warning: 'A pretty green margin is worthless if detection or pre-movement numbers are fantasy.',
  },
  {
    id: 'segment-boxes',
    title: 'The four number boxes',
    tocLabel: '10. Number boxes',
    pointsTo: 'Four cards in a row: Detection, Notification, Pre-movement, Movement (seconds)',
    body: [
      'Each box is one piece of RSET, in seconds. Type a number, then click away (or press Enter) to lock it in.',
      'We only save the change when you finish editing — so the Assumptions Log does not fill up with every single keystroke.',
      'Numbers cannot go below zero. Negative time does not make sense here.',
      'Under each box you will see either “User-entered value” or “Suggestive: some-id” so you know where the number came from.',
      'Click a card (not only the number) to select that component for the suggestive list below.',
    ],
    tip: 'Always ask: “Would I defend this number in front of an AHJ (the building official)?” If not, change it or document why.',
  },
  {
    id: 'suggestive',
    title: 'Suggestive Values list',
    tocLabel: '11. Suggestive values',
    pointsTo: 'Section “Suggestive Values — …” with clickable rows',
    body: [
      'These are starter ideas from research and common practice — not rules, not code numbers, not “the answer.”',
      'Click a row to put that starter value into the matching number box. The tool records it in the Assumptions Log with the citation shown.',
      'The list changes when you select Detection, Notification, Pre-movement, or Movement.',
      'After you click one, read the orange Warning and the Citation under the list. That warning is part of the product. Ignore it at your own risk.',
    ],
    warning: 'Accepting a suggestive value is still a decision. You are saying “I will use this as my starting point and I know its limits.”',
  },
  {
    id: 'show-guide-btn',
    title: 'Show … Guide button',
    tocLabel: '12. Short component guide',
    pointsTo: 'Button next to Suggestive Values title (Show Detection / Notification / … Guide)',
    body: [
      'This opens a short teaching panel for whichever piece you are working on right now.',
      'Opening it also counts toward the four guide checkmarks needed for export.',
      'The Full Guide (this page) has longer, clearer walkthroughs plus the full technical text from the repository guides.',
    ],
  },
  {
    id: 'assumptions-log',
    title: 'Assumptions Log',
    tocLabel: '13. Assumptions Log',
    pointsTo: 'Table titled “Assumptions Log”',
    body: [
      'This is your paper trail. Every time you accept a suggestive value or finish editing a number, a line is added.',
      'Each line shows when you changed it, which piece, what action (accepted / modified / replaced), the new value, and the old value if it changed.',
      'Exports and printouts include this log so someone else can audit your work.',
      'Collapse hides the table. Clear Log empties it after a confirmation — use carefully; you cannot undo.',
    ],
    tip: 'A good log is your friend when someone asks “why 60 seconds?” next month.',
  },
  {
    id: 'tenability-input',
    title: 'Optional Tenability Limit (ASET comparison)',
    tocLabel: '14. Tenability box',
    pointsTo: 'Number box under “Optional Tenability Limit (ASET comparison)”',
    body: [
      'Type a time in seconds for how long you think the space stays tenable (safe enough), if you already have that from some other analysis.',
      'This tool never invents ASET for you. It only subtracts: margin = your typed limit − Total RSET.',
      'Leave it empty if you do not have a tenability number. The margin display will hide.',
      'Clear the box completely to remove the comparison.',
    ],
    warning: 'Do not pretend a tenability number is accurate if you guessed it. Wrong ASET + pretty RSET = false confidence.',
  },
  {
    id: 'how-to-use',
    title: 'Suggested order of work (do this)',
    tocLabel: '15. How to use',
    pointsTo: 'Whole page — recommended sequence',
    body: [
      '1) Read this Full Guide once (you are doing that now).',
      '2) Type a project name if you want.',
      '3) For Detection: open its guide, pick a suggestive value or type your own, read the warning.',
      '4) Repeat for Notification, Pre-movement, and Movement. Pre-movement usually needs the most care.',
      '5) If you have a real tenability time from elsewhere, enter it and look at the margin.',
      '6) Skim the Assumptions Log. Does every line make sense?',
      '7) Check the confirmation box, then Export or Print.',
      '8) If the building has lots of people, stairs, or queues, replace Movement with a proper egress model result — this tool’s movement starters are only for simple cases.',
    ],
    tip: 'Slow is okay. Understanding beats a fast but fake number.',
  },
  {
    id: 'grown-up-rules',
    title: 'Rules that never go away',
    tocLabel: '16. Hard rules',
    pointsTo: 'Mindset for real projects',
    body: [
      'Transparent means visible — not “already approved.”',
      'Suggestive means “starting idea,” not “required by code.”',
      'This tool does not replace hydraulic or agent-based egress modelling when the building needs it.',
      'Codes, handbooks, and research change. Check current editions and your AHJ.',
      'If you cannot explain a number in plain words, you are not ready to export it as if it were finished design.',
    ],
    warning: 'Using optimistic times on purpose to make RSET look small is not engineering. It is cheating people who trust the number.',
  },
]

export const PIECE_PLAIN: Record<string, { title: string; kid: string[]; remember: string }> = {
  detection: {
    title: 'Detection Time — plain English',
    kid: [
      'The fire has just started. Nobody is running yet. Detection is the waiting time until something notices the fire.',
      'That “something” might be a smoke detector, a heat detector, a fancy aspirating system, a sprinkler that opens and trips a waterflow switch, or a person who sees/smells it.',
      'If nothing notices for a long time, the fire grows while the exit clock has not really started for people. So short detection numbers need a good reason.',
      'Waterflow is special: if the alarm starts when a sprinkler opens, detection is “time until first sprinkler opens + any delay on the flow switch,” not a smoke-detector time.',
    ],
    remember: 'Detection is “noticed by the system (or person),” not “first puff of smoke somewhere in the room.”',
  },
  notification: {
    title: 'Notification Time — plain English',
    kid: [
      'The system noticed the fire. Great. Do people know yet?',
      'Notification is the gap between “system knows” and “people get a warning they can actually use.”',
      'Sometimes that is almost instant (public alarm right away). Sometimes staff check first (private mode), or there is a delay timer, or the speakers are hard to understand. Those add time.',
      'Hearing a faint beep you ignore is not a great cue. A clear voice message is usually better at starting the next step.',
    ],
    remember: 'Detection ≠ Notification. Noticing the fire is not the same as warning the people.',
  },
  premovement: {
    title: 'Pre-movement Time — plain English',
    kid: [
      'You heard the alarm. You have not started walking to the exit yet. Everything in between is pre-movement.',
      'People look around, ask friends, finish a task, gather kids, decide if it is a drill, put on a coat… Real humans are messy. Research shows huge scatter — some move fast, some take a long time.',
      'This tool thinks in three mini-steps: Perception (I notice a cue) → Interpretation (I decide what it means) → Action (I commit to leave).',
      'A single short number for a whole building is almost always too simple. Treat starters as middle-of-the-road ideas, not the slowest person who still needs to get out.',
    ],
    remember: 'Pre-movement is usually the biggest and most uncertain piece. Do not shrink it just to win on the screen.',
  },
  movement: {
    title: 'Movement Time — plain English',
    kid: [
      'Now people are actually moving toward safety: down halls, through doors, on stairs, maybe waiting in a crowd.',
      'It is not only “distance ÷ walking speed.” When many people squeeze through a door, a line forms. Lines take time.',
      'For a tiny room with few people, a simple travel time might be okay as a draft. For real buildings with stairs and lots of occupants, you need a proper egress calculation or model.',
      'Movement only starts after pre-movement ends. Fast walking cannot erase a long “I have not decided to leave yet.”',
    ],
    remember: 'If there will be queues, do not trust a single optimistic travel time from this tool as the final answer.',
  },
}
