import ChatBox from "@/app/ui/Chat/ChatBox";
import Header from "./ui/Header/Header";
import Stars from "./ui/Stars";

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <ChatBox />
      <Stars />
    </main>
  );
}
