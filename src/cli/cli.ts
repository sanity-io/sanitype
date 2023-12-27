import path from 'node:path'
import {parseArgs} from 'node:util'
import {v3ToNextSchema} from '../compat/v3-to-next/v3ToNextSchema'
import {serialize} from '../serializers/ts/serialize'

const {values, positionals} = parseArgs({
  allowPositionals: true,
  options: {},
})

const importedSchemaTypes = Promise.all(
  positionals.flatMap(module => {
    return import(path.join(process.cwd(), module)).then(mod => {
      return mod.schemaType || mod.schemaTypes || mod.default || []
    })
  }),
).then(importedTypes => importedTypes.flat())

importedSchemaTypes
  .then(schemaTypes => v3ToNextSchema(schemaTypes))
  .then(schemaTypes => schemaTypes.map(type => serialize(type)))
  .then(console.log)
