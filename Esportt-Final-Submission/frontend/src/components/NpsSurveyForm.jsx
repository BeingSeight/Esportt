'use client';
import { useState } from 'react';
import { toast } from 'sonner';

export function NpsSurveyForm({ userId }) {
  const [score, setScore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (score === null) {
      toast.error("Please select a score.");
      return;
    }
    setIsSubmitting(true);
    try {
      await fetch('/api/metrics/nps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, userId }),
      });
      toast.success("Thank you for your feedback!");
    } catch (error) {
      toast.error("Failed to submit feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
      <h3 className="font-semibold text-white mb-4">How likely are you to recommend us to a friend?</h3>
      <div className="flex justify-center gap-2 mb-4">
        {[...Array(11).keys()].map(num => (
          <button
            type="button"
            key={num}
            onClick={() => setScore(num)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${score === num ? 'bg-blue-600 text-white scale-110' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            {num}
          </button>
        ))}
      </div>
      <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}