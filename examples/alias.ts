import {document, literal, object, string} from "sanitype";

const muxPluginVideo = document({
  _type: literal("mux.video"),
  name: object({first: string(), last: string()}),
})
//
// const myMuxPluginVideo = muxPluginVideo.extend({
//   _type: literal("video"),
// })

const vid = muxPluginVideo.parse({})