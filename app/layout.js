import './globals.css';

export const metadata = {
  title: 'MiniOdoo',
  description: 'Gestion simple de votre entreprise',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
