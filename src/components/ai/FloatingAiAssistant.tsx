
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, Send, Loader2 } from 'lucide-react';
import { answerProduceQuestion, type ProduceQnaInput, type ProduceQnaOutput } from '@/ai/flows/produce-qna-flow';
import { ScrollArea } from '../ui/scroll-area';

interface ChatMessage {
  type: 'user' | 'ai';
  text: string;
}

export default function FloatingAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newUserMessage: ChatMessage = { type: 'user', text: userInput };
    setChatHistory(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const input: ProduceQnaInput = { userQuery: userInput };
      const result: ProduceQnaOutput = await answerProduceQuestion(input);
      const newAiMessage: ChatMessage = { type: 'ai', text: result.answer };
      setChatHistory(prev => [...prev, newAiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorAiMessage: ChatMessage = { type: 'ai', text: "Sorry, I encountered an error. Please try again." };
      setChatHistory(prev => [...prev, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground z-50"
        aria-label="Open AI Assistant"
      >
        <Bot size={28} />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Bot className="text-primary" /> VeggieBot Assistant
            </SheetTitle>
            <SheetDescription>
              Ask me anything about our fruits and vegetables!
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-grow my-4 pr-4">
            <div className="space-y-4">
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-lg ${
                      chat.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {chat.text}
                  </div>
                </div>
              ))}
               {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[75%] p-3 rounded-lg bg-muted text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <SheetFooter className="mt-auto">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2 py-2">
              <Input
                id="ai-query"
                placeholder="E.g., How to store avocados?"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-grow"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !userInput.trim()} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
