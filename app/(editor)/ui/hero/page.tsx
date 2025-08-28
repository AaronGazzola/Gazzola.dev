"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Star, Check, Zap, Shield, Users } from "lucide-react";

const HeroPage = () => {
  return (
    <div className="space-y-16">
      <div>
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-2">Hero Components</h1>
          <p className="text-gray-600">Impactful hero sections to capture attention and drive action</p>
        </div>
      </div>

      <div className="space-y-16">
        <div>
          <div className="px-8 mb-4">
            <h2 className="text-xl font-semibold">Landing Hero</h2>
          </div>
          <div className="border-x border-b rounded-b-lg overflow-hidden">
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
              <div className="max-w-6xl mx-auto px-8 py-20">
                <div className="text-center max-w-4xl mx-auto">
                  <Badge variant="secondary" className="mb-4">
                    🚀 New Product Launch
                  </Badge>
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    Build Amazing
                    <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      Digital Experiences
                    </span>
                  </h1>
                  <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                    Create stunning websites and applications with our powerful tools and beautiful components. 
                    Get started in minutes, not hours.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      <Play className="mr-2 h-5 w-5" />
                      Watch Demo
                    </Button>
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-8 text-sm text-blue-200">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1">4.9/5 from 2,000+ reviews</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="px-8 mb-4">
            <h2 className="text-xl font-semibold">Feature Showcase</h2>
          </div>
          <div className="border-x border-b rounded-b-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
              <div className="max-w-6xl mx-auto px-8 py-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <Badge className="mb-4 bg-green-600">
                      ⚡ Performance First
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                      Lightning Fast
                      <span className="block text-green-400">Development</span>
                    </h1>
                    <p className="text-gray-300 text-lg mb-8">
                      Build production-ready applications 10x faster with our optimized workflow and 
                      pre-built components. No configuration needed.
                    </p>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span>Zero configuration setup</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span>Built-in performance optimization</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span>Production-ready components</span>
                      </div>
                    </div>
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                      Start Building Now
                    </Button>
                  </div>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-8">
                      <div className="bg-white rounded-lg p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <Zap className="h-8 w-8 text-green-600" />
                          <div>
                            <div className="font-semibold text-gray-900">Performance Score</div>
                            <div className="text-2xl font-bold text-green-600">98/100</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Load Time</span>
                            <span className="text-sm font-semibold">0.8s</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full w-4/5"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="px-8 mb-4">
            <h2 className="text-xl font-semibold">Call-to-Action Hero</h2>
          </div>
          <div className="border-x border-b rounded-b-lg overflow-hidden">
            <div className="bg-white">
              <div className="max-w-4xl mx-auto px-8 py-20 text-center">
                <div className="mb-8">
                  <div className="flex justify-center mb-6">
                    <div className="flex -space-x-2">
                      <div className="w-12 h-12 rounded-full bg-blue-500 border-4 border-white flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="w-12 h-12 rounded-full bg-green-500 border-4 border-white flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div className="w-12 h-12 rounded-full bg-purple-500 border-4 border-white flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Join 50,000+ Happy Customers
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Start your free trial today and see why thousands of teams choose our platform 
                    for their most important projects.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto mb-8">
                  <div className="space-y-4">
                    <Input 
                      placeholder="Enter your email address" 
                      className="h-12 text-center"
                    />
                    <Button size="lg" className="w-full h-12">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    No credit card required • 14-day free trial • Cancel anytime
                  </p>
                </div>

                <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>SOC 2 Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>99.9% Uptime</span>
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

export default HeroPage;