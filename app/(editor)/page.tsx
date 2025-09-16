import { redirect } from "next/navigation";
import { getFirstPageUrl } from "./layout.data";

const page = () => {
  redirect(getFirstPageUrl());
};

export default page;
