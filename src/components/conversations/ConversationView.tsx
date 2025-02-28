
import React, { useState, useRef, useEffect } from 'react';
import { Conversation, Message } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, User, Phone, Calendar, XCircle, CheckCircle2, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useApp } from '@/contexts';
import AnimatedCard from '@/components/ui/AnimatedCard';

interface ConversationViewProps {
  conversation: Conversation;
}

const ConversationView: React.FC<ConversationViewProps> = ({ conversation }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage } = useApp();

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    sendMessage(conversation.contactId, message);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusActions = () => {
    switch (conversation.status) {
      case 'interested':
        return (
          <Button variant="outline" size="sm" className="h-8">
            <Calendar className="h-3.5 w-3.5 mr-1" /> Send Calendar Link
          </Button>
        );
      case 'new':
      case 'active':
        return (
          <Button variant="outline" size="sm" className="h-8">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Mark as Interested
          </Button>
        );
      case 'no-response':
        return (
          <Button variant="outline" size="sm" className="h-8">
            <Send className="h-3.5 w-3.5 mr-1" /> Send Follow-up
          </Button>
        );
      case 'do-not-disturb':
        return (
          <Button variant="outline" size="sm" className="h-8" disabled>
            <XCircle className="h-3.5 w-3.5 mr-1" /> Opted Out
          </Button>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <AnimatedCard className="flex-shrink-0 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-medium">{conversation.contactName}</h2>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5 mr-1" />
              <span>{conversation.contactPhone}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            {getStatusActions()}
          </div>
        </div>
      </AnimatedCard>

      <div className="flex-grow overflow-y-auto mb-4 space-y-3 pr-1">
        {conversation.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 bg-card rounded-lg border border-border/80 overflow-hidden">
        <Textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border-0 focus-visible:ring-0 resize-none min-h-[80px]"
        />
        <div className="flex justify-between items-center p-2 border-t border-border/50">
          <div className="text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </div>
          <Button 
            onClick={handleSendMessage} 
            disabled={!message.trim()}
            size="sm"
          >
            <Send className="h-3.5 w-3.5 mr-1.5" /> Send
          </Button>
        </div>
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isOutbound = message.type === 'outbound';

  return (
    <div className={cn(
      "flex",
      isOutbound ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-xl p-3",
        isOutbound 
          ? "bg-primary text-primary-foreground rounded-tr-sm" 
          : "bg-muted rounded-tl-sm"
      )}>
        <div className="text-sm">{message.body}</div>
        <div className={cn(
          "text-xs mt-1 flex justify-end",
          isOutbound ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          {formatDistanceToNow(message.sentAt, { addSuffix: true })}
        </div>
      </div>
    </div>
  );
};

export default ConversationView;
