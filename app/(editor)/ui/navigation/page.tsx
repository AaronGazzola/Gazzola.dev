"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  User, 
  Settings, 
  Bell, 
  Search, 
  Menu, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal
} from "lucide-react";

const NavigationPage = () => {
  return (
    <div className="space-y-12">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">Navigation Components</h1>
        <p className="text-gray-600">Essential navigation patterns for web applications</p>
      </div>

      <div className="space-y-16">
        <div>
          <div className="px-8 mb-4">
            <h2 className="text-xl font-semibold">Primary Navigation Bar</h2>
          </div>
          <div className="border-x border-b rounded-b-lg overflow-hidden">
            <div className="bg-white border-b">
              <div className="max-w-6xl mx-auto px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center space-x-8">
                    <div className="text-xl font-bold">Brand</div>
                    <nav className="hidden md:flex space-x-6">
                      <Button variant="ghost" className="text-blue-600 font-medium">
                        Home
                      </Button>
                      <Button variant="ghost">Products</Button>
                      <Button variant="ghost">About</Button>
                      <Button variant="ghost">Contact</Button>
                    </nav>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="hidden md:flex relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input placeholder="Search..." className="pl-10 w-64" />
                    </div>
                    <Button size="sm">Sign In</Button>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="px-8 mb-4">
            <h2 className="text-xl font-semibold">Navigation with Dropdown</h2>
          </div>
          <div className="border-x border-b rounded-b-lg overflow-hidden">
            <div className="bg-gray-900 text-white">
              <div className="max-w-6xl mx-auto px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center space-x-8">
                    <div className="text-xl font-bold">Dashboard</div>
                    <nav className="hidden md:flex space-x-2">
                      <Button variant="ghost" className="text-white hover:text-gray-300 hover:bg-gray-800">
                        <Home className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                      <Button variant="ghost" className="text-white hover:text-gray-300 hover:bg-gray-800">
                        Analytics
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                      <Button variant="ghost" className="text-white hover:text-gray-300 hover:bg-gray-800">
                        Reports
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                      <Button variant="ghost" className="text-white hover:text-gray-300 hover:bg-gray-800">
                        Settings
                      </Button>
                    </nav>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800 relative">
                      <Bell className="h-5 w-5" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                        3
                      </Badge>
                    </Button>
                    <Button variant="ghost" className="text-white hover:bg-gray-800">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="px-8 mb-4">
            <h2 className="text-xl font-semibold">Breadcrumb Navigation</h2>
          </div>
          <div className="border-x border-b rounded-b-lg overflow-hidden">
            <div className="bg-gray-50 p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Basic Breadcrumb</h3>
                  <nav className="flex items-center space-x-2 text-sm">
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                      Home
                    </Button>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                      Products
                    </Button>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                      Electronics
                    </Button>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Smartphone</span>
                  </nav>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Breadcrumb with Icons</h3>
                  <nav className="flex items-center space-x-2 text-sm">
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                      <Home className="mr-1 h-4 w-4" />
                      Home
                    </Button>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                      <User className="mr-1 h-4 w-4" />
                      Account
                    </Button>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                      <Settings className="mr-1 h-4 w-4" />
                      Settings
                    </Button>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Profile</span>
                  </nav>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Collapsed Breadcrumb</h3>
                  <nav className="flex items-center space-x-2 text-sm">
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                      <Home className="h-4 w-4" />
                    </Button>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-gray-600 hover:text-gray-800">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                      Electronics
                    </Button>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Smartphone</span>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="px-8 mb-4">
            <h2 className="text-xl font-semibold">Pagination</h2>
          </div>
          <div className="border-x border-b rounded-b-lg overflow-hidden">
            <div className="bg-white p-8">
              <div className="space-y-8">
                <div>
                  <h3 className="font-medium mb-4">Basic Pagination</h3>
                  <div className="flex items-center justify-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button variant="default" size="sm">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <Button variant="outline" size="sm">4</Button>
                    <Button variant="outline" size="sm">5</Button>
                    <Button variant="outline" size="sm">
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Pagination with Info</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
                      <span className="font-medium">97</span> results
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" disabled>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="default" size="sm">1</Button>
                      <Button variant="outline" size="sm">2</Button>
                      <Button variant="outline" size="sm">3</Button>
                      <Button variant="ghost" size="sm" className="cursor-default">
                        ...
                      </Button>
                      <Button variant="outline" size="sm">10</Button>
                      <Button variant="outline" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Simple Pagination</h3>
                  <div className="flex items-center justify-between">
                    <Button variant="outline">
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">Page 1 of 10</span>
                    <Button variant="outline">
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Compact Pagination</h3>
                  <div className="flex items-center justify-center space-x-1">
                    <Button variant="ghost" size="icon" disabled>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="default" size="icon">1</Button>
                    <Button variant="ghost" size="icon">2</Button>
                    <Button variant="ghost" size="icon">3</Button>
                    <Button variant="ghost" size="icon">4</Button>
                    <Button variant="ghost" size="icon">5</Button>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationPage;