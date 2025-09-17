import { useState, useCallback, useEffect } from 'react'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { isAddress, getAddress } from 'viem'

interface AddressSliderProps {
  onAddressChange: (address: string | null) => void
}

export function AddressSlider({ onAddressChange }: AddressSliderProps) {
  // Use a MASSIVE range for maximum precision - 10 billion steps!
  const MAX_SLIDER_VALUE = 10000000000
  const [sliderValue, setSliderValue] = useState([MAX_SLIDER_VALUE / 2])
  const [displayAddress, setDisplayAddress] = useState('0x0000000000000000000000000000000000000000')

  const generateAddressFromSliderValue = useCallback((value: number) => {
    // Convert slider value (0 to 10 billion) to the full Ethereum address range
    // Max Ethereum address: 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
    const ratio = value / MAX_SLIDER_VALUE

    // Use BigInt to handle the full 160-bit address space properly
    const maxAddress = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')

    // Use ultra-high precision scaling to capture every possible address
    const ratioScaled = BigInt(Math.floor(ratio * 1000000000000)) // 1 trillion scale for precision
    const addressBigInt = (maxAddress * ratioScaled) / BigInt(1000000000000)

    // Convert back to hex and pad to 40 characters (lowercase for proper checksum)
    const hexString = addressBigInt.toString(16).toLowerCase().padStart(40, '0')
    const rawAddress = `0x${hexString}`

    // Convert to proper checksum address
    try {
      return getAddress(rawAddress)
    } catch (error) {
      console.warn('Invalid address generated:', rawAddress, error)
      return rawAddress // fallback to raw address
    }
  }, [])

  const handleSliderChange = useCallback((value: number[]) => {
    setSliderValue(value)
    const address = generateAddressFromSliderValue(value[0])
    setDisplayAddress(address)

    // Debug logging
    console.log('Generated address:', address)
    console.log('Is valid address:', isAddress(address))

    if (isAddress(address)) {
      onAddressChange(address)
    } else {
      onAddressChange(null)
    }
  }, [generateAddressFromSliderValue, onAddressChange])

  // Keyboard controls for precision adjustments
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      let adjustment = 0

      if (event.key === 'ArrowLeft') {
        if (event.ctrlKey) adjustment = -10000
        else if (event.shiftKey) adjustment = -100
        else adjustment = -1
      } else if (event.key === 'ArrowRight') {
        if (event.ctrlKey) adjustment = 10000
        else if (event.shiftKey) adjustment = 100
        else adjustment = 1
      }

      if (adjustment !== 0) {
        event.preventDefault()
        setSliderValue(prev => {
          const newValue = Math.max(0, Math.min(MAX_SLIDER_VALUE, prev[0] + adjustment))
          const address = generateAddressFromSliderValue(newValue)
          setDisplayAddress(address)

          if (isAddress(address)) {
            onAddressChange(address)
          } else {
            onAddressChange(null)
          }

          return [newValue]
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [generateAddressFromSliderValue, onAddressChange, MAX_SLIDER_VALUE])

  return (
    <Card className="w-full max-w-2xl mx-auto brutalist-card">
      <CardHeader>
        <CardTitle className="font-mono text-2xl text-primary">ADDRESS INPUT SYSTEM</CardTitle>
        <CardDescription className="font-mono text-muted-foreground">
          SLIDE TO INPUT YOUR ETHEREUM ADDRESS
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="text-sm font-mono text-muted-foreground">
            RANGE: 0x0000...0000 → 0xFFFF...FFFF
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            PRECISION: {MAX_SLIDER_VALUE.toLocaleString()} DISCRETE POSITIONS
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            CURRENT POSITION: {sliderValue[0].toLocaleString()} / {MAX_SLIDER_VALUE.toLocaleString()}
          </div>
          <Slider
            value={sliderValue}
            onValueChange={handleSliderChange}
            max={MAX_SLIDER_VALUE}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs font-mono text-muted-foreground">
            <span>0x0000...0000</span>
            <span>CURRENT: {((sliderValue[0] / MAX_SLIDER_VALUE) * 100).toFixed(6)}%</span>
            <span>0xFFFF...FFFF</span>
          </div>
        </div>

        <div className="p-4 bg-secondary border border-primary font-mono text-sm">
          <div className="text-primary mb-2">CURRENT ADDRESS:</div>
          <div className="text-foreground break-all bg-background p-2 border border-border">
            {displayAddress}
          </div>
        </div>

        <div className="p-4 bg-muted border border-border font-mono text-xs">
          <div className="text-primary mb-2">PRECISION CONTROLS:</div>
          <div className="space-y-2">
            <div className="text-muted-foreground">
              USE KEYBOARD ARROWS FOR MICRO-ADJUSTMENTS
            </div>
            <div className="text-muted-foreground">
              LEFT/RIGHT: ±1 POSITION • SHIFT+ARROW: ±100 POSITIONS
            </div>
            <div className="text-muted-foreground">
              CTRL+ARROW: ±10,000 POSITIONS • TOTAL: 10,000,000,000 POSITIONS
            </div>
            <div className="text-primary text-xs mt-2">
              ESTIMATED TIME TO FIND SPECIFIC ADDRESS: 1-6 MONTHS OF DEDICATED SLIDING
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}