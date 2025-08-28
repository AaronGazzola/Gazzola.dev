"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  Star,
  MoreHorizontal,
  Download,
  Edit,
  Trash2
} from "lucide-react";

const DataDisplayPage = () => {
  const tableData = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", lastLogin: "2 hours ago" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active", lastLogin: "1 day ago" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Editor", status: "Inactive", lastLogin: "1 week ago" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", role: "User", status: "Active", lastLogin: "3 hours ago" },
    { id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "Editor", status: "Pending", lastLogin: "Never" },
  ];

  return (
    <div className="space-y-12">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">Data Display Components</h1>
        <p className="text-gray-600">Components for presenting data in organized and accessible formats</p>
      </div>

      <div className="space-y-16">
        <div>
          <div className="px-8 mb-4">
            <h2 className="text-xl font-semibold">Tables</h2>
          </div>
          <div className="border-x border-b rounded-b-lg overflow-hidden bg-white">
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">User Management Table</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tableData.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 bg-gray-200" />
                                {user.name}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600">{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === "Admin" ? "default" : user.role === "Editor" ? "secondary" : "outline"}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  user.status === "Active" ? "default" : 
                                  user.status === "Inactive" ? "secondary" : "outline"
                                }
                                className={
                                  user.status === "Active" ? "bg-green-100 text-green-800" :
                                  user.status === "Inactive" ? "bg-gray-100 text-gray-800" : ""
                                }
                              >
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600">{user.lastLogin}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Simple Data Table</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Sales</TableHead>
                          <TableHead>Revenue</TableHead>
                          <TableHead>Growth</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Product A</TableCell>
                          <TableCell>1,234</TableCell>
                          <TableCell>$12,340</TableCell>
                          <TableCell className="text-green-600">+12%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Product B</TableCell>
                          <TableCell>856</TableCell>
                          <TableCell>$8,560</TableCell>
                          <TableCell className="text-red-600">-5%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Product C</TableCell>
                          <TableCell>2,109</TableCell>
                          <TableCell>$21,090</TableCell>
                          <TableCell className="text-green-600">+18%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="px-8 mb-4">
            <h2 className="text-xl font-semibold">Lists</h2>
          </div>
          <div className="border-x border-b rounded-b-lg overflow-hidden bg-white p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Task List</h3>
                <div className="space-y-3">
                  {[
                    { title: "Complete project proposal", priority: "High", status: "In Progress" },
                    { title: "Review design mockups", priority: "Medium", status: "Pending" },
                    { title: "Update documentation", priority: "Low", status: "Completed" },
                    { title: "Schedule team meeting", priority: "Medium", status: "Pending" }
                  ].map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          task.status === "Completed" ? "bg-green-500" :
                          task.status === "In Progress" ? "bg-blue-500" : "bg-gray-300"
                        }`}></div>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant={task.priority === "High" ? "destructive" : task.priority === "Medium" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {task.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-4">Activity Feed</h3>
                <div className="space-y-4">
                  {[
                    { user: "John Doe", action: "uploaded a new file", time: "2 minutes ago", icon: Download },
                    { user: "Jane Smith", action: "commented on Project Alpha", time: "1 hour ago", icon: Info },
                    { user: "Bob Johnson", action: "completed task", time: "3 hours ago", icon: CheckCircle },
                    { user: "Alice Brown", action: "updated project settings", time: "1 day ago", icon: Edit }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                      <Avatar className="h-8 w-8 bg-gray-200" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">
                          <span className="font-medium">{activity.user}</span>
                          <span className="text-gray-600"> {activity.action}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                      </div>
                      <activity.icon className="h-4 w-4 text-gray-400 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="px-8 mb-4">
            <h2 className="text-xl font-semibold">Badges & Status Indicators</h2>
          </div>
          <div className="border-x border-b rounded-b-lg overflow-hidden bg-white p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Badge Variants</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge className="bg-green-100 text-green-800">Success</Badge>
                  <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Info</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-4">Status Indicators</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Online - System operational</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Warning - Performance degraded</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Offline - System maintenance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
                    <span>Connecting - Establishing connection</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-4">Progress Indicators</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Project Completion</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Storage Used</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>CPU Usage</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="[&>div]:bg-red-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="px-8 mb-4">
            <h2 className="text-xl font-semibold">Alerts & Notifications</h2>
          </div>
          <div className="border-x border-b rounded-b-lg overflow-hidden bg-white p-6">
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  This is an informational alert. It provides additional context or helpful information to the user.
                </AlertDescription>
              </Alert>

              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success</AlertTitle>
                <AlertDescription className="text-green-700">
                  Operation completed successfully. Your changes have been saved.
                </AlertDescription>
              </Alert>

              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">Warning</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  Please review your settings. Some configurations may need your attention.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Something went wrong. Please try again or contact support if the problem persists.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDisplayPage;