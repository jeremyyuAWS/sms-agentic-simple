
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAiService } from '@/hooks/use-ai-service';
import { Sparkles, RotateCw } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';

interface MessageOptimizerProps {
  initialMessage: string;
  onSelectOptimized: (message: string) => void;
  audience?: any;
}

const MessageOptimizer: React.FC<MessageOptimizerProps> = ({
  initialMessage,
  onSelectOptimized,
  audience
}) => {
  const [message, setMessage] = useState(initialMessage);
  const [optimizedMessage, setOptimizedMessage] = useState('');
  const [improvements, setImprovements] = useState<{ type: string; description: string }[]>([]);
  const [expectedImprovement, setExpectedImprovement] = useState(0);
  
  const { optimizeMessage, isOptimizing } = useAiService();
  
  const handleOptimize = async () => {
    const result = await optimizeMessage(message, audience);
    
    if (result) {
      setOptimizedMessage(result.optimizedMessage);
      setImprovements(result.improvements);
      setExpectedImprovement(result.expectedEngagementIncrease);
    }
  };
  
  const handleUseOptimized = () => {
    onSelectOptimized(optimizedMessage);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Your message:</label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message here..."
          className="min-h-[100px]"
        />
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={handleOptimize} 
          disabled={isOptimizing || !message}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
        >
          {isOptimizing ? (
            <>
              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Optimize with AI
            </>
          )}
        </Button>
      </div>
      
      {optimizedMessage && (
        <Card className="border-indigo-100 shadow-md">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 pb-2">
            <CardTitle className="text-lg flex items-center">
              <Sparkles className="mr-2 h-4 w-4 text-indigo-500" />
              AI Optimized Message
            </CardTitle>
            <CardDescription>
              {expectedImprovement > 0 && (
                <span className="text-green-600 font-medium">
                  +{expectedImprovement}% expected engagement increase
                </span>
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            <div className="bg-white p-3 rounded-md border mb-4">
              <p className="whitespace-pre-line">{optimizedMessage}</p>
            </div>
            
            {improvements.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Improvements made:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{improvement.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMessage(optimizedMessage)}
            >
              Edit
            </Button>
            <Button 
              size="sm"
              onClick={handleUseOptimized}
            >
              Use This Message
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default MessageOptimizer;
