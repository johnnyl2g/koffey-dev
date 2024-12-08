import axios from 'axios';
import type { ChatMessage, ChatCompletionResponse } from './types';
import { API_CONFIG } from './config';

class LMStudioService {
  private baseUrl = 'http://localhost:1234/v1';
  private retryAttempts = 3;
  private baseRetryDelay = 1000;

  private async makeRequest<T>(endpoint: string, data: any, attempt = 1): Promise<T> {
    try {
      const response = await axios.post(`${this.baseUrl}${endpoint}`, {
        ...data,
        ...API_CONFIG.MODEL_CONFIG
      }, {
        timeout: 60000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response structure');
      }

      return response.data;
    } catch (error: any) {
      if (attempt < this.retryAttempts) {
        const delay = Math.pow(2, attempt) * this.baseRetryDelay;
        console.log(`Attempt ${attempt} failed. Retrying after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.makeRequest(endpoint, data, attempt + 1);
      }
      throw new Error(`API Error: ${error.message}`);
    }
  }

  private validateMEDDPICInput(notes: Record<string, string>): Record<string, string> {
    const processed: Record<string, string> = {};
    const placeholders = {
      metrics: 'What metrics justify this purchase?',
      economicBuyer: 'Who has budget authority?',
      decisionCriteria: 'What criteria will be used to make the decision?',
      decisionProcess: 'What is the decision-making process?',
      paperProcess: 'What is the paper process?',
      identifyPain: 'What problems are we solving?',
      champion: 'Who is advocating for us internally?'
    };

    for (const [key, value] of Object.entries(notes)) {
      const isInvalid = 
        !value || 
        value.trim() === '' ||
        value === placeholders[key as keyof typeof placeholders] ||
        value.length < 10 ||
        !/[a-zA-Z]{3,}/.test(value); // Check for at least one 3-letter word

      processed[key] = isInvalid ? '[No valid information provided]' : value.trim();
    }

    return processed;
  }

  async analyzeMEDDPICNotes(notes: Record<string, string>): Promise<string> {
    const validatedNotes = this.validateMEDDPICInput(notes);
    
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a strict MEDDPIC sales methodology expert with extremely high standards. Follow these exact rating criteria:

POOR Rating (Automatic triggers - ANY of these result in POOR):
- Empty fields or "[No valid information provided]"
- Single word responses
- Gibberish or random characters
- Vague/generic statements without specifics
- Placeholder text left unchanged
- Content less than 2 meaningful sentences
- No quantifiable metrics or specific names/roles mentioned where required

FAIR Rating requirements (ALL must be met):
- At least 2-3 detailed sentences
- Specific names, titles, or roles mentioned where relevant
- Basic quantifiable metrics or criteria
- Clear process steps or timeline
- Demonstrates basic understanding of the component

GOOD Rating requirements (ALL must be met):
- 3+ detailed sentences with specific examples
- Multiple quantifiable metrics where relevant
- Names, titles, AND roles with clear relationships
- Comprehensive process documentation
- Clear evidence of thorough understanding
- Actionable details and next steps

You MUST be extremely strict in your ratings. When in doubt, assign a lower rating.
If you see "[No valid information provided]", you MUST rate it as POOR.
If you see gibberish or meaningless text, you MUST rate it as POOR.

For each component, use this exact format:

[COMPONENT NAME]:
Rating: [POOR/FAIR/GOOD]
Analysis: [Detailed explanation justifying the rating]
Recommendations: [Specific, actionable improvements needed]`
      },
      {
        role: 'user',
        content: `Analyze these MEDDPIC notes:

Metrics:
${validatedNotes.metrics}

Economic Buyer:
${validatedNotes.economicBuyer}

Decision Criteria:
${validatedNotes.decisionCriteria}

Decision Process:
${validatedNotes.decisionProcess}

Paper Process:
${validatedNotes.paperProcess}

Identify Pain:
${validatedNotes.identifyPain}

Champion:
${validatedNotes.champion}`
      }
    ];

    try {
      const response = await this.makeRequest<ChatCompletionResponse>('/chat/completions', {
        messages,
        temperature: 0.3, // Lower temperature for more consistent enforcement
        max_tokens: 2000,
        presence_penalty: 0.1, // Slight penalty to prevent repetitive language
        frequency_penalty: 0.1
      });

      let result = response.choices[0].message.content.trim();

      // Ensure POOR rating for invalid inputs
      Object.entries(validatedNotes).forEach(([key, value]) => {
        if (value === '[No valid information provided]') {
          const componentName = key.charAt(0).toUpperCase() + key.slice(1);
          const regex = new RegExp(`${componentName}:[\\s\\S]*?Rating: (POOR|FAIR|GOOD)`, 'i');
          result = result.replace(regex, `${componentName}:\nRating: POOR`);
        }
      });

      return result;

    } catch (error) {
      console.error('MEDDPIC analysis error:', error);
      throw error;
    }
  }

  // Role play method included for completeness
  async generateRolePlayResponse(
    personalityProfile: string,
    salesScenario: string,
    conversation: ChatMessage[],
    userInput: string
  ): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are role-playing as a customer with the following profile:
        ${personalityProfile}
        
        The sales scenario is:
        ${salesScenario}
        
        Respond naturally as this customer would, maintaining consistency with their personality and the scenario.`
      },
      ...conversation,
      { role: 'user', content: userInput }
    ];

    try {
      const response = await this.makeRequest<ChatCompletionResponse>('/chat/completions', {
        messages
      });
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Role play generation error:', error);
      throw error;
    }
  }
}

export const lmStudioService = new LMStudioService();




