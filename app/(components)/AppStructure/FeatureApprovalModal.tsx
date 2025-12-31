"use client";

import { InferredFeature, FeatureComplexity } from "../AppStructure.types";
import { Badge } from "@/components/editor/ui/badge";
import { Button } from "@/components/editor/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/editor/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/editor/ui/checkbox";
import { Input } from "@/components/editor/ui/input";
import { Textarea } from "@/components/editor/ui/textarea";
import {
  CheckCircle2,
  XCircle,
  Code,
  Database,
  Sparkles,
  FileCode,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface FeatureApprovalModalProps {
  isOpen: boolean;
  pendingFeatures: Record<string, InferredFeature[]>;
  pageIdToName: Record<string, string>;
  onApprove: (approvedFeatures: Record<string, InferredFeature[]>) => void;
  onCancel: () => void;
}

export const FeatureApprovalModal = ({
  isOpen,
  pendingFeatures,
  pageIdToName,
  onApprove,
  onCancel,
}: FeatureApprovalModalProps) => {
  const [approvalStatus, setApprovalStatus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    Object.values(pendingFeatures).forEach((features) => {
      features.forEach((feature) => {
        initial[feature.id] = true;
      });
    });
    return initial;
  });

  const [editingFeature, setEditingFeature] = useState<string | null>(null);
  const [editedFeatures, setEditedFeatures] = useState<Record<string, Partial<InferredFeature>>>({});
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    Object.keys(pendingFeatures).forEach((pageId) => {
      initial[pageId] = true;
    });
    return initial;
  });

  const toggleFeature = (featureId: string) => {
    setApprovalStatus((prev) => ({
      ...prev,
      [featureId]: !prev[featureId],
    }));
  };

  const togglePage = (pageId: string) => {
    setExpandedPages((prev) => ({
      ...prev,
      [pageId]: !prev[pageId],
    }));
  };

  const approveAll = () => {
    const newStatus: Record<string, boolean> = {};
    Object.values(pendingFeatures).forEach((features) => {
      features.forEach((feature) => {
        newStatus[feature.id] = true;
      });
    });
    setApprovalStatus(newStatus);
  };

  const rejectAll = () => {
    const newStatus: Record<string, boolean> = {};
    Object.values(pendingFeatures).forEach((features) => {
      features.forEach((feature) => {
        newStatus[feature.id] = false;
      });
    });
    setApprovalStatus(newStatus);
  };

  const handleApprove = () => {
    const approved: Record<string, InferredFeature[]> = {};

    Object.entries(pendingFeatures).forEach(([pageId, features]) => {
      const approvedFeatures = features
        .filter((feature) => approvalStatus[feature.id])
        .map((feature) => ({
          ...feature,
          ...(editedFeatures[feature.id] || {}),
        }));

      if (approvedFeatures.length > 0) {
        approved[pageId] = approvedFeatures;
      }
    });

    onApprove(approved);
  };

  const totalFeatures = Object.values(pendingFeatures).reduce(
    (sum, features) => sum + features.length,
    0
  );
  const approvedCount = Object.values(approvalStatus).filter(Boolean).length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh] theme-font-sans theme-tracking">
        <DialogHeader>
          <DialogTitle className="flex items-center theme-gap-2 text-xl theme-font-sans theme-tracking">
            <Sparkles className="h-5 w-5 theme-text-primary" />
            Review Generated Features
          </DialogTitle>
          <DialogDescription className="theme-font-sans theme-tracking">
            AI has inferred {totalFeatures} features from your pages. Review and approve the ones
            you want to include. You can edit titles and descriptions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between theme-py-2 theme-px-4 theme-bg-muted theme-radius">
          <div className="flex items-center theme-gap-4">
            <span className="   font-semibold theme-font-sans theme-tracking">
              {approvedCount} / {totalFeatures} selected
            </span>
          </div>
          <div className="flex theme-gap-2">
            <Button variant="outline" size="sm" onClick={approveAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={rejectAll}>
              Deselect All
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 theme-pr-4" style={{ maxHeight: "60vh" }}>
          <div className="space-y-6">
            {Object.entries(pendingFeatures).map(([pageId, features]) => {
              const pageName = pageIdToName[pageId] || "Unknown Page";
              const isExpanded = expandedPages[pageId];

              return (
                <div key={pageId} className="theme-border-border theme-border theme-radius">
                  <button
                    onClick={() => togglePage(pageId)}
                    className="w-full flex items-center justify-between theme-p-4 hover:theme-bg-muted/50 theme-radius transition-colors"
                  >
                    <div className="flex items-center theme-gap-2">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <h3 className="font-semibold text-base theme-font-sans theme-tracking">
                        {pageName}
                      </h3>
                      <Badge variant="secondary" className="theme-font-sans theme-tracking">
                        {features.length} features
                      </Badge>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="theme-p-4 theme-pt-0 space-y-3">
                      {features.map((feature) => {
                        const isApproved = approvalStatus[feature.id];
                        const isEditing = editingFeature === feature.id;
                        const edited = editedFeatures[feature.id] || {};

                        return (
                          <div
                            key={feature.id}
                            className={`theme-border theme-radius theme-p-4 space-y-3 transition-all ${
                              isApproved
                                ? "theme-border-primary theme-bg-primary/5"
                                : "theme-border-border theme-bg-muted/30"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start theme-gap-3 flex-1">
                                <Checkbox
                                  checked={isApproved}
                                  onCheckedChange={() => toggleFeature(feature.id)}
                                  className="mt-1"
                                />
                                <div className="flex-1 space-y-2">
                                  {isEditing ? (
                                    <>
                                      <Input
                                        value={edited.title || feature.title}
                                        onChange={(e) =>
                                          setEditedFeatures((prev) => ({
                                            ...prev,
                                            [feature.id]: {
                                              ...prev[feature.id],
                                              title: e.target.value,
                                            },
                                          }))
                                        }
                                        className="font-semibold"
                                      />
                                      <Textarea
                                        value={edited.description || feature.description}
                                        onChange={(e) =>
                                          setEditedFeatures((prev) => ({
                                            ...prev,
                                            [feature.id]: {
                                              ...prev[feature.id],
                                              description: e.target.value,
                                            },
                                          }))
                                        }
                                        className="theme-font-sans theme-tracking"
                                        rows={2}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <h4 className="font-semibold theme-font-sans theme-tracking">
                                        {edited.title || feature.title}
                                      </h4>
                                      <p className="text-sm theme-text-muted-foreground theme-font-sans theme-tracking">
                                        {edited.description || feature.description}
                                      </p>
                                    </>
                                  )}

                                  <div className="flex flex-wrap theme-gap-2">
                                    <Badge variant="outline" className="theme-font-sans theme-tracking">
                                      {feature.category}
                                    </Badge>
                                    <Badge
                                      variant={
                                        feature.complexity === FeatureComplexity.COMPLEX
                                          ? "default"
                                          : "secondary"
                                      }
                                      className="theme-font-sans theme-tracking"
                                    >
                                      {feature.complexity}
                                    </Badge>
                                    {feature.databaseTables.length > 0 && (
                                      <Badge
                                        variant="outline"
                                        className="flex items-center theme-gap-1 theme-font-sans theme-tracking"
                                      >
                                        <Database className="h-3 w-3" />
                                        {feature.databaseTables.join(", ")}
                                      </Badge>
                                    )}
                                  </div>

                                  <div className="flex flex-wrap theme-gap-2 text-xs">
                                    {feature.utilityFileNeeds.hooks && (
                                      <div className="flex items-center theme-gap-1 theme-text-muted-foreground">
                                        <FileCode className="h-3 w-3" />
                                        hooks
                                      </div>
                                    )}
                                    {feature.utilityFileNeeds.actions && (
                                      <div className="flex items-center theme-gap-1 theme-text-muted-foreground">
                                        <Code className="h-3 w-3" />
                                        actions
                                      </div>
                                    )}
                                    {feature.utilityFileNeeds.stores && (
                                      <div className="flex items-center theme-gap-1 theme-text-muted-foreground">
                                        <Settings className="h-3 w-3" />
                                        stores
                                      </div>
                                    )}
                                    {feature.utilityFileNeeds.types && (
                                      <div className="flex items-center theme-gap-1 theme-text-muted-foreground">
                                        <FileCode className="h-3 w-3" />
                                        types
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setEditingFeature(isEditing ? null : feature.id)
                                }
                              >
                                {isEditing ? "Done" : "Edit"}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleApprove} disabled={approvedCount === 0}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Approve {approvedCount} Feature{approvedCount !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
