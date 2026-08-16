import type { SystemId, UnitId } from '../types';
import { getUnitById } from './courseUnits';

const BOOK = 'Saladin, Anatomy & Physiology: The Unity of Form and Function, 10th ed. (2024)';
const ACCESS = 'Digital copy is in Moodle via Day One Access / Connect';

const DIAGRAM_CHAPTER: Record<string, string> = {
  integumentary: 'Ch 6 §6.1–6.2',
  skeletal: 'Ch 7–8',
  'long-bone': 'Ch 7 §7.1c, e',
  osteon: 'Ch 7 §7.2a, c, d',
  'synovial-joint': 'Ch 9 §9.1–9.2',
  muscular: 'Ch 10–11',
  biceps: 'Ch 10 §10.1; Ch 11 Table 11.4',
  sarcomere: 'Ch 11 §11.1b, 11.2, 11.3a',
  nmj: 'Ch 11 §11.3–11.4',
  nervous: 'Ch 12',
  neuron: 'Ch 12 §12.2c',
  'action-potential': 'Ch 12 §12.4',
  'spinal-cord': 'Ch 13 §13.1d, 13.3',
  brain: 'Ch 14 §§14.1–14.5',
  diencephalon: 'Ch 14 §§14.1–14.2',
  'cranial-nerves': 'Ch 14 §14.2c',
  ans: 'Ch 15 §15.2–15.3',
  eye: 'Ch 16 §16.5a–c',
  ear: 'Ch 16 §16.4b–d',
  cardiovascular: 'Ch 19–20',
};

const SYSTEM_CHAPTER: Record<string, string> = {
  integumentary: 'Ch 6',
  skeletal: 'Ch 7–9',
  muscular: 'Ch 10–11',
  nervous: 'Ch 12–16',
  cardiovascular: 'Ch 19–20',
  respiratory: 'Ch 22',
  digestive: 'Ch 25',
  endocrine: 'Ch 17',
  urinary: 'Ch 23–24',
  lymphatic: 'Ch 21',
  reproductive: 'Ch 27–28',
};

export function formatSyllabusCite(chapterRef: string, extra?: string): string {
  const tail = extra ? ` ${extra}` : '';
  return `Confirm in ${BOOK}, ${chapterRef}. ${ACCESS}.${tail}`;
}

export function citeForUnitObjective(unitId: UnitId, objective: number): string {
  const unit = getUnitById(unitId);
  const obj = unit?.objectives.find((o) => o.number === objective);
  const ch = obj?.chapters ?? unit?.chapters.join(', ') ?? 'the unit’s listed chapters';
  return formatSyllabusCite(ch, ` Matches Senter syllabus Unit ${unit?.number ?? ''} objective ${objective}.`);
}

export function citeForDiagram(diagramId?: string, systemId?: SystemId): string {
  const ch =
    (diagramId && DIAGRAM_CHAPTER[diagramId]) ||
    (systemId && SYSTEM_CHAPTER[systemId]) ||
    'the matching Saladin chapter on the unit syllabus';
  return formatSyllabusCite(ch, ' Use the same figure/section in Connect if the plate is in the assignment.');
}

export function citeForSystem(systemId: SystemId): string {
  return formatSyllabusCite(SYSTEM_CHAPTER[systemId] ?? 'the related Saladin chapter');
}
