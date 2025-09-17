import { useBalance } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { monadTestnet } from 'viem/chains'
import { formatEther } from 'viem'

interface BalanceDisplayProps {
  address: string | null
}

export function BalanceDisplay({ address }: BalanceDisplayProps) {
  const { data: balance, isError, isLoading } = useBalance({
    address: address as `0x${string}` | undefined,
    chainId: monadTestnet.id,
  })

  const renderContent = () => {
    if (!address) {
      return (
        <div className="text-center p-8">
          <div className="text-4xl mb-4">⚡</div>
          <div className="text-muted-foreground font-mono">
            SLIDE TO SELECT ADDRESS
          </div>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="text-center p-8">
          <div className="text-4xl mb-4 animate-pulse">🔍</div>
          <div className="text-muted-foreground font-mono">
            SCANNING BLOCKCHAIN...
          </div>
        </div>
      )
    }

    if (isError || !balance) {
      return (
        <div className="text-center p-8">
          <div className="text-6xl mb-4">💩</div>
          <div className="text-muted-foreground font-mono">
            ERROR OR NO BALANCE
          </div>
        </div>
      )
    }

    return (
      <div className="text-center p-8">
        <div className="text-4xl mb-4">💰</div>
        <div className="text-3xl font-mono text-primary mb-2">
          {parseFloat(formatEther(balance.value)).toFixed(4)} MON
        </div>
        <div className="text-sm font-mono text-muted-foreground">
          MONAD TESTNET BALANCE
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto brutalist-card">
      <CardHeader>
        <CardTitle className="font-mono text-2xl text-primary">BALANCE CHECK SYSTEM</CardTitle>
        <CardDescription className="font-mono text-muted-foreground">
          DISPLAYING MON BALANCE ON MONAD TESTNET
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  )
}