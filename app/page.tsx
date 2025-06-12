import ChatApp from "@/components/Chat/ChatApp";
import Header from "../components/Header/Header";
import Stars from "../components/Stars";

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <ChatApp />
      <Stars />
    </main>
  );
}
