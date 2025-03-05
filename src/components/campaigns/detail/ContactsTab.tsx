
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface ContactsTabProps {
  contactsInfo: string;
  isDemo?: boolean;
}

export const ContactsTab: React.FC<ContactsTabProps> = ({ contactsInfo, isDemo = false }) => {
  // Demo contact engagement stats for visualization purposes
  const demoContactStats = [
    { status: 'Engaged', count: 78, percentage: 52 },
    { status: 'Unopened', count: 42, percentage: 28 },
    { status: 'Unsubscribed', count: 18, percentage: 12 },
    { status: 'Bounced', count: 12, percentage: 8 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Campaign Contacts</CardTitle>
        <CardDescription>
          {contactsInfo}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isDemo ? (
          <div className="space-y-6">
            {/* Contact Engagement Summary */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Contact Engagement</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {demoContactStats.map((stat) => (
                  <div key={stat.status} className="bg-muted rounded-md p-3">
                    <div className="text-2xl font-bold">{stat.count}</div>
                    <div className="text-xs text-muted-foreground flex justify-between">
                      <span>{stat.status}</span>
                      <span>{stat.percentage}%</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          stat.status === 'Engaged' ? 'bg-green-500' : 
                          stat.status === 'Unopened' ? 'bg-blue-500' : 
                          stat.status === 'Unsubscribed' ? 'bg-orange-500' : 
                          'bg-red-500'
                        }`} 
                        style={{width: `${stat.percentage}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recent Activities */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Recent Contact Activities</h3>
              <div className="space-y-3">
                {[
                  { contact: 'Emma Johnson', action: 'Responded positively', time: '2 hours ago' },
                  { contact: 'Michael Chen', action: 'Opened email', time: '3 hours ago' },
                  { contact: 'Sarah Williams', action: 'Clicked link', time: '5 hours ago' },
                  { contact: 'David Miller', action: 'Requested demo', time: '1 day ago' },
                  { contact: 'Lisa Brown', action: 'Unsubscribed', time: '1 day ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">{activity.contact}</div>
                      <div className="text-sm text-muted-foreground">{activity.action}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Contact list details...</p>
        )}
      </CardContent>
    </Card>
  );
};
