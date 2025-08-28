"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Heart, MessageCircle, Share2, Calendar, User, MapPin } from "lucide-react";

const LayoutPage = () => {
  return (
    <div className="space-y-12">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">Layout Components</h1>
        <p className="text-gray-600">Flexible layout patterns for organizing content</p>
      </div>

      <div className="space-y-16">
        <div>
          <div className="px-8 mb-4">
            <h2 className="text-xl font-semibold">Grid Layouts</h2>
          </div>
          <div className="border-x border-b rounded-b-lg overflow-hidden bg-gray-50 p-8">
            <div className="space-y-8">
              <div>
                <h3 className="font-medium mb-4">2-Column Grid</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-100 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 mb-2">Column 1</h4>
                    <p className="text-blue-700">Content for the first column</p>
                  </div>
                  <div className="bg-green-100 border border-green-200 rounded-lg p-6">
                    <h4 className="font-semibold text-green-900 mb-2">Column 2</h4>
                    <p className="text-green-700">Content for the second column</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">3-Column Grid</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-purple-100 border border-purple-200 rounded-lg p-6">
                    <h4 className="font-semibold text-purple-900 mb-2">Column 1</h4>
                    <p className="text-purple-700">First column content</p>
                  </div>
                  <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-6">
                    <h4 className="font-semibold text-yellow-900 mb-2">Column 2</h4>
                    <p className="text-yellow-700">Second column content</p>
                  </div>
                  <div className="bg-red-100 border border-red-200 rounded-lg p-6">
                    <h4 className="font-semibold text-red-900 mb-2">Column 3</h4>
                    <p className="text-red-700">Third column content</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">4-Column Grid</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                      <div className="w-full h-20 bg-gray-300 rounded mb-3"></div>
                      <h4 className="font-semibold text-gray-900 text-sm">Item {num}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="px-8 mb-4">
            <h2 className="text-xl font-semibold">Card Layouts</h2>
          </div>
          <div className="border-x border-b rounded-b-lg overflow-hidden bg-white p-8">
            <div className="space-y-8">
              <div>
                <h3 className="font-medium mb-4">Product Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: "Product A", price: "$29.99", rating: 4.5 },
                    { title: "Product B", price: "$39.99", rating: 4.8 },
                    { title: "Product C", price: "$19.99", rating: 4.2 }
                  ].map((product, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{product.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`h-4 w-4 ${star <= product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({product.rating})</span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <p className="text-2xl font-bold text-green-600">{product.price}</p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Add to Cart</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-4">Blog Cards</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[
                    { 
                      title: "Getting Started with React", 
                      excerpt: "Learn the basics of React and build your first component.",
                      author: "John Doe",
                      date: "Dec 15, 2023",
                      readTime: "5 min read"
                    },
                    { 
                      title: "Advanced CSS Techniques", 
                      excerpt: "Explore advanced CSS features to create stunning layouts.",
                      author: "Jane Smith",
                      date: "Dec 12, 2023",
                      readTime: "8 min read"
                    }
                  ].map((post, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <div className="w-full h-48 bg-gradient-to-br from-blue-200 to-purple-300"></div>
                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Badge variant="secondary">{post.readTime}</Badge>
                          <span>•</span>
                          <span>{post.date}</span>
                        </div>
                        <CardTitle className="text-xl hover:text-blue-600 cursor-pointer">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                          <span className="text-sm text-gray-600">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="px-8 mb-4">
            <h2 className="text-xl font-semibold">Container Layouts</h2>
          </div>
          <div className="border-x border-b rounded-b-lg overflow-hidden bg-gray-50 p-8">
            <div className="space-y-8">
              <div>
                <h3 className="font-medium mb-4">Center Container</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-8">
                  <div className="max-w-2xl mx-auto">
                    <h4 className="text-xl font-semibold text-center mb-4">Centered Content</h4>
                    <p className="text-gray-600 text-center">
                      This content is centered within a maximum width container. This is commonly used for 
                      articles, forms, and other focused content areas.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Sidebar Layout</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex">
                    <div className="w-64 bg-gray-100 border-r border-gray-200 p-6">
                      <h4 className="font-semibold mb-4">Sidebar</h4>
                      <nav className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start">
                          <Calendar className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                          <MapPin className="mr-2 h-4 w-4" />
                          Locations
                        </Button>
                      </nav>
                    </div>
                    <div className="flex-1 p-6">
                      <h4 className="text-xl font-semibold mb-4">Main Content Area</h4>
                      <p className="text-gray-600 mb-4">
                        This is the main content area next to the sidebar. The sidebar remains fixed 
                        while the content can scroll independently.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-100 rounded-lg p-4">
                          <h5 className="font-medium mb-2">Content Block 1</h5>
                          <p className="text-sm text-gray-600">Some content here</p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4">
                          <h5 className="font-medium mb-2">Content Block 2</h5>
                          <p className="text-sm text-gray-600">Some content here</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Full-Width Container</h3>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8">
                  <div className="text-center">
                    <h4 className="text-2xl font-bold mb-4">Full-Width Section</h4>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                      This container spans the full width of its parent and is commonly used for 
                      hero sections, banners, or call-to-action areas.
                    </p>
                    <Button variant="secondary" size="lg">
                      Get Started
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

export default LayoutPage;