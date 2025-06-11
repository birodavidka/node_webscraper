export const uptime = async (req, res) => {
  try {
    const uptimeInSeconds = process.uptime();
    const uptimeInHours = (uptimeInSeconds / 3600).toFixed(2);
    res.status(200).json({ status: 'ok', uptime: uptimeInHours });
    console.log(`Server uptime: ${uptimeInHours} hours (${uptimeInSeconds} seconds)`);
  } catch (error) {
    console.error("Error in uptime function:", error);
    res.status(500).json({ error: "An error occurred while fetching uptime." });
  }
}

export const status = async (req, res) => {
  try {
    const status = {
      status: 'ok',
      message: 'Server is running smoothly'
    };
    res.status(200).json(status);
    console.log("Server status checked successfully.");
  } catch (error) {
    console.error("Error in status function:", error);
    res.status(500).json({ error: "An error occurred while checking server status." });
  }
}
