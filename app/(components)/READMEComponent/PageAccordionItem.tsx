import { Badge } from "@/components/editor/ui/badge";
import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import { Textarea } from "@/components/editor/ui/textarea";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { PageAccess, PageInput } from "../READMEComponent.types";

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
    level: "public" | "user" | "admin",
    value: boolean
  ) => void;
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
}: PageAccordionItemProps) => {
  const validateRoute = (route: string): boolean => {
    if (!route.trim()) return true;
    return /^\/[a-z0-9\-/\[\]]*$/.test(route);
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
          <div className="flex items-center theme-gap-2">
            <span className="text-sm font-semibold theme-text-foreground">
              {page.name || `Page ${index + 1}`}
            </span>
            {page.route && (
              <span className="hidden sm:inline-block text-xs theme-font-mono theme-bg-secondary theme-text-secondary-foreground px-1.5 py-0.5 theme-radius">
                {page.route}
              </span>
            )}
          </div>
        </button>
        {totalPages > 1 && (
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
          <div className="flex flex-col theme-gap-1">
            <label className="text-xs font-semibold theme-text-foreground">
              Page Name
            </label>
            <Input
              value={page.name}
              onChange={(e) => onUpdate(page.id, { name: e.target.value })}
              placeholder="Home"
              disabled={disabled}
              className={`theme-shadow ${!isNameValid ? "border-destructive" : ""}`}
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
              disabled={disabled}
              className={`theme-shadow theme-font-mono ${!isRouteValid ? "border-destructive" : ""}`}
            />
            {!isRouteValid && (
              <p className="text-xs theme-text-destructive">
                Route must start with / and use lowercase letters, numbers,
                hyphens, or brackets
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
              placeholder="Describe what users see and do on this page..."
              disabled={disabled}
              className={`theme-shadow min-h-[80px] ${!isDescriptionValid ? "border-destructive" : ""}`}
            />
            <p
              className={`text-xs ${isDescriptionValid ? "theme-text-muted-foreground" : "theme-text-destructive"} font-semibold`}
            >
              Minimum {MIN_PAGE_DESCRIPTION_LENGTH} characters
              {page.description.length > 0 &&
                ` (${page.description.trim().length}/${MIN_PAGE_DESCRIPTION_LENGTH})`}
            </p>
          </div>

          {onUpdateAccess && (
            <div className="flex flex-col theme-gap-2">
              <label className="text-xs font-semibold theme-text-foreground">
                Who can access this page?
              </label>
              <div className="flex theme-gap-2 mb-2">
                <Badge
                  variant={pageAccess?.public ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    !disabled &&
                    onUpdateAccess(page.id, "public", !pageAccess?.public)
                  }
                >
                  Public
                </Badge>
                <Badge
                  variant={pageAccess?.user ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    !disabled &&
                    onUpdateAccess(page.id, "user", !pageAccess?.user)
                  }
                >
                  User
                </Badge>
                <Badge
                  variant={pageAccess?.admin ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    !disabled &&
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
