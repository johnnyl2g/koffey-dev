import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { MessageSquare, Plus } from 'lucide-react';
import { lmStudioService } from '../services/api/lmStudioService';

interface Note {
  id: number;
  content: string;
  timestamp: Date;
}

interface NotesSectionProps {
  opportunityId: number;
  opportunityName: string;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  opportunityId,
  opportunityName,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeNotes = async (notesToAnalyze: Note[]) => {
    if (notesToAnalyze.length === 0) return;

    setIsAnalyzing(true);
    try {
      const notesContent = notesToAnalyze.map(note => note.content);
      const result = await lmStudioService.analyzeMEDDPICNotes(
        notesContent.join('\n\n')
      );
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing notes:', error);
      setError('Failed to analyze notes');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const debouncedAnalysis = useCallback(
    debounce((notes: Note[]) => analyzeNotes(notes), 1000),
    [opportunityName]
  );

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now(),
        content: newNote.trim(),
        timestamp: new Date(),
      };
      setNotes(prevNotes => {
        const updatedNotes = [...prevNotes, note];
        debouncedAnalysis(updatedNotes);
        return updatedNotes;
      });
      setNewNote('');
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <MessageSquare className="mr-2" />
        Notes & Analysis
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <textarea
              className="w-full p-2 border rounded"
              rows={3}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a new note..."
            />
            <button
              onClick={addNote}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600"
            >
              <Plus size={20} className="mr-2" />
              Add Note
            </button>
          </div>

          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2">{note.content}</p>
                <p className="text-sm text-gray-500">
                  {note.timestamp.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">AI Analysis</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            {error && (
              <p className="text-red-500 mb-2">{error}</p>
            )}
            {isAnalyzing ? (
              <p className="text-gray-600">Analyzing notes...</p>
            ) : analysis ? (
              <p>{analysis}</p>
            ) : (
              <p className="text-gray-500">Add notes to see AI analysis</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesSection;