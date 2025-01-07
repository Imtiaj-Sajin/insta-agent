export const metadata = {
    title: "Forgot Pass",
    description: "Forgot Password Page Commentzap",
  };
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body  style={{margin:0}}>
            {children}
        </body>
      </html>
    );
  }
  