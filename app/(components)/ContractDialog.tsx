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
import { ProgressStatus } from "@/generated/prisma";
import { format } from "date-fns";
import {
  CheckCircle,
  ChevronDown,
  Clock,
  Loader2,
  Play,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
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

  const isLoading =
    addContractMutation.isPending || updateContractMutation.isPending;

  return (
    <>
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
                  <ScrollArea className="max-h-[300px] border rounded-md p-4">
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
                disabled={!isFormValid() || !approvedValue || isLoading}
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

export default ContractDialog;
