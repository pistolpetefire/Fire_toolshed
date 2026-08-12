export function q(id, topic, stem, choices, answer, explanation, steps, whyNotOthers) {
  return {
    id,
    topics: [topic],
    stem,
    choices,
    answer,
    explanation,
    tutoring: { steps, whyNotOthers },
  };
}
