//-| File path: app/(components)/ActiveContractDialog.tsx
"use client";

import { useUpdateActiveContract } from "@/app/(components)/ActiveContractDialog.hooks";
import { useAuthStore } from "@/app/(stores)/auth.store";
import { useChatStore } from "@/app/(stores)/chat.store";
import { useContractStore } from "@/app/(stores)/contract.store";
import { useAppStore } from "@/app/(stores)/ui.store";
import { Contract, Task } from "@/app/(types)/contract.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProgressStatus } from "@/generated/prisma";
import { cn } from "@/lib/tailwind.utils";
import { DataCyAttributes } from "@/types/cypress.types";
import { format } from "date-fns";
import { CheckCircle, Clock, Loader2, Play, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

const ActiveContractDialog = () => {
  const { ui, closeContractModal } = useAppStore();
  const { contract, setContract } = useContractStore();
  const { conversations } = useChatStore();
  const { isAdmin } = useAuthStore();
  const updateActiveContractMutation = useUpdateActiveContract();

  const [formData, setFormData] = useState<Partial<Contract>>({
    progressStatus: null,
    refundStatus: null,
    tasks: [],
  });

  useEffect(() => {
    if (contract) {
      setFormData({
        id: contract.id,
        progressStatus: contract.progressStatus,
        refundStatus: contract.refundStatus,
        tasks: contract.tasks || [],
      });
    }
  }, [contract]);

  const handleSave = () => {
    if (!contract?.id) return;

    const contractData = {
      id: contract.id,
      progressStatus: formData.progressStatus,
      refundStatus: formData.refundStatus,
      tasks: formData.tasks,
    };

    updateActiveContractMutation.mutate(
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
  };

  const handleInputChange = (field: keyof Contract, value: string | Task[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = (formData.tasks || []).map((task) =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    handleInputChange("tasks", updatedTasks);
  };

  const toggleTaskProgress = (taskId: string) => {
    if (!isAdmin) return;

    const task = (formData.tasks || []).find((t) => t.id === taskId);
    if (!task) return;

    const progressOrder: ProgressStatus[] = [
      "not_started",
      "in_progress",
      "completed",
      "cancelled",
    ];
    const currentIndex = progressOrder.indexOf(
      task.progressStatus || "not_started"
    );
    const nextIndex = (currentIndex + 1) % progressOrder.length;
    const nextStatus = progressOrder[nextIndex];

    updateTask(taskId, { progressStatus: nextStatus });
  };

  const getProgressIcon = (status: string) => {
    switch (status) {
      case "not_started":
        return <Clock className="h-4 w-4 text-gray-500" />;
      case "in_progress":
        return <Play className="h-4 w-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const contractConversations = conversations.filter((conversation) =>
    contract?.conversationIds?.includes(conversation.id)
  );

  const totalPrice = (contract?.tasks || []).reduce(
    (sum, task) => sum + task.price,
    0
  );

  const isLoading = updateActiveContractMutation.isPending;

  return (
    <Dialog
      open={ui.contractModal.isOpen}
      onOpenChange={() => closeContractModal()}
    >
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        data-cy={DataCyAttributes.ACTIVE_CONTRACT_DIALOG}
      >
        <DialogHeader>
          <DialogTitle>Active Contract</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <div className="p-2  rounded border">{contract?.title}</div>
              </div>

              <div>
                <Label>Description</Label>
                <div className="p-2  rounded border min-h-[100px]">
                  {contract?.description}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <div className="p-2  rounded border">
                    {contract?.startDate &&
                      format(new Date(contract.startDate), "MMM d, yyyy")}
                  </div>
                </div>
                <div>
                  <Label>Target Date</Label>
                  <div className="p-2  rounded border">
                    {contract?.targetDate &&
                      format(new Date(contract.targetDate), "MMM d, yyyy")}
                  </div>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <div className="p-2  rounded border">
                    {contract?.dueDate &&
                      format(new Date(contract.dueDate), "MMM d, yyyy")}
                  </div>
                </div>
              </div>

              <div>
                <Label>Total Price ($)</Label>
                <div className="text-2xl font-bold text-green-600">
                  ${totalPrice.toFixed(2)}
                </div>
              </div>

              {isAdmin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="progressStatus">Progress Status</Label>
                    <select
                      id="progressStatus"
                      value={formData.progressStatus || ""}
                      onChange={(e) => handleInputChange("progressStatus", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      data-cy={DataCyAttributes.ACTIVE_CONTRACT_PROGRESS_STATUS_SELECT}
                    >
                      <option value="" disabled>Select progress status...</option>
                      <option value="not_started">Not Started</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="refundStatus">Refund Status</Label>
                    <select
                      id="refundStatus"
                      value={formData.refundStatus || ""}
                      onChange={(e) => handleInputChange("refundStatus", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      data-cy={DataCyAttributes.ACTIVE_CONTRACT_REFUND_STATUS_SELECT}
                    >
                      <option value="" disabled>Select refund status...</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="denied">Denied</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              )}
              {!isAdmin && (
                <div className="grid grid-cols-2 gap-4">
                  {contract?.progressStatus && (
                    <div>
                      <div>
                        <Badge
                          className={cn(
                            "rounded-full",
                            getStatusBadgeColor(
                              contract.progressStatus,
                              "progress"
                            )
                          )}
                          data-cy={DataCyAttributes.ACTIVE_CONTRACT_PROGRESS_STATUS_BADGE}
                        >
                          {formatStatusText(contract.progressStatus)}
                        </Badge>
                      </div>
                    </div>
                  )}
                  {contract?.refundStatus && (
                    <div>
                      <div>
                        <Badge
                          className={cn(
                            "rounded-full",
                            getStatusBadgeColor(contract.refundStatus, "refund")
                          )}
                          data-cy={DataCyAttributes.ACTIVE_CONTRACT_REFUND_STATUS_BADGE}
                        >
                          {formatStatusText(contract.refundStatus)}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <div>
                  <Badge 
                    className="rounded-full bg-green-100 text-green-800"
                    data-cy={DataCyAttributes.ACTIVE_CONTRACT_PAID_STATUS_BADGE}
                  >
                    Paid
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Tasks</Label>
                <div className="space-y-2">
                  {(formData.tasks || []).map((task) => (
                    <div key={task.id} className="border rounded-md">
                      <div className="flex items-center p-3 space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTaskProgress(task.id)}
                          className="p-1"
                          disabled={!isAdmin}
                          data-cy={DataCyAttributes.ACTIVE_CONTRACT_TASK_TOGGLE_PROGRESS_BUTTON}
                          data-progress-status={task.progressStatus || "not_started"}
                        >
                          {getProgressIcon(
                            task.progressStatus || "not_started"
                          )}
                        </Button>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {task.title || "Untitled Task"}
                            </span>
                            <span className="font-semibold">
                              ${task.price.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {task.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Related Conversations</Label>
                <ScrollArea className="max-h-[300px] border rounded-md p-4">
                  <div className="space-y-2">
                    {contractConversations.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">
                        No conversations linked to this contract
                      </p>
                    ) : (
                      contractConversations.map((conversation) => {
                        const lastMessage =
                          conversation.messages[
                            conversation.messages.length - 1
                          ];

                        return (
                          <div
                            key={conversation.id}
                            className="p-3 border rounded-lg "
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium">
                                {conversation.title ||
                                  `Conversation ${conversation.id.slice(0, 8)}`}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {lastMessage &&
                                  format(
                                    new Date(lastMessage.createdAt),
                                    "MMM d, HH:mm"
                                  )}
                              </span>
                            </div>
                            <ScrollArea className="max-h-[150px]">
                              <div className="space-y-1">
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
              data-cy={DataCyAttributes.ACTIVE_CONTRACT_CLOSE_BUTTON}
            >
              Close
            </Button>

            {isAdmin && (
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                data-cy={DataCyAttributes.ACTIVE_CONTRACT_UPDATE_BUTTON}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Contract"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActiveContractDialog;