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
            name: 'myCustomBlock',
            of: [
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
