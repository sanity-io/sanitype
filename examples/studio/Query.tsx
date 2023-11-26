import {Box, Button, Card, Stack} from '@sanity/ui'
import {useCallback, useState} from 'react'
import {useCLStore} from './hooks/CLStoreProvider'

interface QueryPanelProps {}
export function Query(props: QueryPanelProps) {
  const [q, setQ] = useState('*[_type=="person"]')
  const [result, setResult] = useState<unknown>()
  const clStore = useCLStore()

  const doQuery = useCallback(() => {
    clStore.query(q).then(res => {
      setResult(res)
    })
  }, [clStore, q])

  return (
    <Card flex={1} padding={4} shadow={2} radius={2} overflow="auto">
      <Stack>
        <Box>
          <Button mode="bleed" text="Query" tone="positive" onClick={doQuery} />
        </Box>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </Stack>
    </Card>
  )
}
