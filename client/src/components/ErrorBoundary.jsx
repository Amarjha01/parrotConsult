/*  src/components/ErrorBoundary.jsx  */
import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err, info) {
    console.error('Meeting-room crash:', err, info);
  }
  render() {
    return this.state.hasError ? (
      <h2>Something went wrong. Please refresh.</h2>
    ) : (
      this.props.children
    );
  }
}
