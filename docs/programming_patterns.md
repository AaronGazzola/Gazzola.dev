# Programming rules:

- Don't use include any comments aside from the filepath comment on the first line of each file. Remove any other existing comments unless otherwise specified.
- Use shadcn component with tailwind styling. Import "cn" from "@/lib/utils" to concatinate classes.
- If console.logs are requested, then stringify all object, arrays and other primitives into concise text-only logs.
- Don't include error or loading data in the store. Error and loading data are managed by the react-query hooks.

# File Organization and Naming Conventions

- **Components**: `Component.tsx`
- **Hooks**: `Component.hooks.tsx` (located in the same directory as the consuming component)
- **Actions**: `Component.actions.ts` (located in the same directory as the consuming component)
- **Types**: `Component.types.ts` or `page.types.ts` or `layout.types.ts` (defined in the directory with the common ancestor component)
- **Store**: `Component.store.ts` or `page.store.ts` or `layout.store.ts` (defined in the directory with the common ancestor component)

All descendant components should import types from the ancestor types file and manage context data in the ancestor store file.

# Types file example:

```typescript
import {
  EntityStatus,
  Entity as PrismaEntity,
  EntityMetadata as PrismaEntityMetadata,
  RelatedItem as PrismaRelatedItem,
} from "@/lib/prisma-client";

export type Entity = PrismaEntity;
export type RelatedItem = PrismaRelatedItem;
export type EntityMetadata = PrismaEntityMetadata;

export interface EntityInsert
  extends Omit<PrismaEntity, "id" | "createdAt" | "updatedAt"> {}

export interface EntityUpdate
  extends Partial<Omit<PrismaEntity, "createdAt" | "updatedAt">> {
  id: string;
}

export interface EntityWithRelations extends Entity {
  related_items: RelatedItem[];
  metadata: EntityMetadata | null;
}

export interface GetEntitiesParams {
  searchTerm?: string;
  status?: EntityStatus[];
}

export interface AppState {
  user: User | null;
  profile: Profile | null;
  entities: EntityWithRelations[];
  selectedEntity: EntityWithRelations | null;
  filters: GetEntitiesParams;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setEntities: (entities: EntityWithRelations[]) => void;
  setSelectedEntity: (selectedEntity: EntityWithRelations | null) => void;
  setFilters: (filters: GetEntitiesParams) => void;
  reset: () => void;
}
```

# Store file example:

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppState } from "@/types/app.types";

const initialState = {
  user: null,
  profile: null,
  entities: [],
  selectedEntity: null,
  filters: {
    searchTerm: "",
    status: [],
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setEntities: (entities) => set({ entities: entities ?? [] }),
      setSelectedEntity: (selectedEntity) => set({ selectedEntity }),
      setFilters: (filters) => set({ filters }),
      reset: () => set(initialState),
    }),
    {
      name: "app-store",
    }
  )
);
```

# Action utils file:

```typescript
export interface ActionResponse<T> {
  data?: T | null;
  error?: string | null;
}

export const getActionResponse = <T>({
  data,
  error,
}: {
  data?: T | null;
  error?: unknown;
}): ActionResponse<T> => {
  if (error) {
    const errorMessage =
      error instanceof Error
        ? error?.message
        : error?.toString() || "An unknown action error occurred";
    console.error("Action error:", errorMessage);
    return { data: null, error: errorMessage };
  }
  return { data: data ?? null, error: null };
};

export async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
}
```

# Actions file example:

```typescript
"use server";

import { headers } from "next/headers";
import {
  ActionResponse,
  getActionResponse,
  getAuthenticatedUser,
} from "@/lib/action.utils";
import {
  Entity,
  GetEntitiesParams,
  EntityWithRelations,
  EntityUpdate,
} from "@/types/entity.types";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma-client";

export const getEntitiesAction = async (
  params: GetEntitiesParams
): Promise<ActionResponse<EntityWithRelations[]>> => {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return getActionResponse({ error: "Unauthorized" });
    }

    const whereClause = params.searchTerm
      ? {
          name: {
            contains: params.searchTerm,
            mode: "insensitive" as const,
          },
        }
      : {};

    const data = await prisma.entity.findMany({
      where: whereClause,
      include: {
        related_items: true,
        metadata: true,
      },
    });

    return getActionResponse({ data });
  } catch (error) {
    return getActionResponse({ error });
  }
};

export const createEntityAction = async (
  entityData: Omit<Entity, "id" | "createdAt" | "updatedAt">
): Promise<ActionResponse<EntityWithRelations[]>> => {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return getActionResponse({ error: "Unauthorized" });
    }

    await prisma.entity.create({
      data: entityData,
    });

    const updatedEntities = await prisma.entity.findMany({
      include: {
        related_items: true,
        metadata: true,
      },
    });

    return getActionResponse({ data: updatedEntities });
  } catch (error) {
    return getActionResponse({ error });
  }
};

export const updateEntityAction = async (
  entityData: EntityUpdate
): Promise<ActionResponse<EntityWithRelations[]>> => {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return getActionResponse({ error: "Unauthorized" });
    }

    const { id, ...updateData } = entityData;

    await prisma.entity.update({
      where: { id },
      data: updateData,
    });

    const updatedEntities = await prisma.entity.findMany({
      include: {
        related_items: true,
        metadata: true,
      },
    });

    return getActionResponse({ data: updatedEntities });
  } catch (error) {
    return getActionResponse({ error });
  }
};

export const deleteEntityAction = async (
  id: string
): Promise<ActionResponse<Entity>> => {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return getActionResponse({ error: "Unauthorized" });
    }

    const data = await prisma.entity.delete({
      where: { id },
    });

    return getActionResponse({ data });
  } catch (error) {
    return getActionResponse({ error });
  }
};
```

# Hooks file example

```typescript
"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/stores/app.store";
import { Toast } from "@/components/shared/Toast";
import { DataCyAttributes } from "@/types/cypress.types";
import {
 Entity,
 EntityInsert,
 EntityUpdate,
 EntityWithRelations,
} from "@/types/entity.types";
import {
 createEntityAction,
 deleteEntityAction,
 getEntitiesAction,
 updateEntityAction,
} from "@/actions/entity.actions";

export const useGetEntities = () => {
  const { filters, setEntities } = useAppStore();
  return useQuery({
    queryKey: ["entities", filters],
    queryFn: async () => {
      const { data, error } = await getEntitiesAction(filters);
      if (error) throw new Error(error);
      if (data) {
        setEntities(data);
      }
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateEntity = () => {
  const { setEntities } = useAppStore();
  return useMutation({
    mutationFn: async (formData: EntityInsert) => {
      const { data, error } = await createEntityAction(formData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        setEntities(data);
      }
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Entity successfully created"
          data-cy={DataCyAttributes.SUCCESS_ENTITY_CREATE}
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error}
          data-cy={DataCyAttributes.ERROR_ENTITY_CREATE}
        />
      ));
    },
  });
};

export const useUpdateEntityOptimistic = () => {
  const { entities, setEntities } = useAppStore();
  const [originalEntities, setOriginalEntities] = useState<
    EntityWithRelations[]
  >([]);
  return useMutation({
    mutationFn: async (updateData: EntityUpdate) => {
      setOriginalEntities(entities);
      const optimisticEntities = entities.map((entity) =>
        entity.id === updateData.id ? { ...entity, ...updateData } : entity
      );
      setEntities(optimisticEntities);
      const { data, error } = await updateEntityAction(updateData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        setEntities(data);
      }
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Entity updated successfully"
          data-cy={DataCyAttributes.SUCCESS_ENTITY_UPDATE}
        />
      ));
    },
    onError: (error) => {
      setEntities(originalEntities);
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to update entity"}
          data-cy={DataCyAttributes.ERROR_ENTITY_UPDATE}
        />
      ));
    },
  });
};

export const useDeleteEntity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await deleteEntityAction(id);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entities"] });
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Entity deleted successfully"
          data-cy={DataCyAttributes.SUCCESS_ENTITY_DELETE}
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Error"
          message={error.message || "Failed to delete entity"}
          data-cy={DataCyAttributes.ERROR_ENTITY_DELETE}
        />
      ));
    },
  });
};

```
