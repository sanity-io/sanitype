import React from 'react'
import ReactDOM from 'react-dom/client'

import {Root} from './Root'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root>
      <App />
    </Root>
  </React.StrictMode>,
)
