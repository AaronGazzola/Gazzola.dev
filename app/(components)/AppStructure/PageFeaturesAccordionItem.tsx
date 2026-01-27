"use client";

import { Badge } from "@/components/editor/ui/badge";
import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/editor/ui/popover";
import { Textarea } from "@/components/editor/ui/textarea";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { InferredFeature } from "../AppStructure.types";

interface PageFeaturesAccordionItemProps {
  pageId: string;
  pageName: string;
  pageRoute: string;
  features: InferredFeature[];
  expandedFeatureId: string | null;
  onToggleFeature: (featureId: string | null) => void;
  onUpdateFeature: (
    featureId: string,
    updates: Partial<InferredFeature>
  ) => void;
  onAddFeature: (pageId: string) => void;
  onDeleteFeature: (featureId: string) => void;
  disabled?: boolean;
}

export const PageFeaturesAccordionItem = ({
  pageId,
  pageName,
  pageRoute,
  features,
  expandedFeatureId,
  onToggleFeature,
  onUpdateFeature,
  onAddFeature,
  onDeleteFeature,
  disabled = false,
}: PageFeaturesAccordionItemProps) => {
  const [deletePopoverOpen, setDeletePopoverOpen] = useState<string | null>(
    null
  );

  return (
    <div className="theme-border theme-border-border theme-radius theme-bg-muted/30">
      <div className="flex items-center justify-between theme-p-3">
        <div className="flex items-center theme-gap-2">
          <span className="font-semibold theme-text-foreground">
            {pageName}
          </span>
          <span className="text-xs theme-font-mono theme-bg-secondary theme-text-secondary-foreground px-1.5 py-0.5 theme-radius">
            {pageRoute}
          </span>
        </div>
        <Badge variant="secondary" className="theme-font-sans theme-tracking">
          {features.length} {features.length === 1 ? "feature" : "features"}
        </Badge>
      </div>

      <div className="theme-p-3 theme-pt-0 space-y-2">
        {features.map((feature) => {
          const isFeatureExpanded = expandedFeatureId === feature.id;

          return (
            <div
              key={feature.id}
              className="border theme-border-accent theme-radius theme-bg-background"
            >
              <div className="flex items-center justify-between theme-p-2">
                <button
                  onClick={() =>
                    onToggleFeature(isFeatureExpanded ? null : feature.id)
                  }
                  disabled={disabled}
                  className="flex-1 flex items-center theme-gap-2 hover:theme-bg-muted/50 theme-radius transition-colors disabled:opacity-50"
                >
                  {isFeatureExpanded ? (
                    <ChevronDown className="h-3 w-3 theme-text-foreground" />
                  ) : (
                    <ChevronRight className="h-3 w-3 theme-text-foreground" />
                  )}
                  <span className="font-semibold theme-text-foreground">
                    {feature.title}
                  </span>
                </button>

                <Popover
                  open={deletePopoverOpen === feature.id}
                  onOpenChange={(open) =>
                    setDeletePopoverOpen(open ? feature.id : null)
                  }
                >
                  <PopoverTrigger asChild>
                    <button
                      disabled={disabled}
                      className="theme-p-1 hover:theme-bg-destructive/10 theme-radius transition-colors disabled:opacity-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="h-3 w-3 theme-text-destructive" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto theme-p-3">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        onDeleteFeature(feature.id);
                        setDeletePopoverOpen(null);
                      }}
                      disabled={disabled}
                    >
                      Delete Feature
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>

              {isFeatureExpanded && (
                <div className="theme-p-3 theme-pt-0 space-y-2">
                  <div className="flex flex-col theme-gap-2">
                    <label className="font-semibold theme-text-foreground">
                      Title
                    </label>
                    <Input
                      value={feature.title}
                      onChange={(e) =>
                        onUpdateFeature(feature.id, { title: e.target.value })
                      }
                      disabled={disabled}
                      className="theme-font-sans theme-tracking "
                    />
                  </div>

                  <div className="flex flex-col theme-gap-2">
                    <label className="font-semibold theme-text-foreground">
                      Description
                    </label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) =>
                        onUpdateFeature(feature.id, {
                          description: e.target.value,
                        })
                      }
                      onKeyDown={(e) => e.stopPropagation()}
                      disabled={disabled}
                      className="theme-font-sans theme-tracking "
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={() => onAddFeature(pageId)}
          disabled={disabled}
          className="w-full flex items-center justify-start theme-gap-2 theme-px-2 theme-py-1.5 border border-dashed theme-border-accent theme-radius hover:theme-bg-muted/50 transition-colors disabled:opacity-50"
        >
          <Plus className="h-3 w-3 theme-text-muted-foreground" />
          <span className="text-sm theme-text-muted-foreground">
            Add Feature
          </span>
        </button>
      </div>
    </div>
  );
};
