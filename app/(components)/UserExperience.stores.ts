import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Feature, UserExperienceFileType, UserExperienceState } from "./UserExperience.types";

const generateId = () => Math.random().toString(36).substring(2, 11);

export const useUserExperienceStore = create<UserExperienceState>()(
  persist(
    (set, get) => ({
      selectedFilePath: null,
      selectedFileId: null,
      userExperienceFiles: {},
      features: {},
      setSelectedFile: (filePath, fileId) => {
        set({ selectedFilePath: filePath, selectedFileId: fileId });
      },
      addUtilityFile: (parentFileId, parentFileName, fileType) => {
        set((state) => {
          const existing = state.userExperienceFiles[parentFileId] || [];
          if (existing.includes(fileType)) {
            return state;
          }
          return {
            userExperienceFiles: {
              ...state.userExperienceFiles,
              [parentFileId]: [...existing, fileType],
            },
          };
        });
      },
      getUtilityFiles: (fileId) => {
        const state = get();
        return state.userExperienceFiles[fileId] || [];
      },
      clearSelection: () => {
        set({ selectedFilePath: null, selectedFileId: null });
      },
      addFeature: (fileId) => {
        set((state) => {
          const existingFeatures = state.features[fileId] || [];
          const utilityFiles = state.userExperienceFiles[fileId] || [];
          const defaultFileTypes = utilityFiles.reduce((acc, fileType) => {
            acc[fileType] = true;
            return acc;
          }, {} as Record<UserExperienceFileType, boolean>);

          const newFeature: Feature = {
            id: generateId(),
            title: "",
            description: "",
            fileTypes: defaultFileTypes,
            isEditing: true,
          };

          return {
            features: {
              ...state.features,
              [fileId]: [...existingFeatures, newFeature],
            },
          };
        });
      },
      updateFeature: (fileId, featureId, updates) => {
        set((state) => {
          const features = state.features[fileId] || [];
          return {
            features: {
              ...state.features,
              [fileId]: features.map((feature) =>
                feature.id === featureId ? { ...feature, ...updates } : feature
              ),
            },
          };
        });
      },
      removeFeature: (fileId, featureId) => {
        set((state) => {
          const features = state.features[fileId] || [];
          return {
            features: {
              ...state.features,
              [fileId]: features.filter((feature) => feature.id !== featureId),
            },
          };
        });
      },
      getFeatures: (fileId) => {
        const state = get();
        return state.features[fileId] || [];
      },
    }),
    {
      name: "user-experience-storage",
      version: 2,
    }
  )
);
