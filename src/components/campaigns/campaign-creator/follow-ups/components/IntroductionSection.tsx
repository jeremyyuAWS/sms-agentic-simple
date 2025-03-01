
import React from 'react';

const IntroductionSection: React.FC = () => {
  return (
    <div className="text-sm space-y-2 mt-2 mb-4">
      <p className="font-medium">Your Message Sequence</p>
      <p>Customize your message sequence by editing the content of each message. The initial message is sent according to your campaign schedule, and follow-up messages are sent after the specified number of days.</p>
    </div>
  );
};

export default IntroductionSection;
