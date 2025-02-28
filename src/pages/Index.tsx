
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationButtons from "@/components/ui/navigation-buttons";
import { ArrowRight, FileCode, MessageSquare, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

function Index() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Lyzr SMS Agent Platform</h1>
          <p className="text-muted-foreground max-w-[700px] mx-auto">
            Your all-in-one solution for managing SMS campaigns, contacts, and templates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/contacts" className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="p-2 w-fit rounded-md bg-blue-100 mb-2">
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <CardTitle>Contacts</CardTitle>
                <CardDescription>
                  Manage your contacts and organize them into lists
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Import contacts, create lists, and keep your audience organized for targeted outreach.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">
                  View Contacts <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </Link>

          <Link to="/templates" className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="p-2 w-fit rounded-md bg-violet-100 mb-2">
                  <FileCode className="h-8 w-8 text-violet-500" />
                </div>
                <CardTitle>Templates</CardTitle>
                <CardDescription>
                  Create and manage message templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Design reusable message templates with variables to personalize your communications.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">
                  View Templates <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </Link>

          <Link to="/campaigns" className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="p-2 w-fit rounded-md bg-green-100 mb-2">
                  <Send className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle>Campaigns</CardTitle>
                <CardDescription>
                  Create and manage SMS campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Set up campaigns with custom templates, scheduling, and automatic follow-ups.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">
                  View Campaigns <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </Link>

          <Link to="/simplified-campaigns" className="block lg:col-span-3">
            <Card className="hover:shadow-md transition-shadow border-purple-200 bg-purple-50">
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
                  Our new simplified campaign creator guides you through each step of creating a campaign with pre-built templates and campaign types.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="default" className="ml-auto bg-purple-600 hover:bg-purple-700">
                  Try Simplified Campaigns <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
        </div>

        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Updates</h3>
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-muted">
                <p className="font-medium">New Feature: Simplified Campaign Creator</p>
                <p className="text-sm text-muted-foreground">
                  Create campaigns with an easy-to-use wizard interface featuring pre-configured campaign types.
                </p>
              </div>
              <div className="p-2 rounded-lg bg-muted">
                <p className="font-medium">Improved Contact Management</p>
                <p className="text-sm text-muted-foreground">
                  Now with better CSV import and contact list organization.
                </p>
              </div>
              <div className="p-2 rounded-lg bg-muted">
                <p className="font-medium">Enhanced Templates</p>
                <p className="text-sm text-muted-foreground">
                  Create and manage message templates with variables for personalization.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      <NavigationButtons currentPage="home" />
    </div>
  );
}

export default Index;
