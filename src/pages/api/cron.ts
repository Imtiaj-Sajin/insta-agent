import type { NextApiRequest, NextApiResponse } from "next";
import { dailyPerformanceJob } from "../../jobs/dailyPerformanceJob";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    await dailyPerformanceJob();
    res.status(200).json({ message: "Daily performance job executed successfully." });
  } catch (error) {
    console.error("Error executing daily performance job:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
