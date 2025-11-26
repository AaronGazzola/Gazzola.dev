"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/editor/ui/select";
import { Lock } from "lucide-react";
import { useDatabaseStore } from "./DatabaseConfiguration.stores";
import type { PrismaTable, RLSPolicy, UserRole, RLSAccessType } from "./DatabaseConfiguration.types";

export const TableRLSContent = ({ table }: { table: PrismaTable }) => {
  const { addOrUpdateRLSPolicy, getRLSPolicyForOperation, tables } =
    useDatabaseStore();
  const { initialConfiguration } = useEditorStore();

  const authProvider = !initialConfiguration.technologies.betterAuth
    ? "Supabase"
    : "Better Auth";
  const isAuthSchema =
    table.schema === "auth" || table.schema === "better_auth";

  const enabledRoles: UserRole[] = [
    "user",
  ];
  if (initialConfiguration.features.admin.admin) enabledRoles.push("admin");
  if (initialConfiguration.features.admin.superAdmin)
    enabledRoles.push("super-admin");
  if (initialConfiguration.features.admin.organizations) {
    enabledRoles.push("org-admin", "org-member");
  }

  const operations: RLSPolicy["operation"][] =
    ["INSERT", "SELECT", "UPDATE", "DELETE"];

  const availableTables = tables.filter((t) => t.id !== table.id);

  if (isAuthSchema) {
    return (
      <div className="flex flex-col theme-p-4 theme-gap-2">
        <div className="flex items-center theme-gap-2 theme-text-muted-foreground">
          <Lock className="h-4 w-4" />
          <p className="text-base font-semibold theme-font-sans theme-tracking">
            All auth schema security is handled by {authProvider}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-stretch theme-gap-3 theme-p-4">
      {operations.map((operation) => {
        const policy = getRLSPolicyForOperation(table.id, operation);

        return (
          <div
            key={operation}
            className="theme-bg-muted theme-radius theme-p-3"
          >
            <h4 className="text-base font-semibold theme-text-foreground theme-mb-2 theme-font-sans theme-tracking">
              {operation}
            </h4>
            <div className="flex flex-col items-stretch theme-gap-2">
              {enabledRoles.map((role) => {
                const rolePolicy = policy?.rolePolicies?.find(
                  (rp) => rp.role === role
                );
                const accessType = rolePolicy?.accessType || "global";
                const relatedTable = rolePolicy?.relatedTable;

                return (
                  <div key={role} className="flex flex-col theme-gap-2">
                    <div className="flex items-center theme-gap-2">
                      <span className="text-sm theme-text-foreground theme-font-mono min-w-[6rem]">
                        {role}
                      </span>
                      <Select
                        value={accessType}
                        onValueChange={(value) => {
                          if (
                            value === "global" ||
                            value === "own" ||
                            value === "organization"
                          ) {
                            addOrUpdateRLSPolicy(
                              table.id,
                              operation,
                              role,
                              value as RLSAccessType
                            );
                          } else if (value === "related") {
                            addOrUpdateRLSPolicy(
                              table.id,
                              operation,
                              role,
                              "related",
                              availableTables[0]?.name
                            );
                          }
                        }}
                      >
                        <SelectTrigger className="h-7 text-sm flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="global">Global</SelectItem>
                          <SelectItem value="own">Own data</SelectItem>
                          {initialConfiguration.features.admin
                            .organizations && (
                            <SelectItem value="organization">
                              Organization
                            </SelectItem>
                          )}
                          <SelectItem value="related">Related</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {accessType === "related" && (
                      <div className="flex items-center theme-gap-2">
                        <span className="text-sm theme-text-muted-foreground theme-font-mono min-w-[6rem]">
                          Related to:
                        </span>
                        <Select
                          value={relatedTable || ""}
                          onValueChange={(tableName) => {
                            addOrUpdateRLSPolicy(
                              table.id,
                              operation,
                              role,
                              "related",
                              tableName
                            );
                          }}
                        >
                          <SelectTrigger className="h-7 text-sm flex-1">
                            <SelectValue placeholder="Select table" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTables.map((t) => (
                              <SelectItem key={t.id} value={t.name}>
                                {t.schema}.{t.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
