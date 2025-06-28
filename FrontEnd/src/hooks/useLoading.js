import { useState } from 'react';

export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  const withLoading = async (asyncFunction) => {
    startLoading();
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      stopLoading();
    }
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading
  };
};

export const useButtonLoading = () => {
  const [loadingButtons, setLoadingButtons] = useState(new Set());

  const setButtonLoading = (buttonId, loading = true) => {
    setLoadingButtons(prev => {
      const newSet = new Set(prev);
      if (loading) {
        newSet.add(buttonId);
      } else {
        newSet.delete(buttonId);
      }
      return newSet;
    });
  };

  const isButtonLoading = (buttonId) => loadingButtons.has(buttonId);

  const withButtonLoading = async (buttonId, asyncFunction) => {
    setButtonLoading(buttonId, true);
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      setButtonLoading(buttonId, false);
    }
  };

  return {
    setButtonLoading,
    isButtonLoading,
    withButtonLoading
  };
};
