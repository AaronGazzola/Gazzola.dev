"use client";

import { Card } from "@/components/editor/ui/card";
import { Button } from "@/components/editor/ui/button";
import { Input } from "@/components/editor/ui/input";
import { Badge } from "@/components/editor/ui/badge";
import { Checkbox } from "@/components/editor/ui/checkbox";
import { Switch } from "@/components/editor/ui/switch";
import { Slider } from "@/components/editor/ui/slider";
import { ScrollArea } from "@/components/editor/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/editor/ui/radio-group";
import { Minus, Plus } from "lucide-react";

export const ThemeConfigurationPreview = () => {
  return (
    <ScrollArea className="flex-1 h-full">
      <div className="p-[calc(var(--spacing)*1rem)]">
        <div className="grid gap-[calc(var(--spacing)*1rem)] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card>
            <div className="p-[calc(var(--spacing)*1.5rem)]">
              <div className="text-sm text-muted-foreground">Total Revenue</div>
              <div className="text-3xl font-semibold tracking-tight">$15,231.89</div>
              <div className="text-sm text-muted-foreground">+20.1% from last month</div>
            </div>
          </Card>

          <Card>
            <div className="p-[calc(var(--spacing)*1.5rem)]">
              <div className="text-sm text-muted-foreground">Subscriptions</div>
              <div className="text-3xl font-semibold tracking-tight">+2,350</div>
              <div className="text-sm text-muted-foreground">+180.1% from last month</div>
            </div>
          </Card>

          <Card>
            <div className="p-[calc(var(--spacing)*1.5rem)]">
              <div className="font-semibold">Move Goal</div>
              <div className="text-sm text-muted-foreground mt-1">Set your daily activity goal.</div>
              <div className="flex items-center justify-center gap-[calc(var(--spacing)*1rem)] mt-6">
                <Button size="icon" variant="outline" className="size-7 rounded-full">
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease</span>
                </Button>
                <div className="text-center">
                  <div className="text-4xl font-bold tracking-tighter tabular-nums">350</div>
                  <div className="text-xs uppercase text-muted-foreground">Calories/day</div>
                </div>
                <Button size="icon" variant="outline" className="size-7 rounded-full">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase</span>
                </Button>
              </div>
              <div className="mt-6">
                <Button variant="secondary" className="w-full">Set Goal</Button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-[calc(var(--spacing)*1.5rem)]">
              <div className="font-semibold">Volume</div>
              <div className="text-sm text-muted-foreground mt-1">Adjust the volume level.</div>
              <div className="mt-6 space-y-[calc(var(--spacing)*1rem)]">
                <Slider defaultValue={[50]} max={100} step={1} />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="md:col-span-2 lg:col-span-3 xl:col-span-2">
            <div className="p-[calc(var(--spacing)*1.5rem)]">
              <div className="text-lg font-semibold tracking-tight">Upgrade your subscription</div>
              <div className="text-sm text-muted-foreground text-balance mt-2">
                You are currently on the free plan. Upgrade to the pro plan to get access to all features.
              </div>
              <div className="flex flex-col gap-[calc(var(--spacing)*1.5rem)] mt-6">
                <div className="flex flex-col gap-[calc(var(--spacing)*0.75rem)] lg:flex-row">
                  <div className="flex flex-1 flex-col gap-[calc(var(--spacing)*0.5rem)]">
                    <label className="text-sm font-medium" htmlFor="name">Name</label>
                    <Input id="name" placeholder="Evil Rabbit" />
                  </div>
                  <div className="flex flex-1 flex-col gap-[calc(var(--spacing)*0.5rem)]">
                    <label className="text-sm font-medium" htmlFor="email">Email</label>
                    <Input id="email" placeholder="example@acme.com" />
                  </div>
                </div>

                <div className="flex flex-col gap-[calc(var(--spacing)*0.5rem)]">
                  <label className="text-sm font-medium" htmlFor="card-number">Card Number</label>
                  <div className="grid grid-cols-2 gap-[calc(var(--spacing)*0.75rem)] lg:grid-cols-[1fr_80px_60px]">
                    <Input className="col-span-2 lg:col-span-1" id="card-number" placeholder="1234 1234 1234 1234" />
                    <Input id="card-expiry" placeholder="MM/YY" />
                    <Input id="card-cvc" placeholder="CVC" />
                  </div>
                </div>

                <fieldset className="flex flex-col gap-[calc(var(--spacing)*0.75rem)]">
                  <legend className="text-sm font-medium">Plan</legend>
                  <p className="text-sm text-muted-foreground">Select the plan that best fits your needs.</p>
                  <RadioGroup defaultValue="starter" className="grid gap-[calc(var(--spacing)*0.75rem)] lg:grid-cols-2">
                    <label className="flex items-start gap-[calc(var(--spacing)*0.75rem)] rounded-lg border p-[calc(var(--spacing)*0.75rem)] has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-input/20">
                      <RadioGroupItem value="starter" id="starter" />
                      <div className="grid gap-[calc(var(--spacing)*0.25rem)]">
                        <div className="font-medium">Starter Plan</div>
                        <div className="text-xs text-muted-foreground">Perfect for small businesses.</div>
                      </div>
                    </label>
                    <label className="flex items-start gap-[calc(var(--spacing)*0.75rem)] rounded-lg border p-[calc(var(--spacing)*0.75rem)] has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-input/20">
                      <RadioGroupItem value="pro" id="pro" />
                      <div className="grid gap-[calc(var(--spacing)*0.25rem)]">
                        <div className="font-medium">Pro Plan</div>
                        <div className="text-xs text-muted-foreground">More features and storage.</div>
                      </div>
                    </label>
                  </RadioGroup>
                </fieldset>

                <div className="flex flex-col gap-[calc(var(--spacing)*0.75rem)]">
                  <div className="flex items-center gap-[calc(var(--spacing)*0.5rem)]">
                    <Checkbox id="terms" />
                    <label className="text-sm" htmlFor="terms">
                      I agree to the terms and conditions
                    </label>
                  </div>
                  <div className="flex items-center gap-[calc(var(--spacing)*0.5rem)]">
                    <Checkbox id="marketing" />
                    <label className="text-sm" htmlFor="marketing">
                      Send me marketing emails
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="md:col-span-2">
            <div className="p-[calc(var(--spacing)*1.5rem)]">
              <div className="font-semibold">Settings</div>
              <div className="text-sm text-muted-foreground mt-1">Manage your account settings.</div>
              <div className="flex flex-col gap-[calc(var(--spacing)*1rem)] mt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-[calc(var(--spacing)*0.125rem)]">
                    <div className="text-sm font-medium">Email Notifications</div>
                    <div className="text-xs text-muted-foreground">Receive email about your account activity</div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-[calc(var(--spacing)*0.125rem)]">
                    <div className="text-sm font-medium">Marketing Emails</div>
                    <div className="text-xs text-muted-foreground">Receive emails about new products</div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-[calc(var(--spacing)*0.125rem)]">
                    <div className="text-sm font-medium">Social Media</div>
                    <div className="text-xs text-muted-foreground">Allow social media connections</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-[calc(var(--spacing)*1.5rem)]">
              <div className="font-semibold">Status</div>
              <div className="text-sm text-muted-foreground mt-1">Current project status.</div>
              <div className="flex flex-wrap gap-[calc(var(--spacing)*0.5rem)] mt-6">
                <Badge>Active</Badge>
                <Badge variant="secondary">In Progress</Badge>
                <Badge variant="outline">Pending</Badge>
                <Badge variant="destructive">Blocked</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};
