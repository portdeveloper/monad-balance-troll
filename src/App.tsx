import { useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { config, queryClient } from './config/wagmi'
import { AddressSlider } from './components/AddressSlider'
import { BalanceDisplay } from './components/BalanceDisplay'

function App() {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background text-foreground p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-6xl font-mono font-bold text-primary tracking-wider">
                MONAD BALANCE
              </h1>
              <h2 className="text-2xl font-mono text-muted-foreground">
                ADVANCED ADDRESS BALANCE CHECKER
              </h2>
              <div className="text-sm font-mono text-muted-foreground max-w-2xl mx-auto">
                PRECISION ENGINEERING FOR ETHEREUM ADDRESS INPUT.
                USE THE SLIDER BELOW TO SELECT YOUR ADDRESS FROM THE COMPLETE RANGE.
              </div>
            </div>

            <AddressSlider onAddressChange={setSelectedAddress} />
            <BalanceDisplay address={selectedAddress} />

            <div className="text-center text-xs font-mono text-muted-foreground">
              POWERED BY MONAD TESTNET • INDUSTRIAL GRADE BLOCKCHAIN TECHNOLOGY
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
