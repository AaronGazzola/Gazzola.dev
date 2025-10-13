"use client";

import { Badge } from "@/components/editor/ui/badge";
import { Button } from "@/components/editor/ui/button";
import { Calendar } from "@/components/editor/ui/calendar";
import { Card } from "@/components/editor/ui/card";
import { Checkbox } from "@/components/editor/ui/checkbox";
import { Input } from "@/components/editor/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/editor/ui/radio-group";
import { ScrollArea } from "@/components/editor/ui/scroll-area";
import { Textarea } from "@/components/editor/ui/textarea";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export const ThemeConfigurationPreview = () => {
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 5, 5));

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="theme-p-6">
        <div className="flex theme-gap-6" style={{ alignItems: "flex-start" }}>
          <div className="flex-1 flex flex-col theme-gap-6">
            <Card>
              <div className="flex flex-col theme-gap-3  theme-p-6">
                <div className="text-sm theme-text-muted-foreground">
                  Total Revenue
                </div>
                <div className="text-3xl font-bold theme-text-foreground">
                  $15,231.89
                </div>
                <div className="text-xs theme-text-muted-foreground theme-mb-2">
                  +20.1% from last month
                </div>
                <svg
                  viewBox="0 0 400 100"
                  style={{ width: "100%", height: "60px" }}
                >
                  <polyline
                    fill="none"
                    className="theme-text-primary"
                    stroke="currentColor"
                    strokeWidth="2"
                    points="0,80 50,70 100,75 150,65 200,70 250,60 300,45 350,30 400,20"
                  />
                  {[0, 50, 100, 150, 200, 250, 300, 350, 400].map((x, i) => {
                    const y = [80, 70, 75, 65, 70, 60, 45, 30, 20][i];
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="3"
                        className="theme-text-primary"
                        fill="currentColor"
                      />
                    );
                  })}
                </svg>
              </div>
            </Card>

            <Card>
              <div className=" theme-p-6">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="w-full"
                />
              </div>
            </Card>

            <Card>
              <div className="flex flex-col theme-gap-4  theme-p-6">
                <div className="flex flex-col theme-gap-2">
                  <div className="font-semibold theme-text-foreground">
                    Move Goal
                  </div>
                  <div className="text-sm theme-text-muted-foreground">
                    Set your daily activity goal.
                  </div>
                </div>
                <div className="flex items-center justify-center theme-gap-6">
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-7 rounded-full"
                  >
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">Decrease</span>
                  </Button>
                  <div className="text-center flex flex-col theme-gap-1">
                    <div className="text-4xl font-bold tracking-tighter tabular-nums">
                      350
                    </div>
                    <div className="text-xs uppercase theme-text-muted-foreground">
                      Calories/day
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-7 rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Increase</span>
                  </Button>
                </div>
                <div
                  className="grid theme-gap-2"
                  style={{
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gridTemplateRows: "1fr 1fr",
                  }}
                >
                  {[
                    2.4, 3.2, 3.6, 4, 2.8, 2, 1.6, 2.4, 3.2, 3.6, 4, 2.8, 2,
                    1.6,
                  ].map((height, i) => (
                    <div
                      key={i}
                      className="theme-bg-primary theme-radius"
                      style={{
                        height: `calc(var(--theme-spacing) * ${height})`,
                        opacity: i < 7 ? "1" : "0.3",
                        alignSelf: i < 7 ? "end" : "start",
                      }}
                    />
                  ))}
                </div>
                <Button variant="secondary" className="w-full">
                  Set Goal
                </Button>
              </div>
            </Card>

            <Card>
              <div className="flex flex-col theme-gap-4  theme-p-6">
                <div className="flex flex-col theme-gap-2">
                  <div className="font-semibold theme-text-foreground">
                    Exercise Minutes
                  </div>
                  <div className="text-sm theme-text-muted-foreground">
                    Your exercise minutes are ahead of where you normally are.
                  </div>
                </div>
                <svg
                  viewBox="0 0 500 200"
                  style={{ width: "100%", height: "150px" }}
                >
                  <polyline
                    fill="none"
                    className="theme-text-chart-1"
                    stroke="currentColor"
                    strokeWidth="2"
                    points="0,150 71,120 142,100 213,50 284,80 355,90 426,100 500,110"
                  />
                  <polyline
                    fill="none"
                    className="theme-text-chart-2"
                    stroke="currentColor"
                    strokeWidth="2"
                    points="0,180 71,170 142,165 213,160 284,155 355,150 426,155 500,160"
                  />
                  <polyline
                    fill="none"
                    className="theme-text-chart-3"
                    stroke="currentColor"
                    strokeWidth="2"
                    points="0,160 71,155 142,145 213,140 284,135 355,145 426,150 500,145"
                  />
                  <g
                    className="text-xs theme-text-muted-foreground"
                    fill="currentColor"
                  >
                    <text x="35" y="195">
                      Mon
                    </text>
                    <text x="106" y="195">
                      Tue
                    </text>
                    <text x="177" y="195">
                      Wed
                    </text>
                    <text x="248" y="195">
                      Thu
                    </text>
                    <text x="323" y="195">
                      Fri
                    </text>
                    <text x="394" y="195">
                      Sat
                    </text>
                    <text x="465" y="195">
                      Sun
                    </text>
                  </g>
                </svg>
              </div>
            </Card>
          </div>

          <div className="flex-1 flex flex-col theme-gap-6 theme-rounded">
            <Card>
              <div className="flex flex-col theme-gap-4  theme-p-6">
                <div className="flex flex-col theme-gap-2">
                  <div className="font-semibold theme-text-foreground">
                    Upgrade your subscription
                  </div>
                  <div className="text-sm theme-text-muted-foreground">
                    You are currently on the free plan. Upgrade to the pro plan
                    to get access to all features.
                  </div>
                </div>
                <div className="flex flex-col theme-gap-4">
                  <div className="flex theme-gap-4">
                    <div className="flex-1 flex flex-col theme-gap-2">
                      <label className="text-sm font-medium" htmlFor="name">
                        Name
                      </label>
                      <Input id="name" placeholder="Evil Rabbit" />
                    </div>
                    <div className="flex-1 flex flex-col theme-gap-2">
                      <label className="text-sm font-medium" htmlFor="email">
                        Email
                      </label>
                      <Input id="email" placeholder="example@acme.com" />
                    </div>
                  </div>

                  <div className="flex flex-col theme-gap-2">
                    <label
                      className="text-sm font-medium"
                      htmlFor="card-number"
                    >
                      Card Number
                    </label>
                    <div
                      className="grid theme-gap-2"
                      style={{ gridTemplateColumns: "1fr 80px 60px" }}
                    >
                      <Input
                        id="card-number"
                        placeholder="1234 1234 1234 1234"
                      />
                      <Input id="card-expiry" placeholder="MM/YY" />
                      <Input id="card-cvc" placeholder="CVC" />
                    </div>
                  </div>

                  <fieldset className="flex flex-col theme-gap-2">
                    <legend className="text-sm font-medium">Plan</legend>
                    <p className="text-sm theme-text-muted-foreground theme-mb-2">
                      Select the plan that best fits your needs.
                    </p>
                    <RadioGroup
                      defaultValue="starter"
                      className="grid theme-gap-2"
                    >
                      <label
                        className="flex items-start theme-gap-3 theme-radius theme-border-border theme-p-6"
                        style={{ borderWidth: "1px" }}
                      >
                        <RadioGroupItem value="starter" id="starter" />
                        <div className="grid theme-gap-1">
                          <div className="font-medium">Starter Plan</div>
                          <div className="text-xs theme-text-muted-foreground">
                            Perfect for small businesses.
                          </div>
                        </div>
                      </label>
                      <label
                        className="flex items-start theme-gap-3 theme-radius theme-border-border theme-p-6"
                        style={{ borderWidth: "1px" }}
                      >
                        <RadioGroupItem value="pro" id="pro" />
                        <div className="grid theme-gap-1">
                          <div className="font-medium">Pro Plan</div>
                          <div className="text-xs theme-text-muted-foreground">
                            More features and storage.
                          </div>
                        </div>
                      </label>
                    </RadioGroup>
                  </fieldset>

                  <div className="flex flex-col theme-gap-2">
                    <label className="text-sm font-medium" htmlFor="notes">
                      Notes
                    </label>
                    <Textarea id="notes" placeholder="Enter notes" />
                  </div>

                  <div className="flex flex-col theme-gap-2">
                    <div className="flex items-center theme-gap-2">
                      <Checkbox id="terms" />
                      <label className="text-sm" htmlFor="terms">
                        I agree to the terms and conditions
                      </label>
                    </div>
                    <div className="flex items-center theme-gap-2">
                      <Checkbox id="marketing" defaultChecked />
                      <label className="text-sm" htmlFor="marketing">
                        Allow us to send you emails
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex flex-col theme-gap-4  theme-p-6">
                <div className="flex flex-col theme-gap-2">
                  <div className="font-semibold theme-text-foreground">
                    Payments
                  </div>
                  <div className="text-sm theme-text-muted-foreground">
                    Manage your payments.
                  </div>
                </div>
                <div className="flex flex-col theme-gap-3">
                  {[
                    {
                      status: "success",
                      email: "ken99@example.com",
                      amount: "$316.00",
                    },
                    {
                      status: "success",
                      email: "Abe45@example.com",
                      amount: "$242.00",
                    },
                    {
                      status: "processing",
                      email: "Monserrat44@example.com",
                      amount: "$837.00",
                    },
                    {
                      status: "failed",
                      email: "carmella@example.com",
                      amount: "$721.00",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center theme-gap-3 theme-radius theme-border-border  theme-p-6"
                      style={{ borderWidth: "1px" }}
                    >
                      <Checkbox />
                      <div className="flex-1 grid theme-gap-1">
                        <Badge
                          variant={
                            item.status === "success"
                              ? "default"
                              : item.status === "processing"
                                ? "secondary"
                                : "destructive"
                          }
                          style={{ width: "fit-content" }}
                        >
                          {item.status}
                        </Badge>
                        <div className="text-sm theme-text-foreground">
                          {item.email}
                        </div>
                      </div>
                      <div className="font-semibold theme-text-foreground">
                        {item.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
