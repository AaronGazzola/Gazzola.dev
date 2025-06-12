//-| Filepath: component/ContractDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/stores/app.store";
import { useContractStore } from "@/stores/contract.store";
import { Contract } from "@/types/contract.types";
import { useState, useEffect } from "react";

const ContractDialog = () => {
  const { ui, closeContractModal } = useAppStore();
  const { getContractById, updateContract } = useContractStore();

  const [formData, setFormData] = useState<Partial<Contract>>({
    title: "",
    description: "",
    startDate: "",
    targetDate: "",
    dueDate: "",
    price: 0,
    refundStatus: "pending",
    progressStatus: "not_started",
  });

  const contract = ui.contractModal.contractId
    ? getContractById(ui.contractModal.contractId)
    : null;

  useEffect(() => {
    if (contract) {
      setFormData({
        title: contract.title,
        description: contract.description,
        startDate: contract.startDate.split('T')[0],
        targetDate: contract.targetDate.split('T')[0],
        dueDate: contract.dueDate.split('T')[0],
        price: contract.price,
        refundStatus: contract.refundStatus,
        progressStatus: contract.progressStatus,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        startDate: "",
        targetDate: "",
        dueDate: "",
        price: 0,
        refundStatus: "pending",
        progressStatus: "not_started",
      });
    }
  }, [contract]);

  const handleSave = () => {
    if (contract && ui.contractModal.contractId) {
      updateContract(ui.contractModal.contractId, {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : contract.startDate,
        targetDate: formData.targetDate ? new Date(formData.targetDate).toISOString() : contract.targetDate,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : contract.dueDate,
        updatedAt: new Date().toISOString(),
      });
    }
    closeContractModal();
  };

  const handleInputChange = (field: keyof Contract, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={ui.contractModal.isOpen} onOpenChange={() => closeContractModal()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {contract ? "Edit Contract" : "Create Contract"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Contract title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
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
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="targetDate">Target Date</Label>
              <Input
                id="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={(e) => handleInputChange("targetDate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange("price", Number(e.target.value))}
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="progressStatus">Progress Status</Label>
              <Select
                value={formData.progressStatus}
                onValueChange={(value) => handleInputChange("progressStatus", value)}
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
                value={formData.refundStatus}
                onValueChange={(value) => handleInputChange("refundStatus", value)}
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

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => closeContractModal()}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {contract ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractDialog;
