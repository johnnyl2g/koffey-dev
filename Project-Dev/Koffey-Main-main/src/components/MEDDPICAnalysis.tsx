import React, { useState } from 'react';
import { Save, Loader, AlertTriangle } from 'lucide-react';
import { lmStudioService } from '@/services/api/lmStudioService';

const MEDDPICAnalysis = ({ opportunityId, opportunityName }) => {
  const [notes, setNotes] = useState({
    metrics: '',
    economicBuyer: '',
    decisionCriteria: '',
    decisionProcess: '',
    paperProcess: '',
    identifyPain: '',
    champion: ''
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState(null);

  const handleFieldChange = (field, value) => {
    setNotes(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await lmStudioService.analyzeMEDDPICNotes(notes);
      setFeedback(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze notes');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderAnalysisSection = (section) => {
    const rating = section.match(/Rating: (POOR|FAIR|GOOD)/)?.[1];
    const bgColor = {
      'POOR': 'bg-red-50 border-red-200',
      'FAIR': 'bg-yellow-50 border-yellow-200',
      'GOOD': 'bg-green-50 border-green-200'
    }[rating] || 'bg-gray-50 border-gray-200';

    return (
      <div className={`p-4 rounded-lg border ${bgColor} mb-4`}>
        {section.split('\n').map((line, i) => {
          const isRating = line.startsWith('Rating:');
          const isHeader = line.match(/^(METRICS|ECONOMIC BUYER|DECISION CRITERIA|DECISION PROCESS|PAPER PROCESS|IDENTIFY PAIN|CHAMPION):/);
          
          return (
            <div key={i} className={`
              ${isRating ? 'font-bold text-lg my-2' : ''}
              ${isHeader ? 'font-bold text-xl mb-2' : ''}
              ${!isRating && !isHeader ? 'my-1' : ''}
            `}>
              {line}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">MEDDPIC Analysis: {opportunityName}</h3>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className={`px-4 py-2 rounded-lg flex items-center ${
            isAnalyzing ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader className="animate-spin mr-2" />
              Analyzing...
            </>
          ) : (
            <>
              <Save className="mr-2" size={18} />
              Analyze
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
          <AlertTriangle className="mr-2" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Fields */}
        <div className="space-y-4">
          {Object.entries({
            metrics: 'What metrics justify this purchase?',
            economicBuyer: 'Who has budget authority?',
            decisionCriteria: 'What criteria will be used to make the decision?',
            decisionProcess: 'What is the decision-making process?'
          }).map(([field, placeholder]) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
              </label>
              <textarea
                value={notes[field]}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {Object.entries({
            paperProcess: 'What is the paper process?',
            identifyPain: 'What problems are we solving?',
            champion: 'Who is advocating for us internally?'
          }).map(([field, placeholder]) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
              </label>
              <textarea
                value={notes[field]}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="mt-6">
          <h4 className="font-semibold text-xl mb-4">Analysis Results</h4>
          {feedback.split(/\n\n(?=[A-Z]+:)/).map((section, index) => (
            section.trim() && renderAnalysisSection(section)
          ))}
        </div>
      )}
    </div>
  );
};

export default MEDDPICAnalysis;