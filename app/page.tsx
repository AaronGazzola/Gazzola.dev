//-| File path: app/page.tsx
import ChatApp from "@/app/chat/(components)/ChatApp";
import Header from "./(components)/Header";
import Stars from "./(components)/Stars";

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <ChatApp />
      <Stars />
    </main>
  );
}
