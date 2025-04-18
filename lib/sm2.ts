export interface SM2Item {
  interval: number;      // Inter-repetition interval in days
  repetitions: number;   // Number of consecutive correct recalls
  easeFactor: number;    // Factor reflecting ease of recall (>= 1.3)
}

export interface SM2Result extends SM2Item {
  nextReviewDate: Date; // The date for the next review
}

const MIN_EASE_FACTOR = 1.3;

/**
 * Calculates the next review date and updated SM-2 parameters based on recall quality.
 * 
 * @param item The current state of the flashcard (interval, repetitions, easeFactor).
 * @param quality The quality of recall (0-5, where 0=worst, 5=best). Typically: 0-2=fail, 3=hard, 4=good, 5=easy.
 * @returns The updated state including the next review date.
 */
export function calculateSM2(item: SM2Item, quality: number): SM2Result {
  if (quality < 0 || quality > 5) {
    throw new Error("Quality must be between 0 and 5.");
  }

  let { interval, repetitions, easeFactor } = item;

  if (quality < 3) {
    // Failed recall: Reset repetitions and interval
    repetitions = 0;
    interval = 1; // Review again tomorrow
  } else {
    // Successful recall
    repetitions += 1;

    if (repetitions === 1) {
      interval = 1; // First successful recall
    } else if (repetitions === 2) {
      interval = 6; // Second successful recall
    } else {
      interval = Math.ceil(interval * easeFactor);
    }

    // Update ease factor
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < MIN_EASE_FACTOR) {
      easeFactor = MIN_EASE_FACTOR;
    }
  }

  const now = new Date();
  const nextReviewDate = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);
  // Set time to midnight for consistency
  nextReviewDate.setHours(0, 0, 0, 0);

  return {
    interval,
    repetitions,
    easeFactor,
    nextReviewDate,
  };
}

// Helper function to map button difficulty to SM-2 quality score
export function mapDifficultyToQuality(difficulty: "easy" | "good" | "hard"): number {
    switch (difficulty) {
        case "easy": return 5;
        case "good": return 4;
        case "hard": return 3; // Treat 'hard' as just passing (quality 3)
        // We could also map a 'fail' button to quality < 3 if needed
        default: return 3; // Default to 'hard' if something unexpected happens
    }
} 