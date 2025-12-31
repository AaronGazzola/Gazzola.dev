"use client";

import { InferredFeature } from "../AppStructure.types";
import { Badge } from "@/components/editor/ui/badge";
import { Checkbox } from "@/components/editor/ui/checkbox";
import { Input } from "@/components/editor/ui/input";
import { Textarea } from "@/components/editor/ui/textarea";
import { ChevronDown, ChevronRight, Code, FileCode, Settings } from "lucide-react";
import { useState } from "react";

interface PageFeaturesAccordionItemProps {
  pageName: string;
  pageRoute: string;
  features: InferredFeature[];
  isExpanded: boolean;
  onToggle: () => void;
  onUpdateFeature: (featureId: string, updates: Partial<InferredFeature>) => void;
  disabled?: boolean;
}

export const PageFeaturesAccordionItem = ({
  pageName,
  pageRoute,
  features,
  isExpanded,
  onToggle,
  onUpdateFeature,
  disabled = false,
}: PageFeaturesAccordionItemProps) => {
  const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>(
    features.length > 0 ? features[0].id : null
  );

  return (
    <div className="theme-border theme-border-border theme-radius theme-bg-muted/30">
      <button
        onClick={onToggle}
        disabled={disabled}
        className="w-full flex items-center justify-between theme-p-3 hover:theme-bg-muted/50 theme-radius transition-colors disabled:opacity-50"
      >
        <div className="flex items-center theme-gap-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 theme-text-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 theme-text-foreground" />
          )}
          <div className="flex items-center theme-gap-2">
            <span className="font-semibold theme-text-foreground">
              {pageName}
            </span>
            <span className="text-xs theme-font-mono theme-bg-secondary theme-text-secondary-foreground px-1.5 py-0.5 theme-radius">
              {pageRoute}
            </span>
          </div>
        </div>
        <Badge variant="secondary" className="theme-font-sans theme-tracking">
          {features.length} {features.length === 1 ? 'feature' : 'features'}
        </Badge>
      </button>

      {isExpanded && (
        <div className="theme-p-3 theme-pt-0 space-y-2">
          {features.map((feature) => {
            const isFeatureExpanded = expandedFeatureId === feature.id;

            return (
              <div
                key={feature.id}
                className="theme-border theme-border-border theme-radius theme-bg-background"
              >
                <button
                  onClick={() => setExpandedFeatureId(isFeatureExpanded ? null : feature.id)}
                  disabled={disabled}
                  className="w-full flex items-center theme-gap-2 theme-p-2 hover:theme-bg-muted/50 theme-radius transition-colors disabled:opacity-50"
                >
                  {isFeatureExpanded ? (
                    <ChevronDown className="h-3 w-3 theme-text-foreground" />
                  ) : (
                    <ChevronRight className="h-3 w-3 theme-text-foreground" />
                  )}
                  <span className="font-semibold text-sm theme-text-foreground">
                    {feature.title}
                  </span>
                </button>

                {isFeatureExpanded && (
                  <div className="theme-p-3 theme-pt-0 space-y-2">
                    <div className="flex flex-col theme-gap-2">
                      <label className="text-xs font-semibold theme-text-foreground">Title</label>
                      <Input
                        value={feature.title}
                        onChange={(e) =>
                          onUpdateFeature(feature.id, { title: e.target.value })
                        }
                        disabled={disabled}
                        className="theme-font-sans theme-tracking text-sm"
                      />
                    </div>

                    <div className="flex flex-col theme-gap-2">
                      <label className="text-xs font-semibold theme-text-foreground">Description</label>
                      <Textarea
                        value={feature.description}
                        onChange={(e) =>
                          onUpdateFeature(feature.id, { description: e.target.value })
                        }
                        disabled={disabled}
                        className="theme-font-sans theme-tracking text-sm"
                        rows={3}
                      />
                    </div>

                    <div className="flex flex-col theme-gap-2">
                      <label className="text-xs font-semibold theme-text-foreground">Utility Files</label>
                      <div className="flex flex-col lg:flex-row gap-3">
                        <div className="flex items-center theme-gap-2">
                          <Checkbox
                            checked={feature.utilityFileNeeds.hooks}
                            onCheckedChange={() =>
                              onUpdateFeature(feature.id, {
                                utilityFileNeeds: {
                                  ...feature.utilityFileNeeds,
                                  hooks: !feature.utilityFileNeeds.hooks,
                                },
                              })
                            }
                            disabled={disabled}
                          />
                          <label className="flex items-center theme-gap-1 text-sm theme-text-foreground cursor-pointer"
                            onClick={() =>
                              onUpdateFeature(feature.id, {
                                utilityFileNeeds: {
                                  ...feature.utilityFileNeeds,
                                  hooks: !feature.utilityFileNeeds.hooks,
                                },
                              })
                            }
                          >
                            <FileCode className="h-3 w-3" />
                            hooks
                          </label>
                        </div>

                        <div className="flex items-center theme-gap-2">
                          <Checkbox
                            checked={feature.utilityFileNeeds.actions}
                            onCheckedChange={() =>
                              onUpdateFeature(feature.id, {
                                utilityFileNeeds: {
                                  ...feature.utilityFileNeeds,
                                  actions: !feature.utilityFileNeeds.actions,
                                },
                              })
                            }
                            disabled={disabled}
                          />
                          <label className="flex items-center theme-gap-1 text-sm theme-text-foreground cursor-pointer"
                            onClick={() =>
                              onUpdateFeature(feature.id, {
                                utilityFileNeeds: {
                                  ...feature.utilityFileNeeds,
                                  actions: !feature.utilityFileNeeds.actions,
                                },
                              })
                            }
                          >
                            <Code className="h-3 w-3" />
                            actions
                          </label>
                        </div>

                        <div className="flex items-center theme-gap-2">
                          <Checkbox
                            checked={feature.utilityFileNeeds.stores}
                            onCheckedChange={() =>
                              onUpdateFeature(feature.id, {
                                utilityFileNeeds: {
                                  ...feature.utilityFileNeeds,
                                  stores: !feature.utilityFileNeeds.stores,
                                },
                              })
                            }
                            disabled={disabled}
                          />
                          <label className="flex items-center theme-gap-1 text-sm theme-text-foreground cursor-pointer"
                            onClick={() =>
                              onUpdateFeature(feature.id, {
                                utilityFileNeeds: {
                                  ...feature.utilityFileNeeds,
                                  stores: !feature.utilityFileNeeds.stores,
                                },
                              })
                            }
                          >
                            <Settings className="h-3 w-3" />
                            stores
                          </label>
                        </div>

                        <div className="flex items-center theme-gap-2">
                          <Checkbox
                            checked={feature.utilityFileNeeds.types}
                            onCheckedChange={() =>
                              onUpdateFeature(feature.id, {
                                utilityFileNeeds: {
                                  ...feature.utilityFileNeeds,
                                  types: !feature.utilityFileNeeds.types,
                                },
                              })
                            }
                            disabled={disabled}
                          />
                          <label className="flex items-center theme-gap-1 text-sm theme-text-foreground cursor-pointer"
                            onClick={() =>
                              onUpdateFeature(feature.id, {
                                utilityFileNeeds: {
                                  ...feature.utilityFileNeeds,
                                  types: !feature.utilityFileNeeds.types,
                                },
                              })
                            }
                          >
                            <FileCode className="h-3 w-3" />
                            types
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
