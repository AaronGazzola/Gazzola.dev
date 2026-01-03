import { create } from "zustand";
import { persist } from "zustand/middleware";
import { InferredFeature } from "./AppStructure.types";

interface ParsedPage {
  id: string;
  name: string;
  route: string;
  description: string;
}

interface AppStructureState {
  inferredFeatures: Record<string, InferredFeature[]>;
  parsedPages: ParsedPage[];
  featuresGenerated: boolean;
  accordionValue: string;
  expandedPageId: string | null;
  lastGeneratedReadmeContent: string | null;
}

const getInitialState = (): AppStructureState => ({
  inferredFeatures: {},
  parsedPages: [],
  featuresGenerated: false,
  accordionValue: "",
  expandedPageId: null,
  lastGeneratedReadmeContent: null,
});

interface AppStructureStore extends AppStructureState {
  setInferredFeatures: (features: Record<string, InferredFeature[]>) => void;
  updateFeature: (featureId: string, updates: Partial<InferredFeature>) => void;
  setParsedPages: (pages: ParsedPage[]) => void;
  setFeaturesGenerated: (generated: boolean) => void;
  setAccordionValue: (value: string) => void;
  setExpandedPageId: (id: string | null) => void;
  setLastGeneratedReadmeContent: (content: string | null) => void;
  reset: () => void;
}

export const useAppStructureStore = create<AppStructureStore>()(
  persist(
    (set) => ({
      ...getInitialState(),

      setInferredFeatures: (inferredFeatures) => set({ inferredFeatures }),

      updateFeature: (featureId, updates) =>
        set((state) => {
          const updated = { ...state.inferredFeatures };
          Object.entries(updated).forEach(([pageId, features]) => {
            updated[pageId] = features.map((f) =>
              f.id === featureId ? { ...f, ...updates } : f
            );
          });
          return { inferredFeatures: updated };
        }),

      setParsedPages: (parsedPages) => set({ parsedPages }),

      setFeaturesGenerated: (featuresGenerated) => set({ featuresGenerated }),

      setAccordionValue: (accordionValue) => set({ accordionValue }),

      setExpandedPageId: (expandedPageId) => set({ expandedPageId }),

      setLastGeneratedReadmeContent: (lastGeneratedReadmeContent) => set({ lastGeneratedReadmeContent }),

      reset: () => set(getInitialState()),
    }),
    {
      name: "app-structure-store",
    }
  )
);
