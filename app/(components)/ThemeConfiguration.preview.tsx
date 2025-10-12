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
import { Calendar } from "@/components/editor/ui/calendar";
import { Textarea } from "@/components/editor/ui/textarea";
import { Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export const ThemeConfigurationPreview = () => {
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 5, 5));

  return (
    <ScrollArea className="flex-1 h-full">
      <div style={{ padding: "calc(var(--theme-spacing) * 4)" }}>
        <div style={{ display: "grid", gap: "calc(var(--theme-spacing) * 4)", gridTemplateColumns: "repeat(2, 1fr)" }}>
          <Card>
            <div style={{ padding: "calc(var(--theme-spacing) * 6)", display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 6)" }}>
              <div style={{ fontSize: "0.875rem", color: "var(--theme-muted-foreground)" }}>Total Revenue</div>
              <div style={{ fontSize: "1.875rem", fontWeight: "700" }}>$15,231.89</div>
              <div style={{ fontSize: "0.75rem", color: "var(--theme-muted-foreground)" }}>+20.1% from last month</div>
              <svg viewBox="0 0 400 100" style={{ width: "100%", height: "60px" }}>
                <polyline
                  fill="none"
                  stroke="var(--theme-primary)"
                  strokeWidth="2"
                  points="0,80 50,70 100,75 150,65 200,70 250,60 300,45 350,30 400,20"
                />
                {[0,50,100,150,200,250,300,350,400].map((x, i) => {
                  const y = [80,70,75,65,70,60,45,30,20][i];
                  return <circle key={i} cx={x} cy={y} r="3" fill="var(--theme-primary)" />;
                })}
              </svg>
            </div>
          </Card>

          <Card>
            <div style={{ padding: "calc(var(--theme-spacing) * 6)" }}>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full"
              />
            </div>
          </Card>

          <Card>
            <div style={{ padding: "calc(var(--theme-spacing) * 6)", display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 4)" }}>
              <div>
                <div style={{ fontWeight: "600" }}>Move Goal</div>
                <div style={{ fontSize: "0.875rem", color: "var(--theme-muted-foreground)", marginTop: "calc(var(--theme-spacing) * 4)" }}>Set your daily activity goal.</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--theme-spacing)" }}>
                <Button size="icon" variant="outline" className="size-7 rounded-full">
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease</span>
                </Button>
                <div className="text-center">
                  <div className="text-4xl font-bold tracking-tighter tabular-nums">350</div>
                  <div className="text-xs uppercase" style={{ color: "var(--theme-muted-foreground)" }}>Calories/day</div>
                </div>
                <Button size="icon" variant="outline" className="size-7 rounded-full">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase</span>
                </Button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridTemplateRows: "1fr 1fr", gap: "calc(var(--theme-spacing) * 1)" }}>
                {[2.4, 3.2, 3.6, 4, 2.8, 2, 1.6, 2.4, 3.2, 3.6, 4, 2.8, 2, 1.6].map((height, i) => (
                  <div
                    key={i}
                    style={{
                      height: `calc(var(--theme-spacing) * ${height})`,
                      backgroundColor: "var(--theme-primary)",
                      borderRadius: "calc(var(--theme-radius) * 0.5)",
                      opacity: i < 7 ? "1" : "0.3",
                      alignSelf: i < 7 ? "end" : "start"
                    }}
                  />
                ))}
              </div>
              <Button variant="secondary" className="w-full">Set Goal</Button>
            </div>
          </Card>

          <Card>
            <div style={{ padding: "calc(var(--theme-spacing) * 6)", display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 4)" }}>
              <div>
                <div style={{ fontWeight: "600" }}>Exercise Minutes</div>
                <div style={{ fontSize: "0.875rem", color: "var(--theme-muted-foreground)", marginTop: "calc(var(--theme-spacing) * 2)" }}>Your exercise minutes are ahead of where you normally are.</div>
              </div>
              <svg viewBox="0 0 500 200" style={{ width: "100%", height: "150px" }}>
                <polyline
                  fill="none"
                  stroke="var(--theme-chart-1)"
                  strokeWidth="2"
                  points="0,150 71,120 142,100 213,50 284,80 355,90 426,100 500,110"
                />
                <polyline
                  fill="none"
                  stroke="var(--theme-chart-2)"
                  strokeWidth="2"
                  points="0,180 71,170 142,165 213,160 284,155 355,150 426,155 500,160"
                />
                <polyline
                  fill="none"
                  stroke="var(--theme-chart-3)"
                  strokeWidth="2"
                  points="0,160 71,155 142,145 213,140 284,135 355,145 426,150 500,145"
                />
                <g style={{ fontSize: "12px", fill: "var(--theme-muted-foreground)" }}>
                  <text x="35" y="195">Mon</text>
                  <text x="106" y="195">Tue</text>
                  <text x="177" y="195">Wed</text>
                  <text x="248" y="195">Thu</text>
                  <text x="323" y="195">Fri</text>
                  <text x="394" y="195">Sat</text>
                  <text x="465" y="195">Sun</text>
                </g>
              </svg>
            </div>
          </Card>

          <Card>
            <div style={{ padding: "calc(var(--theme-spacing) * 6)", display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 4)" }}>
              <div>
                <div style={{ fontWeight: "600" }}>Upgrade your subscription</div>
                <div style={{ fontSize: "0.875rem", color: "var(--theme-muted-foreground)", marginTop: "calc(var(--theme-spacing) * 2)" }}>
                  You are currently on the free plan. Upgrade to the pro plan to get access to all features.
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 4)" }}>
                <div style={{ display: "flex", gap: "calc(var(--theme-spacing) * 1.5)" }}>
                  <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 4)" }}>
                    <label className="text-sm font-medium" htmlFor="name">Name</label>
                    <Input id="name" placeholder="Evil Rabbit" />
                  </div>
                  <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 4)" }}>
                    <label className="text-sm font-medium" htmlFor="email">Email</label>
                    <Input id="email" placeholder="example@acme.com" />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 4)" }}>
                  <label className="text-sm font-medium" htmlFor="card-number">Card Number</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 60px", gap: "calc(var(--theme-spacing) * 1.5)" }}>
                    <Input id="card-number" placeholder="1234 1234 1234 1234" />
                    <Input id="card-expiry" placeholder="MM/YY" />
                    <Input id="card-cvc" placeholder="CVC" />
                  </div>
                </div>

                <fieldset style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 1.5)" }}>
                  <legend className="text-sm font-medium">Plan</legend>
                  <p style={{ fontSize: "0.875rem", color: "var(--theme-muted-foreground)" }}>Select the plan that best fits your needs.</p>
                  <RadioGroup defaultValue="starter" style={{ display: "grid", gap: "calc(var(--theme-spacing) * 1.5)" }}>
                    <label style={{ display: "flex", alignItems: "start", gap: "calc(var(--theme-spacing) * 1.5)", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", padding: "calc(var(--theme-spacing) * 1.5)" }}>
                      <RadioGroupItem value="starter" id="starter" />
                      <div style={{ display: "grid", gap: "calc(var(--theme-spacing) * 2)" }}>
                        <div className="font-medium">Starter Plan</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--theme-muted-foreground)" }}>Perfect for small businesses.</div>
                      </div>
                    </label>
                    <label style={{ display: "flex", alignItems: "start", gap: "calc(var(--theme-spacing) * 1.5)", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)", padding: "calc(var(--theme-spacing) * 1.5)" }}>
                      <RadioGroupItem value="pro" id="pro" />
                      <div style={{ display: "grid", gap: "calc(var(--theme-spacing) * 2)" }}>
                        <div className="font-medium">Pro Plan</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--theme-muted-foreground)" }}>More features and storage.</div>
                      </div>
                    </label>
                  </RadioGroup>
                </fieldset>

                <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 4)" }}>
                  <label className="text-sm font-medium" htmlFor="notes">Notes</label>
                  <Textarea id="notes" placeholder="Enter notes" />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 1.5)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 4)" }}>
                    <Checkbox id="terms" />
                    <label className="text-sm" htmlFor="terms">
                      I agree to the terms and conditions
                    </label>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 4)" }}>
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
            <div style={{ padding: "calc(var(--theme-spacing) * 6)", display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 4)" }}>
              <div>
                <div style={{ fontWeight: "600" }}>Payments</div>
                <div style={{ fontSize: "0.875rem", color: "var(--theme-muted-foreground)", marginTop: "calc(var(--theme-spacing) * 2)" }}>Manage your payments.</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "calc(var(--theme-spacing) * 2)" }}>
                {[
                  { status: "success", email: "ken99@example.com", amount: "$316.00" },
                  { status: "success", email: "Abe45@example.com", amount: "$242.00" },
                  { status: "processing", email: "Monserrat44@example.com", amount: "$837.00" },
                  { status: "failed", email: "carmella@example.com", amount: "$721.00" }
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "calc(var(--theme-spacing) * 1.5)", padding: "calc(var(--theme-spacing) * 1.5)", borderRadius: "var(--theme-radius)", border: "1px solid var(--theme-border)" }}>
                    <Checkbox />
                    <div style={{ flex: "1", display: "grid", gap: "calc(var(--theme-spacing) * 2)" }}>
                      <Badge variant={item.status === "success" ? "default" : item.status === "processing" ? "secondary" : "destructive"} style={{ width: "fit-content" }}>
                        {item.status}
                      </Badge>
                      <div style={{ fontSize: "0.875rem" }}>{item.email}</div>
                    </div>
                    <div style={{ fontWeight: "600" }}>{item.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};
