

import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { MODEL_NAME, META_PROMPT_SECTIONS } from '../constants';
import { NovelData, Chapter, Stage1Data, Stage2Data, RevisionTaskType, CharacterProfile, TrendSparkUserQuery, TrendSparkAIResponse, TrendSparkConcept } from '../types';

const API_KEY_ENV = process.env.API_KEY;

if (!API_KEY_ENV) {
  console.warn("API_KEY environment variable not set. Gemini API calls may fail if no user key is provided.");
}

const getGeminiClient = (userProvidedApiKey?: string): GoogleGenAI => {
  const effectiveApiKey = userProvidedApiKey || API_KEY_ENV;
  if (!effectiveApiKey) {
    // console.warn("No API key available (neither user-provided nor environment). Gemini API calls will likely fail.");
    return new GoogleGenAI({ apiKey: "NO_VALID_KEY_FALLBACK" }); // Fallback to allow graceful failure if caught by caller
  }
  return new GoogleGenAI({ apiKey: effectiveApiKey });
};

const constructFoundationPrompt = (stage1: Stage1Data): string => {
  let prompt = "## Novel Foundation ##\n";
  prompt += `Core Idea: ${stage1.coreIdea}\n`;
  prompt += `Genre: ${stage1.genre}, Tone: ${stage1.tone}\n`;
  prompt += `Target Audience: ${stage1.targetAudience}\n`;
  prompt += `Theme: ${stage1.theme}\n`;
  prompt += `Logline: ${stage1.logline}\n\n`;
  prompt += "### Characters ###\n";
  stage1.characters.forEach(char => {
    prompt += `- ${char.name} (${char.role}): Wants ${char.want || 'N/A'}, Needs ${char.need || 'N/A'}, Flaw: ${char.flaw || 'N/A'}. Arc: ${char.arc || 'N/A'}\n`;
  });
  prompt += "\n### World ###\n";
  prompt += `Time/Place: ${stage1.worldBuilding.timeAndPlace}\n`;
  prompt += `Core Rules: ${stage1.worldBuilding.coreRules}\n`;
  return prompt;
};

const constructOutlinePrompt = (stage2: Stage2Data): string => {
  let prompt = "\n## Plot Outline Summary ##\n";
  prompt += "Act 1: Starts with protagonist in their stasis, an inciting incident occurs, they debate, and then hit Turning Point 1.\n";
  prompt += `  Inciting Incident Hint: ${stage2.act1.incitingIncident.substring(0,100)}...\n`;
  prompt += `  Midpoint Hint: ${stage2.act2.midpoint.substring(0,100)}...\n`;
  prompt += `  Climax Hint: ${stage2.act3.climax.substring(0,100)}...\n`;
  return prompt;
};


export const generateChapterContent = async (
  novelData: NovelData,
  chapterNumber: number,
  chapterPrompt: {
    povCharacter: string;
    coreGoal: string;
    keyPlotPoints: string;
    startingScene: string;
    endingScene: string;
    atmosphere: string;
    wordCount?: number;
  },
  userApiKey?: string
): Promise<string> => {
  const ai = getGeminiClient(userApiKey);
  const foundationContext = constructFoundationPrompt(novelData.stage1);
  const outlineContext = constructOutlinePrompt(novelData.stage2);
  const metaPromptChapterTemplate = META_PROMPT_SECTIONS.stage3;

  let fullPrompt = `You are a creative partner and writing assistant. Your task is to write a chapter for a novel.
Follow the user's instructions for the chapter carefully, maintaining consistency with the provided novel foundation and plot outline.

${foundationContext}
${outlineContext}

---
**${metaPromptChapterTemplate.instruction.replace('[Chapter Number]', String(chapterNumber))}**

*   ${metaPromptChapterTemplate.pov.replace('[e.g., Protagonist, or a specific supporting character]', chapterPrompt.povCharacter)}
*   ${metaPromptChapterTemplate.coreGoal.replace('[e.g., Introduce new character XX, reveal clue YY, build suspense, show protagonist\'s inner struggle]', chapterPrompt.coreGoal)}
*   ${metaPromptChapterTemplate.keyPlotPoints.replace('[List 1-3 essential events from the outline that must happen in this chapter]', chapterPrompt.keyPlotPoints)}
*   ${metaPromptChapterTemplate.startingScene.replace('[Briefly describe where the character is and what they are doing at the beginning of the chapter]', chapterPrompt.startingScene)}
*   ${metaPromptChapterTemplate.endingScene.replace('[How should this chapter end to make readers want to read the next one immediately?]', chapterPrompt.endingScene)}
*   ${metaPromptChapterTemplate.atmosphere.replace('[e.g., Sad, Tense, Mysterious, Warm]', chapterPrompt.atmosphere)}
*   ${chapterPrompt.wordCount ? metaPromptChapterTemplate.wordCount.replace('[e.g., approx 2000 words]', `Approx ${chapterPrompt.wordCount} words.`) : 'Word count is flexible, focus on quality.'}

Please begin writing Chapter ${chapterNumber}. Ensure the chapter flows well and contributes to the overall narrative.
---
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{role: "user", parts: [{text: fullPrompt}]}],
      config: {
        temperature: 0.7, 
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating chapter:", error);
    return `Error generating chapter: ${error instanceof Error ? error.message : String(error)}. Prompt (first 500 chars): ${fullPrompt.substring(0, 500)}...`;
  }
};


export const reviseTextWithAI = async (
  novelData: NovelData,
  taskType: RevisionTaskType,
  textToRevise: string,
  userApiKey?: string
): Promise<string> => {
  const ai = getGeminiClient(userApiKey);
  const foundationContext = constructFoundationPrompt(novelData.stage1);
  let taskInstruction = "";

  switch (taskType) {
    case RevisionTaskType.CONSISTENCY:
      taskInstruction = META_PROMPT_SECTIONS.stage4.taskConsistency.replace('[Paste the full text or multiple chapters you need to check here]', '');
      break;
    case RevisionTaskType.DESCRIPTION:
      taskInstruction = META_PROMPT_SECTIONS.stage4.taskDescription.replace('[Paste the paragraph you need to optimize here]', '');
      break;
    case RevisionTaskType.DIALOGUE:
      taskInstruction = META_PROMPT_SECTIONS.stage4.taskDialogue.replace('[Paste the dialogue snippet you need to optimize here]', '');
      break;
    case RevisionTaskType.PACING:
      taskInstruction = META_PROMPT_SECTIONS.stage4.taskPacing.replace('[Paste the chapter or paragraph whose pacing you need to adjust here]', '');
      break;
    default:
      return "Error: Unknown revision task.";
  }

  const fullPrompt = `You are a senior editor. Your task is to help revise a piece of writing based on the specific instruction below.
Consider the overall novel foundation provided for context.

${foundationContext}

---
**Revision Task: ${taskType}**
${taskInstruction}

**Text to Revise:**
\`\`\`
${textToRevise}
\`\`\`

Please provide your suggested revisions or feedback. If rewriting, present the improved text. If providing feedback, be specific and actionable.
---
`;
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{role: "user", parts: [{text: fullPrompt}]}],
       config: {
        temperature: 0.5, 
      }
    });
    return response.text;
  } catch (error) {
    console.error(`Error revising text for task ${taskType}:`, error);
    return `Error revising text: ${error instanceof Error ? error.message : String(error)}. Prompt (first 500 chars): ${fullPrompt.substring(0,500)}...`;
  }
};

export const autoFillStage1DataWithAI = async (
  userInput: string,
  currentData: Stage1Data,
  userApiKey?: string
): Promise<Partial<Stage1Data>> => {
  const ai = getGeminiClient(userApiKey);

  const characterFieldsForPrompt = Object.keys(META_PROMPT_SECTIONS.stage1.characterFields)
    .filter(key => !['antagonistMotivation', 'antagonistRelationship', 'supportingRole', 'supportingFunction', 'supportingBrief'].includes(key))
    .join(', ');


  const prompt = `You are an AI assistant helping a writer flesh out their novel ideas for Stage 1: Foundation & Ideation.
The user has provided the following high-level input: "${userInput}"

Considering the user's input and any existing data for Stage 1 (current data: ${JSON.stringify(currentData)}), please generate comprehensive suggestions for all fields in Stage 1.
Your goal is to fill in the details creatively to give the user a strong starting point.

Return your response as a single JSON object with the following structure. Be thorough:
{
  "coreIdea": "string (elaborate on user input or generate if vague)",
  "genre": "string (e.g., Sci-Fi, Fantasy, Mystery)",
  "tone": "string (e.g., Dark & Heavy, Light & Humorous, Epic)",
  "targetAudience": "string (e.g., Young Adult, Adult)",
  "theme": "string (e.g., Love & Sacrifice, Good vs Evil)",
  "logline": "string (compelling logline: When [inciting event], a [protagonist] must [action] or else [stakes])",
  "characters": [
    {
      "name": "string (Protagonist Name)",
      "role": "protagonist",
      "identity": "string (e.g., A disillusioned detective)",
      "appearance": "string",
      "personality": "string (e.g., ISTJ, cynical but fair)",
      "want": "string (Their main goal)",
      "need": "string (Their underlying need)",
      "flaw": "string (A significant weakness)",
      "backstory": "string (A brief, relevant backstory)",
      "arc": "string (How they might change)"
    },
    {
      "name": "string (Antagonist Name)",
      "role": "antagonist",
      "identity": "string (e.g., A shadowy corporation, a rival sorcerer)",
      "motivation": "string (Why they oppose the protagonist)",
      "relationshipToProtagonist": "string (Optional: how they are connected)"
    }
    // Optionally, you can suggest one key supporting character if it fits the user's input.
    // { "name": "string (Supporting Character Name)", "role": "supporting", "identity": "string", "functionInStory": "string", "briefDescription": "string" }
  ],
  "worldBuilding": {
    "timeAndPlace": "string (e.g., Neo-Tokyo, 2077; A medieval fantasy kingdom)",
    "coreRules": "string (e.g., Magic is real but fading; Only the rich have access to cybernetics)",
    "socialStructure": "string (e.g., Strict caste system; A fragile democracy)",
    "keyLocations": "string (e.g., The neon-lit Sector 7; The ancient Whispering Woods)"
  }
}

Ensure all fields are populated. If user input is very brief, be highly creative.
The character array should include at least one protagonist and one antagonist.
`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.75, // Allow for more creative generation
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr) as Partial<Stage1Data>;

    // Ensure characters have IDs if generated by AI
    if (parsedData.characters) {
      parsedData.characters = parsedData.characters.map((char, index) => ({
        ...char,
        id: char.id || `${Date.now()}_char_${index}`, // Assign a new ID if AI didn't provide one
      }));
    }

    return parsedData;

  } catch (error) {
    console.error("Error auto-filling Stage 1 data:", error);
    let errorMessage = `Error auto-filling data. ${error instanceof Error ? error.message : String(error)}.`;
    if (error instanceof SyntaxError) {
        errorMessage += " The AI may have returned an invalid JSON response."
    }
    throw new Error(errorMessage + ` Prompt (first 500 chars): ${prompt.substring(0,500)}...`);
  }
};

export const generateTrendSparkIdeas = async (
  userQuery: TrendSparkUserQuery,
  userApiKey?: string
): Promise<TrendSparkAIResponse> => {
  const ai = getGeminiClient(userApiKey);

  const prompt = `
You are an AI assistant specializing in analyzing novel trends and generating monetizable story concepts for popular web novel platforms.
The user has provided the following observed trends:
"${userQuery.trends}"

Based on these trends, generate 3-4 distinct novel concepts. Each concept should be designed for popular appeal and monetization potential (e.g., suitable for serialized release, strong hooks, clear progression).

Return your response as a single JSON object with the key "concepts". The value of "concepts" should be an array of objects, where each object represents a novel concept and has the following structure:
{
  "id": "string (a unique ID for this concept, e.g., 'concept-123')",
  "title": "string (a catchy and marketable novel title)",
  "blurb": "string (a concise 1-3 sentence premise/hook for the story)",
  "genreSuggestion": "string (suggest a primary genre, e.g., 'System Cultivation', 'Urban Fantasy Romance', 'LitRPG Regressor')",
  "targetAudiencePlatform": "string (suggest a target audience and/or platform, e.g., 'Young adult readers on WebNovel/RoyalRoad', 'Fans of fast-paced progression fantasy')",
  "sellingPoints": [
    "string (a key selling point or monetization angle, e.g., 'Clear power progression system')",
    "string (another key selling point, e.g., 'Strong romantic subplot with popular tropes')",
    "string (optional third selling point, e.g., 'Cliffhanger chapter endings suitable for serialization')"
  ]
}

Ensure the output is valid JSON. Be creative and focus on elements that contribute to reader engagement and potential for monetization on web novel platforms.
`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.8, // Higher temperature for more creative/diverse concepts
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    // Validate that the parsed data matches TrendSparkAIResponse structure
    const parsedData = JSON.parse(jsonStr) as TrendSparkAIResponse;
    if (!parsedData.concepts || !Array.isArray(parsedData.concepts)) {
        throw new Error("AI response is not in the expected format (missing 'concepts' array).");
    }
    // Optionally, add more detailed validation for each concept's structure here
    parsedData.concepts.forEach((concept, index) => {
        if (!concept.id) concept.id = `trend_concept_${Date.now()}_${index}`; // Ensure ID
    });


    return parsedData;

  } catch (error) {
    console.error("Error generating Trend Spark ideas:", error);
    let errorMessage = `Error generating Trend Spark ideas. ${error instanceof Error ? error.message : String(error)}.`;
    if (error instanceof SyntaxError || errorMessage.includes("expected format")) {
        errorMessage += " The AI may have returned an invalid or improperly structured JSON response."
    }
    throw new Error(errorMessage + ` Prompt (first 500 chars): ${prompt.substring(0,500)}...`);
  }
};