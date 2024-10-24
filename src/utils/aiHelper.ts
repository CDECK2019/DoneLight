import Anthropic from 'anthropic';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
});

export async function generateSubtasks(taskDescription: string): Promise<string[]> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Break down this task into 3-5 specific, actionable subtasks: "${taskDescription}". 
        Respond with ONLY an array of subtask descriptions, nothing else.
        Example: ["Research competitor pricing", "Create initial mockups", "Write product description"]`
      }],
    });

    const content = message.content[0].text;
    try {
      return JSON.parse(content);
    } catch {
      // If parsing fails, split by newlines and clean up
      return content
        .split('\n')
        .map(line => line.replace(/^[-*\d.)\s]+/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 5);
    }
  } catch (error) {
    console.error('Error generating subtasks:', error);
    throw error;
  }
}