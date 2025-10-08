import { z } from "zod";

// Auth validators
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Deck validators
export const createDeckSchema = z.object({
  name: z.string().min(1, "Deck name is required").max(100),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  tags: z.array(z.string()).optional(),
});

export const updateDeckSchema = createDeckSchema.partial();

// Flashcard validators
export const createFlashcardSchema = z.object({
  front: z.string().min(1, "Front content is required"),
  back: z.string().min(1, "Back content is required"),
  deckId: z.string().cuid(),
});

export const updateFlashcardSchema = z.object({
  front: z.string().min(1).optional(),
  back: z.string().min(1).optional(),
  deckId: z.string().cuid().optional(),
});

// Study validators
export const reviewSchema = z.object({
  flashcardId: z.string().cuid(),
  sessionId: z.string().cuid().optional(),
  rating: z.number().min(1).max(4),
  timeSpent: z.number().min(0),
});

// AI generation validators
export const generateFlashcardsSchema = z.object({
  documentText: z.string().min(10, "Document must contain at least 10 characters"),
  cardCount: z.number().min(1).max(100).optional(),
  deckId: z.string().cuid().optional(),
  allowExternal: z.boolean().optional(),
  notes: z.string().max(2000, "Notes must be 2000 characters or less").optional(),
});

export const generatePracticeTestSchema = z.object({
  deckIds: z.array(z.string().cuid()).min(1, "At least one deck is required"),
  questionCount: z.number().min(1).max(50),
  questionTypes: z.array(z.enum(["multiple-choice", "short-answer", "true-false"])).optional(),
});

// Note validators
export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string(),
  folder: z.string().optional(),
  tags: z.array(z.string()).optional(),
  parentId: z.string().cuid().optional(),
});

export const updateNoteSchema = createNoteSchema.partial();
