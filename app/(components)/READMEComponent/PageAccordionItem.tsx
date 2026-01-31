import { Badge } from "@/components/editor/ui/badge";
import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import { Textarea } from "@/components/editor/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/editor/ui/select";
import { ChevronDown, ChevronRight, Trash2, X, Shield } from "lucide-react";
import { LayoutInput, PageAccess, PageInput } from "../READMEComponent.types";

interface PageAccordionItemProps {
  page: PageInput;
  index: number;
  totalPages: number;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (id: string, updates: Partial<PageInput>) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
  pageAccess?: PageAccess;
  onUpdateAccess?: (
    pageId: string,
    level: "anon" | "auth" | "admin",
    value: boolean
  ) => void;
  layouts?: LayoutInput[];
}

const MIN_PAGE_NAME_LENGTH = 2;
const MIN_PAGE_DESCRIPTION_LENGTH = 20;

export const PageAccordionItem = ({
  page,
  index,
  totalPages,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
  disabled = false,
  pageAccess,
  onUpdateAccess,
  layouts = [],
}: PageAccordionItemProps) => {
  const validateRoute = (route: string): boolean => {
    if (!route.trim()) return true;
    return /^\/[a-zA-Z0-9\-/\[\]]*$/.test(route);
  };

  const isRouteValid = validateRoute(page.route);
  const isNameValid =
    page.name.trim().length >= MIN_PAGE_NAME_LENGTH || !page.name.trim();
  const isDescriptionValid =
    page.description.trim().length >= MIN_PAGE_DESCRIPTION_LENGTH ||
    !page.description.trim();

  return (
    <div
      className={`flex flex-col theme-gap-2 theme-p-2 theme-bg-muted theme-radius border theme-border-border`}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={onToggle}
          disabled={disabled}
          className="flex items-center theme-gap-2 flex-1 text-left theme-p-1 hover:theme-bg-muted-foreground/10 theme-radius disabled:opacity-50"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 theme-text-primary shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 theme-text-primary shrink-0" />
          )}
          <div className="flex items-center theme-gap-2 flex-wrap">
            <span className="text-sm font-semibold theme-text-foreground">
              {page.name || `Page ${index + 1}`}
            </span>
            {page.route && (
              <span className="hidden sm:inline-block text-xs theme-font-mono theme-bg-secondary theme-text-secondary-foreground px-1.5 py-0.5 theme-radius">
                {page.route}
              </span>
            )}
            {page.isAuthRequired && (
              <Badge
                variant="outline"
                className="theme-gap-1 text-xs h-5 px-1.5 theme-border-primary theme-text-primary"
              >
                <Shield className="h-3 w-3" />
                Required by Auth
              </Badge>
            )}
          </div>
        </button>
        {totalPages > 1 && !page.isAuthRequired && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(page.id)}
            disabled={disabled}
            className="h-6 px-2 theme-text-destructive hover:theme-text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="flex flex-col theme-gap-3 theme-pl-6 theme-pt-2">
          {page.isAuthRequired && (
            <div className="flex items-start theme-gap-2 theme-p-2 theme-bg-primary/10 theme-radius theme-border theme-border-primary/20">
              <Shield className="h-4 w-4 theme-text-primary mt-0.5 shrink-0" />
              <p className="text-xs theme-text-foreground">
                This page is required for the authentication method(s) you
                selected and cannot be modified or removed.
              </p>
            </div>
          )}

          <div className="flex flex-col theme-gap-1">
            <label className="text-xs font-semibold theme-text-foreground">
              Page Name
            </label>
            <Input
              value={page.name}
              onChange={(e) => onUpdate(page.id, { name: e.target.value })}
              placeholder="Home"
              disabled={disabled || page.isAuthRequired}
              className={`theme-shadow ${!isNameValid ? "border-destructive" : ""} ${page.isAuthRequired ? "opacity-100 cursor-not-allowed" : ""}`}
            />
            {!isNameValid && (
              <p className="text-xs theme-text-destructive">
                Must be at least {MIN_PAGE_NAME_LENGTH} characters
              </p>
            )}
          </div>

          <div className="flex flex-col theme-gap-1">
            <label className="text-xs font-semibold theme-text-foreground">
              Route (optional)
            </label>
            <Input
              value={page.route}
              onChange={(e) => onUpdate(page.id, { route: e.target.value })}
              placeholder="/"
              disabled={disabled || page.isAuthRequired}
              className={`theme-shadow theme-font-mono ${!isRouteValid ? "border-destructive" : ""} ${page.isAuthRequired ? "opacity-100 cursor-not-allowed" : ""}`}
            />
            {!isRouteValid && (
              <p className="text-xs theme-text-destructive">
                Route must start with / and use letters, numbers, hyphens, or
                brackets
              </p>
            )}
          </div>

          <div className="flex flex-col theme-gap-1">
            <label className="text-xs font-semibold theme-text-foreground">
              Description
            </label>
            <Textarea
              value={page.description}
              onChange={(e) =>
                onUpdate(page.id, { description: e.target.value })
              }
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="Describe what users see and do on this page..."
              disabled={disabled || page.isAuthRequired}
              className={`theme-shadow min-h-[80px] ${!isDescriptionValid ? "border-destructive" : ""} ${page.isAuthRequired ? "opacity-100 cursor-not-allowed" : ""}`}
            />
            <p
              className={`text-xs ${isDescriptionValid ? "theme-text-muted-foreground" : "theme-text-destructive"} font-semibold`}
            >
              Minimum {MIN_PAGE_DESCRIPTION_LENGTH} characters
              {page.description.length > 0 &&
                ` (${page.description.trim().length}/${MIN_PAGE_DESCRIPTION_LENGTH})`}
            </p>
          </div>

          {layouts.length > 0 && (
            <div className="flex flex-col theme-gap-2">
              <label className="text-xs font-semibold theme-text-foreground">
                Layouts (optional)
              </label>
              {page.layoutIds.length > 0 && (
                <div className="flex flex-wrap theme-gap-2">
                  {page.layoutIds.map((layoutId) => {
                    const layout = layouts.find((l) => l.id === layoutId);
                    if (!layout) return null;
                    return (
                      <Badge
                        key={layoutId}
                        variant="secondary"
                        className={`theme-gap-1 ${!page.isAuthRequired ? "cursor-pointer" : ""}`}
                      >
                        {layout.name}
                        {!page.isAuthRequired && (
                          <X
                            className="h-3 w-3"
                            onClick={() =>
                              !disabled &&
                              onUpdate(page.id, {
                                layoutIds: page.layoutIds.filter(
                                  (id) => id !== layoutId
                                ),
                              })
                            }
                          />
                        )}
                      </Badge>
                    );
                  })}
                </div>
              )}
              {!page.isAuthRequired &&
                layouts.filter((l) => !page.layoutIds.includes(l.id)).length >
                  0 && (
                  <Select
                    disabled={disabled}
                    onValueChange={(layoutId) => {
                      if (!page.layoutIds.includes(layoutId)) {
                        onUpdate(page.id, {
                          layoutIds: [...page.layoutIds, layoutId],
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="w-full theme-shadow">
                      <SelectValue placeholder="Add layout..." />
                    </SelectTrigger>
                    <SelectContent>
                      {layouts
                        .filter((l) => !page.layoutIds.includes(l.id))
                        .map((layout) => (
                          <SelectItem key={layout.id} value={layout.id}>
                            {layout.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
            </div>
          )}

          {onUpdateAccess && (
            <div className="flex flex-col theme-gap-2">
              <label className="text-xs font-semibold theme-text-foreground">
                Who can access this page?
              </label>
              <div className="flex theme-gap-2 mb-2">
                <Badge
                  variant={pageAccess?.anon ? "default" : "outline"}
                  className={!page.isAuthRequired ? "cursor-pointer" : ""}
                  onClick={() =>
                    !disabled &&
                    !page.isAuthRequired &&
                    onUpdateAccess(page.id, "anon", !pageAccess?.anon)
                  }
                >
                  Anon
                </Badge>
                <Badge
                  variant={pageAccess?.auth ? "default" : "outline"}
                  className={!page.isAuthRequired ? "cursor-pointer" : ""}
                  onClick={() =>
                    !disabled &&
                    !page.isAuthRequired &&
                    onUpdateAccess(page.id, "auth", !pageAccess?.auth)
                  }
                >
                  Auth
                </Badge>
                <Badge
                  variant={pageAccess?.admin ? "default" : "outline"}
                  className={!page.isAuthRequired ? "cursor-pointer" : ""}
                  onClick={() =>
                    !disabled &&
                    !page.isAuthRequired &&
                    onUpdateAccess(page.id, "admin", !pageAccess?.admin)
                  }
                >
                  Admin
                </Badge>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
