'use client'

import { ReactNode } from 'react'

interface MobileShellProps {
  children: ReactNode
}

export function MobileShell({ children }: MobileShellProps) {
  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-[#e8e8e8]">
      <div className="relative w-full max-w-[430px] h-[100dvh] bg-background overflow-hidden shadow-2xl md:rounded-[2.5rem] md:border-[8px] md:border-[#252525] md:h-[90dvh] md:max-h-[932px]">
        <div className="relative h-full flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
