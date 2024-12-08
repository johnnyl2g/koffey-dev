import React, { useState, useEffect, useRef } from 'react';
import { lmStudioService } from '../services/api/lmStudioService';
import type { ChatMessage } from '../services/api/types';
import { AlertCircle, PlayCircle, Send, StopCircle, Loader } from 'lucide-react';

const RolePlayCoach: React.FC = () => {
  const [personalityProfile, setPersonalityProfile] = useState('');
  const [salesScenario, setSalesScenario] = useState('');
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScenarioActive, setIsScenarioActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Example profile and scenario for testing
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setPersonalityProfile(
        'A busy CTO of a mid-sized tech company. Very technical, data-driven, and skeptical of sales pitches. Values time efficiency and concrete ROI demonstrations.'
      );
      setSalesScenario(
        'Selling an AI-powered security solution that helps detect and prevent cyber threats in real-time. The product costs $50,000 annually.'
      );
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isScenarioActive || !input.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Add user message immediately for better UX
      const userMessage: ChatMessage = { role: 'user', content: input };
      const updatedConversation = [...conversation, userMessage];
      setConversation(updatedConversation);
      
      // Clear input early
      const currentInput = input;
      setInput('');

      console.log('Sending role play request:', {
        personalityProfile,
        salesScenario,
        conversation: updatedConversation,
        input: currentInput
      });

      const response = await lmStudioService.generateRolePlayResponse(
        personalityProfile,
        salesScenario,
        updatedConversation,
        currentInput
      );

      console.log('Received response:', response);

      if (response) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response
        };
        setConversation(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('No response received');
      }
    } catch (error) {
      console.error('Role play error:', error);
      setError(error instanceof Error ? error.message : 'Failed to get response');
      // Remove the user message if there was an error
      setConversation(prev => prev.slice(0, -1));
      setInput(input); // Restore the input
    } finally {
      setIsLoading(false);
    }
  };

  const startNewScenario = () => {
    if (!personalityProfile.trim() || !salesScenario.trim()) {
      setError('Please fill in both the personality profile and sales scenario before starting.');
      return;
    }
    
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are role-playing as a customer with the following profile:
      ${personalityProfile}
      
      The sales scenario is:
      ${salesScenario}
      
      Please respond as this customer would, maintaining their personality traits and perspective.`
    };

    setConversation([systemMessage]);
    setError(null);
    setIsScenarioActive(true);
  };

  const endScenario = () => {
    const shouldEnd = window.confirm('Are you sure you want to end this role play scenario? All conversation history will be lost.');
    if (shouldEnd) {
      setIsScenarioActive(false);
      setConversation([]);
      setInput('');
      setError(null);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Role Play Coach</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Customer Personality Profile:
          <span className="text-sm text-gray-500 ml-2">
            (Describe the customer's personality, background, and preferences)
          </span>
        </label>
        <textarea
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={personalityProfile}
          onChange={(e) => setPersonalityProfile(e.target.value)}
          placeholder="Example: A technical CTO who values data-driven decisions and ROI..."
          disabled={isScenarioActive}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Sales Scenario:
          <span className="text-sm text-gray-500 ml-2">
            (Describe the product/service and context)
          </span>
        </label>
        <textarea
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={salesScenario}
          onChange={(e) => setSalesScenario(e.target.value)}
          placeholder="Example: Selling an enterprise software solution that costs..."
          disabled={isScenarioActive}
        />
      </div>

      {!isScenarioActive ? (
        <button
          onClick={startNewScenario}
          disabled={!personalityProfile.trim() || !salesScenario.trim()}
          className={`mb-4 px-4 py-2 rounded flex items-center ${
            !personalityProfile.trim() || !salesScenario.trim()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          <PlayCircle className="mr-2" size={20} />
          Start Role Play
        </button>
      ) : (
        <button
          onClick={endScenario}
          className="mb-4 px-4 py-2 rounded flex items-center bg-red-500 text-white hover:bg-red-600"
        >
          <StopCircle className="mr-2" size={20} />
          End Role Play
        </button>
      )}

      {isScenarioActive && (
        <>
          <div className="mb-4 max-h-96 overflow-y-auto border rounded-lg p-4 space-y-4">
            {conversation
              .filter(msg => msg.role !== 'system')
              .map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-100 ml-8'
                      : 'bg-gray-100 mr-8'
                  }`}
                >
                  <div className="font-semibold mb-1">
                    {message.role === 'user' ? 'You' : 'Customer'}:
                  </div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              ))}
            {isLoading && (
              <div className="text-gray-500 italic ml-8 flex items-center">
                <Loader className="animate-spin mr-2" size={16} />
                Customer is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="flex items-end gap-2">
              <textarea
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`px-4 py-2 h-12 rounded text-white flex items-center ${
                  isLoading || !input.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default RolePlayCoach;