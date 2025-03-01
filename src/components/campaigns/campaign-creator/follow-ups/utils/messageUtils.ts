
// Get suggested message titles based on follow-up position
export const getSuggestedMessageTitles = (index: number) => {
  if (index === 0) return [];
  
  return [
    { value: `Quick follow-up (#${index})`, tooltip: "A gentle reminder" },
    { value: `Checking in (#${index})`, tooltip: "An unobtrusive check-in" },
    { value: `Value proposition (#${index})`, tooltip: "Highlights your main value" },
    { value: `Final outreach (#${index})`, tooltip: "Last attempt to connect" },
    { value: `Just wondering (#${index})`, tooltip: "Very casual follow-up" }
  ];
};

// Example text messages for each position in the sequence
export const getExampleMessages = (index: number) => {
  if (index === 0) {
    return [
      "Hi {{first_name}}, this is {{sender_name}} from {{company}}. I wanted to reach out about how we can help you increase revenue by 20% with our solution. Would you be open to a quick chat?",
      "{{first_name}}, {{sender_name}} here from {{company}}. Our clients see 30% efficiency gains within 3 months. I'd love to share how we might help your team at {{prospect_company}} too. When's a good time to connect?",
      "Hi {{first_name}}, {{sender_name}} with {{company}}. Based on your role at {{prospect_company}}, I think our {{product_name}} could help you with {{specific_pain_point}}. Can we schedule a quick 15-minute call?"
    ];
  } 
  
  if (index === 1) {
    return [
      "Hi {{first_name}}, just checking in on my previous message. I'd still love to share how {{company}} has helped similar businesses achieve {{specific_benefit}}. Would you have 15 minutes this week?",
      "{{first_name}}, just following up on my previous text. I understand you're busy, but I think {{product_name}} could really help with your {{specific_challenge}}. Let me know if you'd like to learn more.",
      "Quick follow-up, {{first_name}} - I'm still hoping to connect about how {{company}} can help {{prospect_company}} improve {{metric}}. Does Thursday or Friday work better for a brief call?"
    ];
  }
  
  if (index === 2) {
    return [
      "{{first_name}}, I wanted to share that our clients at {{competitor_company}} increased their {{metric}} by {{percentage}}. I'd be happy to explain how we achieved this in a quick call.",
      "Hi {{first_name}}, I've helped 3 other {{role}} professionals solve {{pain_point}} this month. If that's still a priority for {{prospect_company}}, I'd love to share our approach.",
      "{{first_name}}, I'm reaching out one more time because I believe our {{product_name}} would be valuable for your team at {{prospect_company}}. Let me know if you'd like to see a quick demo."
    ];
  }
  
  return [
    "{{first_name}}, I'll make this my final message. If improving your {{metric}} becomes a priority, feel free to reach out anytime at {{phone_number}}. Wishing you continued success!",
    "I understand timing might not be right, {{first_name}}. If you'd like to explore how {{company}} can help {{prospect_company}} in the future, my line is always open at {{phone_number}}.",
    "{{first_name}}, as this will be my last outreach, I wanted to share this resource that addresses {{specific_challenge}}: {{resource_link}}. Feel free to contact me if you find it valuable."
  ];
};
