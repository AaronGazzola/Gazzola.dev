import { FileSystemEntry } from "@/app/(editor)/layout.types";

export type UserExperienceFileType = "stores" | "hooks" | "actions" | "types";

export interface Feature {
  id: string;
  title: string;
  description: string;
  fileTypes: Record<UserExperienceFileType, boolean>;
  isEditing: boolean;
}

export interface UserExperienceFile extends FileSystemEntry {
  utilityFiles?: UserExperienceFileType[];
  isUtilityFile?: boolean;
  parentFileId?: string;
}

export interface UserExperienceState {
  selectedFilePath: string | null;
  selectedFileId: string | null;
  userExperienceFiles: Record<string, UserExperienceFileType[]>;
  features: Record<string, Feature[]>;
  setSelectedFile: (filePath: string | null, fileId: string | null) => void;
  addUtilityFile: (parentFileId: string, parentFileName: string, fileType: UserExperienceFileType) => void;
  getUtilityFiles: (fileId: string) => UserExperienceFileType[];
  clearSelection: () => void;
  addFeature: (fileId: string) => void;
  updateFeature: (fileId: string, featureId: string, updates: Partial<Feature>) => void;
  removeFeature: (fileId: string, featureId: string) => void;
  getFeatures: (fileId: string) => Feature[];
}
