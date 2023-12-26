import {expect, test} from 'vitest'
import {document, image, object, string} from '../../../creators'
import {v3ToNextSchema} from '../v3ToNextSchema'

const v3Schema = [
  {
    fields: [
      {
        name: 'name',
        type: 'string',
      },
      {
        fields: [
          {
            name: 'street',
            type: 'string',
          },
          {
            name: 'city',
            type: 'string',
          },
          {
            name: 'country',
            type: 'string',
          },
        ],
        name: 'address',
        type: 'object',
      },
      {
        fields: [
          {
            name: 'alt',
            type: 'string',
          },
        ],
        name: 'profilePicture',
        type: 'image',
      },
      {
        fields: [
          {
            name: 'description',
            type: 'string',
          },
        ],
        name: 'cv',
        type: 'file',
      },
      // {
      //   name: 'portableText',
      //   of: [
      //     {
      //       name: 'myCustomBlock',
      //       of: [
      //         {
      //           fields: [
      //             {
      //               name: 'name',
      //               type: 'string',
      //             },
      //           ],
      //           name: 'author',
      //           type: 'object',
      //         },
      //         {
      //           fields: [
      //             // {
      //             //   name: 'marks',
      //             //   of: [
      //             //     {
      //             //       options: {
      //             //         list: ['strong'],
      //             //       },
      //             //       type: 'string',
      //             //     },
      //             //   ],
      //             //   type: 'array',
      //             // },
      //             {
      //               name: 'text',
      //               type: 'string',
      //             },
      //           ],
      //           name: 'span',
      //           type: 'object',
      //         },
      //       ],
      //       type: 'block',
      //     },
      //     {
      //       fields: [],
      //       name: 'image',
      //       type: 'image',
      //     },
      //   ],
      //   type: 'array',
      // },
      // {
      //   name: 'pets',
      //   of: [
      //     {
      //       fields: [
      //         {
      //           name: 'name',
      //           type: 'string',
      //         },
      //         {
      //           name: 'squeaks',
      //           type: 'boolean',
      //         },
      //       ],
      //       name: 'avine',
      //       type: 'object',
      //     },
      //     {
      //       fields: [
      //         {
      //           name: 'name',
      //           type: 'string',
      //         },
      //         {
      //           name: 'meows',
      //           type: 'boolean',
      //         },
      //       ],
      //       name: 'feline',
      //       type: 'object',
      //     },
      //     {
      //       fields: [
      //         {
      //           name: 'name',
      //           type: 'string',
      //         },
      //         {
      //           name: 'barks',
      //           type: 'boolean',
      //         },
      //       ],
      //       name: 'canine',
      //       type: 'object',
      //     },
      //   ],
      //   type: 'array',
      // },
    ],
    name: 'human',
    type: 'document',
  },
]

test('toV3Schema', () => {
  expect(v3ToNextSchema(v3Schema)).toMatchInlineSnapshot(`
    [
      {
        "shape": {
          "_createdAt": {
            "type": {
              "def": "",
              "typeName": "string",
            },
            "typeName": "optional",
          },
          "_id": {
            "type": {
              "def": "",
              "typeName": "string",
            },
            "typeName": "optional",
          },
          "_rev": {
            "type": {
              "def": "",
              "typeName": "string",
            },
            "typeName": "optional",
          },
          "_type": {
            "typeName": "literal",
            "value": "human",
          },
          "_updatedAt": {
            "type": {
              "def": "",
              "typeName": "string",
            },
            "typeName": "optional",
          },
          "address": {
            "shape": {
              "city": {
                "typeName": "string",
              },
              "country": {
                "typeName": "string",
              },
              "street": {
                "typeName": "string",
              },
            },
            "typeName": "object",
          },
          "cv": {
            "shape": {
              "_type": {
                "typeName": "literal",
                "value": "file",
              },
              "asset": {
                "referenceType": {
                  "shape": {
                    "_createdAt": {
                      "type": {
                        "def": "",
                        "typeName": "string",
                      },
                      "typeName": "optional",
                    },
                    "_id": {
                      "type": {
                        "def": "",
                        "typeName": "string",
                      },
                      "typeName": "optional",
                    },
                    "_rev": {
                      "type": {
                        "def": "",
                        "typeName": "string",
                      },
                      "typeName": "optional",
                    },
                    "_type": {
                      "typeName": "literal",
                      "value": "sanity.fileAsset",
                    },
                    "_updatedAt": {
                      "type": {
                        "def": "",
                        "typeName": "string",
                      },
                      "typeName": "optional",
                    },
                    "assetId": {
                      "def": "",
                      "typeName": "string",
                    },
                    "creditLine": {
                      "type": {
                        "def": "",
                        "typeName": "string",
                      },
                      "typeName": "optional",
                    },
                    "description": {
                      "type": {
                        "def": "",
                        "typeName": "string",
                      },
                      "typeName": "optional",
                    },
                    "extension": {
                      "def": "",
                      "typeName": "string",
                    },
                    "label": {
                      "type": {
                        "def": "",
                        "typeName": "string",
                      },
                      "typeName": "optional",
                    },
                    "mimeType": {
                      "def": "",
                      "typeName": "string",
                    },
                    "originalFilename": {
                      "type": {
                        "def": "",
                        "typeName": "string",
                      },
                      "typeName": "optional",
                    },
                    "path": {
                      "def": "",
                      "typeName": "string",
                    },
                    "sha1hash": {
                      "def": "",
                      "typeName": "string",
                    },
                    "size": {
                      "typeName": "number",
                    },
                    "source": {
                      "type": {
                        "shape": {
                          "id": {
                            "def": "",
                            "typeName": "string",
                          },
                          "name": {
                            "def": "",
                            "typeName": "string",
                          },
                          "url": {
                            "type": {
                              "def": "",
                              "typeName": "string",
                            },
                            "typeName": "optional",
                          },
                        },
                        "typeName": "object",
                      },
                      "typeName": "optional",
                    },
                    "title": {
                      "type": {
                        "def": "",
                        "typeName": "string",
                      },
                      "typeName": "optional",
                    },
                    "url": {
                      "def": "",
                      "typeName": "string",
                    },
                  },
                  "typeName": "document",
                },
                "shape": {
                  "_ref": {
                    "def": "",
                    "typeName": "string",
                  },
                  "_type": {
                    "typeName": "literal",
                    "value": "reference",
                  },
                  "_weak": {
                    "type": {
                      "def": true,
                      "typeName": "boolean",
                    },
                    "typeName": "optional",
                  },
                },
                "typeName": "reference",
              },
            },
            "typeName": "file",
          },
          "name": {
            "typeName": "string",
          },
          "profilePicture": {
            "shape": {
              "_type": {
                "typeName": "literal",
                "value": "image",
              },
              "asset": {
                "referenceType": {
                  "shape": {
                    "_createdAt": {
                      "type": {
                        "def": "",
                        "typeName": "string",
                      },
                      "typeName": "optional",
                    },
                    "_id": {
                      "type": {
                        "def": "",
                        "typeName": "string",
                      },
                      "typeName": "optional",
                    },
                    "_rev": {
                      "type": {
                        "def": "",
                        "typeName": "string",
                      },
                      "typeName": "optional",
                    },
                    "_type": {
                      "typeName": "literal",
                      "value": "sanity.imageAsset",
                    },
                    "_updatedAt": {
                      "type": {
                        "def": "",
                        "typeName": "string",
                      },
                      "typeName": "optional",
                    },
                    "assetId": {
                      "def": "",
                      "typeName": "string",
                    },
                    "creditLine": {
                      "type": {
                        "def": "",
                        "typeName": "string",
                      },
                      "typeName": "optional",
                    },
                    "description": {
                      "type": {
                        "def": "",
                        "typeName": "string",
                      },
                      "typeName": "optional",
                    },
                    "extension": {
                      "def": "",
                      "typeName": "string",
                    },
                    "label": {
                      "type": {
                        "def": "",
                        "typeName": "string",
                      },
                      "typeName": "optional",
                    },
                    "metadata": {
                      "shape": {
                        "_type": {
                          "typeName": "literal",
                          "value": "sanity.imageMetadata",
                        },
                        "blurHash": {
                          "type": {
                            "def": "",
                            "typeName": "string",
                          },
                          "typeName": "optional",
                        },
                        "dimensions": {
                          "shape": {
                            "_type": {
                              "typeName": "literal",
                              "value": "sanity.imageDimensions",
                            },
                            "aspectRatio": {
                              "typeName": "number",
                            },
                            "height": {
                              "typeName": "number",
                            },
                            "width": {
                              "typeName": "number",
                            },
                          },
                          "typeName": "object",
                        },
                        "hasAlpha": {
                          "def": true,
                          "typeName": "boolean",
                        },
                        "isOpaque": {
                          "def": true,
                          "typeName": "boolean",
                        },
                        "lqip": {
                          "type": {
                            "def": "",
                            "typeName": "string",
                          },
                          "typeName": "optional",
                        },
                        "palette": {
                          "type": {
                            "shape": {
                              "_type": {
                                "typeName": "literal",
                                "value": "sanity.imagePalette",
                              },
                              "darkMuted": {
                                "type": {
                                  "shape": {
                                    "_type": {
                                      "typeName": "literal",
                                      "value": "sanity.imagePaletteSwatch",
                                    },
                                    "background": {
                                      "def": "",
                                      "typeName": "string",
                                    },
                                    "foreground": {
                                      "def": "",
                                      "typeName": "string",
                                    },
                                    "population": {
                                      "typeName": "number",
                                    },
                                    "title": {
                                      "type": {
                                        "def": "",
                                        "typeName": "string",
                                      },
                                      "typeName": "optional",
                                    },
                                  },
                                  "typeName": "object",
                                },
                                "typeName": "optional",
                              },
                              "darkVibrant": {
                                "type": {
                                  "shape": {
                                    "_type": {
                                      "typeName": "literal",
                                      "value": "sanity.imagePaletteSwatch",
                                    },
                                    "background": {
                                      "def": "",
                                      "typeName": "string",
                                    },
                                    "foreground": {
                                      "def": "",
                                      "typeName": "string",
                                    },
                                    "population": {
                                      "typeName": "number",
                                    },
                                    "title": {
                                      "type": {
                                        "def": "",
                                        "typeName": "string",
                                      },
                                      "typeName": "optional",
                                    },
                                  },
                                  "typeName": "object",
                                },
                                "typeName": "optional",
                              },
                              "dominant": {
                                "type": {
                                  "shape": {
                                    "_type": {
                                      "typeName": "literal",
                                      "value": "sanity.imagePaletteSwatch",
                                    },
                                    "background": {
                                      "def": "",
                                      "typeName": "string",
                                    },
                                    "foreground": {
                                      "def": "",
                                      "typeName": "string",
                                    },
                                    "population": {
                                      "typeName": "number",
                                    },
                                    "title": {
                                      "type": {
                                        "def": "",
                                        "typeName": "string",
                                      },
                                      "typeName": "optional",
                                    },
                                  },
                                  "typeName": "object",
                                },
                                "typeName": "optional",
                              },
                              "lightMuted": {
                                "type": {
                                  "shape": {
                                    "_type": {
                                      "typeName": "literal",
                                      "value": "sanity.imagePaletteSwatch",
                                    },
                                    "background": {
                                      "def": "",
                                      "typeName": "string",
                                    },
                                    "foreground": {
                                      "def": "",
                                      "typeName": "string",
                                    },
                                    "population": {
                                      "typeName": "number",
                                    },
                                    "title": {
                                      "type": {
                                        "def": "",
                                        "typeName": "string",
                                      },
                                      "typeName": "optional",
                                    },
                                  },
                                  "typeName": "object",
                                },
                                "typeName": "optional",
                              },
                              "lightVibrant": {
                                "type": {
                                  "shape": {
                                    "_type": {
                                      "typeName": "literal",
                                      "value": "sanity.imagePaletteSwatch",
                                    },
                                    "background": {
                                      "def": "",
                                      "typeName": "string",
                                    },
                                    "foreground": {
                                      "def": "",
                                      "typeName": "string",
                                    },
                                    "population": {
                                      "typeName": "number",
                                    },
                                    "title": {
                                      "type": {
                                        "def": "",
                                        "typeName": "string",
                                      },
                                      "typeName": "optional",
                                    },
                                  },
                                  "typeName": "object",
                                },
                                "typeName": "optional",
                              },
                              "muted": {
                                "type": {
                                  "shape": {
                                    "_type": {
                                      "typeName": "literal",
                                      "value": "sanity.imagePaletteSwatch",
                                    },
                                    "background": {
                                      "def": "",
                                      "typeName": "string",
                                    },
                                    "foreground": {
                                      "def": "",
                                      "typeName": "string",
                                    },
                                    "population": {
                                      "typeName": "number",
                                    },
                                    "title": {
                                      "type": {
                                        "def": "",
                                        "typeName": "string",
                                      },
                                      "typeName": "optional",
                                    },
                                  },
                                  "typeName": "object",
                                },
                                "typeName": "optional",
                              },
                              "vibrant": {
                                "type": {
                                  "shape": {
                                    "_type": {
                                      "typeName": "literal",
                                      "value": "sanity.imagePaletteSwatch",
                                    },
                                    "background": {
                                      "def": "",
                                      "typeName": "string",
                                    },
                                    "foreground": {
                                      "def": "",
                                      "typeName": "string",
                                    },
                                    "population": {
                                      "typeName": "number",
                                    },
                                    "title": {
                                      "type": {
                                        "def": "",
                                        "typeName": "string",
                                      },
                                      "typeName": "optional",
                                    },
                                  },
                                  "typeName": "object",
                                },
                                "typeName": "optional",
                              },
                            },
                            "typeName": "object",
                          },
                          "typeName": "optional",
                        },
                      },
                      "typeName": "object",
                    },
                    "mimeType": {
                      "def": "",
                      "typeName": "string",
                    },
                    "originalFilename": {
                      "type": {
                        "def": "",
                        "typeName": "string",
                      },
                      "typeName": "optional",
                    },
                    "path": {
                      "def": "",
                      "typeName": "string",
                    },
                    "sha1hash": {
                      "def": "",
                      "typeName": "string",
                    },
                    "size": {
                      "typeName": "number",
                    },
                    "source": {
                      "type": {
                        "shape": {
                          "id": {
                            "def": "",
                            "typeName": "string",
                          },
                          "name": {
                            "def": "",
                            "typeName": "string",
                          },
                          "url": {
                            "type": {
                              "def": "",
                              "typeName": "string",
                            },
                            "typeName": "optional",
                          },
                        },
                        "typeName": "object",
                      },
                      "typeName": "optional",
                    },
                    "title": {
                      "type": {
                        "def": "",
                        "typeName": "string",
                      },
                      "typeName": "optional",
                    },
                    "url": {
                      "def": "",
                      "typeName": "string",
                    },
                  },
                  "typeName": "document",
                },
                "shape": {
                  "_ref": {
                    "def": "",
                    "typeName": "string",
                  },
                  "_type": {
                    "typeName": "literal",
                    "value": "reference",
                  },
                  "_weak": {
                    "type": {
                      "def": true,
                      "typeName": "boolean",
                    },
                    "typeName": "optional",
                  },
                },
                "typeName": "reference",
              },
            },
            "typeName": "image",
          },
        },
        "typeName": "document",
      },
    ]
  `)
})
