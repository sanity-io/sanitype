import {ThemeProvider, studioTheme} from '@sanity/ui'
import React from 'react'
import type {ReactNode} from 'react'

export function Root({children}: {children: ReactNode}) {
  return <ThemeProvider theme={studioTheme}>{children}</ThemeProvider>
}
