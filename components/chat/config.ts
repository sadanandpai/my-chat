import type { ChatCopy, ChatPersona } from "./types";

export const chatApiRoute = "/api/chat";

export const chatPersona: ChatPersona = {
  name: "Sadanand Pai",
  tagline: "Frontend engineer",
  initials: "SP",
};

export const chatCopy: ChatCopy = {
  placeholder: "Message Sadanand...",
  emptyTitle: "Hey, I'm Sadanand",
  emptySubtitle:
    "Ask me about my work, projects, professional experience, or skills.",
};
