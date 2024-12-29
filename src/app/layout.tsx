export const metadata = {
    title: "Sign In",
    description: "Sign In to Commentzap",
  };
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body className={" flex flex-row"} style={{margin:0}}>
            {/* <TwitterNavbar /> */}
            {children}
        </body>
      </html>
    );
  }
  