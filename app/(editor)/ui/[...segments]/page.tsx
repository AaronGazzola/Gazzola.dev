interface PageProps {
  params: { segments: string[] };
}

const page = ({ params }: PageProps) => {
  const lastSegment = params.segments[params.segments.length - 1];
  return <div>{lastSegment}</div>;
};

export default page;