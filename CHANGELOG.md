# Changelog

## [0.6.2](https://github.com/sanity-io/sanitype/compare/sanitype-v0.6.1...sanitype-v0.6.2) (2024-11-17)


### Bug Fixes

* exclude `never` from union types ([#16](https://github.com/sanity-io/sanitype/issues/16)) ([671342d](https://github.com/sanity-io/sanitype/commit/671342d8125b4f880af8f65eace8ffc40b1a782f))

## [0.6.1](https://github.com/sanity-io/sanitype/compare/sanitype-v0.6.0...sanitype-v0.6.1) (2024-11-12)


### Bug Fixes

* export missing util type ([494a600](https://github.com/sanity-io/sanitype/commit/494a6008e64907bacfc105d0fdb442c0d28c721f))

## [0.6.0](https://github.com/sanity-io/sanitype/compare/sanitype-v0.5.0...sanitype-v0.6.0) (2024-11-12)


### Features

* add loader utils ([dcd643b](https://github.com/sanity-io/sanitype/commit/dcd643bea632cb8121150f05bfdd5a98831c9029))

## [0.5.0](https://github.com/sanity-io/sanitype/compare/sanitype-v0.4.0...sanitype-v0.5.0) (2024-11-11)


### Features

* add a stubbed resolve ([ba179ee](https://github.com/sanity-io/sanitype/commit/ba179eec25737c72927c4ce07c549140d91fea8c))
* add asset fields to example v3 studio ([540364c](https://github.com/sanity-io/sanitype/commit/540364c1a3c0c0639978af6816da13c2a3fd6016))
* add block type creator for portable text ([3377e2d](https://github.com/sanity-io/sanitype/commit/3377e2d59c068179599704f34a8b6c5b3b1ff9c5))
* add builtins ([8da7d05](https://github.com/sanity-io/sanitype/commit/8da7d059facfd1d3cc2e7fac415a64730d6f4e13))
* add check script ([c89744e](https://github.com/sanity-io/sanitype/commit/c89744e57177319d4e2cbb4d3215b0c8eefaddd1))
* add content-utils pickDeep + getInstanceName ([b66895a](https://github.com/sanity-io/sanitype/commit/b66895a31c888b26074fd8eaeceb5171ffd19a86))
* add file type ([a262a5b](https://github.com/sanity-io/sanitype/commit/a262a5bc3205f240a7406861999988e69c7388ad))
* add graphql strict mode validator utility ([cfbdeb8](https://github.com/sanity-io/sanitype/commit/cfbdeb85163a421ceabe8a9a22aec9e632175d0c))
* add image type ([5227a11](https://github.com/sanity-io/sanitype/commit/5227a11e6e4f2bfa30d13ca61c74d14fc2b5e169))
* add rename type utility ([1ab30d4](https://github.com/sanity-io/sanitype/commit/1ab30d428dc803c9a6fda47f46e5892d803c8755))
* add support for date and date time ([574daed](https://github.com/sanity-io/sanitype/commit/574daedcecaf21fc255ab321333042e1392cbe30))
* add support for deep partial types ([73f803d](https://github.com/sanity-io/sanitype/commit/73f803d30149f35b7c02dba1d0188b07b0b03bc0))
* add support for initialValue and nullable/nullish values ([15c4fa2](https://github.com/sanity-io/sanitype/commit/15c4fa21a67afa701c42223b767786159fae44f4))
* add support for never-type ([8c5e74a](https://github.com/sanity-io/sanitype/commit/8c5e74a753bb0cbeb5bcf65b65adce1b40a499fa))
* add support for parsing object-like schemas ([ae3311f](https://github.com/sanity-io/sanitype/commit/ae3311f9ca7f0a30fd7ff9350db2c203ddfb3470))
* add system asset schemas ([8de5f54](https://github.com/sanity-io/sanitype/commit/8de5f543444f4524e0f5cc3fc8911871f010a702))
* add v3 schema generation for assets ([6e5ed19](https://github.com/sanity-io/sanitype/commit/6e5ed19c99765e3cbc21cdfe7143b2b373e174fb))
* array of arrays restriction ([a546397](https://github.com/sanity-io/sanitype/commit/a546397849fb10618753b2fc4474626840d477ce))
* discriminated unions ([4357720](https://github.com/sanity-io/sanitype/commit/4357720d45260d5dbd687dbd0e65a51fd66fe719))
* **example:** add example of union input types ([a89373d](https://github.com/sanity-io/sanitype/commit/a89373d302220d20f59bf91fdf92ed12c74d78f6))
* extends ([05db453](https://github.com/sanity-io/sanitype/commit/05db453d0e9ef21f42bfea75a4267da854706b49))
* extends ([1143137](https://github.com/sanity-io/sanitype/commit/114313798e9c6bf929122c92b2dbc97e58a6ba38))
* **forms:** a gentle beginning ([b491a4f](https://github.com/sanity-io/sanitype/commit/b491a4faddce5ed4d8a70564c9a490a17487ecd8))
* implement converter from sanitype schema =&gt; v3 compatible schema ([8c4a6f7](https://github.com/sanity-io/sanitype/commit/8c4a6f739c91021e1c832b64b498181c7096f7a3))
* implement deepRequired ([f5e118f](https://github.com/sanity-io/sanitype/commit/f5e118fc2b5b6aa14897100c308a05778fae83d9))
* implement lifecycle helpers: draft, stored ([5c1cfa7](https://github.com/sanity-io/sanitype/commit/5c1cfa73d91f42b701303e74c3d10ab5c66d8ba9))
* implement omit + pick utils ([23e6e29](https://github.com/sanity-io/sanitype/commit/23e6e29ec5f68b8c58b384088efd62bff1a4895a))
* implement shallow partial/required ([b1b55de](https://github.com/sanity-io/sanitype/commit/b1b55dec9d29732c1c5f939ff840b9337554d205))
* improve handling of object-like schemas in v3 schema generation ([e979d46](https://github.com/sanity-io/sanitype/commit/e979d465693c1bf0885905f4a0adaf92490e20f4))
* make document types inherit optional attributes from base document shape ([d6df9ed](https://github.com/sanity-io/sanitype/commit/d6df9ed3022a0537ca511a13f02a0ba419ac1bcf))
* properly support circular references ([d760348](https://github.com/sanity-io/sanitype/commit/d76034892241f92cc288111f58314a319d9702a2))
* refine `SanityImage` type ([93d5601](https://github.com/sanity-io/sanitype/commit/93d5601f93cea1ebc9259b1d886653bae3973436))
* remove support for nullable/nullish ([ae8501b](https://github.com/sanity-io/sanitype/commit/ae8501b2cea98fb54e28bd679bd640ec6972f20e))
* resolve literal values ([bdc5930](https://github.com/sanity-io/sanitype/commit/bdc5930ea29e3f121f54ede8a8ca96aed9d69aaa))
* support array parsing, and handle optional types ([c117598](https://github.com/sanity-io/sanitype/commit/c11759827211d7695059eb0e40d6aef5443878fc))


### Bug Fixes

* add an output formatting hack ([b07f506](https://github.com/sanity-io/sanitype/commit/b07f506be4a1d3ac92d6615cc418b68bda47c877))
* add missing project reference ([bebcedd](https://github.com/sanity-io/sanitype/commit/bebceddca03037dee732522759f24e98f14f4c88))
* allow literal values in primitive unions ([a59d78b](https://github.com/sanity-io/sanitype/commit/a59d78bd75e78b06f7b0f753ceec670f5e8a0807))
* avoid using creators in foundational code ([3f4e65a](https://github.com/sanity-io/sanitype/commit/3f4e65af990dc5d6286460d9471adb2564c8a90e))
* **build:** add missing exported symbols ([c711494](https://github.com/sanity-io/sanitype/commit/c711494177b9f31dee9d3b8db4551ab63b9deef7))
* **build:** fix ts/build errors ([35f6f62](https://github.com/sanity-io/sanitype/commit/35f6f62f4c221118c6816ffe76c4d98664886575))
* **build:** run pkg:build with check script ([32d5782](https://github.com/sanity-io/sanitype/commit/32d57828b1ca895112e0fb1f46149be68172a65d))
* **ci:** harmonize github workflow, run test coverage ([1f955c6](https://github.com/sanity-io/sanitype/commit/1f955c619625a2da5a637304ed7b7dd9ce9bf5c3))
* **ci:** remove test:types from test workflow ([ecdd6a9](https://github.com/sanity-io/sanitype/commit/ecdd6a9ed6fb9282562559de497541e8c2b330c6))
* **compat:** convert dateTime =&gt; datetime ([d1b2ea1](https://github.com/sanity-io/sanitype/commit/d1b2ea104063def4d7ebb83fa4d142e3f3e63f71))
* **deps:** optimize dependencies ([77612ff](https://github.com/sanity-io/sanitype/commit/77612fff270a34f37c33eaf86592113e978a4551))
* **deps:** upgrade dependencies ([2e867f6](https://github.com/sanity-io/sanitype/commit/2e867f6190e15dde122161f0c8a31b8aed5a6849))
* **deps:** upgrade dependencies ([e5e6e1c](https://github.com/sanity-io/sanitype/commit/e5e6e1ca02d8012b710ab13a962322b02c937bd6))
* **deps:** upgrade dev dependencies ([8558abf](https://github.com/sanity-io/sanitype/commit/8558abf8cce7950a09c83762da71ce85ce23a682))
* **deps:** upgrade to sanity ui 2.0 alpha ([43ba610](https://github.com/sanity-io/sanitype/commit/43ba6101903a1ae954e79b1ce9e35767b7eb544b))
* **deps:** upgrade typescript to 5.2 ([efea616](https://github.com/sanity-io/sanitype/commit/efea6169414e40831cd7511a0fdb27312018f817))
* **docs:** add spec notes ([70c659f](https://github.com/sanity-io/sanitype/commit/70c659f6c12e657881e1fd1b008491641cb64e8f))
* **docs:** improve readme ([4153b26](https://github.com/sanity-io/sanitype/commit/4153b26997e4950454e21eb2a2411cedc837ca04))
* **docs:** minor readme fixes ([8db74d9](https://github.com/sanity-io/sanitype/commit/8db74d9457a81eb1a222961af25e99e08998b7c7))
* drop builders approach in favor of creators ([81629ad](https://github.com/sanity-io/sanitype/commit/81629ad8a0cd6b14a760c90fb6e1d19d8e0b8572))
* example data model mistake ([18850c9](https://github.com/sanity-io/sanitype/commit/18850c96743caf52b81f7383a1182ebbd571f704))
* **example-studio:** unset empty string inputs ([f325e25](https://github.com/sanity-io/sanitype/commit/f325e25cf781c4412f8b6cdb36fc6267eeda479a))
* **example-studio:** upgrade mutiny ([8effa50](https://github.com/sanity-io/sanitype/commit/8effa50d595fd5231a1ba86455a56440b8723b76))
* expand form def types ([5a3109f](https://github.com/sanity-io/sanitype/commit/5a3109f398dd7737bd2b439cf8fbec93168589ee))
* export lifecycle utils ([b162756](https://github.com/sanity-io/sanitype/commit/b162756dd14449e9e3e97f21d83ca1e2f4c67017))
* export literal value creator helper ([efbd478](https://github.com/sanity-io/sanitype/commit/efbd478ba78e3a45dffeb9bf99a18fbcabe0449f))
* export typedToClassic ([dfe4430](https://github.com/sanity-io/sanitype/commit/dfe443043779cd47722efa18cd2f62cb4e340e2e))
* **form:** make form optional on base types ([992945e](https://github.com/sanity-io/sanitype/commit/992945ea5e8214958dd598b7af936fedd0fc3352))
* image type inference ([1802217](https://github.com/sanity-io/sanitype/commit/180221748ce6c030d183e9d524d951c465688598))
* improve concealed type wrapper ([5c29a30](https://github.com/sanity-io/sanitype/commit/5c29a30d6089aaa9433381e86542ed61977d794c))
* improve discriminated union typings ([89bc0b6](https://github.com/sanity-io/sanitype/commit/89bc0b6ae2264320781f67d81617490e17262fcc))
* improve omit, pick and extend when handling types with only output specified ([0e55b19](https://github.com/sanity-io/sanitype/commit/0e55b19f86efd87920e41a2381df5805e1f4ed5c))
* improve portable text schema and typings ([6a8ab22](https://github.com/sanity-io/sanitype/commit/6a8ab22b659df2d3f8d4c9718492389e420621ca))
* improve primitive union input ([594a5bd](https://github.com/sanity-io/sanitype/commit/594a5bde4e21dfcfb90132b5b977b0c51c1b505d))
* improve typed-to-classic converter ([2756355](https://github.com/sanity-io/sanitype/commit/275635555c6a8032e9a55fe265fdaada651d494f))
* include SanityLiteral in SanityPrimitive ([66a51b9](https://github.com/sanity-io/sanitype/commit/66a51b9ac3008335c15efba5ea07d9f31b8a5852))
* **inspect:** make inspect use deterministic sort order for object keys ([a47bc53](https://github.com/sanity-io/sanitype/commit/a47bc536680d1fbc07aaad2801150aa9bf4254d6))
* move asset schemas to avoid uninitialized variable access ([f1bbd6d](https://github.com/sanity-io/sanitype/commit/f1bbd6dc7668a14922f153da167a9aa7bebfb215))
* only allow discriminated unions with _type in object arrays ([18d6162](https://github.com/sanity-io/sanitype/commit/18d6162df252b64f32b5023166d51cef03339184))
* **package:** export date and datetime creators ([2ab02f9](https://github.com/sanity-io/sanitype/commit/2ab02f9baf6a125723a4bb70bbc940cb55b1a924))
* pass _type as part of shape ([ab9b389](https://github.com/sanity-io/sanitype/commit/ab9b389965098b150af496e8d99089dadd2c4024))
* pass type as first argument to defineForm instead of requiring template parameter ([1142d6a](https://github.com/sanity-io/sanitype/commit/1142d6a464021a948562fff194a2cef0a42c8e8e))
* put value types in its own file ([bdb7ab4](https://github.com/sanity-io/sanitype/commit/bdb7ab41b149b5f42b6202ab5fe4a3827c9084a6))
* reference `_type` type ([a63e861](https://github.com/sanity-io/sanitype/commit/a63e861ecfd038de312e5c969f7a832fbaeb27bc))
* remove blanket conversion of any object-like schema ([e8cb379](https://github.com/sanity-io/sanitype/commit/e8cb3798221dcac8f32eeca45e0da058e1fd3bd3))
* remove external import ([5db5b4f](https://github.com/sanity-io/sanitype/commit/5db5b4fd7592a5a48fc8ef123fd421f875c27a9c))
* remove nonexistent `metadata` field from `fileAsset` schema ([2423559](https://github.com/sanity-io/sanitype/commit/2423559e9d53bb7d3531ac7c7356dd10c16c21ed))
* set correct type for asset schemas ([df3e957](https://github.com/sanity-io/sanitype/commit/df3e95781e04070d5ba2d9fc72109acda553fc79))
* simplify form definitions ([8ed08ff](https://github.com/sanity-io/sanitype/commit/8ed08ff7e5b800ee5a0d308d61d8f0b761850890))
* split document/object types ([2a26104](https://github.com/sanity-io/sanitype/commit/2a26104825d8b7c23c4e559cbce7dcc6b8f9f6ac))
* standardize dateTime casing ([c972bdf](https://github.com/sanity-io/sanitype/commit/c972bdf21a9104aa37bd9ae6ce54df46c92f866b))
* support references in object unions ([301792d](https://github.com/sanity-io/sanitype/commit/301792d93c6f779c0f1acb7759f5ccfb84f01de5))
* **test:** exclude .tmp from vitest typechecks ([b5814a2](https://github.com/sanity-io/sanitype/commit/b5814a217dc4266a401f99eee4a739c9acb67cda))
* turn optional fields into optional properties ([051e8dc](https://github.com/sanity-io/sanitype/commit/051e8dcc3b30396189318ab931d38cd80fd8debf))
* **types:** add support for custom names for block types ([018e869](https://github.com/sanity-io/sanitype/commit/018e8697b792356aaabc334aa94d6379f906b3d5))
* union of assets ([240f756](https://github.com/sanity-io/sanitype/commit/240f756f0892ad1c3441a09997b3c24814c8a67e))
* update examples imports to point at the correct package name ([fb8f29f](https://github.com/sanity-io/sanitype/commit/fb8f29f17b663e1ddf9fd72efaa602938be4a3e5))
* use stricter parsing for date and datetime ([6b8bcd9](https://github.com/sanity-io/sanitype/commit/6b8bcd99af4d5e5fbeb3d1dab105e5f86963c028))
* v3 schema generation for asset in array ([60e5fd7](https://github.com/sanity-io/sanitype/commit/60e5fd7e7916bfed39614a8586b82d1edd050d9a))
* **v3-compat:** add support for generating portable text array schemas ([#8](https://github.com/sanity-io/sanitype/issues/8)) ([74a0581](https://github.com/sanity-io/sanitype/commit/74a0581c0cb99e8817fb3c8fc3dec7b740a9f324))
* **v3-compat:** add v3 compat for date and dateTime ([#9](https://github.com/sanity-io/sanitype/issues/9)) ([d40d6d8](https://github.com/sanity-io/sanitype/commit/d40d6d8f6d62b4635f1d40b9c27b166eee9cc8fd))

## Changelog
