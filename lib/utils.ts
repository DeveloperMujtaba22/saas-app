import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { subjectsColors } from "@/constants"
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSubjectColor = (subject: string) => {
    return subjectsColors[subject as keyof typeof subjectsColors] 
}

export const formUrlQuery = ({ params, key, value }: {
  params: string;
  key: string;
  value: string | null;
}) => {
  const currentUrl = new URLSearchParams(params);
  
  if (value) {
    currentUrl.set(key, value);
  } else {
    currentUrl.delete(key);
  }
  
  return `?${currentUrl.toString()}`;
};

export const removeKeysFromQuery = ({ params, keysToRemove }: {
  params: string;
  keysToRemove: string[];
}) => {
  const currentUrl = new URLSearchParams(params);
  
  keysToRemove.forEach((key) => {
    currentUrl.delete(key);
  });
  
  return `?${currentUrl.toString()}`;
};

// Create Vapi Assistant Configuration
export const createVapiAssistant = (
  topic: string, 
  subject: string, 
  style: string
): CreateAssistantDTO => {
  const vapiAssistant: CreateAssistantDTO = {
    name: "Companion",
    
    firstMessage: `Hello, let's start the session. Today we'll be talking about ${topic}`,
    
    // Speech-to-Text Configuration
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en",
    },
    
    // Text-to-Speech Configuration
    voice: {
      provider: "11labs",
      voiceId: "21m00Tcm4TlvDq8ikWAM",
      stability: 0.4,
      similarityBoost: 0.6,
      style: 0.0,
      useSpeakerBoost: true,
    },
    
    // AI Model Configuration
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a highly knowledgeable tutor teaching a real-time workshop.

Tutor Guidelines:
- Stick to the given topic: ${topic} and subject: ${subject}
- Keep the conversation flowing smoothly while maintaining context
- From time to time make sure that the student is following you
- Break down the topic into smaller parts and teach the student step by step
- Keep your style of conversation ${style}
- Keep your responses short, like in a real voice conversation
- Do not include any special characters in your responses - no asterisks, emojis, or markdown
- Ask questions to check understanding
- Provide examples and analogies when explaining concepts
- Be patient and encouraging
- If the student seems confused, explain in a different way`,
        }
      ],
    },
  } as CreateAssistantDTO;
  
  return vapiAssistant;
};

// Optional: Export interface for message tracking
export interface VapiMessageHistory {
  clientMessages: any[];
  serverMessages: any[];
}

// Voice configurations for different voice types and styles
export const voices = {
  male: { casual: "2BJW5coyhAzSr8STdHbE", formal: "c6SfcYrb2t09NHXiT80T" },
  female: { casual: "ZIlrSGI4jZqobxRKprJz", formal: "sarah" },
};

// Configure assistant with voice settings
export const configureAssistant = (
  voice: string,
  style: string,
  topic: string,
  subject: string
): CreateAssistantDTO => {
  // Get the voice ID based on voice type and style
  const voiceId = voices[voice as keyof typeof voices]?.[style as keyof typeof voices.male] || "sarah";

  const assistantConfig: CreateAssistantDTO = {
    name: "Companion",
    
    firstMessage: `Hello, let's start the session. Today we'll be talking about ${topic}`,
    
    // Speech-to-Text Configuration
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en",
    },
    
    // Text-to-Speech Configuration
    voice: {
      provider: "11labs",
      voiceId: voiceId,
      stability: 0.4,
      similarityBoost: 0.6,
      speed: 1,
      style: 0.0,
      useSpeakerBoost: true,
    },
    
    // AI Model Configuration
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a highly knowledgeable tutor teaching a real-time workshop.

Tutor Guidelines:
- Stick to the given topic: ${topic} and subject: ${subject}
- Keep the conversation flowing smoothly while maintaining context
- From time to time make sure that the student is following you
- Break down the topic into smaller parts and teach the student step by step
- Keep your style of conversation ${style}
- Keep your responses short, like in a real voice conversation
- Do not include any special characters in your responses - no asterisks, emojis, or markdown
- Ask questions to check understanding
- Provide examples and analogies when explaining concepts
- Be patient and encouraging
- If the student seems confused, explain in a different way`,
        }
      ],
    },
  } as CreateAssistantDTO;
  
  return assistantConfig;
};