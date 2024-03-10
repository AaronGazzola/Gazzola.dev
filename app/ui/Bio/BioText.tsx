import { sourceCodePro } from "@/app/styles/fonts";
import clsx from "clsx";

const BioText = () => {
  return (
    <div className="flex flex-col">
      <h1 className={clsx(sourceCodePro.className)}>Bio</h1>
    </div>
  );
};

export default BioText;
