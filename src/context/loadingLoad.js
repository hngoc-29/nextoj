'use client';
import {
  createContext,
  useState
} from 'react';
const loadingLoadContext = createContext();
const LoadingLoadProvider = ({ children }) => {
  const [loadingLoad,
    setLoadingLoad] = useState(true);
  const loadingMethod = {
    loadingLoad,
    setLoadingLoad
  };
  return (
    <loadingLoadContext.Provider value={loadingMethod}>
      {children}
    </loadingLoadContext.Provider>
  );
};

export default LoadingLoadProvider;

export {
  loadingLoadContext,
};