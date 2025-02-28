
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Clock, BarChart3, Users } from 'lucide-react';

interface FeaturePoint {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const CampaignJustification: React.FC = () => {
  const featurePoints: FeaturePoint[] = [
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Automated Follow-up Sequences",
      description: "Create sophisticated multi-step communication flows that automatically adapt based on recipient responses."
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Time-optimized Delivery",
      description: "Send messages at the perfect time with customizable sending windows and timezone controls to maximize engagement."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: "Comprehensive Analytics",
      description: "Gain valuable insights with detailed performance metrics to continuously refine your outreach strategies."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Targeted Audience Segmentation",
      description: "Reach the right people with precise contact filtering and dynamic audience segmentation."
    }
  ];

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Campaigns</CardTitle>
        <CardDescription className="text-lg">
          Create and manage outreach campaigns with automated follow-up sequences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">
          Our campaign management system gives you complete control over your outreach efforts.
          Easily design multi-step communications that adapt to recipient responses, with intelligent
          automation to ensure your messages reach the right people at exactly the right time.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {featurePoints.map((point, index) => (
            <div key={index} className="flex gap-3 p-4 rounded-lg border">
              <div className="mt-0.5">{point.icon}</div>
              <div>
                <h3 className="font-medium">{point.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignJustification;
