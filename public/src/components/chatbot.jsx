import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: "Hello! I'm your ProfileApp assistant. I can answer these 4 questions:\n\n1. What is ProfileApp?\n2. How do I search profiles?\n3. What job types are available?\n4. How do I create a profile?" 
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  
  // Predefined Q&A pairs - focused on just 4 key questions
  const qaPairs = {
    "what is profileapp": "ProfileApp is a platform where professionals can create and manage their profiles. You can search for profiles by name or job title, and filter by job types.",
    "how do i search profiles": "You can search profiles using the search bar on the home page. Type a name or job title, and results will filter automatically. You can also filter by job type using the dropdown next to the search bar.",
    "what job types are available": "We have various job types including Full Stack Developer, UX/UI Designer, Data Scientist, Product Manager, DevOps Engineer, and Frontend Developer.",
    "how do i create a profile": "To create a profile, you need to register or log in first. After logging in, click on the 'Add Profile' link in the navigation menu and fill out the profile form.",
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = { role: "user", content: inputValue };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    // Process user input and get response
    const response = getResponse(inputValue);
    
    // Simulate typing delay for a more natural feel
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: response }
      ]);
    }, 500);
    
    setInputValue("");
  };

  const getResponse = (input) => {
    const normalizedInput = input.toLowerCase().trim();
    
    // Check for exact matches first
    if (qaPairs[normalizedInput]) {
      return qaPairs[normalizedInput];
    }
    
    // Check for keywords related to our 4 main questions
    if (normalizedInput.includes("what") && (normalizedInput.includes("profileapp") || normalizedInput.includes("this app"))) {
      return qaPairs["what is profileapp"];
    }
    
    if (normalizedInput.includes("search") || normalizedInput.includes("find") || normalizedInput.includes("filter")) {
      return qaPairs["how do i search profiles"];
    }
    
    if (normalizedInput.includes("job") || normalizedInput.includes("type") || 
        normalizedInput.includes("developer") || normalizedInput.includes("designer")) {
      return qaPairs["what job types are available"];
    }
    
    if (normalizedInput.includes("create") || normalizedInput.includes("add") || 
        normalizedInput.includes("make") || normalizedInput.includes("new") || 
        normalizedInput.includes("profile") || normalizedInput.includes("register")) {
      return qaPairs["how do i create a profile"];
    }
    
    // If no match found, provide a helpful default response
    return "I can answer these 4 questions:\n1. What is ProfileApp?\n2. How do I search profiles?\n3. What job types are available?\n4. How do I create a profile?\n\nCould you try asking one of these?";
  };

  return (
    <>
      {/* Chat bubble button */}
      <button
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-300 z-50 hover:scale-105 ${
          isOpen 
            ? 'bg-secondary text-secondary-foreground rotate-90' 
            : 'bg-primary text-primary-foreground'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat window */}
      <div 
        className={`fixed bottom-20 right-6 w-80 sm:w-96 bg-background border border-border rounded-lg shadow-xl flex flex-col transition-all duration-300 z-40 ${
          isOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ maxHeight: '500px' }}
      >
        {/* Chat header */}
        <div className="bg-primary text-primary-foreground p-3 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} />
            <h3 className="font-medium">ProfileApp Assistant</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground/80 hover:text-primary-foreground"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Messages area */}
        <div className="p-4 flex-grow overflow-y-auto flex flex-col" style={{ maxHeight: '350px' }}>
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-3 max-w-[80%] whitespace-pre-line ${
                message.role === 'assistant' 
                  ? 'bg-muted text-foreground rounded-lg p-3 rounded-tl-none self-start border border-muted' 
                  : 'bg-primary text-primary-foreground rounded-lg p-3 rounded-tr-none ml-auto self-end'
              }`}
            >
              {message.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <form onSubmit={handleSubmit} className="border-t border-border p-3 flex gap-2">
          <Input
            type="text"
            placeholder="Ask about the 4 questions..."
            value={inputValue}
            onChange={handleInputChange}
            className="flex-grow focus-visible:ring-primary"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!inputValue.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </>
  );
}