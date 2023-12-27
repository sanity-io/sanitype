import prettier from 'prettier'
import type {SourceFile} from './types'

const DEFAULT_PRETTIER_CONFIG = {
  semi: false,
  bracketSpacing: false,
}

export async function prettify(sourceFile: SourceFile) {
  const {source, name} = sourceFile
  return {
    name,
    source: await prettier.format(source, {
      parser: 'typescript',
      ...((await prettier.resolveConfig(process.cwd())) ||
        DEFAULT_PRETTIER_CONFIG),
    }),
  }
}

export async function prettifyAll(sourceFiles: SourceFile[]) {
  return sourceFiles.map(prettify)
}
