import type { ReactNode } from 'react';

/**
 * A "spread" is one opening of the book: a left page and a right page.
 * Convention used throughout the book:
 *   left  = the story / narration / explanation
 *   right = the visual, simulation or code that the story talks about
 * On mobile the two pages stack vertically (left first).
 */
export interface Spread {
  id: string;            // stable, used in the URL hash (#p/<id>)
  chapter: string;       // chapter id this spread belongs to
  stage?: Stage;         // which teaching stage this spread serves
  title: string;
  left: ReactNode;
  right: ReactNode;
  /** On phones, show the right page (the diagram) first. Used by narrated scenes. */
  visualFirst?: boolean;
}

/** The nine-stage teaching model (see docs/TEACHING_MODEL.md). Not every topic uses every stage. */
export type Stage =
  | 'imagine' | 'discover' | 'visualize' | 'interact' | 'behind'
  | 'python' | 'when' | 'test' | 'explore';

export const STAGE_LABEL: Record<Stage, string> = {
  imagine: 'Imagine', discover: 'Discover', visualize: 'Visualize', interact: 'Interact',
  behind: 'Behind the scenes', python: 'Implement with Python', when: 'When to use it',
  test: 'Test yourself', explore: 'Explore further',
};
