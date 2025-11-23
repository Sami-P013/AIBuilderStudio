import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function generateCode(prompt: string, projectType: string): Promise<string> {
  if (!openai) {
    throw new Error("OpenAI API key is not configured. Please add your OPENAI_API_KEY to use AI code generation.");
  }

  try {
    const systemPrompt = getSystemPrompt(projectType);
    
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_completion_tokens: 4096,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate code. Please check your API key and try again.");
  }
}

function getSystemPrompt(projectType: string): string {
  const basePrompt = "You are an expert web developer. Generate clean, modern, and fully functional code based on the user's requirements. ";
  
  switch (projectType) {
    case "website":
      return basePrompt + "Create a complete, responsive HTML file with inline CSS and JavaScript. Make it visually appealing with modern design principles. Include all necessary HTML structure, styling, and interactivity in a single file.";
    
    case "webapp":
      return basePrompt + "Create a functional web application with HTML, CSS, and JavaScript in a single file. Include proper state management, event handling, and a clean UI. Make it interactive and user-friendly.";
    
    case "chatbot":
      return basePrompt + "Create a chatbot interface with HTML, CSS, and JavaScript in a single file. Include a message display area, input field, and basic conversation logic. Make it visually appealing and easy to use.";
    
    case "ai-agent":
      return basePrompt + "Create an AI agent interface with HTML, CSS, and JavaScript in a single file. Include input/output areas, status indicators, and a clean workflow. Make it professional and intuitive.";
    
    default:
      return basePrompt + "Create a complete HTML file with inline CSS and JavaScript that fulfills the user's requirements.";
  }
}
