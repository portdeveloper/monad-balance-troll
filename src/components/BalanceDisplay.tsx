import { useState, useEffect, useCallback } from 'react'
import { useBalance } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { monadTestnet } from 'viem/chains'
import { formatEther } from 'viem'

interface BalanceDisplayProps {
  address: string | null
}

export function BalanceDisplay({ address }: BalanceDisplayProps) {
  const [shouldCheck, setShouldCheck] = useState(false)
  const [checkedAddress, setCheckedAddress] = useState<string | null>(null)


  const { data: balance, isError, isLoading } = useBalance({
    address: shouldCheck && address ? (address as `0x${string}`) : undefined,
    chainId: monadTestnet.id,
  })

  const handleCheckBalance = useCallback(() => {
    if (address) {
      setShouldCheck(true)
      setCheckedAddress(address)
    }
  }, [address])

  // Enter key support for checking balance
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && address && (!shouldCheck || checkedAddress !== address)) {
        event.preventDefault()
        handleCheckBalance()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [address, shouldCheck, checkedAddress, handleCheckBalance])

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

    if (!shouldCheck || checkedAddress !== address) {
      return (
        <div className="text-center p-8 space-y-4">
          <div className="text-4xl mb-4">🎯</div>
          <div className="text-muted-foreground font-mono mb-4">
            ADDRESS SELECTED - READY TO CHECK BALANCE
          </div>
          <Button
            onClick={handleCheckBalance}
            className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 brutalist-border"
            size="lg"
          >
            CHECK BALANCE ON MONAD TESTNET [ENTER]
          </Button>
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
        <div className="text-center p-8 space-y-4">
          <div className="text-6xl mb-4">💩</div>
          <div className="text-muted-foreground font-mono mb-4">
            ERROR OR NO BALANCE
          </div>
          <Button
            onClick={handleCheckBalance}
            className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 brutalist-border"
            size="sm"
          >
            TRY AGAIN
          </Button>
        </div>
      )
    }

    return (
      <div className="text-center p-8 space-y-4">
        <div className="text-4xl mb-4">💰</div>
        <div className="text-3xl font-mono text-primary mb-2">
          {parseFloat(formatEther(balance.value)).toFixed(4)} MON
        </div>
        <div className="text-sm font-mono text-muted-foreground mb-4">
          MONAD TESTNET BALANCE
        </div>
        <Button
          onClick={handleCheckBalance}
          className="font-mono bg-secondary text-secondary-foreground hover:bg-secondary/90 brutalist-border"
          size="sm"
        >
          CHECK AGAIN
        </Button>
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