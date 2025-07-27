export const classicHuman = [
  {
    name: 'human',
    type: 'document',
    fields: [
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'birthTime',
        type: 'datetime',
      },
      {
        name: 'favoriteTimes',
        type: 'array',
        of: [{type: 'datetime'}],
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
            type: 'reference',
            to: {type: 'city'},
          },
          {
            name: 'country',
            type: 'string',
          },
        ],
      },
      {
        type: 'array',
        name: 'citiesVisited',
        of: [{type: 'reference', to: {type: 'city'}}],
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
            name: 'myCustomBlock',
            of: [
              {
                fields: [
                  {
                    name: 'marks',
                    of: [
                      {
                        options: {
                          list: ['strong'],
                        },
                        type: 'string',
                      },
                    ],
                    type: 'array',
                  },
                  {
                    name: 'text',
                    type: 'string',
                  },
                ],
                name: 'span',
                type: 'object',
              },
              {
                fields: [
                  {
                    name: 'name',
                    type: 'string',
                  },
                ],
                name: 'author',
                type: 'object',
              },
            ],
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
