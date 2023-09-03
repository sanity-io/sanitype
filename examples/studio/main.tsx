import React from 'react'
import ReactDOM from 'react-dom/client'

import Refractor from 'react-refractor'
import json from 'refractor/lang/json'

import {Root} from './Root'
import App from './App'

Refractor.registerLanguage(json)
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root>
      <App />
    </Root>
  </React.StrictMode>,
)
