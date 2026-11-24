import type { Spread } from '../book/types';
import { CURRICULUM } from '../data/curriculum';
import { welcomeScene, part0 } from './introScenes';
import { tokenizationScenes } from './tokenization/scenes';
import { tokenization } from './tokenization';

/** Pages that stay as reference pages (code, quiz, sources); the explaining is done by narrated scenes. */
const keep = (ids: string[]) => tokenization.filter((s) => ids.includes(s.id));

/** Reading order of all written spreads. Add a chapter here once its spreads exist. */
export const SPREADS: Spread[] = [
  welcomeScene,
  ...part0,
  ...tokenizationScenes,
  ...keep(['tok-python', 'tok-test', 'tok-explore']),
];

export const CHAPTER_TITLES: Record<string, string> = Object.fromEntries(
  CURRICULUM.flatMap((p) => p.chapters.map((c) => [c.id, c.title])),
);
