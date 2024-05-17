import React, { useState } from "react";

function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  if (error) {
    return (
      <div>
        <h2>Something went wrong!</h2>
        <p>{error && error.toString()}</p>
        <p>Component stack trace:</p>
        <pre>{errorInfo && errorInfo.componentStack}</pre>
      </div>
    );
  }

  return children;
}

export default ErrorBoundary;
