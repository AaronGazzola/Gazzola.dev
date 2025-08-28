"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const FooterPage = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Footer Components</h1>
        <p className="text-gray-600">Various footer designs and layouts for different use cases</p>
      </div>

      <div className="space-y-12">
        <div>
          <h2 className="text-xl font-semibold mb-4">Simple Footer</h2>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-900 text-white p-8">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold">Company Name</h3>
                    <p className="text-gray-400 text-sm">Making the world a better place</p>
                  </div>
                  <div className="flex space-x-4">
                    <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
                      Privacy
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
                      Terms
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
                      Contact
                    </Button>
                  </div>
                </div>
                <Separator className="my-6 bg-gray-700" />
                <div className="text-center text-sm text-gray-400">
                  © 2024 Company Name. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Footer with Social Links</h2>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-900 text-white p-8">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold mb-4">Brand Name</h3>
                    <p className="text-gray-400 mb-4">
                      We create amazing digital experiences that make people&apos;s lives better.
                    </p>
                    <div className="flex space-x-4">
                      <Button variant="ghost" size="icon" className="text-white hover:text-blue-400">
                        <Facebook className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white hover:text-blue-400">
                        <Twitter className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white hover:text-pink-400">
                        <Instagram className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white hover:text-blue-600">
                        <Linkedin className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Quick Links</h4>
                    <div className="space-y-2 text-sm">
                      <div><Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400 hover:text-white">About Us</Button></div>
                      <div><Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400 hover:text-white">Services</Button></div>
                      <div><Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400 hover:text-white">Portfolio</Button></div>
                      <div><Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400 hover:text-white">Contact</Button></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Support</h4>
                    <div className="space-y-2 text-sm">
                      <div><Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400 hover:text-white">Help Center</Button></div>
                      <div><Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400 hover:text-white">Documentation</Button></div>
                      <div><Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400 hover:text-white">Privacy Policy</Button></div>
                      <div><Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400 hover:text-white">Terms of Service</Button></div>
                    </div>
                  </div>
                </div>
                <Separator className="my-8 bg-gray-700" />
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                  <div>© 2024 Brand Name. All rights reserved.</div>
                  <div className="flex space-x-4 mt-4 md:mt-0">
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400 hover:text-white">
                      Privacy
                    </Button>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400 hover:text-white">
                      Terms
                    </Button>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400 hover:text-white">
                      Cookies
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Newsletter Footer</h2>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-8">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
                    <p className="text-blue-100 mb-4">
                      Subscribe to our newsletter for the latest updates and insights.
                    </p>
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Enter your email" 
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                      <Button variant="secondary">Subscribe</Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Contact Info</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>hello@company.com</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>+1 (555) 123-4567</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>123 Business St, City, State 12345</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Follow Us</h4>
                    <div className="flex space-x-3 mb-4">
                      <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
                        <Facebook className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
                        <Instagram className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-blue-100">
                      Join thousands of followers for daily inspiration
                    </div>
                  </div>
                </div>
                <Separator className="my-8 bg-white/20" />
                <div className="text-center text-sm text-blue-100">
                  © 2024 Your Company. Crafted with ❤️ for amazing experiences.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterPage;