export const LEGACY_STAGE_NAME_MAP = {
  "Absolute Cinema": "Main Stage",
  "Lock In": "Side Stage",
  "Cafe del Mar": "Lounge Stage",
  "Etihad Arena": "Arena Stage",
} as const;

export type LegacyStageTitle = keyof typeof LEGACY_STAGE_NAME_MAP;
export type CanonicalStageTitle = (typeof LEGACY_STAGE_NAME_MAP)[LegacyStageTitle];

export const normalizeStageTitle = (title?: string | null): string | undefined => {
  if (!title) {
    return undefined;
  }

  return LEGACY_STAGE_NAME_MAP[title as LegacyStageTitle] ?? title;
};
