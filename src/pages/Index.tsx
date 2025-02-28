
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Upload, MessageSquare, Send, Users } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            SMS Agent Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Effortlessly manage SMS conversations with prospects through an intuitive platform that automates outreach, tracks responses, and helps schedule meetings.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-lg p-6 text-center hover:shadow-lg transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">Import Contacts</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Upload contact lists via CSV with validation and preview options.
              </p>
              <Button asChild size="sm" variant="outline">
                <Link to="/contacts">
                  Import Contacts
                </Link>
              </Button>
            </div>
            
            <div className="bg-card rounded-lg p-6 text-center hover:shadow-lg transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">Create Campaigns</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Set up automated messaging campaigns with personalized templates.
              </p>
              <Button asChild size="sm" variant="outline">
                <Link to="/campaigns">
                  Create Campaign
                </Link>
              </Button>
            </div>
            
            <div className="bg-card rounded-lg p-6 text-center hover:shadow-lg transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">Manage Conversations</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Track responses and engage with prospects in real-time.
              </p>
              <Button asChild size="sm" variant="outline">
                <Link to="/campaigns">
                  Manage Conversations
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="gap-2"
            >
              <Link to="/contacts">
                <Users className="h-4 w-4" />
                Start Managing Contacts
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
