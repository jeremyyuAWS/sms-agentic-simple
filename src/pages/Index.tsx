
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationButtons from "@/components/ui/navigation-buttons";
import { ArrowRight, MessageSquare, Upload, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingState from "@/components/ui/loading-state";

function Index() {
  console.log("Index component function starting");
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simplified useEffect with direct state update
  useEffect(() => {
    console.log("Index component mounted");
    
    // Set a shorter timeout to avoid long white screen
    const timer = setTimeout(() => {
      console.log("Setting isLoaded to true");
      setIsLoaded(true);
    }, 100);
    
    return () => {
      clearTimeout(timer);
      console.log("Index component unmounting");
    };
  }, []);

  // Immediately render content for debugging
  console.log("Index rendering with states:", { isLoaded, error });

  return (
    <div className="min-h-screen bg-background">
      {isLoaded ? (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight">Lyzr SMS Agent Platform</h1>
              <p className="text-muted-foreground max-w-[700px] mx-auto">
                Create SMS campaigns effortlessly with guided setup and smart contact management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/simplified-campaigns" className="block">
                <Card className="h-full hover:shadow-md transition-shadow border-purple-200 bg-purple-50">
                  <CardHeader>
                    <div className="p-2 w-fit rounded-md bg-purple-100 mb-2">
                      <MessageSquare className="h-8 w-8 text-purple-500" />
                    </div>
                    <CardTitle>Simplified Campaign Creator</CardTitle>
                    <CardDescription>
                      Create campaigns with a streamlined, wizard-based approach
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Our wizard guides you through each step of creating a campaign with pre-built templates and campaign types.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="default" className="w-full bg-purple-600 hover:bg-purple-700">
                      Create a Campaign <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>

              <Link to="/contacts" className="block">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="p-2 w-fit rounded-md bg-blue-100 mb-2">
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                    <CardTitle>Manage Contacts</CardTitle>
                    <CardDescription>
                      Upload and organize your contacts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Import contacts via CSV, create contact lists, and keep your audience organized for targeted outreach.
                    </p>
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md flex items-center space-x-2">
                      <Upload className="h-5 w-5 text-blue-500" />
                      <span className="text-sm font-medium">Quick CSV Upload Available</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Manage Contacts <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </div>

            <Card className="border-purple-100">
              <CardHeader>
                <CardTitle>Get Started in 3 Simple Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600 font-bold mb-2">1</div>
                    <h3 className="font-medium">Upload Your Contacts</h3>
                    <p className="text-sm text-muted-foreground">Import your contacts via CSV with automatic field mapping</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600 font-bold mb-2">2</div>
                    <h3 className="font-medium">Choose Campaign Type</h3>
                    <p className="text-sm text-muted-foreground">Select from pre-configured campaign types with optimized messaging</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600 font-bold mb-2">3</div>
                    <h3 className="font-medium">Launch Your Campaign</h3>
                    <p className="text-sm text-muted-foreground">Review and launch with intelligent scheduling and automated follow-ups</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Updates & Tips</h3>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-muted">
                    <p className="font-medium">New Feature: Simplified Campaign Creator</p>
                    <p className="text-sm text-muted-foreground">
                      Create campaigns with an easy-to-use wizard interface featuring pre-configured campaign types.
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted">
                    <p className="font-medium">Tip: Smart Contact Import</p>
                    <p className="text-sm text-muted-foreground">
                      Our CSV importer automatically maps common fields and validates phone numbers.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          <NavigationButtons currentPage="home" />
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-blue-500" />
            </div>
            <div className="h-4 w-40 bg-gray-200 rounded mb-3"></div>
            <div className="h-3 w-28 bg-gray-100 rounded"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Index;
