import Moon from "./Moon";
import Portrait from "./Portrait";

const moonImageNames = [
  "css-lgo.svg",
  "html-lgo.svg",
  "javascript-logo.svg",
  "next-js-logo.svg",
  "nodejs-logo.svg",
  "postgresql-logo.svg",
  "prisma-logo.svg",
  "react-logo.svg",
  "tailwind-logo.svg",
  "Typescript-logo.svg",
];

const Orbit = () => {
  return (
    <div className="flex items-center justify-center p-16 relative my-10">
      {moonImageNames.map((imageName, index) => (
        <Moon
          index={index}
          key={imageName}
          imageName={imageName}
          total={moonImageNames.length}
        />
      ))}
      <Portrait />
    </div>
  );
};

export default Orbit;
