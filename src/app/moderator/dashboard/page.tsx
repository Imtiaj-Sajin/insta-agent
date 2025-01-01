import { loginIsRequiredServer } from "@/lib/auth";

const ModeratorDashboard: React.FC = async () => {
      await loginIsRequiredServer();
  
    return '';
  };
  
export default ModeratorDashboard;
  