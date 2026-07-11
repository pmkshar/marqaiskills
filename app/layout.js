import './globals.css';
import AuthProvider from '../components/AuthProvider';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Marq AI Skills Platform',
  description: 'Production-ready AI skills for business, coding, and everyday life. 173+ skills across sales, marketing, engineering, and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
