import React, { ErrorInfo } from 'react';
import { UnexpectedError } from './UnexpectedError';

type IErrorBoundaryProps = {
  children: React.ReactNode;
}

type IErrorBoundary = {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundary> {
  state: IErrorBoundary = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): IErrorBoundary {
    console.error(error);
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('error:', error, errorInfo);
  }

  updateState = (hasError: boolean): void => {
    this.setState({ hasError });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <UnexpectedError updateState={this.updateState} />;
    }
    return this.props.children;
  }
}
