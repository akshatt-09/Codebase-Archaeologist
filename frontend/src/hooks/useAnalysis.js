import { useState, useEffect } from 'react';
import { getSummary, analyzeRepository } from '../services/api';

export function useAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSummary()
      .then((res) => {
        if (res && res.analyzed) {
          setData(res);
        }
      })
      .catch((err) => console.warn('No active summary found:', err));
  }, []);

  const runAnalysis = async (formData) => {
    setLoading(true);
    setError(null);
    setAnalyzingStep('Uploading repository...');
    try {
      setAnalyzingStep('Parsing source files & resolving dependencies...');
      const result = await analyzeRepository(formData);
      setData(result);
      setAnalyzingStep(null);
    } catch (err) {
      setError(err.message);
      setAnalyzingStep(null);
    } finally {
      setLoading(false);
    }
  };

  const runGithubAnalysis = async (url) => {
    setLoading(true);
    setError(null);
    setAnalyzingStep('Cloning repository from GitHub...');
    try {
      setAnalyzingStep('Parsing codebase & analyzing git history...');
      
      const response = await fetch('/api/analyze-github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze GitHub repository');
      }

      setData(result);
      setAnalyzingStep(null);
    } catch (err) {
      setError(err.message || 'Error connecting to backend');
      setAnalyzingStep(null);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, analyzingStep, error, runAnalysis, runGithubAnalysis };
}