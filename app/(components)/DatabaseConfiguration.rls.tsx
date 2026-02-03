"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/editor/ui/select";
import { Lock } from "lucide-react";
import { useDatabaseStore } from "./DatabaseConfiguration.stores";
import type {
  DatabaseTable,
  RLSAccessType,
  RLSPolicy,
  UserRole,
} from "./DatabaseConfiguration.types";

export const TableRLSContent = ({ table }: { table: DatabaseTable }) => {
  const { addOrUpdateRLSPolicy, getRLSPolicyForOperation, tables } =
    useDatabaseStore();

  const authProvider = "Supabase";
  const isAuthSchema = table.schema === "auth";

  const enabledRoles: UserRole[] = ["anon", "authenticated", "admin"];

  const operations: RLSPolicy["operation"][] = [
    "INSERT",
    "SELECT",
    "UPDATE",
    "DELETE",
  ];

  const availableTables = tables.filter((t) => t.id !== table.id);

  const getRoleLabel = (role: UserRole): string => {
    return role === "authenticated" ? "auth" : role;
  };

  if (isAuthSchema) {
    return (
      <div className="flex flex-col theme-p-4 theme-gap-2">
        <div className="flex items-center theme-gap-2 theme-text-muted-foreground">
          <Lock className="h-4 w-4" />
          <p className="text-base font-semibold theme-font theme-tracking">
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
            <h4 className="text-base font-semibold theme-text-foreground theme-mb-2 theme-font theme-tracking">
              {operation}
            </h4>
            <div className="flex flex-col items-stretch theme-gap-2">
              {enabledRoles.map((role) => {
                const rolePolicy = policy?.rolePolicies?.find(
                  (rp) => rp.role === role
                );
                const accessType = rolePolicy?.accessType || "none";

                return (
                  <div key={role} className="flex flex-col theme-gap-2">
                    <div className="flex items-center theme-gap-2">
                      <span className="text-sm theme-text-foreground theme-font-mono min-w-[6rem]">
                        {getRoleLabel(role)}
                      </span>
                      <Select
                        value={accessType}
                        onValueChange={(value) => {
                          addOrUpdateRLSPolicy(
                            table.id,
                            operation,
                            role,
                            value as RLSAccessType
                          );
                        }}
                      >
                        <SelectTrigger className="h-7 text-sm flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No access</SelectItem>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="global">Global</SelectItem>
                          <SelectItem value="own">Own data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
