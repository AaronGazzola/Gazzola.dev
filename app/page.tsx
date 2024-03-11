import ChatBox from "@/app/ui/Chat/ChatBox";
import Header from "./ui/Header/Header";
import Bio from "./ui/Bio/Bio";
import ImageDivider from "./ui/ImageDivider";
import Stars from "./ui/Stars";

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Bio />
      <ImageDivider />
      <ChatBox />
      <Stars />
    </main>
  );
}
