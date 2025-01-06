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
        <body className={" flex flex-row"} style={{margin:0}}>
            {children}
        </body>
      </html>
    );
  }
  