import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DatabaseTableDescription {
  id: string;
  name: string;
  description: string;
}

interface DatabaseTablesState {
  tableDescriptions: DatabaseTableDescription[];
  tablesGenerated: boolean;
  accordionValue: string;
  expandedTableId: string | null;
  lastGeneratedAppStructure: string | null;
}

const getInitialState = (): DatabaseTablesState => ({
  tableDescriptions: [],
  tablesGenerated: false,
  accordionValue: "",
  expandedTableId: null,
  lastGeneratedAppStructure: null,
});

interface DatabaseTablesStore extends DatabaseTablesState {
  setTableDescriptions: (tables: DatabaseTableDescription[]) => void;
  updateTableDescription: (
    tableId: string,
    updates: Partial<DatabaseTableDescription>
  ) => void;
  addTableDescription: (table: DatabaseTableDescription) => void;
  deleteTableDescription: (tableId: string) => void;
  setTablesGenerated: (generated: boolean) => void;
  setAccordionValue: (value: string) => void;
  setExpandedTableId: (id: string | null) => void;
  setLastGeneratedAppStructure: (content: string | null) => void;
  reset: () => void;
}

export const useDatabaseTablesStore = create<DatabaseTablesStore>()(
  persist(
    (set) => ({
      ...getInitialState(),

      setTableDescriptions: (tableDescriptions) => set({ tableDescriptions }),

      updateTableDescription: (tableId, updates) =>
        set((state) => ({
          tableDescriptions: state.tableDescriptions.map((t) =>
            t.id === tableId ? { ...t, ...updates } : t
          ),
        })),

      addTableDescription: (table) =>
        set((state) => ({
          tableDescriptions: [...state.tableDescriptions, table],
        })),

      deleteTableDescription: (tableId) =>
        set((state) => ({
          tableDescriptions: state.tableDescriptions.filter(
            (t) => t.id !== tableId
          ),
        })),

      setTablesGenerated: (tablesGenerated) => set({ tablesGenerated }),

      setAccordionValue: (accordionValue) => set({ accordionValue }),

      setExpandedTableId: (expandedTableId) => set({ expandedTableId }),

      setLastGeneratedAppStructure: (lastGeneratedAppStructure) =>
        set({ lastGeneratedAppStructure }),

      reset: () => set(getInitialState()),
    }),
    {
      name: "database-tables-store",
    }
  )
);
