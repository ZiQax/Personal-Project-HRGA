import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import api from '../services/api';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  referenceId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    referenceId: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, referenceId: Date.now().toString(36).toUpperCase() };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Automatically report to the backend AI Monitor
    api.post('/system/crash-report', {
      error: {
        message: error.message,
        stack: error.stack
      },
      componentStack: errorInfo.componentStack
    }).catch(err => console.error('Failed to send crash report', err));
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, referenceId: '' });
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-xl shadow-slate-200/50 border border-slate-200 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600" />
            
            <div className="bg-red-50 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
              <AlertOctagon className="h-8 w-8 text-red-600" />
            </div>
            
            <h1 className="text-xl font-bold text-slate-800 mb-3 tracking-tight">Operational Interruption</h1>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              A system anomaly was detected. The AI monitoring protocol has logged this event and notified IT maintenance for immediate analysis.
            </p>

            <div className="bg-slate-50 rounded-lg p-4 mb-8 border border-slate-100 text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">LOG REFERENCE</p>
              <p className="font-mono text-slate-700 text-sm font-bold tracking-wider">{this.state.referenceId}</p>
            </div>

            <button 
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold text-sm transition-all shadow-lg shadow-red-100 active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
              Reset System Context
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

