import { AuthForm } from "./components/AuthForm";
import { ThemeToolbar } from "./components/ThemeToolbar";

interface PageProps {
  params: Promise<{ segments: string[] }>;
}

const page = async ({ params }: PageProps) => {
  const { segments } = await params;
  const lastSegment = segments[segments.length - 1];
  
  if (lastSegment === "authentication") {
    return (
      <div className="min-h-screen bg-background">
        <ThemeToolbar />
        <div className="flex items-center justify-center py-12">
          <AuthForm />
        </div>
      </div>
    );
  }
  
  return <div>{lastSegment}</div>;
};

export default page;