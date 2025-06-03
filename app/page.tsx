import ChatBox from "@/app/ui/Chat/ChatBox";
import Header from "./ui/Header/Header";
import Bio from "./ui/Bio/Bio";
import Slider from "./ui/Slider";
import Stars from "./ui/Stars";

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Bio />
      <Slider />
      <ChatBox />
      <Stars />
    </main>
  );
}
