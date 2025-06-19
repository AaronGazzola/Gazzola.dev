//-| Filepath: component/ContractDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/stores/app.store";
import { useChatStore } from "@/stores/chat.store";
import { useContractStore } from "@/stores/contract.store";
import { Contract } from "@/types/contract.types";
import { createId } from "@paralleldrive/cuid2";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const ContractDialog = () => {
  const { ui, closeContractModal, isAdmin, profile } = useAppStore();
  const { getContractById, updateContract, addContract } = useContractStore();
  const { conversations, selectedConversationId, setSelectedConversationId } =
    useChatStore();

  const [formData, setFormData] = useState<Partial<Contract>>({
    title: "",
    description: "",
    price: 0,
    refundStatus: "pending",
    progressStatus: "not_started",
    conversationIds: [],
  });

  const [selectedConversationIds, setSelectedConversationIds] = useState<
    string[]
  >([]);

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
      });
      setSelectedConversationIds(contract.conversationIds);
    } else {
      setFormData({
        title: "",
        description: "",
        price: 0,
        refundStatus: "pending",
        progressStatus: "not_started",
        conversationIds: [],
      });
      setSelectedConversationIds([]);
    }
  }, [contract]);

  const handleSave = () => {
    if (isEditMode && contract && ui.contractModal.contractId) {
      updateContract(ui.contractModal.contractId, {
        ...formData,
        startDate: formData.startDate
          ? new Date(formData.startDate)
          : contract.startDate,
        targetDate: formData.targetDate
          ? new Date(formData.targetDate)
          : contract.targetDate,
        dueDate: formData.dueDate
          ? new Date(formData.dueDate)
          : contract.dueDate,
        conversationIds: selectedConversationIds,
        updatedAt: new Date(),
      });
    } else if (!isEditMode && profile) {
      const now = new Date();
      const newContract: Contract = {
        id: createId(),
        title: formData.title || "",
        description: formData.description || "",
        startDate: formData.startDate ? new Date(formData.startDate) : now,
        targetDate: formData.targetDate ? new Date(formData.targetDate) : now,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : now,
        price: formData.price || 0,
        refundStatus: formData.refundStatus || "pending",
        progressStatus: formData.progressStatus || "not_started",
        profile,
        conversationIds: selectedConversationIds,
        userApproved: !isAdmin,
        adminApproved: isAdmin,
        createdAt: now,
        updatedAt: now,
        profileId: profile.id,
      };
      addContract(newContract);
    }
    closeContractModal();
  };

  const handleInputChange = (field: keyof Contract, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConversationToggle = (
    conversationId: string,
    checked: boolean
  ) => {
    if (checked) {
      setSelectedConversationIds((prev) => [...prev, conversationId]);
    } else {
      setSelectedConversationIds((prev) =>
        prev.filter((id) => id !== conversationId)
      );
    }
  };

  const handleConversationHeaderClick = (conversationId: string) => {
    if (selectedConversationId === conversationId) {
      setSelectedConversationId(null);
    } else {
      setSelectedConversationId(conversationId);
    }
  };

  const sortedConversations = [...conversations].sort(
    (a, b) =>
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );

  return (
    <Dialog
      open={ui.contractModal.isOpen}
      onOpenChange={() => closeContractModal()}
    >
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Contract" : "Create Contract"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 h-full">
          <div className="flex-1 space-y-4">
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
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
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
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) =>
                    handleInputChange("targetDate", e.target.value)
                  }
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
                onChange={(e) =>
                  handleInputChange("price", Number(e.target.value))
                }
                placeholder="0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="progressStatus">Progress Status</Label>
                <Select
                  value={formData.progressStatus}
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
                  value={formData.refundStatus}
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
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <Label>Related Conversations</Label>
              <div className="border rounded-lg p-4 bg-gray-50">
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {sortedConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className="border rounded-lg bg-white"
                      >
                        <div
                          className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-t-lg cursor-pointer"
                          onClick={() =>
                            handleConversationHeaderClick(conversation.id)
                          }
                        >
                          <Checkbox
                            id={conversation.id}
                            checked={selectedConversationIds.includes(
                              conversation.id
                            )}
                            onCheckedChange={(checked) =>
                              handleConversationToggle(
                                conversation.id,
                                checked as boolean
                              )
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {conversation.title ||
                                  `Conversation ${conversation.id.slice(0, 8)}`}
                              </div>
                              <div className="text-xs text-gray-500">
                                {conversation.messages.length} messages
                              </div>
                            </div>
                            <div className="ml-auto">
                              {selectedConversationId === conversation.id ? (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-500" />
                              )}
                            </div>
                          </div>
                        </div>

                        {selectedConversationId === conversation.id && (
                          <div className="border-t p-3 bg-gray-50 rounded-b-lg">
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {conversation.messages.length > 0 ? (
                                conversation.messages
                                  .slice(-3)
                                  .map((message) => (
                                    <div
                                      key={message.id}
                                      className="text-xs text-gray-600 p-2 bg-white rounded border"
                                    >
                                      <div className="font-medium mb-1">
                                        User {message.senderId.slice(0, 8)}
                                      </div>
                                      <div className="truncate">
                                        {message.content.slice(0, 100)}
                                        {message.content.length > 100 && "..."}
                                      </div>
                                    </div>
                                  ))
                              ) : (
                                <p className="text-xs text-gray-500 italic">
                                  No messages in this conversation
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {conversations.length === 0 && (
                      <p className="text-xs text-gray-500 italic p-3">
                        No conversations available
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => closeContractModal()}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isEditMode ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractDialog;
