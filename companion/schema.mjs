import { readFile } from 'node:fs/promises';

export const MASTERY_KEYS = Object.freeze([
  ['termIndependence', 'Term independence'],
  ['causalChain', 'Causal chain'],
  ['mechanismTransparency', 'Mechanism transparency'],
  ['boundaryDifferentiation', 'Boundary differentiation'],
  ['stressTestPass', 'Stress-test pass']
]);

const VALID_SESSION_STATUSES = new Set(['inactive', 'in-progress', 'mastered', 'paused']);
const VALID_CRITERION_STATUSES = new Set(['done', 'active', 'pending']);
const VALID_SCAFFOLD_STATUSES = new Set(['none', 'suggested', 'shown']);
const VALID_LANGUAGES = new Set(['en', 'ko']);

export function normalizeSnapshot(raw = {}) {
  const source = isPlainObject(raw) ? raw : {};
  const criteriaById = new Map(
    Array.isArray(source.masteryCriteria)
      ? source.masteryCriteria
          .filter(isPlainObject)
          .map((criterion) => [asText(criterion.id), criterion])
      : []
  );

  const masteryCriteria = MASTERY_KEYS.map(([id, label]) => {
    const criterion = criteriaById.get(id) ?? {};
    const status = VALID_CRITERION_STATUSES.has(criterion.status)
      ? criterion.status
      : 'pending';

    return {
      id,
      label,
      status,
      evidence: asText(criterion.evidence)
    };
  });

  const scaffoldSource = isPlainObject(source.scaffoldState) ? source.scaffoldState : {};
  const scaffoldStatus = VALID_SCAFFOLD_STATUSES.has(scaffoldSource.status)
    ? scaffoldSource.status
    : 'none';

  return {
    concept: asText(source.concept) || 'Untitled concept',
    status: VALID_SESSION_STATUSES.has(source.status) ? source.status : 'inactive',
    round: Number.isInteger(source.round) && source.round >= 0 ? source.round : 0,
    currentLearnerQuote: asText(source.currentLearnerQuote),
    currentGapCategory: asText(source.currentGapCategory),
    currentGapSummary: asText(source.currentGapSummary),
    currentProbe: asText(source.currentProbe) || 'Start a Feynman session in the terminal.',
    masteryCriteria,
    scaffoldState: {
      status: scaffoldStatus,
      summary: asText(scaffoldSource.summary)
    },
    roundHistory: normalizeRoundHistory(source.roundHistory),
    sessionLogPath: asText(source.sessionLogPath),
    updatedAt: asText(source.updatedAt),
    language: VALID_LANGUAGES.has(source.language) ? source.language : 'en'
  };
}

export async function readSnapshotFile(filePath) {
  try {
    const body = await readFile(filePath, 'utf8');
    return {
      ok: true,
      snapshot: normalizeSnapshot(JSON.parse(body)),
      error: ''
    };
  } catch (error) {
    return {
      ok: false,
      snapshot: normalizeSnapshot(),
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function normalizeRoundHistory(roundHistory) {
  if (!Array.isArray(roundHistory)) {
    return [];
  }

  return roundHistory
    .filter(isPlainObject)
    .slice(-8)
    .map((round, index) => ({
      round: Number.isInteger(round.round) && round.round > 0 ? round.round : index + 1,
      quote: asText(round.quote),
      gapCategory: asText(round.gapCategory),
      gapSummary: asText(round.gapSummary),
      probe: asText(round.probe),
      scaffoldUsed: round.scaffoldUsed === true
    }));
}

function asText(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return typeof value === 'string' ? value : String(value);
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
