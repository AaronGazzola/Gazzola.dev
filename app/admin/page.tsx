//-| File path: app/admin/page.tsx
//-| Filepath: app/admin/page.tsx
"use client";

import { UserTable } from "@/app/components/admin/UserTable";
import { useGetUsers } from "@/hooks/admin.hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminPage = () => {
  const router = useRouter();
  const { data: users, isLoading, error } = useGetUsers();

  useEffect(() => {
    if (error?.message === "Unauthorized") {
      router.push("/");
    }
  }, [error, router]);

  if (error?.message === "Unauthorized") {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Manage users and monitor system activity
          </p>
        </div>
        <UserTable users={users || []} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default AdminPage;
