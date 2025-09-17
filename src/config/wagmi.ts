import { createConfig, http } from 'wagmi'
import { monadTestnet } from 'viem/chains'
import { QueryClient } from '@tanstack/react-query'

export const config = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
})

export const queryClient = new QueryClient()