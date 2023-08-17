import {document, literal, object, string} from "../src/builders";

const muxPluginVideo = document({
  _type: literal("mux.video"),
  name: object({first: string(), last: string()}),
})
//
// const myMuxPluginVideo = muxPluginVideo.extend({
//   _type: literal("video"),
// })

const vid = muxPluginVideo.parse({})