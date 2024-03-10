import Image from "next/image";

const ImageDivider = () => {
  return (
    <div className="relative overflow-hidden max-h-[500px] flex items-start justify-center ">
      {/* <div className="absolute inset-0 bg-black z-10 bg-overlay" /> */}
      <div className="absolute top-0 right-0 left-0 h-24 z-10 top-vignette" />
      <div className="absolute bottom-0 right-0 left-0 h-24 z-10 bottom-vignette" />
      <Image
        className="object-cover h-full w-full"
        src="/Astronaut code wall.png"
        alt="Astronaut floating cyberspace divider image"
        width={1456}
        height={832}
      />
    </div>
  );
};

export default ImageDivider;
