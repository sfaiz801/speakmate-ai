import '@/styles/globals.scss';
import { AppProvider } from '@/context/AppContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import ToastContainer from '@/components/common/ToastContainer';

export const metadata = {
  title: 'SpeakMate AI — Personal AI English Speaking Tutor for Hindi Learners',
  description:
    'Practice spoken English with a friendly Gemini-powered AI tutor. Get gentle grammar corrections, Hindi explanations, daily vocabulary, real-life roleplay, and interview coaching.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <AppProvider>
            {children}
            <ToastContainer />
          </AppProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
