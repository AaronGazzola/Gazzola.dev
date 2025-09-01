interface PageProps {
  params: Promise<{ segments: string[] }>;
}

const page = async ({ params }: PageProps) => {
  const { segments } = await params;
  const lastSegment = segments[segments.length - 1];
  return <div>{lastSegment}</div>;
};

export default page;