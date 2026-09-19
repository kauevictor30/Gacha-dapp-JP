import type { Metadata } from 'next';
import './globals.css';
import { WalletProvider } from '@/components/WalletProvider';

export const metadata: Metadata = {
  title: 'Gacha Machine - Stellar Lootbox',
  description: 'Abra baús na rede Stellar e ganhe prêmios físicos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}