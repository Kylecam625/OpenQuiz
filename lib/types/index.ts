import { Flashcard, Deck, User, StudySession, Review, PracticeTest, Note } from "@prisma/client";

// Extended types with relations
export type DeckWithCards = Deck & {
  flashcards: Flashcard[];
  _count?: {
    flashcards: number;
  };
};

export type FlashcardWithDeck = Flashcard & {
  deck: Deck;
};

export type StudySessionWithReviews = StudySession & {
  reviews: Review[];
  deck?: Deck | null;
};

export type PracticeTestWithQuestions = PracticeTest & {
  questions: Array<{
    id: string;
    question: string;
    questionType: string;
    correctAnswer: string;
    options: string[];
    explanation: string | null;
    order: number;
  }>;
};

// Study modes
export type StudyMode = "flip" | "multiple-choice" | "typing";

// Review ratings for spaced repetition
export type ReviewRating = 1 | 2 | 3 | 4; // Again, Hard, Good, Easy

// AI generation types
export interface FlashcardGenerationRequest {
  documentText: string;
  cardCount?: number; // undefined = auto
  deckId?: string;
}

export interface GeneratedFlashcard {
  front: string;
  back: string;
}

export interface PracticeTestGenerationRequest {
  deckIds: string[];
  questionCount: number;
  questionTypes?: Array<"multiple-choice" | "short-answer" | "true-false">;
}

// Dashboard stats
export interface DashboardStats {
  totalDecks: number;
  totalCards: number;
  cardsDueToday: number;
  studyStreak: number;
  recentActivity: Array<{
    type: "study" | "deck" | "test";
    description: string;
    timestamp: Date;
  }>;
}

