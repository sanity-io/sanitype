import {adjustHue, desaturate} from 'color2k'
import type {JsonArray, JsonObject, JsonValue} from './json'

const BASE_BRACKET_COLOR = desaturate('#FF871F', 0.5)
export function JSONObject(props: {value: JsonObject; depth: number}) {
  const bracketColor = adjustHue(BASE_BRACKET_COLOR, props.depth * 10)
  return (
    <>
      <code style={{color: bracketColor}}>{'{'}</code>
      <div style={{paddingLeft: '1em'}}>
        {Object.entries(props.value)
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
