// file path: types/chat.types.ts
export interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title?: string;
  participants: string[];
  messages: Message[];
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
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
  files: FileUpload[];
  selectedConversationId: string | null;
  setConversations: (conversations: Conversation[]) => void;
  setFiles: (files: FileUpload[]) => void;
  setSelectedConversationId: (id: string | null) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (
    conversationId: string,
    updates: Partial<Conversation>
  ) => void;
  removeConversation: (conversationId: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (
    conversationId: string,
    messageId: string,
    updates: Partial<Message>
  ) => void;
  removeMessage: (conversationId: string, messageId: string) => void;
  addFile: (file: FileUpload) => void;
  removeFile: (fileId: string) => void;
  getConversationById: (conversationId: string) => Conversation | null;
  getUserConversations: (userId: string) => Conversation[];
  getMessageFiles: (messageId: string) => FileUpload[];
  reset: () => void;
}
