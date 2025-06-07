//-| filepath: types/chat.types.ts
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

export interface FileUpload {
  id: string;
  messageId: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

export interface ChatState {
  conversations: Conversation[];
  messages: Message[];
  files: FileUpload[];
  selectedConversationId: string | null;
  expandedGroups: string[];
  setConversations: (conversations: Conversation[]) => void;
  setMessages: (messages: Message[]) => void;
  setFiles: (files: FileUpload[]) => void;
  setSelectedConversationId: (id: string | null) => void;
  setExpandedGroups: (groups: string[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (
    conversationId: string,
    updates: Partial<Conversation>
  ) => void;
  removeConversation: (conversationId: string) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  removeMessage: (messageId: string) => void;
  addFile: (file: FileUpload) => void;
  removeFile: (fileId: string) => void;
  getConversationMessages: (conversationId: string) => Message[];
  getConversationById: (conversationId: string) => Conversation | null;
  getUserConversations: (userId: string) => Conversation[];
  getMessageFiles: (messageId: string) => FileUpload[];
  reset: () => void;
}
