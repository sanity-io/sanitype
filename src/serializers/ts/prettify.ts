import prettier from 'prettier'
import type {Options} from 'prettier'
import type {SourceFile} from './types'

const DEFAULT_PRETTIER_CONFIG = {
  semi: false,
  bracketSpacing: false,
}
export async function prettify(
  sourceFile: SourceFile,
  config: Options = DEFAULT_PRETTIER_CONFIG,
) {
  const {source, name} = sourceFile
  return {
    name,
    source: await prettier.format(source, {
      parser: 'typescript',
      ...config,
    }),
  }
}

export async function prettifyAll(
  sourceFiles: SourceFile[],
  config: Options = DEFAULT_PRETTIER_CONFIG,
) {
  return Promise.all(sourceFiles.map(file => prettify(file, config)))
}
