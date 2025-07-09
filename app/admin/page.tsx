//-| File path: app/admin/page.tsx
"use client";

import { useGetAppData } from "@/app/(hooks)/app.hooks";
import { UserTable } from "@/app/admin/(components)/UserTable";

const AdminPage = () => {
  const { data, isLoading } = useGetAppData();
  const users = data?.users || [];

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Manage users and monitor system activity
          </p>
        </div>
        <UserTable users={users} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default AdminPage;
