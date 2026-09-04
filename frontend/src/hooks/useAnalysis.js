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

  return { data, loading, analyzingStep, error, runAnalysis };
}