import type { Spread } from '../book/types';
import { CURRICULUM } from '../data/curriculum';
import { part0 } from './introScenes';
import { welcomeScenes } from './welcomeScenes';
import { dataScenes } from './data/scenes';
import { learningTypesScenes } from './learning-types/scenes';
import { neuronScenes } from './neuron/scenes';
import { learningScenes } from './learning/scenes';
import { fitScenes } from './fit/scenes';
import { planningScenes } from './planning/scenes';
import { pretrainingDataScenes } from './pretraining-data/scenes';
import { tokenizationScenes, tokenizationEnd } from './tokenization/scenes';
import { tokenization } from './tokenization';

/** Pages that stay as reference pages (sources); the explaining, code and quizzes are narrated scenes. */
const keep = (ids: string[]) => tokenization.filter((s) => ids.includes(s.id));

/** Reading order of all written spreads. Add a chapter here once its spreads exist. */
export const SPREADS: Spread[] = [
  ...welcomeScenes,
  ...part0,
  ...dataScenes,
  ...learningTypesScenes,
  ...neuronScenes,
  ...learningScenes,
  ...fitScenes,
  ...planningScenes,
  ...pretrainingDataScenes,
  ...tokenizationScenes,
  ...tokenizationEnd,
  ...keep(['tok-explore']),
];

export const CHAPTER_TITLES: Record<string, string> = Object.fromEntries(
  CURRICULUM.flatMap((p) => p.chapters.map((c) => [c.id, c.title])),
);
