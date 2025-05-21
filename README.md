# Care4Crisis - Blockchain Donation Platform

This project enhances the Care4Crisis donation platform with blockchain integration, providing transparency and automated fund distribution for donations.

## Smart Contract Details

The platform uses smart contracts to handle donations for NGO campaigns:

1. When an NGO contacts Care4Crisis, a campaign is created with:
   - A target donation amount
   - A deadline for fundraising
   - The NGO's wallet address for receiving funds

2. The smart contract automatically:
   - Collects and holds donations made to the campaign
   - Releases funds to the NGO when either:
     - The target amount is reached
     - The deadline has passed

3. All transactions are recorded on the blockchain for complete transparency

## UI Features and Improvements

The platform includes several UI improvements for better user experience:

1. **Donation Page Enhancements**:
   - Properly styled round NGO logo containers
   - Improved contact information display with proper text truncation
   - Fixed alignment issues for better readability

2. **NGO Information Display**:
   - Redesigned NGO Info buttons with consistent sizing and styling
   - Enhanced event cards with proper button styling
   - Improved hover states for interactive elements

3. **Progress Tracking**:
   - Fixed progress bars with accurate percentage display
   - Proper width calculation for visual representation of funding progress
   - Clear visual indication of campaign funding status

4. **Social Media Integration**:
   - Improved "Follow Us" section with platform-specific icons
   - Enhanced social media links with hover effects
   - Optimized layout for better visibility and engagement

## Project Structure

- `blockchain/` - Contains smart contract code and deployment scripts
- `src/services/` - Integration services for Ethereum and Solana
- `src/components/donation/` - React components for the donation platform

## Blockchain Technologies Used

- **Ethereum (Sepolia Testnet)**: Primary blockchain using MetaMask wallet
- **Solana (Testnet)**: Alternative blockchain using Phantom wallet

## Prerequisites

- Node.js and npm
- MetaMask browser extension
- Phantom wallet (for Solana integration)
- Sepolia ETH testnet tokens
- Solana testnet tokens

## Smart Contract Deployment

### Deploying to Ethereum Sepolia Testnet

1. Create a `.env` file in the `blockchain/` directory with your credentials:
   ```
   PRIVATE_KEY=your_metamask_private_key
   ALCHEMY_API_URL=your_alchemy_sepolia_api_url
   ETHERSCAN_API_KEY=your_etherscan_api_key (optional for verification)
   ```

2. Install dependencies:
   ```
   cd blockchain
   npm install
   ```

3. Compile the contracts:
   ```
   npx hardhat compile
   ```

4. Deploy to Sepolia:
   ```
   npx hardhat run scripts/deploy.js --network sepolia
   ```

5. Update the contract address in `src/services/ethereumService.js` with the deployed address

### Mainnet Deployment (When Ready)

1. Update hardhat.config.js with mainnet configurations
2. Run the deployment script with mainnet network flag
3. Update the contract address in the frontend service

## Interacting with the Contract

After deployment, users can:

1. View active campaigns from the blockchain
2. Donate ETH or SOL to campaigns
3. Create new campaigns (with platform approval)
4. View transaction history on-chain

## For Developers

To extend this functionality:

1. Enhance the contracts with additional features:
   ```solidity
   // Example of adding a new feature
   function withdrawEmergencyFunds() public onlyOwner {
     // Implementation details
   }
   ```

2. Update the frontend services in `src/services/` to interact with new contract functions

3. Add new components in the React frontend to expose the new functionality

## Testing

Run smart contract tests:
```
cd blockchain
npx hardhat test
```

## License

MIT
