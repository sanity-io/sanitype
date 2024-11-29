import {array, block, type Infer, parse} from '@sanity/sanitype'

const minimalistPortableText = array(block({}))

type MinimalistPortableText = Infer<typeof minimalistPortableText>

const portableTextValue = parse(minimalistPortableText, [])

const element = portableTextValue.forEach(element => {
  // children can only contain spans
  element.children

  // children can only contain spans
  element.style.toUpperCase()
})
