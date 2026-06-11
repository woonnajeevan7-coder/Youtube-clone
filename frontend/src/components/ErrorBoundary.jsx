import React from 'react';

/**
 * Captures React rendering errors and displays a user-friendly recovery card.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '24px',
          backgroundColor: '#1f1f1f',
          borderRadius: '12px',
          border: '1px solid #cc0000',
          color: '#f1f1f1',
          margin: '20px auto',
          maxWidth: '600px',
          textAlign: 'center',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.5)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#ff4d4d' }}>Something went wrong</h3>
          <p style={{ margin: '0 0 16px 0', color: '#aaa', fontSize: '14px' }}>
            We encountered an error rendering this component.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              backgroundColor: '#cc0000',
              color: '#fff',
              border: 'none',
              borderRadius: '18px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
