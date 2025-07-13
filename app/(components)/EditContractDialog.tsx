//-| File path: app/(components)/EditContractDialog.tsx
"use client";

import {
  useAddContract,
  useContractPayment,
  useUpdateContract,
} from "@/app/(components)/ContractDialog.hooks";
import { useAuthStore } from "@/app/(stores)/auth.store";
import { useChatStore } from "@/app/(stores)/chat.store";
import { useContractStore } from "@/app/(stores)/contract.store";
import { useAppStore } from "@/app/(stores)/ui.store";
import { Contract, Task } from "@/app/(types)/contract.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ProgressStatus } from "@/generated/prisma";
import { format } from "date-fns";
import { isEqual } from "lodash";
import {
  CheckCircle,
  ChevronDown,
  Clock,
  CreditCard,
  Loader2,
  Play,
  Plus,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

const EditContractDialog = () => {
  const { ui, closeContractModal } = useAppStore();
  const { contract, setContract, contracts, contractHasChanged } =
    useContractStore();
  const { conversations, targetUser } = useChatStore();
  const { isAdmin, profile, user } = useAuthStore();
  const addContractMutation = useAddContract();
  const updateContractMutation = useUpdateContract();
  const contractPaymentMutation = useContractPayment();

  const [openConversationIds, setOpenConversationIds] = useState<string[]>([]);

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
    tasks: [],
  });

  const [selectedConversationIds, setSelectedConversationIds] = useState<
    string[]
  >([]);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  const isEditMode = !!contract;

  const approvedValue = isAdmin
    ? formData.adminApproved
    : formData.userApproved;

  const shouldShowPaymentButton = (() => {
    if (
      !contract ||
      isAdmin ||
      !formData.userApproved ||
      !formData.adminApproved ||
      contract.isPaid
    ) {
      return false;
    }

    // Create comparison objects excluding approval states
    const formDataForComparison = {
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      targetDate: formData.targetDate,
      dueDate: formData.dueDate,
      price: formData.price,
      refundStatus: formData.refundStatus,
      progressStatus: formData.progressStatus,
      conversationIds: selectedConversationIds,
      tasks: formData.tasks,
    };

    const contractDataForComparison = {
      title: contract.title,
      description: contract.description,
      startDate: contract.startDate,
      targetDate: contract.targetDate,
      dueDate: contract.dueDate,
      price: contract.price,
      refundStatus: contract.refundStatus,
      progressStatus: contract.progressStatus,
      conversationIds: contract.conversationIds,
      tasks: contract.tasks,
    };

    // Only show payment button if the data matches (only approval states can be different)
    return isEqual(formDataForComparison, contractDataForComparison);
  })();

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
        tasks: contract.tasks || [],
      });
      setSelectedConversationIds(contract.conversationIds || []);
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
        tasks: [],
      });
      setSelectedConversationIds([]);
    }
  }, [contract]);

  const handleSave = () => {
    if (!isFormValid()) return;

    const totalPrice = (formData.tasks || []).reduce(
      (sum, task) => sum + task.price,
      0
    );

    const contractData = {
      ...formData,
      price: totalPrice,
      conversationIds: selectedConversationIds,
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

  const handlePayment = () => {
    if (contract?.id) {
      contractPaymentMutation.mutate(contract.id, {
        onSuccess: () => {
          setContract(null);
          closeContractModal();
        },
      });
    }
  };

  const handleRefresh = () => {
    const currentContract = contracts.find((c) => c.id === contract?.id);
    if (currentContract) setContract(currentContract);
  };

  const handleInputChange = (
    field: keyof Contract,
    value: string | number | Date | boolean | string[] | Task[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
    return formData.title && formData.description;
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

  const addTask = () => {
    const newTask: Task = {
      id: `temp-${Date.now()}`,
      title: "",
      description: "",
      price: 0,
      progressStatus: "not_started",
      contractId: formData.id || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    handleInputChange("tasks", [...(formData.tasks || []), newTask]);
    setExpandedTaskId(newTask.id);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = (formData.tasks || []).map((task) =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    handleInputChange("tasks", updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = (formData.tasks || []).filter(
      (task) => task.id !== taskId
    );
    handleInputChange("tasks", updatedTasks);
    setDeleteTaskId(null);
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
    }
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

  const expandTask = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const totalPrice = (formData.tasks || []).reduce(
    (sum, task) => sum + task.price,
    0
  );

  const getNameFromId = (id: string) =>
    id === user?.id
      ? profile?.firstName || user.name || "You"
      : isAdmin && id === targetUser?.id
        ? targetUser.name
        : "Az Anything";

  const isLoading =
    addContractMutation.isPending ||
    updateContractMutation.isPending ||
    contractPaymentMutation.isPending;

  return (
    <>
      <Dialog
        open={ui.contractModal.isOpen}
        onOpenChange={() => closeContractModal()}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <DialogTitle>
                {isEditMode ? "Edit Contract" : "Create Contract"}
              </DialogTitle>
              {contractHasChanged && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="border-yellow-400 text-yellow-500 font-medium hover:bg-yellow-50/10 hover:text-yellow-200 rounded-full space-x-2"
                >
                  The contract has been updated, refresh to see changes
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
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
                        handleInputChange(
                          "targetDate",
                          new Date(e.target.value)
                        )
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
                          ? new Date(formData.dueDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange("dueDate", new Date(e.target.value))
                      }
                    />
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
                          <SelectItem value="not_started">
                            Not Started
                          </SelectItem>
                          <SelectItem value="in_progress">
                            In Progress
                          </SelectItem>
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
                    checked={approvedValue || false}
                    onCheckedChange={(checked) =>
                      handleInputChange(
                        isAdmin ? "adminApproved" : "userApproved",
                        checked
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Tasks</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTask}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
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
                          >
                            {getProgressIcon(
                              task.progressStatus || "not_started"
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTaskId(task.id)}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => expandTask(task.id)}
                          >
                            {expandedTaskId === task.id ? (
                              <div className="space-y-2">
                                <Input
                                  value={task.title}
                                  onChange={(e) =>
                                    updateTask(task.id, {
                                      title: e.target.value,
                                    })
                                  }
                                  placeholder="Task title"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <Textarea
                                  value={task.description}
                                  onChange={(e) =>
                                    updateTask(task.id, {
                                      description: e.target.value,
                                    })
                                  }
                                  placeholder="Task description"
                                  rows={2}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <Input
                                  type="number"
                                  value={task.price}
                                  onChange={(e) =>
                                    updateTask(task.id, {
                                      price: Number(e.target.value),
                                    })
                                  }
                                  placeholder="0"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <span className="truncate">
                                  {task.title || "Untitled Task"}
                                </span>
                                <span className="font-semibold">
                                  ${task.price.toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Conversations</Label>
                  <div className="text-sm text-gray-600 mb-2">
                    Select conversations to include in this contract
                  </div>
                  <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
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

                          const isOpen = openConversationIds.includes(
                            conversation.id
                          );

                          return (
                            <Collapsible
                              className="border rounded-md"
                              key={conversation.id}
                              onOpenChange={(open) => {
                                if (open) {
                                  setOpenConversationIds((prev) => [
                                    ...prev,
                                    conversation.id,
                                  ]);
                                } else {
                                  setOpenConversationIds((prev) =>
                                    prev.filter((id) => id !== conversation.id)
                                  );
                                }
                              }}
                              open={isOpen}
                            >
                              <CollapsibleTrigger asChild>
                                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50/20 cursor-pointer">
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
                                        {lastMessage &&
                                          format(
                                            new Date(lastMessage.createdAt),
                                            "MMM d, HH:mm"
                                          )}
                                      </h4>
                                      <div className="flex items-center space-x-2">
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                      </div>
                                    </div>
                                    {lastMessage && !isOpen && (
                                      <div className="flex gap-2 items-center">
                                        <p className="text-xs truncate mt-1">
                                          {getNameFromId(lastMessage.senderId)}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate mt-1">
                                          {lastMessage.content.slice(0, 50)}...
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="ml-6 mt-2">
                                  <div className="space-y-2">
                                    {conversation.messages.map((message) => (
                                      <div
                                        key={message.id}
                                        className="text-xs p-2 "
                                      >
                                        <div className="flex items-start mb-1 gap-2">
                                          <span className="text-gray-200">
                                            {getNameFromId(message.senderId)}
                                          </span>
                                          <span className="text-gray-400">
                                            {format(
                                              new Date(message.createdAt),
                                              "MMM d, HH:mm"
                                            )}
                                          </span>
                                        </div>
                                        <p className="text-gray-400">
                                          {message.content}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <div className="flex gap-2">
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
              </div>

              <div className="flex gap-2">
                {shouldShowPaymentButton && (
                  <Button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {contractPaymentMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Complete Payment
                      </>
                    )}
                  </Button>
                )}

                <Button
                  onClick={handleSave}
                  disabled={!isFormValid() || !approvedValue || isLoading}
                >
                  {isLoading && !contractPaymentMutation.isPending ? (
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
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTaskId}
        onOpenChange={() => setDeleteTaskId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTaskId && deleteTask(deleteTaskId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditContractDialog;
