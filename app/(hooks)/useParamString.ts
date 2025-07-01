//-| File path: app/(hooks)/useParamString.ts
import { useParams } from "next/navigation";
export function getParamString(param?: string | string[]): string {
  if (!param) return "";
  if (typeof param === "string") {
    return param;
  }
  return param[0];
}

const useParamString = (param: string) => {
  return getParamString(useParams()[param]);
};

export default useParamString;
