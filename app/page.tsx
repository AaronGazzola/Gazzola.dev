import ChatBox from "@/app/ui/Chat/ChatBox";
import Header from "./ui/Header/Header";
import Bio from "./ui/Bio/Bio";
import ImageDivider from "./ui/ImageDivider";

export default function Home() {
  return (
    <main>
      <Header />
      <Bio />
      <ImageDivider />
      <ChatBox />
    </main>
  );
}
