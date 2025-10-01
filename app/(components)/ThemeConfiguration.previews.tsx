"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/configuration/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/configuration/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/configuration/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/configuration/ui/avatar";
import { Badge } from "@/components/configuration/ui/badge";
import { Button } from "@/components/configuration/ui/button";
import { Calendar } from "@/components/configuration/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/configuration/ui/card";
import { Checkbox } from "@/components/configuration/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/configuration/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/configuration/ui/dialog";
import { Input } from "@/components/configuration/ui/input";
import { Label } from "@/components/configuration/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/configuration/ui/popover";
import { Progress } from "@/components/configuration/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/configuration/ui/radio-group";
import { ScrollArea } from "@/components/configuration/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/configuration/ui/select";
import { Separator } from "@/components/configuration/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/configuration/ui/sheet";
import { Skeleton } from "@/components/configuration/ui/skeleton";
import { Slider } from "@/components/configuration/ui/slider";
import { Switch } from "@/components/configuration/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/configuration/ui/table";
import { Textarea } from "@/components/configuration/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/configuration/ui/tooltip";
import { AlertCircle, ChevronDown } from "lucide-react";
import { PreviewProps } from "./ThemeConfiguration.types";

export const AccordionPreview = ({ styleConfig }: PreviewProps) => (
  <Accordion type="single" collapsible className="w-full" style={styleConfig}>
    <AccordionItem value="item-1">
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
      <AccordionContent>
        Yes. It adheres to the WAI-ARIA design pattern.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger>Is it styled?</AccordionTrigger>
      <AccordionContent>
        Yes. It comes with default styles that matches the other components.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

export const AlertPreview = ({ variant, styleConfig }: PreviewProps) => (
  <Alert variant={variant as any} style={styleConfig}>
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Heads up!</AlertTitle>
    <AlertDescription>
      You can add components to your app using the CLI.
    </AlertDescription>
  </Alert>
);

export const AlertDialogPreview = ({ styleConfig }: PreviewProps) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="outline" style={styleConfig}>Show Dialog</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export const AvatarPreview = ({ styleConfig }: PreviewProps) => (
  <Avatar style={styleConfig}>
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
);

export const BadgePreview = ({ variant, styleConfig }: PreviewProps) => (
  <Badge variant={variant as any} style={styleConfig}>
    Badge
  </Badge>
);

export const ButtonPreview = ({ variant, styleConfig }: PreviewProps) => (
  <Button variant={variant as any} style={styleConfig}>
    Button
  </Button>
);

export const CalendarPreview = ({ styleConfig }: PreviewProps) => (
  <Calendar mode="single" className="rounded-md border" style={styleConfig} />
);

export const CardPreview = ({ styleConfig }: PreviewProps) => (
  <Card className="w-[350px]" style={styleConfig}>
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <CardDescription>Card Description</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Card Content</p>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button variant="outline">Cancel</Button>
      <Button>Deploy</Button>
    </CardFooter>
  </Card>
);

export const CheckboxPreview = ({ styleConfig }: PreviewProps) => (
  <div className="flex items-center space-x-2">
    <Checkbox id="terms" style={styleConfig} />
    <label
      htmlFor="terms"
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      Accept terms and conditions
    </label>
  </div>
);

export const CollapsiblePreview = ({ styleConfig }: PreviewProps) => (
  <Collapsible className="w-[350px] space-y-2" style={styleConfig}>
    <CollapsibleTrigger asChild>
      <Button variant="ghost" className="flex w-full justify-between">
        <span>Can I use this?</span>
        <ChevronDown className="h-4 w-4" />
      </Button>
    </CollapsibleTrigger>
    <CollapsibleContent className="space-y-2">
      <div className="rounded-md border px-4 py-3 text-sm">
        Yes. Free to use for personal and commercial projects.
      </div>
    </CollapsibleContent>
  </Collapsible>
);

export const DialogPreview = ({ styleConfig }: PreviewProps) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" style={styleConfig}>Open Dialog</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" value="John Doe" className="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const InputPreview = ({ styleConfig }: PreviewProps) => (
  <Input placeholder="Email" style={styleConfig} />
);

export const LabelPreview = ({ styleConfig }: PreviewProps) => (
  <Label style={styleConfig}>Email Address</Label>
);

export const PopoverPreview = ({ styleConfig }: PreviewProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" style={styleConfig}>Open Popover</Button>
    </PopoverTrigger>
    <PopoverContent className="w-80">
      <div className="grid gap-4">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Dimensions</h4>
          <p className="text-sm text-muted-foreground">
            Set the dimensions for the layer.
          </p>
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

export const ProgressPreview = ({ styleConfig }: PreviewProps) => (
  <Progress value={66} className="w-[60%]" style={styleConfig} />
);

export const RadioGroupPreview = ({ styleConfig }: PreviewProps) => (
  <RadioGroup defaultValue="option-one" style={styleConfig}>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option-one" id="option-one" />
      <Label htmlFor="option-one">Option One</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option-two" id="option-two" />
      <Label htmlFor="option-two">Option Two</Label>
    </div>
  </RadioGroup>
);

export const ScrollAreaPreview = ({ styleConfig }: PreviewProps) => (
  <ScrollArea className="h-72 w-48 rounded-md border" style={styleConfig}>
    <div className="p-4">
      <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
      {Array.from({ length: 50 }).map((_, i) => (
        <div key={i} className="text-sm">
          Tag {i + 1}
        </div>
      ))}
    </div>
  </ScrollArea>
);

export const SelectPreview = ({ styleConfig }: PreviewProps) => (
  <Select>
    <SelectTrigger className="w-[180px]" style={styleConfig}>
      <SelectValue placeholder="Select a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="orange">Orange</SelectItem>
    </SelectContent>
  </Select>
);

export const SeparatorPreview = ({ styleConfig }: PreviewProps) => (
  <div>
    <div className="space-y-1">
      <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
      <p className="text-sm text-muted-foreground">
        An open-source UI component library.
      </p>
    </div>
    <Separator className="my-4" style={styleConfig} />
    <div className="flex h-5 items-center space-x-4 text-sm">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
    </div>
  </div>
);

export const SheetPreview = ({ variant, styleConfig }: PreviewProps) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" style={styleConfig}>Open Sheet</Button>
    </SheetTrigger>
    <SheetContent side={variant as any || "right"}>
      <SheetHeader>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>
          Make changes to your profile here.
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
);

export const SkeletonPreview = ({ styleConfig }: PreviewProps) => (
  <div className="flex items-center space-x-4">
    <Skeleton className="h-12 w-12 rounded-full" style={styleConfig} />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" style={styleConfig} />
      <Skeleton className="h-4 w-[200px]" style={styleConfig} />
    </div>
  </div>
);

export const SliderPreview = ({ styleConfig }: PreviewProps) => (
  <Slider defaultValue={[50]} max={100} step={1} className="w-[60%]" style={styleConfig} />
);

export const SwitchPreview = ({ styleConfig }: PreviewProps) => (
  <div className="flex items-center space-x-2">
    <Switch id="airplane-mode" style={styleConfig} />
    <Label htmlFor="airplane-mode">Airplane Mode</Label>
  </div>
);

export const TablePreview = ({ styleConfig }: PreviewProps) => (
  <Table style={styleConfig}>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Email</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell className="font-medium">John Doe</TableCell>
        <TableCell>Active</TableCell>
        <TableCell>john@example.com</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Jane Smith</TableCell>
        <TableCell>Inactive</TableCell>
        <TableCell>jane@example.com</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

export const TextareaPreview = ({ styleConfig }: PreviewProps) => (
  <Textarea placeholder="Type your message here." style={styleConfig} />
);

export const TooltipPreview = ({ styleConfig }: PreviewProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" style={styleConfig}>Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const COMPONENT_PREVIEWS: Record<string, (props: PreviewProps) => JSX.Element> = {
  accordion: AccordionPreview,
  alert: AlertPreview,
  "alert-dialog": AlertDialogPreview,
  avatar: AvatarPreview,
  badge: BadgePreview,
  button: ButtonPreview,
  calendar: CalendarPreview,
  card: CardPreview,
  checkbox: CheckboxPreview,
  collapsible: CollapsiblePreview,
  dialog: DialogPreview,
  input: InputPreview,
  label: LabelPreview,
  popover: PopoverPreview,
  progress: ProgressPreview,
  "radio-group": RadioGroupPreview,
  "scroll-area": ScrollAreaPreview,
  select: SelectPreview,
  separator: SeparatorPreview,
  sheet: SheetPreview,
  skeleton: SkeletonPreview,
  slider: SliderPreview,
  switch: SwitchPreview,
  table: TablePreview,
  textarea: TextareaPreview,
  tooltip: TooltipPreview,
};
