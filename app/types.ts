
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
  isWriting?: boolean; // To show loading state for this specific chapter
}

export interface Stage3Data {
  chapters: Chapter[];
  currentChapterPrompt: { // For the form inputs
    povCharacter: string;
    coreGoal: string;
    keyPlotPoints: string;
    startingScene: string;
    endingScene: string;
    atmosphere: string;
    wordCount?: number;
  }
}

export interface NovelData {
  title: string;
  stage1: Stage1Data;
  stage2: Stage2Data;
  stage3: Stage3Data;
}

export enum NovelStage {
  FOUNDATION = 'Foundation & Ideation',
  OUTLINE = 'Plot Outlining',
  WRITING = 'Chapter Writing',
  REVISION = 'Revision & Polishing',
  FINALIZE_EXPORT = 'Finalize & Export',
}

export const STAGES_ORDER = [
  NovelStage.FOUNDATION,
  NovelStage.OUTLINE,
  NovelStage.WRITING,
  NovelStage.REVISION,
  NovelStage.FINALIZE_EXPORT,
];

export interface StageInfo {
  id: NovelStage;
  titleKey: string; // Changed from title to titleKey
  descriptionKey: string; // Changed from description to descriptionKey
}

export enum RevisionTaskType {
  CONSISTENCY = "Consistency Check",
  DESCRIPTION = "Description Enhancement",
  DIALOGUE = "Dialogue Optimization",
  PACING = "Pacing Adjustment",
}

export interface RevisionState {
  taskType: RevisionTaskType | '';
  inputText: string;
  outputText: string;
  isLoading: boolean;
}

// Defines the primary tools navigable from the main ToolSidebar
export type ToolSectionId = 'novel-editor' | 'poem-generator' | 'script-writer' | 'trend-spark'; // Added 'trend-spark'

// Types for Pricing Page
export type BillingCycle = 'monthly' | 'yearly';

export interface PricingPlan {
  id: string;
  nameKey: string; // Changed from name to nameKey
  prices: { [currencyCode: string]: string }; 
  priceMonthly: string; 
  priceYearly?: string; 
  originalPrices?: { [currencyCode: string]: string }; 
  originalPriceMonthly?: string; 
  currencySymbol: string; 
  currencyCode: string; 
  featureKeys: string[]; // Changed from features (string[]) to featureKeys (string[])
  ctaTextKey: string; // Changed from ctaText to ctaTextKey
  isHighlighted?: boolean; 
  highlightBadgeKey?: string; // Changed from highlightBadge to highlightBadgeKey
  monthlyPriceId?: string; 
  yearlyPriceId?: string; 
  gumroadLinkMonthly?: string;
  gumroadLinkYearly?: string;
}

export interface FAQItem {
  questionKey: string; // Changed from question to questionKey
  answerKey: string; // Changed from answer to answerKey
}

// Authentication Types
export interface User {
  id: string; 
  email: string; 
}

export interface AuthState {
  currentUser: (User & { token: string }) | null;
  isLoading: boolean;
  error: string | null;
}

export interface OpenAuthUser {
  id: string;
  email?: string; 
}

export interface AuthResponse {
  token: string;
  user: User; 
  message?: string;
}

export interface SignUpInitiateResponse {
    message: string;
}

export interface VerificationResponse {
    message: string;
    user?: User; 
}


export interface AuthErrorResponse {
  message: string;
  error?: string; 
  error_description?: string; 
}

export type OAuthProvider = 'google' | 'microsoft' | 'apple' | 'github';

// App View Types
export type AppView = 
  | 'home' 
  | 'tool' 
  | 'pricing' 
  | 'signIn' 
  | 'signUp' 
  | 'authCallback'
  | 'privacy'
  | 'terms'
  | 'about'
  | 'contact';

// For i18n
export interface LangInfo {
  code: string;
  name: string;
}

// For Trend Spark Tool
export interface TrendSparkUserQuery {
  trends: string; // User-inputted text describing observed trends
}

export interface TrendSparkConcept {
  id: string; // Unique ID for the concept
  title: string;
  blurb: string; // Short premise
  genreSuggestion: string;
  targetAudiencePlatform: string; // e.g., "Young adults on WebNovel"
  sellingPoints: string[]; // Key aspects for monetization/popularity
}

export interface TrendSparkAIResponse {
  concepts: TrendSparkConcept[];
}
