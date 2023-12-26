export const v3Human = [
  {
    name: 'human',
    type: 'document',
    fields: [
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'address',
        type: 'object',
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
      },
      {
        name: 'profilePicture',
        type: 'image',
        fields: [
          {
            name: 'alt',
            type: 'string',
          },
        ],
      },
      {
        name: 'cv',
        type: 'file',
        fields: [
          {
            name: 'description',
            type: 'string',
          },
        ],
      },
      {
        name: 'portableText',
        type: 'array',
        of: [
          {
            type: 'block',
            of: [
              {
                type: 'object',
                name: 'author',
                fields: [{name: 'name', type: 'string'}],
              },
            ],
            lists: [
              {
                title: 'Bullet',
                value: 'bullet',
              },
              {
                title: 'Number',
                value: 'number',
              },
            ],
            styles: [
              {title: 'Normal', value: 'normal'},
              {title: 'H1', value: 'h1'},
              {title: 'H2', value: 'h2'},
            ],
            marks: {
              annotations: [
                {
                  name: 'author',
                  type: 'object',
                  fields: [{name: 'foo', type: 'number'}],
                },
                {
                  name: 'book',
                  type: 'object',
                  fields: [{name: 'bar', type: 'number'}],
                },
              ],
              decorators: [
                {title: 'Strong', value: 'strong'},
                {title: 'Emphasis', value: 'em'},
              ],
            },
          },
          {
            name: 'image',
            type: 'image',
            fields: [],
          },
        ],
      },
      {
        name: 'pets',
        type: 'array',
        of: [
          {
            name: 'avine',
            type: 'object',
            fields: [
              {
                name: 'name',
                type: 'string',
              },
              {
                name: 'squeaks',
                type: 'boolean',
              },
            ],
          },
          {
            name: 'feline',
            type: 'object',
            fields: [
              {
                name: 'name',
                type: 'string',
              },
              {
                name: 'meows',
                type: 'boolean',
              },
            ],
          },
          {
            name: 'canine',
            type: 'object',
            fields: [
              {
                name: 'name',
                type: 'string',
              },
              {
                name: 'barks',
                type: 'boolean',
              },
            ],
          },
        ],
      },
    ],
  },
]
