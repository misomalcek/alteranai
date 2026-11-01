/**
 * Bibliography. Every entry an article cites with [@id].
 *
 * `topic` is the folder the document lives in under ~/sources or ~/content (blueprint folders
 * lose their "-blueprints" suffix). It must exist in corpus.json, so a citation always lands on
 * a real topic tag. `topic: 'external'` marks a reference we cite but do not hold a copy of.
 *
 * `tier` is the corpus provenance tier (sources_status): primary = the original document,
 * web = a page we saved, synthesis = a generated summary we keep as a reading aid (never cited
 * for a number), own = our own measured record.
 */
export type Tier = 'primary' | 'web' | 'synthesis' | 'own' | 'external';

export interface Source {
  authors?: string;
  title: string;
  venue?: string;
  year?: number;
  url?: string;
  topic: string;
  tier: Tier;
  /** path under ~/sources or ~/content, for our own audit trail */
  file?: string;
}

export const SOURCES: Record<string, Source> = {
  // ── retrieval ─────────────────────────────────────────────
  cormack2009: {
    authors: 'G. V. Cormack, C. L. A. Clarke, S. Büttcher',
    title: 'Reciprocal rank fusion outperforms Condorcet and individual rank learning methods',
    venue: 'SIGIR 2009', year: 2009, url: 'https://doi.org/10.1145/1571941.1572114',
    topic: 'external', tier: 'external',
  },
  laforge2026: {
    authors: 'Guillaume Laforge',
    title: 'Advanced RAG — Understanding Reciprocal Rank Fusion in Hybrid Search',
    venue: 'glaforge.dev', year: 2026,
    url: 'https://glaforge.dev/posts/2026/02/10/advanced-rag-understanding-reciprocal-rank-fusion-in-hybrid-search/',
    topic: 'hybrid-retrieval', tier: 'web', file: 'sources/hybrid-retrieval/28-Advanced RAG …',
  },
  topk2026: {
    authors: 'TopK',
    title: 'RRF vs Score Fusion vs True Hybrid: Which Should You Use?',
    venue: 'topk.io', year: 2026, url: 'https://www.topk.io/learn/rrf-vs-true-hybrid',
    topic: 'hybrid-retrieval', tier: 'web', file: 'sources/hybrid-retrieval/31-RRF vs Score Fusion …',
  },
  dennyson2025: {
    authors: 'Robert Dennyson',
    title: 'Dense vs Sparse vs Hybrid RRF: Which RAG Technique Actually Works?',
    venue: 'Medium', year: 2025,
    topic: 'hybrid-retrieval', tier: 'web', file: 'sources/hybrid-retrieval/24-Dense vs Sparse …',
  },
  anthropic2025research: {
    authors: 'Anthropic',
    title: 'How we built our multi-agent research system',
    venue: 'anthropic.com', year: 2025, url: 'https://www.anthropic.com/research/multi-agent-research-system',
    topic: 'hybrid-retrieval', tier: 'web', file: 'sources/hybrid-retrieval/15-How we built …',
  },
  cohen2025: {
    authors: 'D. Cohen, Y. Halpern, N. Kahlon, J. Oren, O. Berkovitch, et al.',
    title: 'Small Models, Big Results: Achieving Superior Intent Extraction through Decomposition',
    venue: 'EMNLP 2025', year: 2025, url: 'https://aclanthology.org/2025.emnlp-main.949/',
    topic: 'hybrid-retrieval', tier: 'primary', file: 'sources/hybrid-retrieval/2025.emnlp-main.949.pdf',
  },
  schubert: {
    authors: 'J. Schubert, M. Krug, J. Baumeister',
    title: 'Knowledge Retrieval with LLMs using Context-Specific Intent and Slot Classification',
    venue: 'LWDA, CEUR-WS',
    topic: 'hybrid-retrieval', tier: 'primary', file: 'sources/hybrid-retrieval/IR_LWDA_CRC_126.pdf',
  },
  jiang2023retro: {
    authors: 'Y. Jiang, Y. Yu, M. Kong, et al., C. W. Coley',
    title: 'Artificial Intelligence for Retrosynthesis Prediction',
    venue: 'Engineering 25, 32–50', year: 2023, url: 'https://doi.org/10.1016/j.eng.2022.04.021',
    topic: 'hybrid-retrieval', tier: 'primary', file: 'sources/hybrid-retrieval/1-s2.0-S2095809922005665-main.pdf',
  },
  khattab2022: {
    authors: 'O. Khattab, K. Santhanam, X. L. Li, D. Hall, P. Liang, C. Potts, M. Zaharia',
    title: 'Demonstrate-Search-Predict: Composing retrieval and language models for knowledge-intensive NLP',
    venue: 'arXiv:2212.14024', year: 2022, url: 'https://arxiv.org/abs/2212.14024',
    topic: 'hybrid-retrieval', tier: 'primary', file: 'sources/hybrid-retrieval/2212.14024v2.pdf',
  },
  lightman2023: {
    authors: 'H. Lightman, V. Kosaraju, Y. Burda, H. Edwards, B. Baker, T. Lee, J. Leike, J. Schulman, I. Sutskever, K. Cobbe',
    title: "Let's Verify Step by Step",
    venue: 'arXiv:2305.20050', year: 2023, url: 'https://arxiv.org/abs/2305.20050',
    topic: 'adaptive-systems', tier: 'primary', file: 'sources/adaptive-systems/2305.20050v1.pdf',
  },

  // ── memory, plants, graphs ────────────────────────────────
  m_spectral: {
    authors: 'AlteranAI', title: 'MEASURED: the graph has community structure the embeddings do not; eigengap says k≈2, not 12',
    venue: 'measurement record, 2026-09-18', year: 2026, topic: 'phyto', tier: 'own',
    file: 'sources/phyto/2026-09-18-MEASURED-spectral-graph-has-structure-embeddings-do-not.md',
  },
  m_clusters: {
    authors: 'AlteranAI', title: 'MEASURED: why KG clusters are empty; it is not the algorithm, and full text does not fix it',
    venue: 'measurement record, 2026-09-18', year: 2026, topic: 'phyto', tier: 'own',
    file: 'sources/phyto/2026-09-18-MEASURED-kg-clusters-root-cause.md',
  },
  miao2024: {
    authors: 'J. Miao, L. Hu, Q. Zhang, L. Cao',
    title: 'Graph Memory Learning: Imitating Lifelong Remembering and Forgetting of Brain Networks',
    venue: 'arXiv:2407.19183', year: 2024, url: 'https://arxiv.org/abs/2407.19183',
    topic: 'phyto', tier: 'primary', file: 'sources/phyto/2407.19183v2.pdf',
  },
  moskvoretskii2026: {
    authors: 'V. Moskvoretskii, D. Glandorf, J. Medina Moreira, T. Käser, R. West',
    title: 'Tracing Persona Vectors Through LLM Pretraining',
    venue: 'arXiv:2605.13329', year: 2026, url: 'https://arxiv.org/abs/2605.13329',
    topic: 'phyto', tier: 'primary', file: 'sources/phyto/2605.13329v1.pdf',
  },
  cloud2026: {
    authors: 'A. Cloud, M. Le, J. Chua, J. Betley, A. Sztyber-Betley, S. Mindermann, J. Hilton, S. Marks, O. Evans',
    title: 'Language models transmit behavioural traits through hidden signals in data',
    venue: 'Nature 652, 615–621', year: 2026, url: 'https://truthful.ai/papers/subliminal-learning/',
    topic: 'phyto', tier: 'primary', file: 'sources/phyto/15-Language models transmit …',
  },
  valueleakage: {
    title: "Value Leakage: An LLM's Answers Are Silently Shaped by Its Own Values",
    venue: 'LessWrong',
    url: 'https://www.lesswrong.com/posts/hbMw4Yqw6RnFaExDy/value-leakage-an-llm-s-answers-are-silently-shaped-by-its-1',
    topic: 'phyto', tier: 'web', file: 'sources/phyto/38-Value Leakage …',
  },
  mtgjl: {
    title: 'MultiScaleTreeGraph.jl — the MTG concept',
    venue: 'documentation', url: 'https://vezy.github.io/MultiScaleTreeGraph.jl/stable/the_mtg/mtg_concept/',
    topic: 'phyto', tier: 'web', file: 'sources/phyto/23-Concept · MultiScaleTreeGraph.jl',
  },
  pieters2022: {
    authors: 'O. Pieters, T. De Swaef, M. Stock, F. wyffels',
    title: 'Leveraging plant physiological dynamics using physical reservoir computing',
    venue: 'Scientific Reports 12, 12594', year: 2022,
    topic: 'phyto', tier: 'primary', file: 'sources/phyto/16-Leveraging plant physiological dynamics …',
  },
  treememories2024: {
    authors: 'P. Krokene, M. H. Mageroy',
    title: 'Tree Memories: How Can Trees Remember Without a Brain?',
    venue: 'Frontiers for Young Minds 12:1400253', year: 2024, url: 'https://kids.frontiersin.org/articles/10.3389/frym.2024.1400253',
    topic: 'phyto', tier: 'web', file: 'sources/phyto/37-Tree Memories …',
  },
  mcgill2025: {
    authors: 'McGill University Newsroom',
    title: "Plants retain a 'genetic memory' of past population crashes, study shows", year: 2026,
    url: 'https://www.mcgill.ca/newsroom/channels/news/plants-retain-genetic-memory-past-population-crashes-study-shows-371067',
    topic: 'phyto', tier: 'web', file: 'sources/phyto/29-Plants retain …',
  },

  schelpe2026: {
    authors: 'Schelpe, Corbenic', title: 'Byte-Exact KV-State Grafting',
    venue: 'arXiv:2607.14431', year: 2026, url: 'https://arxiv.org/abs/2607.14431', topic: 'external', tier: 'external',
  },

  fossdal2024: {
    authors: 'C. G. Fossdal, P. Krokene, J. E. Olsen, et al.', title: 'Epigenetic stress memory in gymnosperms',
    venue: 'Plant Physiology 195, 1117–1133', year: 2024, url: 'https://doi.org/10.1093/plphys/kiae051', topic: 'external', tier: 'external',
  },

  // ── fungi and worlds ──────────────────────────────────────
  adamatzky2022: {
    authors: 'A. Adamatzky, P. Ayres, A. E. Beasley, N. Roberts, H. A. B. Wösten',
    title: 'Logics in Fungal Mycelium Networks',
    venue: 'Logica Universalis 16, 655–669', year: 2022, url: 'https://doi.org/10.1007/s11787-022-00318-4',
    topic: 'infinite-worlds', tier: 'primary', file: 'sources/infinite-worlds/Logics_in_Fungal_Mycelium_Networks …',
  },
  larocco2025: {
    authors: 'J. LaRocco, Q. Tahmina, R. Petreaca, J. Simonis, J. Hill',
    title: 'Sustainable memristors from shiitake mycelium for high-frequency bioelectronics',
    venue: 'PLoS One 20(10): e0328965', year: 2025, url: 'https://doi.org/10.1371/journal.pone.0328965',
    topic: 'infinite-worlds', tier: 'primary', file: 'sources/infinite-worlds/Sustainable_memristors …',
  },
  tompris2025: {
    authors: 'I. Tompris, I. K. Chatzipaschalis, T. P. Chatzinikolaou, et al., A. Adamatzky, P. Ayres, G. Ch. Sirakoulis',
    title: 'Mycelium as a computational medium: a framework for growth modeling towards reservoir computing',
    venue: 'Natural Computing', year: 2025, url: 'https://doi.org/10.1007/s11047-025-10040-x',
    topic: 'infinite-worlds', tier: 'primary', file: 'sources/infinite-worlds/Mycelium_as_a_computational_medium …',
  },
  stojcheva: {
    authors: 'V. Stojcheva',
    title: 'Mycelium as a Source of True Randomness: Exploring Fungal Networks for Organic Random Number Generation',
    venue: "Bachelor's thesis, LUT University",
    topic: 'infinite-worlds', tier: 'primary', file: 'sources/infinite-worlds/EXPLORING_FUNGAL_NETWORKS …',
  },

  // ── optimisation and fractals ─────────────────────────────
  kingma2015: {
    authors: 'D. P. Kingma, J. Ba', title: 'Adam: A Method for Stochastic Optimization',
    venue: 'ICLR 2015', year: 2015, url: 'https://arxiv.org/abs/1412.6980', topic: 'external', tier: 'external',
  },
  loshchilov2019: {
    authors: 'I. Loshchilov, F. Hutter', title: 'Decoupled Weight Decay Regularization',
    venue: 'ICLR 2019', year: 2019, url: 'https://arxiv.org/abs/1711.05101', topic: 'external', tier: 'external',
  },
  dudko: {
    authors: 'D. Dudko, D. Schleicher, appendix by W. Jung', title: 'Core entropy of quadratic polynomials',
    venue: 'arXiv:1412.8760', url: 'https://arxiv.org/abs/1412.8760',
    topic: 'fractal-optimizer', tier: 'primary', file: 'sources/fractal-optimizer/1412.8760v2.pdf',
  },
  quanta2024: {
    authors: 'Quanta Magazine', title: "The Quest to Decode the Mandelbrot Set, Math's Famed Fractal",
    year: 2024, url: 'https://www.quantamagazine.org/the-quest-to-decode-the-mandelbrot-set-maths-famed-fractal-20240126/',
    topic: 'fractal-optimizer', tier: 'web', file: 'sources/fractal-optimizer/19-The Quest to Decode …',
  },
  fractalbench: {
    title: 'Fractal Optimization Benchmark: PureFractalOrbitOptimizer vs SGD and AdamW (two-spirals)',
    venue: 'blueprint, generated in a NotebookLM session', year: 2026,
    topic: 'fractal-optimizer', tier: 'synthesis', file: 'content/fractal-optimizer-blueprints/06-Fractal Optimization Benchmark.md',
  },
  ourbench: {
    authors: 'AlteranAI', title: 'Fractal-orbit optimizer reproduction: two-spirals, five seeds, D_q probe',
    venue: 'github.com/misomalcek/alteranai/research', year: 2026, url: 'https://github.com/misomalcek/alteranai/tree/main/research',
    topic: 'fractal-optimizer', tier: 'own', file: 'research/bench_fractal.py · probe_dq.py · bench_fractal.json',
  },
  adamworbits: {
    title: 'AdamW vs. Fractal Orbits',
    venue: 'blueprint, generated in a NotebookLM session', year: 2026,
    topic: 'fractal-optimizer', tier: 'synthesis', file: 'content/fractal-optimizer-blueprints/04-AdamW vs. Fractal Orbits.md',
  },

  // ── information, emergence, philosophy ────────────────────
  landauer: {
    title: "Landauer's principle", venue: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Landauer%27s_principle',
    topic: 'arch-of-truth', tier: 'web', file: "sources/arch-of-truth/12-Landauer's principle - Wikipedia",
  },
  berut2012: {
    authors: 'A. Bérut, A. Arakelyan, A. Petrosyan, S. Ciliberto, R. Dillenschneider, E. Lutz',
    title: "Experimental verification of Landauer's principle linking information and thermodynamics",
    venue: 'Nature 483, 187–190', year: 2012, url: 'https://arxiv.org/abs/1503.06537', topic: 'external', tier: 'external',
  },
  sep_emergence: {
    authors: 'Stanford Encyclopedia of Philosophy', title: 'Emergent Properties',
    url: 'https://plato.stanford.edu/entries/properties-emergent/',
    topic: 'adaptive-systems', tier: 'primary', file: 'sources/adaptive-systems/12-Emergent Properties …',
  },
  grunspan2025: {
    authors: 'R. Grunspan, J. D. Smith, E. VanderVeen', title: 'Emergent Intelligence',
    venue: 'Studies in Intelligence 69(4)', year: 2025,
    topic: 'adaptive-systems', tier: 'primary', file: 'sources/adaptive-systems/25-Emergent-Intelligence-69-4-Dec2025.pdf',
  },
};

export const sourceTopics = () => new Set(Object.values(SOURCES).map((s) => s.topic));
