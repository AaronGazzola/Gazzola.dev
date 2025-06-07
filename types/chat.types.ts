//-\ filepath: types/chat.types.ts
export interface Conversation {
  id: string;
  title?: string;
  participants: string[];
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface ChatState {
  conversations: Conversation[];
  messages: Message[];
  selectedConversationId: string | null;
  expandedGroups: string[];
  isLoading: boolean;

  setConversations: (conversations: Conversation[]) => void;
  setMessages: (messages: Message[]) => void;
  setSelectedConversationId: (id: string | null) => void;
  setExpandedGroups: (groups: string[]) => void;
  setLoading: (isLoading: boolean) => void;

  addConversation: (conversation: Conversation) => void;
  updateConversation: (
    conversationId: string,
    updates: Partial<Conversation>
  ) => void;
  removeConversation: (conversationId: string) => void;

  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  removeMessage: (messageId: string) => void;

  getConversationMessages: (conversationId: string) => Message[];
  getConversationById: (conversationId: string) => Conversation | null;
  getUserConversations: (userId: string) => Conversation[];

  reset: () => void;
}
