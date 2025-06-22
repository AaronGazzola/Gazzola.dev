//-| File path: app/chat/page.tsx
import { getAuthenticatedUser } from "@/lib/auth.utils";

const page = async () => {
  const user = await getAuthenticatedUser();

  return <div>chat page; user:{user?.name}</div>;
};

export default page;
