import './globals.css';

export const metadata = {
  title: 'Marq AI Skills Platform',
  description: 'Production-ready AI skills for business, coding, and everyday life. 173+ skills across sales, marketing, engineering, and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
