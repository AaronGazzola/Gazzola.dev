//-| File path: app/(components)/ContractDialog.tsx
"use client";

import {
  useAddContract,
  useUpdateContract,
} from "@/app/(components)/ContractDialog.hooks";
import { useAuthStore } from "@/app/(stores)/auth.store";
import { useChatStore } from "@/app/(stores)/chat.store";
import { useContractStore } from "@/app/(stores)/contract.store";
import { useAppStore } from "@/app/(stores)/ui.store";
import { Contract } from "@/app/(types)/contract.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const ContractDialog = () => {
  const { ui, closeContractModal } = useAppStore();
  const { contract, setContract } = useContractStore();
  const { conversations } = useChatStore();
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
    refundStatus: null,
    progressStatus: null,
    conversationIds: [],
    userApproved: true,
    adminApproved: false,
  });

  const [approved, setApproved] = useState(true);
  const [selectedConversationIds, setSelectedConversationIds] = useState<
    string[]
  >([]);

  const isEditMode = !!contract;

  useEffect(() => {
    if (contract) {
      setFormData({
        id: contract.id,
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
      setSelectedConversationIds(contract.conversationIds || []);
      setApproved(isAdmin ? contract.adminApproved : contract.userApproved);
      return;
    }
    if (!contract) {
      setFormData({
        title: "",
        description: "",
        startDate: new Date(),
        targetDate: new Date(),
        dueDate: new Date(),
        price: 0,
        refundStatus: null,
        progressStatus: null,
        conversationIds: [],
        userApproved: true,
        adminApproved: false,
      });
      setSelectedConversationIds([]);
      setApproved(true);
    }
  }, [contract, isAdmin]);

  const handleSave = () => {
    if (!isFormValid()) return;

    const contractData = {
      ...formData,
      conversationIds: selectedConversationIds,
      [isAdmin ? "adminApproved" : "userApproved"]: approved,
    };

    if (isEditMode) {
      updateContractMutation.mutate(
        {
          updates: contractData,
        },
        {
          onSuccess: () => {
            setContract(null);
            closeContractModal();
          },
        }
      );
    } else {
      addContractMutation.mutate(
        contractData as Omit<
          Contract,
          "id" | "createdAt" | "updatedAt" | "profile"
        >,
        {
          onSuccess: () => {
            setContract(null);
            closeContractModal();
          },
        }
      );
    }
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
    }
    if (type === "refund") {
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

  const handleConversationToggle = (conversationId: string) => {
    setSelectedConversationIds((prev) =>
      prev.includes(conversationId)
        ? prev.filter((id) => id !== conversationId)
        : [...prev, conversationId]
    );
  };

  const isLoading =
    addContractMutation.isPending || updateContractMutation.isPending;

  return (
    <Dialog
      open={ui.contractModal.isOpen}
      onOpenChange={() => closeContractModal()}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Contract" : "Create Contract"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Contract title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
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
                    value={
                      formData.startDate
                        ? new Date(formData.startDate)
                            .toISOString()
                            .split("T")[0]
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
                        ? new Date(formData.targetDate)
                            .toISOString()
                            .split("T")[0]
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
                <Label htmlFor="price">Price ($)</Label>
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

              {isAdmin && (
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
              )}
              {!isAdmin && (
                <div className="grid grid-cols-2 gap-4">
                  {formData.progressStatus && (
                    <div>
                      <Label>Progress Status</Label>
                      <Badge
                        className={getStatusBadgeColor(
                          formData.progressStatus,
                          "progress"
                        )}
                      >
                        {formatStatusText(formData.progressStatus)}
                      </Badge>
                    </div>
                  )}
                  {formData.refundStatus && (
                    <div>
                      <Label>Refund Status</Label>
                      <Badge
                        className={getStatusBadgeColor(
                          formData.refundStatus,
                          "refund"
                        )}
                      >
                        {formatStatusText(formData.refundStatus)}
                      </Badge>
                    </div>
                  )}
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

            <div className="space-y-4">
              <div>
                <Label>Conversations</Label>
                <div className="text-sm text-gray-600 mb-2">
                  Select conversations to include in this contract
                </div>
                <ScrollArea className="max-h-[400px] border rounded-md p-4">
                  <div className="space-y-2">
                    {conversations.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">
                        No conversations available
                      </p>
                    ) : (
                      conversations.map((conversation) => {
                        const lastMessage =
                          conversation.messages[
                            conversation.messages.length - 1
                          ];
                        const isSelected = selectedConversationIds.includes(
                          conversation.id
                        );

                        return (
                          <Collapsible key={conversation.id}>
                            <CollapsibleTrigger asChild>
                              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() =>
                                    handleConversationToggle(conversation.id)
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium truncate">
                                      {conversation.title ||
                                        `Conversation ${conversation.id.slice(0, 8)}`}
                                    </h4>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xs text-gray-500">
                                        {lastMessage &&
                                          format(
                                            new Date(lastMessage.createdAt),
                                            "MMM d, HH:mm"
                                          )}
                                      </span>
                                      <ChevronDown className="h-4 w-4 text-gray-400" />
                                    </div>
                                  </div>
                                  {lastMessage && (
                                    <p className="text-xs text-gray-500 truncate mt-1">
                                      {lastMessage.content.slice(0, 50)}...
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="ml-6 mt-2">
                                <ScrollArea className="max-h-[200px] border rounded p-3 bg-gray-50">
                                  <div className="space-y-2">
                                    {conversation.messages.map((message) => (
                                      <div
                                        key={message.id}
                                        className="text-xs p-2 border rounded bg-white"
                                      >
                                        <div className="flex justify-between items-start mb-1">
                                          <span className="font-medium text-blue-600">
                                            {message.senderId.slice(0, 8)}
                                          </span>
                                          <span className="text-gray-400">
                                            {format(
                                              new Date(message.createdAt),
                                              "MMM d, HH:mm"
                                            )}
                                          </span>
                                        </div>
                                        <p className="text-gray-700">
                                          {message.content}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setContract(null);
                closeContractModal();
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !isFormValid() || (!approved && isEditMode) || isLoading
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractDialog;
