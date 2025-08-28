"use client";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Home, Settings, User, FileText, Menu, X } from "lucide-react";
import { useState } from "react";

const SidebarPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("home");

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Sidebar Components</h1>
        <p className="text-gray-600">Various sidebar navigation patterns and layouts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Basic Navigation Sidebar</h2>
          <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px]">
            <div className="flex">
              <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-2">
                <div className="font-semibold text-lg mb-4">Navigation</div>
                <nav className="space-y-1">
                  <Button 
                    variant={activeItem === "home" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveItem("home")}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Button>
                  <Button 
                    variant={activeItem === "profile" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveItem("profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button 
                    variant={activeItem === "documents" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveItem("documents")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Documents
                  </Button>
                  <Button 
                    variant={activeItem === "settings" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveItem("settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </nav>
              </div>
              <div className="flex-1 p-4">
                <h3 className="text-lg font-medium capitalize">{activeItem}</h3>
                <p className="text-gray-600 mt-2">Content for {activeItem} section</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Collapsible Sidebar</h2>
          <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px]">
            <div className="flex">
              <div className={`${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-white border-r border-gray-200 p-4`}>
                <div className="flex items-center justify-between mb-4">
                  {!isCollapsed && <div className="font-semibold text-lg">Menu</div>}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  >
                    {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </Button>
                </div>
                <nav className="space-y-1">
                  <Button 
                    variant="ghost" 
                    className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start'}`}
                  >
                    <Home className="h-4 w-4" />
                    {!isCollapsed && <span className="ml-2">Home</span>}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start'}`}
                  >
                    <User className="h-4 w-4" />
                    {!isCollapsed && <span className="ml-2">Profile</span>}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start'}`}
                  >
                    <FileText className="h-4 w-4" />
                    {!isCollapsed && <span className="ml-2">Documents</span>}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start'}`}
                  >
                    <Settings className="h-4 w-4" />
                    {!isCollapsed && <span className="ml-2">Settings</span>}
                  </Button>
                </nav>
              </div>
              <div className="flex-1 p-4">
                <h3 className="text-lg font-medium">Main Content</h3>
                <p className="text-gray-600 mt-2">
                  {isCollapsed ? 'Sidebar is collapsed' : 'Sidebar is expanded'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Responsive Layout Example</h2>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="md:flex">
              <div className="md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-4">
                <div className="font-semibold text-lg mb-4">Responsive Menu</div>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      <span className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        Documents
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 mt-1">
                    <Button variant="ghost" className="w-full justify-start pl-6" size="sm">
                      Recent Files
                    </Button>
                    <Button variant="ghost" className="w-full justify-start pl-6" size="sm">
                      Shared
                    </Button>
                    <Button variant="ghost" className="w-full justify-start pl-6" size="sm">
                      Archive
                    </Button>
                  </CollapsibleContent>
                </Collapsible>
                <Separator className="my-2" />
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
              <div className="flex-1 p-4 min-h-[300px]">
                <h3 className="text-lg font-medium">Responsive Content Area</h3>
                <p className="text-gray-600 mt-2">
                  This layout adapts to different screen sizes. On mobile, the sidebar appears above the content.
                  On desktop, it appears as a side navigation.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarPage;