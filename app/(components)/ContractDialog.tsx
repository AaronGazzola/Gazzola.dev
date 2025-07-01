//-| File path: app/(components)/ContractDialog.tsx
"use client";

import {
  useAddContract,
  useUpdateContract,
} from "@/app/(components)/ContractDialog.hooks";
import { useAuthStore } from "@/app/(stores)/auth.store";
import { useContractStore } from "@/app/(stores)/contract.store";
import { useAppStore } from "@/app/(stores)/ui.store";
import { Contract } from "@/app/(types)/contract.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

const ContractDialog = () => {
  const { ui, closeContractModal } = useAppStore();
  const { getContractById } = useContractStore();
  const { isAdmin } = useAuthStore();
  const addContractMutation = useAddContract();
  const updateContractMutation = useUpdateContract();

  const [formData, setFormData] = useState<Partial<Contract>>({
    title: "",
    description: "",
    startDate: new Date(),
    targetDate: new Date(),
    dueDate: new Date(),
    price: 0,
    refundStatus: "pending",
    progressStatus: "not_started",
    conversationIds: [],
    userApproved: true,
    adminApproved: false,
  });

  const [approved, setApproved] = useState(true);

  const contract = ui.contractModal.contractId
    ? getContractById(ui.contractModal.contractId)
    : null;

  const isEditMode = !!contract;

  useEffect(() => {
    if (contract) {
      setFormData({
        title: contract.title,
        description: contract.description,
        startDate: contract.startDate,
        targetDate: contract.targetDate,
        dueDate: contract.dueDate,
        price: contract.price,
        refundStatus: contract.refundStatus,
        progressStatus: contract.progressStatus,
        conversationIds: contract.conversationIds,
        userApproved: contract.userApproved,
        adminApproved: contract.adminApproved,
      });
      setApproved(isAdmin ? contract.adminApproved : contract.userApproved);
    } else {
      setFormData({
        title: "",
        description: "",
        startDate: new Date(),
        targetDate: new Date(),
        dueDate: new Date(),
        price: 0,
        refundStatus: "pending",
        progressStatus: "not_started",
        conversationIds: [],
        userApproved: true,
        adminApproved: false,
      });
      setApproved(true);
    }
  }, [contract, isAdmin]);

  const handleSave = async () => {
    if (!isFormValid()) return;

    const contractData = {
      ...formData,
      [isAdmin ? "adminApproved" : "userApproved"]: approved,
    };

    if (isEditMode) {
      await updateContractMutation.mutateAsync({
        id: contract!.id,
        updates: contractData,
      });
    } else {
      await addContractMutation.mutateAsync(
        contractData as Omit<
          Contract,
          "id" | "createdAt" | "updatedAt" | "profile"
        >
      );
    }

    closeContractModal();
  };

  const handleInputChange = (
    field: keyof Contract,
    value: string | number | Date | boolean | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.title && formData.description && formData.price !== undefined
    );
  };

  const getStatusBadgeColor = (status: string, type: "progress" | "refund") => {
    if (type === "progress") {
      switch (status) {
        case "completed":
          return "bg-green-100 text-green-800";
        case "in_progress":
          return "bg-blue-100 text-blue-800";
        case "not_started":
          return "bg-gray-100 text-gray-800";
        case "cancelled":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    } else {
      switch (status) {
        case "completed":
          return "bg-green-100 text-green-800";
        case "approved":
          return "bg-blue-100 text-blue-800";
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "denied":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
  };

  const formatStatusText = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Dialog
      open={ui.contractModal.isOpen}
      onOpenChange={() => closeContractModal()}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Contract" : "Create Contract"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Contract title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Contract description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={
                  formData.startDate
                    ? new Date(formData.startDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleInputChange("startDate", new Date(e.target.value))
                }
              />
            </div>
            <div>
              <Label htmlFor="targetDate">Target Date</Label>
              <Input
                id="targetDate"
                type="date"
                value={
                  formData.targetDate
                    ? new Date(formData.targetDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleInputChange("targetDate", new Date(e.target.value))
                }
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={
                  formData.dueDate
                    ? new Date(formData.dueDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleInputChange("dueDate", new Date(e.target.value))
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="price">Price ($) *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price || 0}
              onChange={(e) =>
                handleInputChange("price", Number(e.target.value))
              }
              placeholder="0"
            />
          </div>

          {isAdmin ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="progressStatus">Progress Status</Label>
                <Select
                  value={formData.progressStatus || "not_started"}
                  onValueChange={(value) =>
                    handleInputChange("progressStatus", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select progress status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="refundStatus">Refund Status</Label>
                <Select
                  value={formData.refundStatus || "pending"}
                  onValueChange={(value) =>
                    handleInputChange("refundStatus", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select refund status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="denied">Denied</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Progress Status</Label>
                {formData.progressStatus ? (
                  <Badge
                    className={getStatusBadgeColor(
                      formData.progressStatus,
                      "progress"
                    )}
                  >
                    {formatStatusText(formData.progressStatus)}
                  </Badge>
                ) : (
                  <div className="text-sm text-gray-500">Not set</div>
                )}
              </div>
              <div>
                <Label>Refund Status</Label>
                {formData.refundStatus ? (
                  <Badge
                    className={getStatusBadgeColor(
                      formData.refundStatus,
                      "refund"
                    )}
                  >
                    {formatStatusText(formData.refundStatus)}
                  </Badge>
                ) : (
                  <div className="text-sm text-gray-500">Not set</div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <Label htmlFor="approved">
              {isAdmin ? "Admin Approved" : "User Approved"}
            </Label>
            <Switch
              id="approved"
              checked={approved}
              onCheckedChange={setApproved}
              disabled={!isEditMode}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => closeContractModal()}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isFormValid() || (!approved && isEditMode)}
          >
            {isEditMode ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractDialog;
