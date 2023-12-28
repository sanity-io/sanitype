import path from 'node:path'
import {parseArgs} from 'node:util'
import {promises} from 'node:fs'
import prettier from 'prettier'
import {v3ToNextSchema} from '../compat/v3-to-next/v3ToNextSchema'
import {optional} from '../creators'
import {prettifyAll} from '../serializers/ts/prettify'
import {serialize} from '../serializers/ts/serialize'
import type {SourceFile} from '../serializers/ts/types'

const {values, positionals} = parseArgs({
  allowPositionals: true,
  options: {
    outDir: {
      type: 'string',
      short: 'o',
    },
    force: {
      type: 'boolean',
      short: 'f',
    },
    prettify: {
      type: 'boolean',
      short: 'p',
    },
  },
})
if (!values.outDir) {
  // eslint-disable-next-line
  console.error('Missing --out-dir')
  process.exit(1)
}

async function run(
  input: string[],
  options: {force?: boolean; prettify?: boolean; outDir: string},
) {
  const prettierConfig =
    (options.prettify && (await prettier.resolveConfig(options.outDir))) ||
    undefined

  const importedSchemaTypes = Promise.all(
    input.flatMap(module => {
      return import(path.join(process.cwd(), module)).then(mod => {
        return mod.schemaType || mod.schemaTypes || mod.default || []
      })
    }),
  ).then(importedTypes => importedTypes.flat())

  importedSchemaTypes
    .then(schemaTypes => v3ToNextSchema(schemaTypes))
    .then(schemaTypes =>
      Promise.all(
        schemaTypes.flatMap(async type => {
          const serialized = serialize(type)
          return options.prettify
            ? await prettifyAll(serialized, prettierConfig)
            : serialized
        }),
      ),
    )
    .then(serialized => writeAll(options.outDir!, serialized.flat()))

  async function writeAll(outDir: string, sourceFiles: SourceFile[]) {
    await promises.mkdir(outDir, {recursive: true})
    return Promise.all(
      sourceFiles.map(async file => {
        const outFilePath = path.join(process.cwd(), outDir, `${file.name}.ts`)
        if (!options.force && (await exists(outFilePath))) {
          throw new Error(`File already exists: ${outFilePath}`)
        }
        return promises.writeFile(
          path.join(process.cwd(), options.outDir, `${file.name}.ts`),
          file.source,
        )
      }),
    )
  }
}

function exists(file: string) {
  return promises.stat(file).then(
    stat => true,
    err => (err.code === 'ENOENT' ? false : Promise.reject(err)),
  )
}

run(positionals, {
  prettify: values.prettify,
  force: values.force,
  outDir: values.outDir!,
})
