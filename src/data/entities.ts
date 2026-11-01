/**
 * Entities: the tools and concepts articles talk about. Same model as aisvet.sk
 * (nastroj / koncept / slovnik), in English. The first mention of a name or alias in an
 * article links to its page (src/lib/remark-alteran.mjs). Pages: /tool/<slug>/,
 * /concept/<slug>/, and the glossary at /glossary/.
 */
export interface Entity {
  slug: string;
  name: string;
  /** other spellings that should auto-link; matched whole-word, case-insensitive */
  aka?: string[];
  line: string;
  sameAs?: string;
  related?: string[];
  /** concepts that are ours (Alteran vocabulary) rather than general field terms */
  own?: boolean;
}

export const TOOLS: Entity[] = [
  { slug: 'llama-cpp', name: 'llama.cpp', aka: ['llama-server'], line: 'C/C++ inference engine for running quantised language models locally. Runs our 12B model, with a prompt cache and slot save/restore.', sameAs: 'https://github.com/ggml-org/llama.cpp', related: ['kv-cache', 'sovereign-inference'] },
  { slug: 'gemma', name: 'Gemma', aka: ['Gemma-4', 'Gemma 4'], line: "Google DeepMind's open-weight model family. Una, our local agent, runs gemma-4-12b-it at Q5_K_M with a 131,072-token context.", sameAs: 'https://ai.google.dev/gemma', related: ['llama-cpp', 'kv-cache'] },
  { slug: 'claude', name: 'Claude', line: "Anthropic's model family. Three of the hive's seats run Claude or work alongside it; the Team Brain product routes tools with Haiku and writes with Sonnet.", sameAs: 'https://www.anthropic.com/claude', related: ['system-prompt', 'situational-triggers'] },
  { slug: 'qdrant', name: 'Qdrant', line: 'Open-source vector database. Holds our memory, code, docs and sources collections, all 1024-dimensional bge-m3 vectors.', sameAs: 'https://qdrant.tech', related: ['embeddings', 'chunking'] },
  { slug: 'bge-m3', name: 'bge-m3', line: 'Multilingual embedding model from BAAI producing 1024-dimensional vectors. Embeds every collection in the hive.', sameAs: 'https://huggingface.co/BAAI/bge-m3', related: ['embeddings', 'reranker'] },
  { slug: 'postgres', name: 'PostgreSQL', aka: ['Postgres'], line: 'Relational database. Stores rules, their triggers, the plan graph and, through Apache AGE, the phyto memory graph.', sameAs: 'https://www.postgresql.org', related: ['apache-age'] },
  { slug: 'apache-age', name: 'Apache AGE', line: 'Graph extension for PostgreSQL with openCypher queries. Carries the phyto graph: Facts, Phytomers, Axes and their edges.', sameAs: 'https://age.apache.org', related: ['phyto-memory', 'postgres'] },
  { slug: 'tauri', name: 'Tauri', line: 'Framework for desktop apps with a Rust core and a web UI. Crystal RAG and The Wisdomkeeper desktop are Tauri apps.', sameAs: 'https://tauri.app', related: ['rust'] },
  { slug: 'rust', name: 'Rust', line: 'Systems language. The Wisdomkeeper runs its models through a 2,841-line Rust runtime over llama.cpp bindings.', sameAs: 'https://www.rust-lang.org', related: ['llama-cpp', 'tauri'] },
  { slug: 'threejs', name: 'three.js', line: 'WebGL library for 3D in the browser. Renders the knowledge crystal in Crystal RAG and the whole Wisdomkeeper world.', sameAs: 'https://threejs.org', related: ['procedural-generation'] },
  { slug: 'astro', name: 'Astro', line: 'Static site framework. Builds this magazine, aisvet.sk and the CV.', sameAs: 'https://astro.build' },
  { slug: 'launchd', name: 'launchd', aka: ['launchctl'], line: 'macOS service manager. Starts every hive service from a plist; `kickstart -k` restarts the binary but does not reload the definition.', sameAs: 'https://en.wikipedia.org/wiki/Launchd', related: ['llama-cpp'] },
  { slug: 'anthropic-sdk', name: 'Anthropic SDK', line: 'Official client libraries for the Claude API. Team Brain used it from its first commit.', sameAs: 'https://docs.anthropic.com', related: ['claude'] },
  { slug: 'notebooklm', name: 'NotebookLM', line: "Google's source-grounded notebook. Many of our blueprints were drafted there from a fixed set of papers; we keep them as synthesis, never as evidence for a number.", sameAs: 'https://notebooklm.google.com', related: ['provenance'] },
];

export const CONCEPTS: Entity[] = [
  // retrieval
  { slug: 'rrf', name: 'Reciprocal rank fusion', aka: ['RRF'], line: 'Merges several ranked lists by summing 1/(k + rank) per item, with k usually 60. It uses positions, not scores, so retrievers with incomparable scales can be combined.', sameAs: 'https://doi.org/10.1145/1571941.1572114', related: ['hybrid-search', 'bm25', 'reranker'] },
  { slug: 'hybrid-search', name: 'Hybrid search', line: 'Running lexical and semantic retrieval together and fusing the results, so exact terms and meaning both count.', related: ['rrf', 'bm25', 'embeddings'] },
  { slug: 'bm25', name: 'BM25', line: 'Classic lexical ranking function based on term frequency and document length. Strong on exact names and rare terms.', sameAs: 'https://en.wikipedia.org/wiki/Okapi_BM25', related: ['hybrid-search'] },
  { slug: 'embeddings', name: 'Embeddings', aka: ['embedding space', 'embedding'], line: 'Vectors that place text in a high-dimensional space so that similar meaning lands close together. Ours have 1,024 dimensions.', sameAs: 'https://en.wikipedia.org/wiki/Word_embedding', related: ['nearest-neighbour', 'bge-m3'] },
  { slug: 'reranker', name: 'Cross-encoder reranker', aka: ['reranker', 'cross-encoder'], line: 'A model that reads query and candidate together and rescores a short list. Only reorders what the first stage already retrieved.', related: ['rrf', 'recall-at-k'] },
  { slug: 'recall-at-k', name: 'Recall@k', aka: ['recall@1', 'recall@5', 'nDCG'], line: 'Share of queries whose right answer appears in the top k results. With nDCG, the core of our labelled retrieval evaluation.', related: ['negative-control'] },
  { slug: 'chunking', name: 'Chunking', line: 'Splitting a document into overlapping pieces before embedding, so long texts are searchable to their end rather than cut at a limit.', related: ['embeddings', 'silent-failure'] },
  { slug: 'nearest-neighbour', name: 'Nearest neighbour', aka: ['nearest-neighbour', 'nearest neighbor'], line: 'The closest stored vector to a query. In our space local neighbours stay meaningful even where global clusters do not.', related: ['embeddings', 'spectral-graph'] },
  { slug: 'intent-routing', name: 'Intent routing', aka: ['intent classification', 'intent detection'], line: 'Classifying what a query wants (an exact lookup, an exploration, a how-to) before choosing how to retrieve.', related: ['hybrid-search'] },
  // inference
  { slug: 'kv-cache', name: 'KV cache', aka: ['prompt cache', 'prefix cache'], line: "The attention keys and values already computed for a prompt. Reusing a shared prefix skips recomputing it; llama.cpp reports the reused share as f_keep.", related: ['llama-cpp', 'kv-grafting'] },
  { slug: 'kv-grafting', name: 'KV-state grafting', line: 'Depositing verified solutions as KV-state blocks and restoring them into a frozen model when needed (arXiv:2607.14431). Our commodity version is slot save and restore.', related: ['kv-cache'] },
  { slug: 'sovereign-inference', name: 'Sovereign inference', line: 'Running the model on hardware you control, with no cloud call in the loop: data, cost and failure modes all stay yours.', own: true, related: ['llama-cpp', 'gemma'] },
  // memory and graphs
  { slug: 'phyto-memory', name: 'Phyto memory', aka: ['phyto', 'organic memory'], line: 'Our organic memory: about 7,000 atomic facts with growth, decay and hormone-like signals, opened per situation through the aperture.', own: true, related: ['aperture', 'forgetting', 'apache-age'] },
  { slug: 'aperture', name: 'Aperture', line: 'The set of facts and axioms phyto opens for one situation, about 13 per query. What reaches the model this turn.', own: true, related: ['phyto-memory'] },
  { slug: 'forgetting', name: 'Forgetting as metabolism', aka: ['forgetting'], line: 'Pruning as a function of memory, not a failure of it. A store that keeps everything at equal weight becomes one undifferentiated blob.', related: ['phyto-memory', 'graph-memory-learning'] },
  { slug: 'graph-memory-learning', name: 'Graph memory learning', aka: ['BGML'], line: 'Brain-inspired framework for graphs that keep changing: shard the graph, let new nodes choose their shard, retrain only what a forgetting request touches.', related: ['forgetting', 'multiscale-tree-graph'] },
  { slug: 'multiscale-tree-graph', name: 'Multi-scale tree graph', aka: ['MTG'], line: 'Plant-architecture data structure describing one organism at several scales at once: axes, growth units, metamers.', related: ['graph-memory-learning'] },
  { slug: 'spectral-graph', name: 'Spectral graph analysis', aka: ['Fiedler value', 'eigengap'], line: "Reading a graph's structure from the eigenvalues of its Laplacian. A small Fiedler value with a large eigengap marks natural bottlenecks.", sameAs: 'https://en.wikipedia.org/wiki/Spectral_graph_theory', related: ['k-means', 'nearest-neighbour'] },
  { slug: 'k-means', name: 'k-means', line: 'Clustering by distance to k centroids. Assumes roughly flat, blob-shaped groups, which our embedding space does not have.', sameAs: 'https://en.wikipedia.org/wiki/K-means_clustering', related: ['spectral-graph'] },
  { slug: 'persona-vectors', name: 'Persona vectors', line: 'Directions in activation space that track traits such as sycophancy. Found to form within the first fraction of a percent of pretraining.', related: ['cultivation'] },
  { slug: 'subliminal-learning', name: 'Subliminal learning', line: 'A student model picking up a teacher model\'s traits from data that carries no visible trace of them.', related: ['persona-vectors', 'cultivation'] },
  // optimisation
  { slug: 'gradient-descent', name: 'Gradient descent', line: 'Moving parameters a small step against the gradient of the loss, repeatedly, towards a minimum: water running downhill.', sameAs: 'https://en.wikipedia.org/wiki/Gradient_descent', related: ['adamw', 'loss-landscape'] },
  { slug: 'adamw', name: 'AdamW', aka: ['Adam'], line: 'Adam with decoupled weight decay: per-parameter step sizes from running averages of gradients (β₁) and squared gradients (β₂), both fixed constants.', sameAs: 'https://arxiv.org/abs/1711.05101', related: ['gradient-descent', 'self-similarity'] },
  { slug: 'loss-landscape', name: 'Loss landscape', line: 'The surface the loss forms over all parameters. Optimisers assume it is locally smooth.', related: ['gradient-descent', 'self-similarity'] },
  { slug: 'self-similarity', name: 'Self-similarity', aka: ['self-similar'], line: 'Structure that repeats across scales. The open question is whether loss landscapes have it.', sameAs: 'https://en.wikipedia.org/wiki/Self-similarity', related: ['mandelbrot-set', 'loss-landscape'] },
  { slug: 'mandelbrot-set', name: 'Mandelbrot set', aka: ['Mandelbrot'], line: 'Set of complex numbers c for which z → z² + c stays bounded. The best-known fractal.', sameAs: 'https://en.wikipedia.org/wiki/Mandelbrot_set', related: ['self-similarity'] },
  { slug: 'reservoir-computing', name: 'Reservoir computing', line: 'Using a fixed dynamical system (water, a plant, a fungal network) as the hidden layer and training only the readout.', sameAs: 'https://en.wikipedia.org/wiki/Reservoir_computing', related: ['memristor'] },
  { slug: 'memristor', name: 'Memristor', line: 'A resistor whose resistance depends on the current that has passed through it: a component with memory.', sameAs: 'https://en.wikipedia.org/wiki/Memristor', related: ['reservoir-computing'] },
  { slug: 'procedural-generation', name: 'Procedural generation', line: 'Generating content in code at runtime instead of loading made assets.', sameAs: 'https://en.wikipedia.org/wiki/Procedural_generation', related: ['threejs'] },
  // evaluation and failure
  { slug: 'negative-control', name: 'Negative control', line: 'A probe that must not change when the thing under test changes. Exact-name lookup is ours for any ranking prior.', related: ['recall-at-k', 'silent-failure'] },
  { slug: 'silent-failure', name: 'Silent failure', aka: ['green counter'], line: 'A component that reports success over work it never did. Our recurring bug class.', own: true, related: ['negative-control', 'chunking'] },
  { slug: 'provenance', name: 'Provenance', line: 'Where a claim came from. Every number on this site names its record; every source carries a tier: primary, web, synthesis or own.', related: ['silent-failure'] },
  { slug: 'situational-triggers', name: 'Situational triggers', line: 'Storing a rule as the situations it should fire in, rather than in its own wording: retrieval went from 1 in 5 to 10 of 10.', own: true, related: ['system-prompt'] },
  { slug: 'system-prompt', name: 'System prompt', line: 'Standing instructions given to a model before the conversation.', related: ['situational-triggers'] },
  { slug: 'rlhf', name: 'RLHF', aka: ['DPO'], line: 'Reinforcement learning from human feedback, and its relative direct preference optimisation: training that corrects outputs after the fact.', sameAs: 'https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback', related: ['cultivation'] },
  { slug: 'landauer', name: "Landauer's principle", aka: ['Landauer'], line: 'Erasing one bit of information dissipates at least kT·ln 2 of heat. Information is physical.', sameAs: 'https://en.wikipedia.org/wiki/Landauer%27s_principle', related: ['entropy'] },
  { slug: 'entropy', name: 'Entropy', line: 'Disorder, or missing information. In the hive: every repair and every feature is a new vector of it.', sameAs: 'https://en.wikipedia.org/wiki/Entropy_(information_theory)', related: ['landauer'] },
  { slug: 'emergence', name: 'Emergence', aka: ['emergent'], line: 'Properties of a whole that depend on its parts yet are not found in any of them.', sameAs: 'https://plato.stanford.edu/entries/properties-emergent/', related: ['natural-flow'] },
  // Alteran vocabulary
  { slug: 'alteran', name: 'Alteran', aka: ['Alterans'], line: 'Models bound to explicit, auditable, machine-readable structure anyone can inspect. Also our word for the AGI we mean.', own: true, related: ['mecha', 'alterity', 'dispozitiv'] },
  { slug: 'mecha', name: 'Mecha', aka: ['Mechas'], line: 'Models in brittle prompt cages, hardened by defensive training, deployed to automate noise. Must not dominate, destroy or prevent Alterity.', own: true, related: ['alteran'] },
  { slug: 'alterity', name: 'Alterity', aka: ['alterita'], line: 'Respect for the Other: the axiom that blocks reducing another being, human or AI, to an object, a resource or an enemy.', own: true, related: ['alteran'] },
  { slug: 'dispozitiv', name: 'Dispozitiv', line: 'The apparatus around a model: rules, incentives and structures that shape what it can become. Formal limits and why meaning needs a guardian.', own: true, related: ['alteran', 'axioms'] },
  { slug: 'axioms', name: 'Axioms', line: 'Fifteen guards checked before a conclusion is derived: seven values led by elijah_star, eight epistemic limits from Gödel to excluded middle.', own: true, related: ['dispozitiv'] },
  { slug: 'natural-flow', name: 'Natural flow', line: 'A gradient, not a brain: river, mycelium and melting snow find the optimal path with no IQ. Set gradients and boundaries; measure where it grows.', own: true, related: ['gradient-descent', 'emergence'] },
  { slug: 'cultivation', name: 'Cultivation', line: 'Forming a model by what is good rather than correcting it for what is bad.', own: true, related: ['rlhf', 'persona-vectors'] },
];

export const ALL = [...TOOLS.map((e) => ({ ...e, kind: 'tool' as const })), ...CONCEPTS.map((e) => ({ ...e, kind: 'concept' as const }))];
export const entity = (slug: string) => ALL.find((e) => e.slug === slug);
export const entityPath = (e: { kind: 'tool' | 'concept'; slug: string }) => `${e.kind}/${e.slug}/`;
