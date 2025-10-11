"use client";

import { useEditorStore } from "@/app/(editor)/layout.stores";
import { Button } from "@/components/configuration/ui/button";
import { Input } from "@/components/configuration/ui/input";
import { Card } from "@/components/configuration/ui/card";
import { Badge } from "@/components/configuration/ui/badge";
import { cn } from "@/lib/tailwind.utils";
import { ScrollArea } from "@/components/editor/ui/scroll-area";

export const ThemeConfigurationPreview = () => {
  const { darkMode } = useEditorStore();

  return (
    <div
      className={cn(
        "flex-1",
        darkMode ? "bg-gray-900" : "bg-gray-50"
      )}
    >
      <ScrollArea className="h-full">
        <div className="p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h3
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider mb-4",
                  darkMode ? "text-gray-500" : "text-gray-500"
                )}
              >
                Buttons
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  className={cn(
                    darkMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
                >
                  Primary
                </Button>
                <Button variant="outline">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>

            <div>
              <h3
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider mb-4",
                  darkMode ? "text-gray-500" : "text-gray-500"
                )}
              >
                Inputs
              </h3>
              <div className="grid gap-4 max-w-md">
                <Input placeholder="Enter your email..." />
                <Input placeholder="Password" type="password" />
                <Input placeholder="Disabled" disabled />
              </div>
            </div>

            <div>
              <h3
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider mb-4",
                  darkMode ? "text-gray-500" : "text-gray-500"
                )}
              >
                Cards
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Card
                  className={cn(
                    "p-6",
                    darkMode
                      ? "bg-gray-950 border-gray-800"
                      : "bg-white border-gray-200"
                  )}
                >
                  <h4
                    className={cn(
                      "text-lg font-semibold mb-2",
                      darkMode ? "text-gray-100" : "text-gray-900"
                    )}
                  >
                    Card Title
                  </h4>
                  <p
                    className={cn(
                      "text-sm",
                      darkMode ? "text-gray-400" : "text-gray-600"
                    )}
                  >
                    This is a sample card with some content to preview the
                    theme styling.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm">Action</Button>
                    <Button size="sm" variant="outline">
                      Cancel
                    </Button>
                  </div>
                </Card>

                <Card
                  className={cn(
                    "p-6",
                    darkMode
                      ? "bg-gray-950 border-gray-800"
                      : "bg-white border-gray-200"
                  )}
                >
                  <h4
                    className={cn(
                      "text-lg font-semibold mb-2",
                      darkMode ? "text-gray-100" : "text-gray-900"
                    )}
                  >
                    Another Card
                  </h4>
                  <p
                    className={cn(
                      "text-sm",
                      darkMode ? "text-gray-400" : "text-gray-600"
                    )}
                  >
                    Cards adapt to the configured theme including colors,
                    radius, and shadows.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Badge
                      className={cn(
                        darkMode
                          ? "bg-blue-600 text-white"
                          : "bg-blue-600 text-white"
                      )}
                    >
                      New
                    </Badge>
                    <Badge variant="outline">Featured</Badge>
                  </div>
                </Card>
              </div>
            </div>

            <div>
              <h3
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider mb-4",
                  darkMode ? "text-gray-500" : "text-gray-500"
                )}
              >
                Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge
                  className={cn(
                    darkMode
                      ? "bg-blue-600 text-white"
                      : "bg-blue-600 text-white"
                  )}
                >
                  Primary
                </Badge>
                <Badge variant="outline">Secondary</Badge>
                <Badge variant="secondary">Default</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </div>

            <div>
              <h3
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider mb-4",
                  darkMode ? "text-gray-500" : "text-gray-500"
                )}
              >
                Typography
              </h3>
              <div className="space-y-3">
                <h1
                  className={cn(
                    "text-4xl font-bold",
                    darkMode ? "text-gray-100" : "text-gray-900"
                  )}
                >
                  Heading 1
                </h1>
                <h2
                  className={cn(
                    "text-3xl font-semibold",
                    darkMode ? "text-gray-100" : "text-gray-900"
                  )}
                >
                  Heading 2
                </h2>
                <h3
                  className={cn(
                    "text-2xl font-semibold",
                    darkMode ? "text-gray-100" : "text-gray-900"
                  )}
                >
                  Heading 3
                </h3>
                <p
                  className={cn(
                    "text-base",
                    darkMode ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  This is a paragraph of body text. It demonstrates how the
                  chosen typography settings affect regular content. The font
                  family, size, and color all follow the theme configuration.
                </p>
                <p
                  className={cn(
                    "text-sm",
                    darkMode ? "text-gray-400" : "text-gray-600"
                  )}
                >
                  This is smaller text, often used for captions or secondary
                  information.
                </p>
              </div>
            </div>

            <div>
              <h3
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider mb-4",
                  darkMode ? "text-gray-500" : "text-gray-500"
                )}
              >
                Form Example
              </h3>
              <Card
                className={cn(
                  "p-6 max-w-md",
                  darkMode
                    ? "bg-gray-950 border-gray-800"
                    : "bg-white border-gray-200"
                )}
              >
                <h4
                  className={cn(
                    "text-lg font-semibold mb-4",
                    darkMode ? "text-gray-100" : "text-gray-900"
                  )}
                >
                  Sign Up
                </h4>
                <div className="space-y-4">
                  <div>
                    <label
                      className={cn(
                        "text-sm font-medium mb-1.5 block",
                        darkMode ? "text-gray-300" : "text-gray-700"
                      )}
                    >
                      Email
                    </label>
                    <Input placeholder="you@example.com" type="email" />
                  </div>
                  <div>
                    <label
                      className={cn(
                        "text-sm font-medium mb-1.5 block",
                        darkMode ? "text-gray-300" : "text-gray-700"
                      )}
                    >
                      Password
                    </label>
                    <Input placeholder="••••••••" type="password" />
                  </div>
                  <Button className="w-full">Create Account</Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
