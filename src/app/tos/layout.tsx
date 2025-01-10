export const metadata = {
    title: "Terms of Service",
    description: "Terms of Service for Commentzap",
  };
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body  style={{margin:0}}>
            {/* <TwitterNavbar /> */}
            {children}
        </body>
      </html>
    );
  }
  