/** The shipped apps. Shared by the portfolio page and the homepage. */
export const apps = [
  {
    name: 'Crystal RAG',
    status: 'Live v0.4.10',
    line: 'Point it at a folder and get a local, searchable knowledge crystal. Qdrant and the embedding model ship inside the app, so nothing leaves the machine.',
    detail: 'Hybrid retrieval fuses vector, lexical and graph lists with reciprocal rank fusion (k=60), so a file the vector search missed still surfaces through its relations.',
    stack: 'Tauri · Rust · three.js · Qdrant · local embeddings',
    repo: 'https://github.com/misomalcek/crystal-rag',
    page: 'https://misomalcek.github.io/crystal-rag/',
    downloads: [
      { label: 'macOS', href: 'https://github.com/misomalcek/crystal-rag/releases/download/v0.4.10/crystal-rag_0.4.10_aarch64.dmg' },
      { label: 'Windows', href: 'https://github.com/misomalcek/crystal-rag/releases/download/v0.4.10/crystal-rag_0.4.10_x64-setup.exe' },
    ],
  },
  {
    name: 'The Wisdomkeeper',
    status: 'Live 0.1.2',
    line: 'A game about infinite fractal worlds, with a browser edition and a desktop build tested on macOS and Windows.',
    detail: 'A custom inference runtime in Rust, 2,841 lines over llama.cpp bindings: a log-probability judge, a grammar-constrained actor, a sidecar with nothing on the network. Both models run on an 8 GB Windows laptop with integrated graphics. Desktop source private, installers public.',
    stack: 'Tauri · Rust · llama.cpp · three.js',
    repo: 'https://github.com/misomalcek/the-wisdomkeeper',
    page: 'https://misomalcek.github.io/the-wisdomkeeper/',
    downloads: [
      { label: 'macOS', href: 'https://github.com/misomalcek/the-wisdomkeeper/releases/download/desktop-0.1.2/wisdomkeeper-infinite_0.1.2_aarch64.dmg' },
      { label: 'Windows', href: 'https://github.com/misomalcek/the-wisdomkeeper/releases/download/desktop-0.1.2/wisdomkeeper-infinite_0.1.2_x64-setup.exe' },
    ],
  },
  {
    name: 'SEO Brain',
    status: 'Live v0.1.0',
    line: 'Team Brain as a product: one codebase that deploys three ways, to a Linux VPS, as a macOS app, or as a Windows app.',
    detail: 'Credentials are the user\'s own: Claude API, OpenRouter or any OpenAI-compatible endpoint including a local one, plus Google service accounts for Search Console, GA4, PageSpeed and CrUX. The installers are public. Keys stay on the machine.',
    stack: 'Tauri · Express · Next.js · Postgres in the app',
    repo: 'https://github.com/misomalcek/seo-brain',
    page: 'https://github.com/misomalcek/seo-brain',
    downloads: [
      { label: 'macOS', href: 'https://github.com/misomalcek/seo-brain/releases/download/v0.1.0/seo-brain_0.1.0_aarch64.dmg' },
      { label: 'Windows', href: 'https://github.com/misomalcek/seo-brain/releases/download/v0.1.0/seo-brain_0.1.0_x64-setup.exe' },
    ],
  },
];
