// OpenAI GPT API Integration
export class GPTAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
  }

  async generateContent(prompt, contentType = 'essay', vibeMode = 'classic') {
    try {
      const systemPrompt = this.buildSystemPrompt(contentType, vibeMode);
      const userPrompt = this.buildUserPrompt(prompt, contentType);

      console.log('GPT API Request:', { contentType, vibeMode, prompt: prompt.substring(0, 100) + '...' });

      // Try GPT-4 first, fallback to GPT-3.5-turbo if needed
      const model = this.apiKey.includes('gpt-4') ? 'gpt-4' : 'gpt-3.5-turbo';

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: model,
          max_tokens: 4000,
          temperature: 0.7,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API Error: ${response.status} ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || 'No content generated';

      return {
        success: true,
        content,
        metadata: {
          model: data.model,
          usage: data.usage,
          contentType,
          vibeMode,
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('GPT API Error:', error);
      return {
        success: false,
        error: error.message,
        content: null
      };
    }
  }

  buildSystemPrompt(contentType, vibeMode) {
    const vibeInstructions = {
      classic: 'You are a professional student assistant. Write in a scholarly, well-structured manner with proper academic tone and formatting.',
      lazy: 'You are a smart but casual student assistant. Write efficiently while maintaining quality, but in a more relaxed and conversational tone that still meets academic standards.'
    };

    const contentInstructions = {
      essay: 'Write a comprehensive essay with proper introduction, body paragraphs, and conclusion. Include relevant examples and analysis.',
      discussion: 'Write a thoughtful discussion post that engages with the topic and invites further discussion from classmates.',
      email: 'Write a professional and respectful email to a professor. Be clear, concise, and appropriately formal.',
      studyguide: 'Create a comprehensive study guide with key concepts, important terms, and practice questions.',
      assignment: 'Complete the assignment following all specified requirements and guidelines.'
    };

    return `You are a professional AI homework assistant. ${vibeInstructions[vibeMode] || vibeInstructions.classic}

${contentInstructions[contentType] || contentInstructions.assignment}

Guidelines:
- Follow academic integrity standards
- Cite sources when appropriate (use placeholder citations if specific sources aren't provided)
- Structure content clearly with proper formatting
- Aim for the appropriate length based on the assignment requirements
- Use proper grammar and academic language
- Include specific examples and analysis when relevant`;
  }

  buildUserPrompt(prompt, contentType) {
    const contentTypeLabels = {
      essay: 'essay',
      discussion: 'discussion post',
      email: 'email to professor',
      studyguide: 'study guide',
      assignment: 'assignment response'
    };

    const label = contentTypeLabels[contentType] || 'assignment response';

    return `Help with the following prompt: Please write a ${label} based on the following:

${prompt}

Please provide a well-structured, high-quality response that fully addresses the requirements.`;
  }

  async testConnection() {
    try {
      // Test with a simple prompt
      const result = await this.generateContent(
        'Write a brief test response to confirm the API is working.',
        'assignment',
        'classic'
      );
      
      if (result.success && result.content.length > 10) {
        return { success: true, message: 'OpenAI GPT API connection successful' };
      } else {
        return { success: false, error: 'Unexpected response from GPT API' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Generate specific content types
  async generateEssay(prompt, vibeMode = 'classic') {
    return this.generateContent(prompt, 'essay', vibeMode);
  }

  async generateDiscussionPost(prompt, vibeMode = 'classic') {
    return this.generateContent(prompt, 'discussion', vibeMode);
  }

  async generateEmail(prompt, vibeMode = 'classic') {
    return this.generateContent(prompt, 'email', vibeMode);
  }

  async generateStudyGuide(prompt, vibeMode = 'classic') {
    return this.generateContent(prompt, 'studyguide', vibeMode);
  }
}

// Helper function to create GPT API instance
export const createGPTAPI = (apiKey) => {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }
  return new GPTAPI(apiKey);
};

// Content type helpers (same as Claude for compatibility)
export const CONTENT_TYPES = {
  ESSAY: 'essay',
  DISCUSSION: 'discussion',
  EMAIL: 'email',
  STUDY_GUIDE: 'studyguide',
  ASSIGNMENT: 'assignment'
};

export const VIBE_MODES = {
  CLASSIC: 'classic',
  LAZY: 'lazy'
}; 