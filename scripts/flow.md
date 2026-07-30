V.1.0
scripts/meinova/
├── cli.mjs
├── generators/
│   ├── generate.mjs
│   ├── make.mjs
│   ├── schema.mjs
│   ├── crud.mjs
│   ├── form.mjs
│   ├── columns.mjs
│   ├── filters.mjs
│   ├── types.mjs
│   └── page.mjs
├── templates/
│   └── crud/
│       ├── page.vue
│       ├── form.ts
│       ├── columns.ts
│       ├── filters.ts
│       ├── table.ts
│       ├── types.ts
│       └── index.ts
└── utils/
    └── strings.mjs

scripts/
└── meinova/
    ├── cli.mjs
    │
    ├── generators/
    │   ├── generate.mjs        # Orchestrator
    │   ├── make.mjs            # Skeleton generator (legacy)
    │   ├── schema.mjs          # Fetch /ui-schema/
    │   │
    │   ├── writers/
    │   │   ├── crud.mjs
    │   │   └── file.mjs
    │   │
    │   ├── builders/
    │   │   ├── form.mjs
    │   │   ├── columns.mjs
    │   │   ├── filters.mjs
    │   │   ├── types.mjs
    │   │   ├── table.mjs
    │   │   ├── page.mjs
    │   │   └── dialog.mjs
    │   │
    │   └── utils/
    │       ├── replace.mjs
    │       ├── strings.mjs
    │       └── paths.mjs
    │
    └── templates/
        └── crud/
            ├── page.vue
            ├── form.ts
            ├── columns.ts
            ├── filters.ts
            ├── table.ts
            ├── types.ts
            │
            └── components/
                ├── Table.vue
                ├── Dialog.vue
                └── index.ts

