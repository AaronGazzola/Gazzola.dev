"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const FormPage = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Form Components</h1>
        <p className="text-gray-600">Demonstration of various form input components</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Email Input</h2>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Password Input</h2>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Textarea</h2>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Enter your message here..." />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Select</h2>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Checkbox</h2>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Switch</h2>
            <div className="flex items-center space-x-2">
              <Switch id="notifications" />
              <Label htmlFor="notifications">Enable notifications</Label>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Button</h2>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
              </div>
              <div className="flex gap-2">
                <Button variant="destructive">Destructive</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Complete Form Example</h2>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input id="fullname" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-form">Email</Label>
                <Input id="email-form" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="newsletter" />
                <Label htmlFor="newsletter">Subscribe to newsletter</Label>
              </div>
              <Button type="submit" className="w-full">Submit</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPage;