import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type PromptName = "job-analysis" | "skills-extraction";

export interface PromptVariables {
  [key: string]: string;
}

const promptCache = new Map<PromptName, string>();

/**
 * Load a prompt template from file
 * @param promptName - Name of the prompt template to load
 * @returns The raw prompt template with placeholders
 */
export function loadPrompt(promptName: PromptName): string {
  // Check cache first
  if (promptCache.has(promptName)) {
    return promptCache.get(promptName)!;
  }

  try {
    const promptPath = join(__dirname, `${promptName}.prompt.txt`);
    const promptTemplate = readFileSync(promptPath, "utf-8");

    // Cache the template
    promptCache.set(promptName, promptTemplate);

    return promptTemplate;
  } catch (error) {
    throw new Error(
      `Failed to load prompt template "${promptName}": ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Fill a prompt template with actual values
 * @param template - The prompt template with placeholders
 * @param variables - Object containing variable names and their values
 * @returns The filled prompt ready to send to the LLM
 */
export function fillPrompt(
  template: string,
  variables: PromptVariables
): string {
  let filledPrompt = template;

  // Replace all placeholders with actual values
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    filledPrompt = filledPrompt.replace(new RegExp(placeholder, "g"), value);
  }

  // Check for any remaining unfilled placeholders
  const remainingPlaceholders = filledPrompt.match(/\{\{[^}]+\}\}/g);
  if (remainingPlaceholders) {
    console.warn(
      `Warning: Unfilled placeholders found in prompt: ${remainingPlaceholders.join(
        ", "
      )}`
    );
  }

  return filledPrompt;
}

/**
 * Convenience function to load and fill a prompt in one call
 * @param promptName - Name of the prompt template to load
 * @param variables - Object containing variable names and their values
 * @returns The filled prompt ready to send to the LLM
 */
export function getPrompt(
  promptName: PromptName,
  variables: PromptVariables
): string {
  const template = loadPrompt(promptName);
  return fillPrompt(template, variables);
}
