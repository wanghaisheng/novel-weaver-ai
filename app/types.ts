

export interface CharacterProfile {
  id: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | '';
  identity?: string;
  appearance?: string;
  personality?: string;
  want?: string;
  need?: string;
  flaw?: string;
  backstory?: string;
  arc?: string;
  // For antagonist
  motivation?: string;
  relationshipToProtagonist?: string;
  // For supporting
  functionInStory?: string;
  briefDescription?: string;
}

export interface Stage1Data {
  coreIdea: string;
  genre: string;
  tone: string;
  targetAudience: string;
  theme: string;
  logline: string;
  characters: CharacterProfile[];
  worldBuilding: {
    timeAndPlace: string;
    coreRules: string;
    socialStructure: string;
    keyLocations: string;
  };
}

export interface ActData {
  description: string; // General description or prompt
  content: string; // User input for this part
}

export interface Stage2Data {
  act1: {
    stasis: string;
    incitingIncident: string;
    debate: string;
    turningPoint1: string;
  };
  act2: {
    testsAlliesEnemies: string;
    midpoint: string;
    risingAction: string;
    allIsLost: string;
    turningPoint2: string;
  };
  act3: {
    runUpToClimax: string;
    climax: string;
    fallingAction: string;
    resolution: string;
  };
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  povCharacter: string;
  coreGoal: string;
  keyPlotPoints: string;
  startingScene: string;
  endingScene: string;
  atmosphere: string;
  wordCount?: number;
  content: string;
  isWriting?: boolean; // Optional: true if AI is currently writing this chapter
}

export interface Stage3Data {
  chapters: Chapter[];
  currentChapterPrompt: {
    povCharacter: string;
    coreGoal: string;
    keyPlotPoints: string;
    startingScene: string;
    endingScene: string;
    atmosphere: string;
    wordCount?: number;
  };
}

export enum RevisionTaskType {
  CONSISTENCY = 'Consistency Check',
  DESCRIPTION = 'Description Enhancement',
  DIALOGUE = 'Dialogue Optimization',
  PACING = 'Pacing Adjustment',
}

export interface RevisionState {
  taskType: RevisionTaskType | '';
  inputText: string;
  outputText: string;
  isLoading: boolean;
}


export interface NovelData {
  title: string;
  stage1: Stage1Data;
  stage2: Stage2Data;
  stage3: Stage3Data;
  // Stage 4 (Revision) is interactive and doesn't store data in NovelData directly,
  // but relies on Stage 3's chapter content.
  // Stage 5 (Finalize & Export) primarily uses existing novelData.title and triggers download.
}

export enum NovelStage {
  FOUNDATION = 'Foundation & Ideation',
  OUTLINE = 'Plot Outlining',
  WRITING = 'Chapter Writing',
  REVISION = 'Revision & Polishing',
  FINALIZE_EXPORT = 'Finalize & Export',
}

export const STAGES_ORDER: NovelStage[] = [
  NovelStage.FOUNDATION,
  NovelStage.OUTLINE,
  NovelStage.WRITING,
  NovelStage.REVISION,
  NovelStage.FINALIZE_EXPORT,
];

export interface StageInfo {
  id: NovelStage;
  titleKey: string;
  descriptionKey: string;
}

export type AppView = 'home' | 'tool' | 'pricing' | 'signIn' | 'signUp' | 'authCallback' | 'privacy' | 'terms' | 'about' | 'contact' | 'monetization';

// This is the user object from OpenAuth provider
export interface OpenAuthUser {
  id: string; // Typically a UUID from OpenAuth
  email?: string; // Email might be optional depending on provider
  // other fields from provider...
}

// This is the user object we'll use in our app's state
export interface User {
  id: string; // User's unique ID (from OpenAuth system, consistent across providers)
  email: string; // User's email address (should be present for our app's use)
  // other app-specific fields like subscription status can be added here
}

export interface AuthResponse {
  token: string;
  user: User; // Use our app's User type
  message?: string;
}

export interface AuthErrorResponse {
  error?: string;
  error_description?: string;
  message?: string; // Often used by OpenAuth for more user-friendly messages
}

export interface SignUpInitiateResponse {
    message: string;
}

export interface VerificationResponse {
  message: string;
  user?: OpenAuthUser; // Server might return some user info
}

export type OAuthProvider = 'google' | 'microsoft' | 'apple' | 'github';


export type ToolSectionId = 'novel-editor' | 'trend-spark'; // Removed 'sitemap-generator'

export interface PricingPlan {
  id: string;
  nameKey: string;
  prices: { [currencyCode: string]: string }; // e.g. { "KRW": "10000", "USD": "10" }
  priceMonthly: string; // Base monthly price in primary currency (e.g., KRW or USD)
  priceYearly?: string; // Optional: if yearly pricing differs structurally beyond discount
  originalPrices?: { [currencyCode: string]: string };
  originalPriceMonthly?: string;
  currencySymbol: string; // Default, will be updated by selectedCurrency
  currencyCode: string; // Default, will be updated
  featureKeys: string[];
  ctaTextKey: string;
  isHighlighted?: boolean;
  highlightBadgeKey?: string;
}

export type BillingCycle = 'monthly' | 'yearly';

export interface FAQItem {
  questionKey: string;
  answerKey: string;
}

// Trend Spark Types
export interface TrendSparkUserQuery {
  trends: string; // User's description of current trends
}

export interface TrendSparkConcept {
  id: string; // Unique ID for the concept
  title: string;
  blurb: string; // Short premise/hook
  genreSuggestion: string;
  targetAudiencePlatform: string;
  sellingPoints: string[]; // Key aspects for monetization/popularity
}

export interface TrendSparkAIResponse {
  concepts: TrendSparkConcept[];
}