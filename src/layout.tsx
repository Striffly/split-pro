import { PublicEnvProvider } from '~/../env/publicEnvProvider';
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PublicEnvProvider>{children}</PublicEnvProvider>
      </body>
    </html>
  );
}
