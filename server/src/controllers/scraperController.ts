

export const scrape = async (req, res) => {

  try {
    console.log("scrape function called");
    res.status(200).json({ message: "Scrape function called successfully." });
  } catch (error) {
    console.error("Error in scrape function:", error);
    res.status(500).json({ error: "An error occurred while scraping." });
    return;
    
  }
  console.log("scrape function called");
}