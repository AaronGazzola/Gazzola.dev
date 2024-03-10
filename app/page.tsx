import ChatBox from "@/app/ui/Chat/ChatBox";
import Header from "./ui/Header/Header";
import Bio from "./ui/Bio/Bio";

export default function Home() {
  return (
    <main>
      <Header />
      <Bio />
      <ChatBox />
    </main>
  );
}
