/**
 * This service manages the automatic distribution of funds when events reach their goals
 * or when their timeframes end. In a real application, this would interact with
 * blockchain contracts to transfer funds.
 */

class EventDistribution {
  // In-memory store of processed transactions
  static transactions = [];

  /**
   * Check events that need distribution and process them
   * @param {Array} events - List of events to check
   * @returns {Promise} - Promise that resolves when all distributions are complete
   */
  static async checkAndDistribute(events) {
    // For demo purposes - in a real app, this would check blockchain conditions
    // and trigger smart contract transactions
    console.log("Checking events for distribution...");
    
    // Find events that meet distribution criteria
    const eventsToDistribute = events.filter(event => {
      // Distribute if goal is met or if very close to deadline with substantial funds
      const goalMet = event.raised >= event.goal;
      const urgentTimeframe = event.daysLeft <= 3;
      const substantialFunds = event.raised >= (event.goal * 0.8);
      
      return goalMet || (urgentTimeframe && substantialFunds);
    });
    
    if (eventsToDistribute.length === 0) {
      console.log("No events need distribution at this time");
      return [];
    }
    
    console.log(`${eventsToDistribute.length} events require distribution`);
    
    // Process each distribution
    const newTransactions = [];
    
    for (const event of eventsToDistribute) {
      // In a real app, this would trigger a blockchain transaction
      const txId = `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Create transaction record
      const transaction = {
        id: txId,
        date: new Date().toISOString(),
        eventId: event.id,
        eventTitle: event.title,
        amount: event.raised.toString(),
        from: "Care4Crisis",
        to: event.organizer,
        currency: "ETH", // Default for demo
        status: "confirmed"
      };
      
      // Add to transactions history
      this.transactions.push(transaction);
      newTransactions.push(transaction);
      
      console.log(`Distributed ${event.raised} to ${event.organizer} for cause "${event.title}"`);
    }
    
    return newTransactions;
  }
  
  /**
   * Get all transactions that have been processed
   * @returns {Array} - List of transactions
   */
  static getTransactions() {
    return this.transactions;
  }
}

export default EventDistribution; 