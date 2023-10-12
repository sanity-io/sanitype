import {adjustHue, desaturate} from 'color2k'
import {partition} from 'lodash'
import type {JsonArray, JsonObject, JsonValue} from './json'

const BASE_BRACKET_COLOR = desaturate('#FF871F', 0.5)

const DOCUMENT_KEYS_DISPLAY_ORDER = [
  '_id',
  '_type',
  '_rev',
  /*... other system fields will be sorted after */
]

export function JSONObject(props: {value: JsonObject; depth: number}) {
  const bracketColor = adjustHue(BASE_BRACKET_COLOR, props.depth * 10)

  const [systemEntries, entries] = partition(
    Object.entries(props.value),
    ([key]) => key.startsWith('_'),
  )
  return (
    <>
      <code style={{color: bracketColor}}>{'{'}</code>
      <div style={{paddingLeft: '1em'}}>
        {systemEntries
          .toSorted(([a], [b]) => {
            const i1 = DOCUMENT_KEYS_DISPLAY_ORDER.indexOf(a)
            const i2 = DOCUMENT_KEYS_DISPLAY_ORDER.indexOf(b)
            return i1 === -1 ? 0 : i1 - i2
          })
          .concat(entries)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => {
            return (
              <div key={key}>
                <code style={{color: 'darkgoldenrod'}}>{key}</code>
                <code style={{color: 'gray'}}>:</code>{' '}
                <_JSONValue value={value} depth={props.depth + 1} />
              </div>
            )
          })}
      </div>
      <code style={{color: bracketColor}}>{'}'}</code>
    </>
  )
}

export function JSONArray(props: {
  value: JsonArray
  depth: number
  // renderProp: (name: string) => ReactElement
}) {
  return (
    <div>
      {props.value.map((value, i) => {
        return <_JSONValue key={i} value={value} depth={props.depth + 1} />
      })}
    </div>
  )
}

export function _JSONValue(props: {value: JsonValue; depth: number}) {
  if (typeof props.value === 'string') {
    return <code style={{color: 'green'}}>"{props.value}"</code>
  }
  if (typeof props.value === 'number') {
    return <code style={{color: 'blue'}}>{props.value}</code>
  }
  if (typeof props.value === 'boolean') {
    return <code style={{color: 'blue'}}>{props.value ? 'true' : 'false'}</code>
  }
  if (Array.isArray(props.value)) {
    return (
      <>
        <code>[</code>
        <JSONArray value={props.value} depth={props.depth + 1} />
        <code>]</code>
      </>
    )
  }
  return (
    <>
      <JSONObject value={props.value as JsonObject} depth={props.depth + 1} />
    </>
  )
}

export function JSONValue(props: {value: JsonValue}) {
  return <_JSONValue value={props.value as JsonObject} depth={1} />
}
