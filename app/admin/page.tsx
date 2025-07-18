//-| File path: app/admin/page.tsx
"use client";

import { useState } from "react";
import { useGetAppData } from "@/app/(hooks)/app.hooks";
import { UserTable } from "@/app/admin/(components)/UserTable";
import SignOutConfirm from "@/app/(components)/SignOutConfirm";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { DataCyAttributes } from "@/types/cypress.types";

const AdminPage = () => {
  const { data, isLoading } = useGetAppData();
  const users = data?.users || [];
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);

  const handleSignOutClick = () => {
    setIsSignOutDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
            <p className="text-muted-foreground">
              Manage users and monitor system activity
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOutClick}
            className="flex items-center gap-2"
            data-cy={DataCyAttributes.ADMIN_SIGN_OUT_BUTTON}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
        <UserTable users={users} isLoading={isLoading} />
      </div>
      <SignOutConfirm
        isOpen={isSignOutDialogOpen}
        onClose={() => setIsSignOutDialogOpen(false)}
      />
    </div>
  );
};

export default AdminPage;
