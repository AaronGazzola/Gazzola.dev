//-| File path: app/(components)/ContractDialog.tsx
"use client";

import ActiveContractDialog from "@/app/(components)/ActiveContractDialog";
import EditContractDialog from "@/app/(components)/EditContractDialog";
import { useContractStore } from "@/app/(stores)/contract.store";

const ContractDialog = () => {
  const { contract } = useContractStore();
  if (contract?.isPaid) return <ActiveContractDialog />;
  return <EditContractDialog />;
};

export default ContractDialog;
