export const metadata = {
    title: "Pricacy Policy",
    description: "Privacy Policy for Commentzap",
  };
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body style={{margin:0}}>
            {children}
        </body>
      </html>
    );
  }
  