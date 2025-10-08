/**
 * SM-2 Spaced Repetition Algorithm
 * Based on the SuperMemo 2 algorithm
 */

export interface SpacedRepetitionData {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
}

export function calculateNextReview(
  rating: 1 | 2 | 3 | 4,
  currentData: {
    easeFactor: number;
    interval: number;
    repetitions: number;
  }
): SpacedRepetitionData {
  let { easeFactor, interval, repetitions } = currentData;

  // Rating: 1 = Again, 2 = Hard, 3 = Good, 4 = Easy

  if (rating >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
  } else {
    // Incorrect response
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor
  easeFactor = easeFactor + (0.1 - (4 - rating) * (0.08 + (4 - rating) * 0.02));

  // Ease factor minimum
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Adjust interval based on rating even for correct responses
  if (rating === 4) {
    // Easy: Increase interval by 1.3x
    interval = Math.round(interval * 1.3);
  } else if (rating === 2) {
    // Hard: Reduce interval
    interval = Math.max(1, Math.round(interval * 0.5));
  }

  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval,
    repetitions,
    nextReview,
  };
}

export function getDueCards(cards: Array<{ nextReview: Date }>) {
  const now = new Date();
  return cards.filter((card) => new Date(card.nextReview) <= now);
}

