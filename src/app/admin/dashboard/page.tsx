import { loginIsRequiredClient, loginIsRequiredServer } from "@/lib/auth";

export default async function Home() {
    await loginIsRequiredServer();
  
    return (
      <div>
        <h1>Welcome to Home</h1>
      </div>
    );
}
