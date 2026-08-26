# Exemplars by dimension

Generated 2026-08-19T18:19:29+00:00 from a per-pattern selection pass over 1,748 papers.
Criteria and weights are defined in [build/exemplars/RUBRIC.md](build/exemplars/RUBRIC.md);
the method is described in [METHODOLOGY.md](METHODOLOGY.md). Scores are the
reviewer-adjusted consensus of the rating agents, on a 0–5 scale.

## U01 · Input, Context & Specification

*Setting the context* — 568 eligible papers, 568 shortlisted, 5 selected.

**1. [Codesigning Ripplet: an LLM-Assisted Assessment Authoring System Grounded in a Conceptual Model of Teachers' Workflows](https://doi.org/10.1145/3772318.3790418)** — chi-2026 2026 · `6006` · **4.95**

A teacher hand-edits one generated assessment question; the system infers why that change was made, materializes it as a reusable edit command, and reapplies it to questions in other assessments. The specification is never written down by the user at all - it is induced from a single corrective act and then becomes a durable, reusable object, which is the sharpest form of 'input as something other than a prompt' in the dimension. Anyone whose users already fix generated output by hand can lift it: watch the fix, generalize it, offer it back as a named operation.

> Chosen over the next candidate because: Over GenNI (10539), whose quote shows the inversion from a goal text to inferred control states but never a later run conditioned on them, while Ripplet's coded quote carries exemplar, induction, materialized structure and reuse verbatim.

**2. [AI-Instruments: Embodying Prompts as Instruments to Abstract & Reflect Graphical Interface Commands as General-Purpose Tools](https://doi.org/10.1145/3706598.3714259)** — chi-2025 2025 · `4449` · **4.75**

Prompt fragments are generated from the image currently in hand, each fragment is rendered as a separately editable widget naming a dimension of that image, and changing one regenerates the image. The controls are therefore a function of the artifact rather than a fixed panel decided at design time - the reviewer confirmed derivation, addressable handles and re-parameterized regeneration all appear literally in the coded figure text. Any system that generates an artifact it cannot fully explain can adopt this: expose the artifact's own dimensions as the control surface.

> Chosen over the next candidate because: Over DesignWeaver (3576), which makes the same image-derived-palette move in the same venue and year but whose quote leaves the regeneration half implicit - and whose score was hand-raised by the curator to reach that rank.

**3. [Understanding and Supporting Formal Email Exchange by Answering AI-Generated Questions](https://doi.org/10.1145/3706598.3714016)** — chi-2025 2025 · `3951` · **4.70**

Questions are generated from the incoming email, the user answers a set of short questions, and the reply is the downstream product - the user composes neither the reply nor a prompt. It is the one elicitation instance where the whole signature is quoted rather than inferred, and where the material preceding the questions is a fixed external artifact rather than user-authored content, so the head-of-loop claim actually holds. The move transplants to any inbox-shaped task where an incoming artifact defines the slots a response must fill.

> Chosen over the next candidate because: Over StepWrite (13647), whose adaptive policy is the more consequential system but whose excerpt, per the reviewer, never exposes the turn order or input-record schema - so its head-of-loop status rests on the phrase 'incrementally elicits' alone.

**4. [CanvasPic: An Interactive Tool for Freely Generating Facial Images Based on Spatial Layout](https://doi.org/10.1145/3613905.3650952)** — chiea-2024 2024 · `7479` · **4.75**

Users position reference images on a two-dimensional layout and the distances between them determine how much each attribute influences the generated face; rearranging elements without editing any of them changes the output. This is the dimension's clearest case of a specification that lives in configuration rather than in content - nothing the user 'wrote' changed, only where things sit. Any system that blends several sources can borrow the mapping from arrangement to weighting.

> Chosen over the next candidate because: Over CrossLit (5384), whose spatial relation is group membership only - a legitimate but coarser reading of the signature - and over Component-Wise Sketching (5715), whose entire center-distance rule rests on one incidental sentence the reviewer verified is not the paper's design move.

**5. [Code Shaping: Iterative Code Editing with Free-form AI-Interpreted Sketching](https://doi.org/10.1145/3706598.3713822)** — chi-2025 2025 · `3895` · **4.55**

Free-form sketch annotations drawn directly on top of code and console output are interpreted as edit specifications for the underlying program, so the drawing surface and the artifact surface are the same surface. It is the only proof in the whole dimension that freehand marking as specification survives leaving visual media - the mechanism is about pointing at and marking up an artifact, not about drawing pictures. Any editor with a rendered artifact can adopt it.

> Chosen over the next candidate because: Over ImaginationVellum (13801), which scores higher and is the tighter sketch-conditioning instance, but which would make this a third image-generation entry alongside AI-Instruments and CanvasPic and adds no channel the set does not already show.

*Curator note:* Overrides of pattern-level judgements. (1) pat-015: the curator ranked StepWrite (13647, 4.83) above the email system (3951, 4.70) on breadth of mechanism while conceding the email system has the clearest literal structural evidence; reviewer 1 confirmed that concession and found StepWrite's head-of-loop status unquoted. Under a one-slot-per-pattern set the evidence claim wins, so 3951 leads. (2) pat-040: I took the lower-scoring Code Shaping over ImaginationVellum (4.85) on set-level range, not on evidence - ImaginationVellum's coded quote is stronger, and a reader who wants the canonical stroke-as-conditioning instance should go there. (3) pat-022: AI-Instruments' second candidacy under pat-027 (4.50) was dropped by both reviewers for the no-repeated-system rule and for a quote that shows no induction step; that drop is honoured here, and the system appears once, at pat-022.

Patterns unrepresented: pat-032 Source Conditioned Generation, pat-034 Artifact Generation Property Controls, pat-035 Atomic AI Action Menu, pat-059 Inferred User State Driven Adaptation, pat-092 Natural-Language Control, pat-093 Familiar-Object Metaphor. Five slots against eleven patterns forces this. The most defensible complaint is pat-059: the dimension's own description names user-state signals as a specification source, and no exemplar covers them. I left it out because all three of its candidates are compromised - 12905 was verified as pure sensor infrastructure with no user-facing specification, which U01's classification boundary excludes; 9838's state is gaze-derived and equally close to that boundary; 9078, the soundest of the three, has an explanation-template inventory that is never enumerated and the lowest score band in the pattern. pat-092 was left out as the dimension's default move rather than its most instructive one, and its top-scored candidate (11792) was found unconfirmed by reviewer 1.

What to distrust. Ripplet's quote does not say whether the induced edit command is inspectable or editable by the user - do not claim it. AI-Instruments does not state that the fragment set is automatically regenerated when the input image changes. The email system's quote establishes the questions and the answers but only implies how answers are assembled into the reply. CanvasPic's positioned elements are imported reference images, not the user's own material, so the surface is closer to a blend-weight canvas than an open workspace; the quote also does not establish an unbounded surface. Code Shaping's annotation vocabulary and the exact return of edited output for another drawing pass are not described, and its score was cut 0.35 from the raters' consensus by the curator for that reason. Two proposed promotions from reviewer 1 (rid 13373 RuleScope at pat-027, rid 10058 SeeChart at pat-034) are not present in this dimension's candidate file, so no bibliographic data exists for them here and they could not be selected.

*Near misses:* `13801` ImaginationVellum: Generative-AI Ideation Canvas with Spatia, `13647` StepWrite: Adaptive Planning for Speech-Driven Text Generati, `15614` Steering AI-driven Personalization of Scientific Text for Ge, `9078` Ask, Verify, Refine: A Question-Aware Multimodal XUI with Fe, `3590` FusAIn: Composing Generative AI Visual Prompts Using Pen-bas, `5505` CareerCraft: Supporting New Graduates on Job Hunting with LL

### Patterns in U01

#### pat-015 · Question-Driven Elicitation

*30 rated · 3 exemplars*

- **[StepWrite: Adaptive Planning for Speech-Driven Text Generation](https://doi.org/10.1145/3746059.3747610)** — uist-2025 2025 · `13647` · 4.83

  StepWrite uses an adaptive Q&A dialogue to incrementally populate task-relevant context and then synthesizes that accumulated specification into a coherent draft. It is a particularly consequential instance because question-driven elicitation replaces conventional prompt composition in a hands-free, eyes-free writing workflow.

- **[Socrates: Data Story Generation via Adaptive Machine-Guided Elicitation of User Feedback](https://doi.org/10.1109/tvcg.2023.3327363)** — tvcg-2024 2024 · `11327` · 4.77

  Socrates makes the elicitation policy part of generation: the machine adaptively selects questions, records the user's feedback, and incorporates it into the resulting data story. This clearly demonstrates how system-authored questions can progressively determine a generative specification.

- **[Understanding and Supporting Formal Email Exchange by Answering AI-Generated Questions](https://doi.org/10.1145/3706598.3714016)** — chi-2025 2025 · `3951` · 4.70

  The system derives short questions from an incoming email, and the user's answers constitute the specification for a reply instead of requiring the user to compose either a full response or a generative prompt. The source artifact, system questions, user action, and target task are all explicit, making this the cleanest directly reconstructable inversion in the set.

*Also ranked (7 more, by rater consensus):*

4. [GenerativeGUI: Dynamic GUI Generation Leveraging LLMs for Enhanced User Interaction on Chat Interfaces](https://doi.org/10.1145/3706599.3719743) — chiea-2025 2025 · `8366` · 4.40
5. [Bridging Pedagogy and Play: Introducing a Language Mapping Interface for Human-AI Co-Creation in Educational Game Design](https://doi.org/10.1145/3772363.3798862) — chiea-2026 2026 · `9122` · 4.35
6. [Personalizing Human-LLM Interactions through Mixed Profiling](https://doi.org/10.1145/3772363.3799351) — chiea-2026 2026 · `9493` · 4.32
7. [From Prompt to Presence: Co-Creating Personalised Emotional Sanctuaries in VR with Generative AI](https://doi.org/10.1145/3742413.3789067) — iui-2026 2026 · `10233` · 4.30
8. [PrivacyAkinator: Articulating Key Privacy Design Decisions by Answering LLM-Generated Multiple-choice Questions](https://doi.org/10.1145/3772318.3790408) — chi-2026 2026 · `5574` · 4.27
9. [The You You Are: A Payphone Installation for Parallel-Self Dialogue Enabled by Voice Cloning](https://doi.org/10.1145/3772363.3799159) — chiea-2026 2026 · `9849` · 4.27
10. [Words to Describe What I'm Feeling: Exploring the Potential of AI Agents for High Subjectivity Decisions in Advance Care Planning](https://doi.org/10.1145/3772318.3791335) — chi-2026 2026 · `5259` · 4.18

#### pat-022 · Artifact Derived Controls

*30 rated · 3 exemplars*

- **[AI-Instruments: Embodying Prompts as Instruments to Abstract & Reflect Graphical Interface Commands as General-Purpose Tools](https://doi.org/10.1145/3706598.3714259)** — chi-2025 2025 · `4449` · 4.75

  The system decomposes an existing image into image-specific prompt fragments, renders those dimensions as individually editable controls, and regenerates the image when a fragment changes. The evidence directly captures the complete derivation–control–downstream-operation chain and makes the content-dependent nature of the controls unusually easy to reconstruct.

- **[GazeNoter: Co-Piloted AR Note-Taking via Gaze Selection of LLM Suggestions to Match Users' Intentions](https://doi.org/10.1145/3706598.3714294)** — chi-2025 2025 · `3398` · 4.40

  GazeNoter extracts context keywords from the user’s latest spoken sentence, exposes those input-dependent terms for selection, and uses the selections to shape candidate sentences. It is a strong example of replacing repeated free-text specification with a dynamically derived set of discrete handles.

- **[DesignWeaver: Dimensional Scaffolding for Text-to-Image Product Design](https://doi.org/10.1145/3706598.3714211)** — chi-2025 2025 · `3576` · 4.40

  DesignWeaver derives key product-design dimensions from generated images and surfaces them as a palette for subsequent prompt construction. The palette is therefore determined by the artifact rather than fixed at design time, giving novices concrete, selectable handles for steering later image generation.

*Also ranked (7 more, by rater consensus):*

3. [Composable Prompting Workspaces for Creative Writing: Exploration and Iteration Using Dynamic Widgets](https://doi.org/10.1145/3706599.3720243) — chiea-2025 2025 · `8204` · 4.30
5. [Actionbrushes: Painting with Elemental Dynamics from a Generative Palette](https://doi.org/10.1145/3772363.3798553) — chiea-2026 2026 · `9055` · 4.20
6. [ConceptEVA: Concept-Based Interactive Exploration and Customization of Document Summaries](https://doi.org/10.1145/3544548.3581260) — chi-2023 2023 · `1990` · 4.17
7. [Luminate: Structured Generation and Exploration of Design Space with Large Language Models for Human-AI Co-Creation](https://doi.org/10.1145/3613904.3642400) — chi-2024 2024 · `3151` · 4.15
8. [An Interactive Visual Enhancement for Prompted Programmatic Weak Supervision in Text Classification](https://doi.org/10.1111/cgf.70131) — cgf-2025 2025 · `640` · 4.13
9. [DeckFlow: Specification Decomposition on a Multimodal Generative Canvas](https://doi.org/10.1109/vl-hcc65237.2025.00027) — vlhcc-2025 2025 · `14001` · 4.13
10. [Elemental Alchemist: A Generative Interface for Semantic Control of Particle Systems Across Dynamic Levels of Abstraction](https://doi.org/10.1145/3800645.3812946) — dis-2026 2026 · `16921` · 4.10

#### pat-027 · Specification by Demonstration

*25 rated · 3 exemplars*

- **[Codesigning Ripplet: an LLM-Assisted Assessment Authoring System Grounded in a Conceptual Model of Teachers' Workflows](https://doi.org/10.1145/3772318.3790418)** — chi-2026 2026 · `6006` · 4.95

  A manual edit to one finished question is interpreted, generalized into a reusable edit command, and applied to other questions—the clearest complete demonstration-to-operative-specification loop in the candidates.

- **[GenNI: Human-AI Collaboration for Data-Backed Text Generation](https://doi.org/10.1109/tvcg.2021.3114845)** — tvcg-2022 2022 · `10539` · 4.72

  The user supplies a desired finished text and the system reverses generation to recover control states, making an induced parameterization—not the exemplar—the operative specification.

- **[AI-Instruments: Embodying Prompts as Instruments to Abstract & Reflect Graphical Interface Commands as General-Purpose Tools](https://doi.org/10.1145/3706598.3714259)** — chi-2025 2025 · `4449` · 4.50

  A concrete example or result is grounded into an instrument, reifying the demonstrated behavior as a reusable general-purpose interface-command abstraction.

*Also ranked (7 more, by rater consensus):*

4. [AgentPbD: Interactive Agentic Workflow Generation from User Demonstration on Web Browsers](https://doi.org/10.1109/vl-hcc65237.2025.00064) — vlhcc-2025 2025 · `14038` · 4.62
5. [End User Authoring of Personalized Content Classifiers: Comparing Example Labeling, Rule Writing, and LLM Prompting](https://doi.org/10.1145/3706598.3713691) — chi-2025 2025 · `4067` · 4.52
6. [RuleScope: Semantic-Aware Authoring of Data Validation Rules](https://doi.org/10.1109/tvcg.2026.3697222) — tvcg-2026 2026 · `13373` · 4.38
7. [Data Formulator: AI-Powered Concept-Driven Visualization Authoring](https://doi.org/10.1109/tvcg.2023.3326585) — tvcg-2024 2024 · `11418` · 4.32
8. [IntentTuner: An Interactive Framework for Integrating Human Intentions in Fine-tuning Text-to-Image Generative Models](https://doi.org/10.1145/3613904.3642165) — chi-2024 2024 · `2966` · 4.23
9. [Exploring Fairy Cursor as a Form of AI Agent for In-the-Flow Assistance: Design Opportunities and Challenges](https://doi.org/10.1145/3800645.3813082) — dis-2026 2026 · `16713` · 4.10
10. [WhatELSE: Shaping Narrative Spaces at Configurable Level of Abstraction for AI-bridged Interactive Storytelling](https://doi.org/10.1145/3706598.3713363) — chi-2025 2025 · `3796` · 4.03

#### pat-032 · Source Conditioned Generation

*30 rated · 3 exemplars*

- **[GANSpiration: Balancing Targeted and Serendipitous Inspiration in User Interface Design with Style-Based Generative Adversarial Network](https://doi.org/10.1145/3491102.3517511)** — chi-2022 2022 · `1423` · 4.55

  GANSpiration is the cleanest structural match: it ingests the user’s preliminary design image, encodes that artifact into latent conditioning state, and uses it to generate design inspiration whose output changes with the supplied draft.

- **[CareerCraft: Supporting New Graduates on Job Hunting with LLM-Assisted Self-Construction of Career Profile](https://doi.org/10.1145/3772318.3791221)** — chi-2026 2026 · `5505` · 4.48

  CareerCraft exposes a concrete ingestion-and-transformation pipeline in which user-uploaded documents and prior reflections are processed by an LLM into predefined experience cards, turning material the user already has into structured generative output.

- **[From Photos to Immersive Memories: Awakening the Past with Panoramic Environments](https://doi.org/10.1145/3706599.3720170)** — chiea-2025 2025 · `8351` · 4.46

  The system conditions generation on a clearly pre-existing, multimodal personal artifact—diary text, photographs, and EXIF metadata—and transforms those records into a VR environment intended to preserve their original context.

*Also ranked (7 more, by rater consensus):*

2. [Is This the Real Me?: Investigating Algorithmic Self-Portraits as a Medium for Critical Reflection on Algorithmic Experiences on YouTube](https://doi.org/10.1145/3800645.3812910) — dis-2026 2026 · `16931` · 4.52
4. [DiaryPlay: AI-Assisted Creation of Interactive Story Vignettes for Everyday Storytelling](https://doi.org/10.1145/3772318.3790572) — chi-2026 2026 · `5445` · 4.38
6. [ResonantLoom: From Prompting to Repair in Object-Centric Generative Sound Design](https://doi.org/10.1145/3772363.3799166) — chiea-2026 2026 · `9984` · 4.32
7. [DataSway: Vivifying Metaphoric Visualization with Animation Clip Generation and Coordination](https://doi.org/10.1145/3800645.3813048) — dis-2026 2026 · `16919` · 4.32
8. [StyleMe: Towards Intelligent Fashion Generation with Designer Style](https://doi.org/10.1145/3544548.3581377) — chi-2023 2023 · `2074` · 4.30
9. [RoomDreaming: Generative-AI Approach to Facilitating Iterative, Preliminary Interior Design Exploration](https://doi.org/10.1145/3613904.3642901) — chi-2024 2024 · `2563` · 4.27
10. [Thing2Reality: Enabling Spontaneous Creation of 3D Objects from 2D Content using Generative AI in XR Meetings](https://doi.org/10.1145/3746059.3747621) — uist-2025 2025 · `13618` · 4.23

#### pat-034 · Artifact Generation Property Controls

*30 rated · 3 exemplars*

- **[TaleBrush: Visual Sketching of Story Generation with Pretrained Language Models](https://doi.org/10.1145/3491101.3519873)** — chiea-2022 2022 · `6492` · 4.72

  TaleBrush makes surprise a persistent, ordered generation property that writers specify spatially by drawing a level trajectory, providing an unusually clear and expressive realization of the pattern.

- **[Steering AI-driven Personalization of Scientific Text for General Audiences](https://doi.org/10.1145/3757660)** — cscw-2025 2025 · `15614` · 4.62

  The system presents a named 0–100 personalization slider and explicitly generates scientific-text translations at the selected degree, almost exactly reproducing the structural signature.

- **[ImaginationVellum: Generative-AI Ideation Canvas with Spatial Prompts, Generative Strokes, and Ideation History](https://doi.org/10.1145/3746059.3747631)** — uist-2025 2025 · `13801` · 4.42

  ImaginationVellum turns persistent canvas geometry—relative distance and 2D layout—into an ordered control surface for token weights, temperature, CFG, and related generation parameters.

*Also ranked (7 more, by rater consensus):*

3. [CoBRA: Programming Cognitive Bias in Social Agents Using Classic Social Science Experiments](https://doi.org/10.1145/3772318.3790804) — chi-2026 2026 · `5199` · 4.48
5. [GELEX: Generative AI-Hybrid System for Example-Based Learning](https://doi.org/10.1145/3613905.3650900) — chiea-2024 2024 · `7582` · 4.43
6. [WhatELSE: Shaping Narrative Spaces at Configurable Level of Abstraction for AI-bridged Interactive Storytelling](https://doi.org/10.1145/3706598.3713363) — chi-2025 2025 · `3796` · 4.42
7. [The less I type, the better: How AI Language Models can Enhance or Impede Communication for AAC Users](https://doi.org/10.1145/3544548.3581560) — chi-2023 2023 · `1907` · 4.38
8. [SeeChart: Enabling Accessible Visualizations Through Interactive Natural Language Interface For People with Visual Impairments](https://doi.org/10.1145/3581641.3584099) — iui-2023 2023 · `10058` · 4.28
9. [GANSlider: How Users Control Generative Models for Images using Multiple Sliders with and without Feedforward Information](https://doi.org/10.1145/3491102.3502141) — chi-2022 2022 · `869` · 4.25
10. [ViDscribe: Multimodal AI for Customizing Audio Description and Question Answering in Online Videos](https://doi.org/10.1145/3772363.3798744) — chiea-2026 2026 · `9701` · 4.23

#### pat-035 · Atomic AI Action Menu

*11 rated · 3 exemplars*

- **[Leveraging ChatGPT for Adaptive Learning through Personalized Prompt-based Instruction: A CS1 Education Case Study](https://doi.org/10.1145/3613905.3637148)** — chiea-2024 2024 · `7932` · 4.22

  This is the strongest structural exemplar: topics and subtopics form the content units, while every unit is supported by the same four named prompt actions—Explanation, Example, Exercise, and Exercise Solution—producing a clear units × actions interaction space.

- **[Jamplate: Exploring LLM-Enhanced Templates for Idea Reflection](https://doi.org/10.1145/3640543.3645196)** — iui-2024 2024 · `10180` · 3.98

  Jamplate exposes three prepared reflection questions and makes each directly invocable: clicking a question generates an answer grounded in the competitor or column being examined. The fixed choices and resulting action–unit binding are unusually concrete and reproducible.

- **[LADICA: A Large Shared Display Interface for Generative AI Cognitive Assistance in Co-located Team Collaboration](https://doi.org/10.1145/3706598.3713289)** — chi-2025 2025 · `3620` · 3.78

  Each idea note has an adjacent AI affordance through which the user chooses a prepared relation type; LADICA then generates thinking aspects conditioned on that specific note and choice. This clearly demonstrates atomic action–unit binding in a repository of collaborative ideas.

*Also ranked (6 more, by rater consensus):*

4. [Sensecape: Enabling Multilevel Exploration and Sensemaking with Large Language Models](https://doi.org/10.1145/3586183.3606756) — uist-2023 2023 · `13484` · 3.27
5. [A Mystery for You: A fact-checking game enhanced by large language models (LLMs) and a tangible interface](https://doi.org/10.1145/3613905.3648110) — chiea-2024 2024 · `8042` · 3.10
6. [Orality: A Semantic Canvas for Externalizing and Clarifying Thoughts with Speech](https://doi.org/10.1145/3772318.3791713) — chi-2026 2026 · `4816` · 2.97
7. [Prompt Machine: A Tangible Generative AI Tool for Supporting Children's Learning and Literacy](https://doi.org/10.1145/3715336.3735673) — dis-2025 2025 · `16464` · 2.37
8. [ReadingQuizMaker: A Human-NLP Collaborative System that Supports Instructors to Design High-Quality Reading Quiz Questions](https://doi.org/10.1145/3544548.3580957) — chi-2023 2023 · `2013` · 2.13
10. [GLITTER: An AI-assisted Platform for Material-Grounded Asynchronous Discussion in Flipped Learning](https://doi.org/10.1145/3746059.3747742) — uist-2025 2025 · `13641` · 1.83

#### pat-039 · Spatial Canvas

*17 rated · 4 exemplars*

- **[CanvasPic: An Interactive Tool for Freely Generating Facial Images Based on Spatial Layout](https://doi.org/10.1145/3613905.3650952)** — chiea-2024 2024 · `7479` · 4.75

  CanvasPic is the canonical Spatial Canvas exemplar: users reposition images on a two-dimensional layout, and the distances between them continuously determine each image attribute’s influence on the generated face. Moving unchanged elements therefore changes the request and its output through an explicit, inspectable spatial mapping.

- **[Component-Wise Sketching and Generation for Car Interior Design](https://doi.org/10.1145/3772318.3790912)** — chi-2026 2026 · `5715` · 4.55

  The system interprets component positions relative to the canvas center, automatically assembling the nearest components into a cabin preview. Because moving an otherwise unchanged component can include or exclude it from the generated configuration, the mechanism directly satisfies the pattern’s requirement that coordinates and distances function as specification.

- **[CrossLit: Connecting Visual and Textual Sensemaking for Literature Review](https://doi.org/10.1145/3772318.3791418)** — chi-2026 2026 · `5384` · 4.40

  CrossLit turns users’ spatial organization of literature piles into document structure: each group formed in the visual editor becomes a drafted section in the text editor. The canvas is thus an executable specification for synthesis, with rearrangement across groups changing the generated outline and prose without requiring changes to the papers themselves.

- **[ImaginationVellum: Generative-AI Ideation Canvas with Spatial Prompts, Generative Strokes, and Ideation History](https://doi.org/10.1145/3746059.3747631)** — uist-2025 2025 · `13801` · 4.12 · *added by hand*

  The whole 2D canvas is the prompt: strokes, placement and spatial relationships between elements are read as specification rather than as decoration around a text box. It is the fullest statement of the pattern in the candidate pool, since the canvas is not a staging area whose contents are later serialised into a prompt but is itself the active prompt space. Any tool with a freeform surface can adopt the move of treating arrangement as instruction.

*Also ranked (6 more, by rater consensus):*

5. [PromptChainer: Chaining Large Language Model Prompts through Visual Programming](https://doi.org/10.1145/3491101.3519729) — chiea-2022 2022 · `6679` · 3.87
6. [CoNode: Visualizing Workflows for Knowledge Reuse and Recombination in Team-AI Collaborative Design](https://doi.org/10.1145/3772318.3791216) — chi-2026 2026 · `5463` · 3.85
7. [Canvas3D: Empowering Precise Spatial Control for Image Generation with Constraints from a 3D Virtual Canvas](https://doi.org/10.1145/3742413.3789142) — iui-2026 2026 · `10255` · 3.60
8. [AI-Instruments: Embodying Prompts as Instruments to Abstract & Reflect Graphical Interface Commands as General-Purpose Tools](https://doi.org/10.1145/3706598.3714259) — chi-2025 2025 · `4449` · 3.53
9. [Sci-Fi Spark: A Human-AI Co-Creation System for Science Fiction Ideation](https://doi.org/10.1145/3772318.3791950) — chi-2026 2026 · `5288` · 3.47
10. [FusAIn: Composing Generative AI Visual Prompts Using Pen-based Interaction](https://doi.org/10.1145/3706598.3714027) — chi-2025 2025 · `3590` · 3.22

#### pat-040 · Sketch-Based Input

*30 rated · 3 exemplars*

- **[ImaginationVellum: Generative-AI Ideation Canvas with Spatial Prompts, Generative Strokes, and Ideation History](https://doi.org/10.1145/3746059.3747631)** — uist-2025 2025 · `13801` · 4.85

  Generative Strokes are an especially exact match: both the geometry and placement of freehand marks directly modulate generation and latent semantic or stylistic parameters on an ideation canvas.

- **[Drawing with Reframer: Emergence and Control in Co-Creative AI](https://doi.org/10.1145/3581641.3584095)** — iui-2023 2023 · `10072` · 4.70

  Reframer consumes the current vector sketch together with a text goal and completes that sketch on the canvas, clearly making drawn geometry persistent generative state in a co-creative loop.

- **[Code Shaping: Iterative Code Editing with Free-form AI-Interpreted Sketching](https://doi.org/10.1145/3706598.3713822)** — chi-2025 2025 · `3895` · 4.55

  Free-form annotations drawn directly over code and console output are spatial specifications interpreted by AI to edit the underlying artifact, demonstrating that sketch-based steering can extend beyond visual-media generation.

*Also ranked (7 more, by rater consensus):*

2. [Notational Animating: An Interactive Approach to Creating and Editing Animation Keyframes](https://doi.org/10.1145/3772318.3790707) — chi-2026 2026 · `5632` · 4.75
4. [TaleBrush: Sketching Stories with Generative Pretrained Language Models](https://doi.org/10.1145/3491102.3501819) — chi-2022 2022 · `973` · 4.63
6. [A Collaborative, Interactive and Context-Aware Drawing Agent for Co-Creative Design](https://doi.org/10.1109/tvcg.2023.3293853) — tvcg-2024 2024 · `11750` · 4.38
7. [Smartboard: Visual Exploration of Team Tactics with LLM Agent](https://doi.org/10.1109/tvcg.2024.3456200) — tvcg-2025 2025 · `11931` · 4.25
8. [ScribbleSense: Generative Scribble-Based Texture Editing With Intent Prediction](https://doi.org/10.1109/tvcg.2025.3635035) — tvcg-2026 2026 · `12941` · 4.20
9. [SketchDynamics: Exploring Free-Form Sketches for Dynamic Intent Expression in Animation Generation](https://doi.org/10.1145/3772318.3791071) — chi-2026 2026 · `5326` · 4.07
10. [One Kiss: Emojis as Agents of Genre Flux in Generative Comics](https://doi.org/10.1145/3772363.3798758) — chiea-2026 2026 · `9476` · 4.05

#### pat-059 · Inferred User State Driven Adaptation

*30 rated · 3 exemplars*

- **[Portable Somatic Wearable: AI-Assisted Reflection Through Gaze-Derived Somatic Markers](https://doi.org/10.1145/3772363.3799134)** — chiea-2026 2026 · `9838` · 4.62

  This is the clearest complete instance: an inferred three-level hesitation variable selects among three authored conversational behaviors—continuing the narrative, holding space, or pausing with affirmation.

- **[Enhancing Perceived Empathy in Empathic Mixed Reality Agents via Context-Aware Adaptation](https://doi.org/10.1109/tvcg.2025.3646601)** — tvcg-2026 2026 · `12905` · 4.48

  The direction of physiological arousal functions as a discrete user-state variable that selects between two explicit, bounded difficulty behaviors: remove half the drones or add drones up to eight.

- **[Ask, Verify, Refine: A Question-Aware Multimodal XUI with Feedback-Guided Refinement for Clinical Verification](https://doi.org/10.1145/3772363.3798745)** — chiea-2026 2026 · `9078` · 4.42

  A predicted user-intent variable explicitly routes the response through an authored explanation template and determines which evidence and justification fields appear.

*Also ranked (7 more, by rater consensus):*

3. [When Systems Take Initiative: A Design Framework for Adaptive, Mixed-initiative Database Querying](https://doi.org/10.1145/3800645.3812906) — dis-2026 2026 · `16714` · 4.50
4. [LingoQ: Bridging the Gap between EFL Learning and Work through AI-Generated Work-Related Quizzes](https://doi.org/10.1145/3772318.3791342) — chi-2026 2026 · `6229` · 4.38
6. [In-Situ Adaptive Interfaces for Online Browsing: Design Dimensions for Intent-Responsive Automation and User Control](https://doi.org/10.1145/3742413.3789092) — iui-2026 2026 · `10192` · 4.22
7. [Persistent Assistant: Seamless Everyday AI Interactions via Intent Grounding and Multimodal Feedback](https://doi.org/10.1145/3706598.3714317) — chi-2025 2025 · `4106` · 4.03
8. [GraftMind: Facilitating Group Ideation with AI-Mediated Idea Sharing](https://doi.org/10.1145/3772318.3791388) — chi-2026 2026 · `4672` · 3.87
9. [DocDancer: Authoring Ultra-Responsive Documents with Layout Generation](https://doi.org/10.1109/vl-hcc57772.2023.00023) — vlhcc-2023 2023 · `13881` · 3.80
10. [MindShift: Leveraging Large Language Models for Mental-States-Based Problematic Smartphone Use Intervention](https://doi.org/10.1145/3613904.3642790) — chi-2024 2024 · `3004` · 3.75

#### pat-092 · Natural-Language Control

*30 rated · 3 exemplars*

- **[Interactive Table Synthesis With Natural Language](https://doi.org/10.1109/tvcg.2023.3329120)** — tvcg-2024 2024 · `11792` · 4.50

  Natural language is explicitly the primary interaction modality for transforming a separate table artifact, making substitution for a complex transformation-control vocabulary the system’s central claim.

- **[Stylette: Styling the Web with Natural Language](https://doi.org/10.1145/3491102.3501931)** — chi-2022 2022 · `1168` · 4.40

  Users express desired styling goals in natural language and the system changes a separate website artifact, cleanly instantiating outcome-oriented control in place of CSS and visual style manipulation.

- **[NL2Color: Refining Color Palettes for Charts with Natural Language](https://doi.org/10.1109/tvcg.2023.3326522)** — tvcg-2024 2024 · `11389` · 4.30

  The evidence explicitly connects natural-language expressions of desired outcomes to refinement of a separately represented chart palette, closely matching both the pattern’s outcome orientation and artifact/control separation.

*Also ranked (7 more, by rater consensus):*

1. [AVA: Towards Autonomous Visualization Agents through Visual Perception-Driven Decision-Making](https://doi.org/10.1111/cgf.15093) — cgf-2024 2024 · `350` · 4.45
4. [LLMR: Real-time Prompting of Interactive Worlds using Large Language Models](https://doi.org/10.1145/3613904.3642579) — chi-2024 2024 · `3216` · 4.32
5. [Prompt2Task: Automating UI Tasks on Smartphones from Textual Prompts](https://doi.org/10.1145/3716132) — tochi-2025 2025 · `17197` · 4.25
7. [I Want It That Way: Enabling Interactive Decision Support Using Large Language Models and Constraint Programming](https://doi.org/10.1145/3685053) — tiis-2024 2024 · `10383` · 4.02
8. [LegisFlow: Enhancing Korean Legal Research with Temporal-Aware LLM Interfaces](https://doi.org/10.1145/3746059.3747752) — uist-2025 2025 · `13685` · 4.02
9. [There Were Too Many to Check, So I Just Added One: Using an LLM-Powered Agent to Reduce Redundant Reports in Crowdsourced Reporting](https://doi.org/10.1145/3800645.3813043) — dis-2026 2026 · `16717` · 4.02
10. [ShadAR: LLM-driven shader generation to transform visual perception in Augmented Reality](https://doi.org/10.1145/3772363.3799378) — chiea-2026 2026 · `9841` · 3.93

#### pat-093 · Familiar-Object Metaphor

*35 rated · 3 exemplars*

- **[AI Kitchen: Child-Readable Ingredient Labels and Transparency Stickers for Failure Anticipation and Reliance Calibration](https://doi.org/10.1145/3772363.3799047)** — chiea-2026 2026 · `9042` · 4.90

  AI Kitchen adopts a coherent kitchen vocabulary—ingredient cards, recipes, testing, traps, and product stickers—and maps its familiar actions directly onto training-data selection, model testing, reliance practice, and transparency export.

- **[FusAIn: Composing Generative AI Visual Prompts Using Pen-based Interaction](https://doi.org/10.1145/3706598.3714027)** — chi-2025 2025 · `3590` · 4.75

  FusAIn makes a familiar pen the prompt-composition surface: designers load it with objects or visual attributes such as color and texture, turning the physical logic of preparing and using drawing tools into operations over a generative specification.

- **[PromptPaint: Steering Text-to-Image Generation Through Paint Medium-like Interactions](https://doi.org/10.1145/3586183.3606777)** — uist-2023 2023 · `13492` · 4.55

  PromptPaint uses paint-medium interactions as the direct steering surface for diffusion-based image generation, replacing model-specific parameter controls with an established vocabulary of artistic media and manipulation.

*Also ranked (7 more, by rater consensus):*

4. [SwipeGANSpace: Swipe-to-Compare Image Generation via Efficient Latent Space Exploration](https://doi.org/10.1145/3640543.3645141) — iui-2024 2024 · `10164` · 4.48
5. [Dasdaq: Reimagining Dreams as Creative Assets in Human-AI Systems](https://doi.org/10.1145/3772363.3798501) — chiea-2026 2026 · `9179` · 4.47
6. [Actionbrushes: Painting with Elemental Dynamics from a Generative Palette](https://doi.org/10.1145/3772363.3798553) — chiea-2026 2026 · `9055` · 4.33
7. [Toyteller: AI-powered Visual Storytelling Through Toy-Playing with Character Symbols](https://doi.org/10.1145/3706598.3713435) — chi-2025 2025 · `3976` · 4.05
8. [DreamGarden: A Designer Assistant for Growing Games from a Single Prompt](https://doi.org/10.1145/3706598.3714233) — chi-2025 2025 · `4190` · 4.03
9. [StepMIND: A Visual Framework for Stepwise, Multimodal, and Bidirectional Explanations of AI-Generated Data Analysis Pipeline](https://doi.org/10.1145/3742413.3789070) — iui-2026 2026 · `10210` · 3.90
10. [From Competition to Collaborative Smelling: Navigating the Olfactory Gap in Human-AI Interaction](https://doi.org/10.1145/3772363.3798626) — chiea-2026 2026 · `9296` · 3.88

## U02 · Initiative & Intervention Timing

*Setting the context* — 184 eligible papers, 184 shortlisted, 5 selected.

**1. [ProMemAssist: Exploring Timely Proactive Assistance Through Working Memory Modeling in Multi-Modal Wearable Devices](https://doi.org/10.1145/3746059.3747770)** — uist-2025 2025 · `13772` · **4.93**

A working-memory model feeds a timing predictor that scores every candidate message and resolves it to deliver-now, defer, or discard, so the moment of appearance is an explicit output of the system rather than the side effect of a detector firing. That makes it the dimension's definitional case: U02 asks when assistance appears and who triggers it, and this is the one candidate whose contribution is that decision itself. Any system with a queue of things it could say — notifications, tutoring hints, driver alerts — can lift the utility-versus-interruption-cost policy directly.

> Chosen over the next candidate because: It leads instead of CatAlyst because CatAlyst's own tiebreak promoted it on what the assistance contains (a generated continuation of the user's work) while its timing rule is a single dwell threshold on detected disengagement — the simplest trigger in the pool.

**2. [Beyond Text Generation: Supporting Writers with Continuous Automatic Text Summaries](https://doi.org/10.1145/3526113.3545672)** — uist-2022 2022 · `13462` · **4.75**

Paragraphwise summaries sit in the margin beside the editor and are recomputed while the writer types, with no invocation step and no commitment of the output into the artifact. It is the continuous mode in its cleanest form — assistance that is always current and never interrupts — and it is the only candidate in the set where every structural element (authored source, invocation-free recompute, spatial adjacency, read-only status) is documented rather than inferred. Any tool with an authored surface and a derivable secondary view can adopt the same always-fresh, never-asked-for arrangement.

> Chosen over the next candidate because: It holds the continuous slot over GestureCoach because GestureCoach's live cue push is structurally the same move as ProMemAssist's proactive delivery, whereas a silently recomputing margin adds a mode the set would otherwise lack.

**3. [HiLDE: Intentional Code Generation via Human-in-the-Loop Decoding](https://doi.org/10.1109/vl-hcc65237.2025.00032)** — vlhcc-2025 2025 · `14006` · **4.60**

The programmer writes a function signature and presses CMD/CTRL+I every time the next fragment of the implementation is wanted, so generation happens only on request and only at the point of writing — the verbatim evidence carries the control, the repetition, and the continuation together. It is the explicitly-summoned mode at an unusual granularity: the user re-summons at each decision point inside one completion rather than once per suggestion, which reframes when a request occurs instead of merely shortcutting it. The pattern transplants anywhere a long generation has internal branch points a user would want to steer.

> Chosen over the next candidate because: It takes the slot over Choice Over Control because that paper's caret sentence does not verify in the full text, it shares a domain and lab with the Continuous Summaries entry at a 0.00 gap, and tab-to-complete-at-the-caret is the default thing anyone would build first.

**4. [Prompting Destiny: Negotiating Socialization and Growth in an LLM-Mediated Speculative Gameworld](https://doi.org/10.1145/3772363.3798749)** — chiea-2026 2026 · `9513` · **3.50**

The system maintains evaluative signals during play but deliberately hides real-time scores, releasing growth feedback as reflective prompts only at the end-of-stage boundary, with a stated rationale of preventing score-chasing. It is the only candidate in the pool where not intervening is the design decision, which is what keeps U02 a dimension about timing rather than a catalogue of triggers — and participants reported the delayed summaries re-framing earlier interactions, so phase two demonstrably acts on phase-one material. Any assist that could fire mid-stream — editing, driving, code review, coaching — can borrow the withhold-then-release structure and its justification.

> Chosen over the next candidate because: It beats TeamVision because TeamVision's evidence shows only a dashboard placed after the simulation with no withholding decision, and its phase one is performed by students while phase two hands controls to educators, whereas Deferred Intervention presumes one actor's activity and then that actor's controls.

**5. [StorySage: Conversational Autobiography Writing Powered by a Multi-Agent Framework](https://doi.org/10.1145/3746059.3747681)** — uist-2025 2025 · `13758` · **2.85**

The interview is packaged into bounded sessions: a session coordinator sets the agenda that opens the next one, a fixed interviewer/scribe/planner/writer flow runs inside it, the session closes with an updated biography, and material from session t is rewritten into questions scoped for session t+1. It is the set's only instance of the session-bound mode the dimension names, and the one case where the system rather than the user imposes the boundary on a process that could have been left running. Monitoring, tutoring, journaling and review tools can all adopt the entry-condition/terminal-state cycle wholesale.

> Chosen over the next candidate because: It beats Poet-Weaver because Poet-Weaver's entire session claim is one figure-caption title that names a session and shows none of the cycle, while StorySage's session structure is carried by its architecture and its documented cross-session scoping.

*Curator note:* Overrides of pattern-level judgements. (1) CatAlyst (4.95, the pool's top score) is out and ProMemAssist leads pat-009: the curator's own tiebreak promoted CatAlyst on what its assistance contains, which is not this dimension's variable, and its timing rule is a single dwell threshold. Both reviewers converged on this. (2) Choice Over Control (4.75) is out and HiLDE holds pat-090: reviewer 1 could not locate its caret sentence in the extracted text, which is the exact ground the curator used to rank it first, and it duplicates the Continuous Summaries domain, lab and score. (3) TeamVision loses the pat-013 slot to Prompting Destiny despite its stronger venue and sample: the reviewers split here, and I followed the one who found that TeamVision's coded quote shows placement-after-the-activity with no withholding, and that its two phases belong to different actors. (4) GPTFootprint (4.55) and Marco (3.95) are both out of pat-012, the former because its panel is a request counter times per-query constants and is explicitly not derived from what the user writes, the latter because its only timing claim is the word 'automatically'. Two patterns went unrepresented: pat-011 Live Activity Output Synchronization, dropped because its best-evidenced candidate (GestureCoach) makes the same push-a-cue-during-a-live-stream move as ProMemAssist, and pat-012 was retained as the continuous mode instead; and no sixth pattern was reachable within five slots. Distrust list: StorySage's coded quote does not verify in the extracted text and its inclusion rests on the surrounding record (session architecture, Fig 1 cycle) rather than on the sentence the writeup was built from, so it is the weakest-evidenced entry here and its writeup should be rebuilt on that other evidence. Prompting Destiny is a late-breaking-work-scale study (n=12) carrying the deferred mode alone. HiLDE's insertion at the caret is implied by the narrative rather than stated, and the paper's figure shows an exploration overlay with an accept step, so output may be previewed rather than inserted directly.

*Near misses:* `2258` CatAlyst: Domain-Extensible Intervention for Preventing Task, `13765` GestureCoach: Rehearsing for Engaging Talks with LLM-Driven , `1960` Visual Captions: Augmenting Verbal Communication with On-the, `4065` TeamVision: An AI-powered Learning Analytics System for Supp, `2002` Choice Over Control: How Users Write with Large Language Mod, `3171` Marco: Supporting Business Document Workflows via Collection, `8356` GPTFootprint: Increasing Consumer Awareness of the Environme

### Patterns in U02

#### pat-009 · Proactive Support

*30 rated · 3 exemplars*

- **[CatAlyst: Domain-Extensible Intervention for Preventing Task Procrastination Using Large Generative Models](https://doi.org/10.1145/3544548.3581133)** — chi-2023 2023 · `2258` · 4.95

  CatAlyst exposes the complete proactive-support structure: it detects halted task progress without a user request and responds by presenting a generated continuation of the user’s work. The state trigger, unsolicited output, and actionable intervention are all explicit, while the domain-extensible design makes the mechanism broadly reusable.

- **[ProMemAssist: Exploring Timely Proactive Assistance Through Working Memory Modeling in Multi-Modal Wearable Devices](https://doi.org/10.1145/3746059.3747770)** — uist-2025 2025 · `13772` · 4.93

  ProMemAssist makes intervention timing an explicit system decision: predicted utility determines whether assistance is spoken immediately, deferred, or discarded. This clearly satisfies the non-user-triggered output signature and contributes a portable policy for balancing timely help against unwanted interruption.

- **[Are We On Track? AI-Assisted Active and Passive Goal Reflection During Meetings](https://doi.org/10.1145/3706598.3714052)** — chi-2025 2025 · `3819` · 4.65

  The system independently identifies when reflective discussion is needed and then surfaces a question with three response options. That internal-decision-to-output edge precisely matches the structural signature, and the structured prompt demonstrates proactive support as an actionable checkpoint rather than a generic alert.

*Also ranked (7 more, by rater consensus):*

4. [Sensing What Surveys Miss: Understanding and Personalizing Proactive LLM Support by User Modeling](https://doi.org/10.1145/3772318.3791191) — chi-2026 2026 · `5473` · 4.60
5. [CoExplorer: Generative AI Powered 2D and 3D Adaptive Interfaces to Support Intentionality in Video Meetings](https://doi.org/10.1145/3613905.3650797) — chiea-2024 2024 · `7490` · 4.52
6. [AROMA: Mixed-Initiative AI Assistance for Non-Visual Cooking by Grounding Multimodal Information Between Reality and Videos](https://doi.org/10.1145/3746059.3747650) — uist-2025 2025 · `13626` · 4.50
7. [The CoExplorer Technology Probe: A Generative AI-Powered Adaptive Interface to Support Intentionality in Planning and Running Video Meetings](https://doi.org/10.1145/3643834.3661507) — dis-2024 2024 · `16313` · 4.47
8. [ClassMeta: Designing Interactive Virtual Classmate to Promote VR Classroom Participation](https://doi.org/10.1145/3613904.3642947) — chi-2024 2024 · `3208` · 4.45
9. [It Warned Me Just at the Right Moment: Exploring LLM-based Real-time Detection of Phone Scams](https://doi.org/10.1145/3706599.3720263) — chiea-2025 2025 · `8078` · 4.43
10. [State Your Intention to Steer Your Attention: An AI Assistant for Intentional Digital Living](https://doi.org/10.1145/3772318.3791404) — chi-2026 2026 · `6155` · 4.35

#### pat-011 · Live Activity Output Synchronization

*30 rated · 3 exemplars*

- **[Visual Captions: Augmenting Verbal Communication with On-the-fly Visuals](https://doi.org/10.1145/3544548.3581566)** — chi-2023 2023 · `1960` · 4.57

  Visual content is generated synchronously with an independently unfolding verbal exchange, so each caption must appear while its corresponding utterance remains current.

- **[GestureCoach: Rehearsing for Engaging Talks with LLM-Driven Gesture Recommendations](https://doi.org/10.1145/3746059.3747705)** — uist-2025 2025 · `13765` · 4.50

  The system continuously tracks rehearsal speech and proactively delivers gesture cues during the passages to which they apply, making the live input, timed output, and intervention point explicit.

- **[StoryDrawer: A Child-AI Collaborative Drawing System to Support Children's Creative Visual Storytelling](https://doi.org/10.1145/3491102.3501914)** — chi-2022 2022 · `965` · 4.42

  Children’s telling unfolds independently while the system transforms it into drawings in real time, preserving the live coupling between narration and visual output without waiting for the story to end.

*Also ranked (7 more, by rater consensus):*

2. [Graphologue: Exploring Large Language Model Responses with Interactive Diagrams](https://doi.org/10.1145/3586183.3606737) — uist-2023 2023 · `13531` · 4.52
5. [It Warned Me Just at the Right Moment: Exploring LLM-based Real-time Detection of Phone Scams](https://doi.org/10.1145/3706599.3720263) — chiea-2025 2025 · `8078` · 4.33
6. [Why So Serious? Exploring Timely Humorous Comments in AAC Through AI-Powered Interfaces](https://doi.org/10.1145/3706598.3714102) — chi-2025 2025 · `4232` · 4.05
7. [ReaLJam: Real-Time Human-AI Music Jamming with Reinforcement Learning-Tuned Transformers](https://doi.org/10.1145/3706599.3720227) — chiea-2025 2025 · `8513` · 4.03
8. [LADICA: A Large Shared Display Interface for Generative AI Cognitive Assistance in Co-located Team Collaboration](https://doi.org/10.1145/3706598.3713289) — chi-2025 2025 · `3620` · 3.98
9. [Just Talk, and Sticky Notes will be Created: Towards Collaborative Dialogue in Face-to-Face Workshops the Experiment with a Generative AI-Based](https://doi.org/10.1145/3706599.3720231) — chiea-2025 2025 · `8423` · 3.95
10. [InterPilot: Exploring the Design Space of AI-assisted Job Interview Support for HR Professionals](https://doi.org/10.1145/3772363.3798373) — chiea-2026 2026 · `9384` · 3.95

#### pat-012 · Live Side Panel

*24 rated · 3 exemplars*

- **[Beyond Text Generation: Supporting Writers with Continuous Automatic Text Summaries](https://doi.org/10.1145/3526113.3545672)** — uist-2022 2022 · `13462` · 4.75

  Continuously recomputed paragraph summaries appear as margin annotations beside the text being authored, making the source, automatic derivation, adjacency, and non-committal commentary role explicit.

- **[GPTFootprint: Increasing Consumer Awareness of the Environmental Impacts of LLMs](https://doi.org/10.1145/3706599.3719708)** — chiea-2025 2025 · `8356` · 4.55

  Its always-visible side panel updates environmental-impact information during the primary activity, clearly establishing persistence, automatic refresh, spatial adjacency, and a read-only derived display.

- **[Marco: Supporting Business Document Workflows via Collection-Centric Information Foraging with Large Language Models](https://doi.org/10.1145/3613904.3641969)** — chi-2024 2024 · `3171` · 3.95

  Interaction in the Notebook View automatically drives derived, collection-level aggregation in a distinct Table View, providing a clear invocation-free and asymmetric dependency between working and commentary regions.

*Also ranked (7 more, by rater consensus):*

4. [Plotania: Exploring Transparency Trade-offs in AI Co-Writing Through Virtual Readers and Transparent Attribution](https://doi.org/10.1145/3772318.3790926) — chi-2026 2026 · `6057` · 4.08
5. [DiagLink: A Dual-User Diagnostic Assistance System by Synergizing Experts with LLMs and Knowledge Graphs](https://doi.org/10.1145/3772318.3791724) — chi-2026 2026 · `5022` · 4.07
6. [InsightLens: Augmenting LLM-Powered Data Analysis With Interactive Insight Management and Navigation](https://doi.org/10.1109/tvcg.2025.3567131) — tvcg-2025 2025 · `12247` · 4.02
7. [AI of Oz: Enhancing Wizard of Oz Studies in HCI with AI Assistance for Human Moderation](https://doi.org/10.1145/3772318.3791324) — chi-2026 2026 · `4871` · 3.92
8. [Visual Story-Writing: Writing by Manipulating Visual Representations of Stories](https://doi.org/10.1145/3746059.3747758) — uist-2025 2025 · `13731` · 3.78
9. [MemoVis: A GenAI-Powered Tool for Creating Companion Reference Images for 3D Design Feedback](https://doi.org/10.1145/3694681) — tochi-2024 2024 · `17103` · 3.67
10. [Exploring the Design Space of Real-time LLM Knowledge Support Systems: A Case Study of Jargon Explanations](https://doi.org/10.1145/3706598.3714262) — chi-2025 2025 · `3830` · 3.63

#### pat-013 · Deferred Intervention

*6 rated · 3 exemplars*

- **[Prompting Destiny: Negotiating Socialization and Growth in an LLM-Mediated Speculative Gameworld](https://doi.org/10.1145/3772363.3798749)** — chiea-2026 2026 · `9513` · 3.50

  The system explicitly suppresses real-time evaluation during play and releases feedback only at the end-of-stage boundary, with a stated rationale—reducing score-chasing—for choosing deferral over continuous intervention.

- **[TeamVision: An AI-powered Learning Analytics System for Supporting Reflection in Team-based Healthcare Simulation](https://doi.org/10.1145/3706598.3713395)** — chi-2025 2025 · `4065` · 2.50

  Its post-simulation analytics dashboard plausibly creates the pattern’s two phases: an uninterrupted simulation followed immediately by a dedicated debrief using information derived from that simulation. The supplied evidence, however, does not explicitly confirm silent observation or retroactive controls.

- **[PRISM: Post-task Reflection via Intelligent Social Multi-agents for Enhancing Learning Experience and Industrial Skill Retention](https://doi.org/10.1145/3772363.3798456)** — chiea-2026 2026 · `9484` · 2.10

  PRISM clearly reserves its assistance for a post-task phase and restructures the completed experience into reflective dialogue, but the evidence does not establish during-task detection, intentional withholding, or controls that revise phase-one material.

*Also ranked (1 more, by rater consensus):*

4. [Opportunities and Barriers for AI Feedback on Meeting Inclusion in Socioorganizational Teams](https://doi.org/10.1145/3772318.3791135) — chi-2026 2026 · `5884` · 1.80

#### pat-082 · Chunked Interaction Sessions

*4 rated · 3 exemplars*

- **[StorySage: Conversational Autobiography Writing Powered by a Multi-Agent Framework](https://doi.org/10.1145/3746059.3747681)** — uist-2025 2025 · `13758` · 2.85

  StorySage is the strongest structural match because it explicitly defines its depicted interaction flow as one session, indicating that autobiographical conversation is organized as a bounded episode rather than an always-open thread. The available excerpt does not establish the session’s entry condition, terminal state, or cross-session reference rules, so the exemplar is strong but incompletely evidenced.

- **[Poet-Weaver: Reflecting on Communication Failure in Personal Relationships With Stylized AI-Generated Conversation Digests](https://doi.org/10.1145/3757646)** — cscw-2025 2025 · `15755` · 2.25

  Poet-Weaver packages sensitive conversation reflection into a named session with its own interaction flow, plausibly turning reflection into a discrete episode. However, the caption alone does not verify a system-imposed close, repeated-session reset, or limits on what subsequent sessions may reference.

- **[HINT: Integration Testing for AI-based features with Humans in the Loop](https://doi.org/10.1145/3490099.3511141)** — iui 2022 · `10028` · 1.55

  HINT deliberately divides an evolving AI experience across successive sessions, making repeated episodes part of how the experience is tested. It is only a weak exemplar: the quote does not demonstrate defined openings and closes, a fixed within-session flow, or session-scoped context, and the sessions may belong to the evaluation protocol rather than the interface itself.

*Also ranked (1 more, by rater consensus):*

4. [StayFocused: Examining the Effects of Reflective Prompts and Chatbot Support on Compulsive Smartphone Use](https://doi.org/10.1145/3613904.3642479) — chi-2024 2024 · `3243` · 1.72

#### pat-090 · On-Demand Suggestion

*17 rated · 3 exemplars*

- **[Choice Over Control: How Users Write with Large Language Models using Diegetic and Non-Diegetic Prompting](https://doi.org/10.1145/3544548.3580969)** — chi-2023 2023 · `2002` · 4.75

  This is the most complete structural match: pressing Tab explicitly requests generation, and the suggestion appears after the current caret in the same text editor.

- **[HiLDE: Intentional Code Generation via Human-in-the-Loop Decoding](https://doi.org/10.1109/vl-hcc65237.2025.00032)** — vlhcc-2025 2025 · `14006` · 4.60

  The programmer invokes a keyboard shortcut precisely when and where each next implementation fragment is wanted, making on-demand continuation an unusually intentional, incremental control strategy.

- **[FigurA11y: AI Assistance for Writing Scientific Alt Text](https://doi.org/10.1145/3640543.3645212)** — iui-2024 2024 · `10179` · 4.10

  The explicitly named Generate at Cursor feature places requested generation within the scientific-alt-text authoring field, closely matching the pattern while applying it to consequential accessibility work.

*Also ranked (7 more, by rater consensus):*

4. [CoAuthor: Designing a Human-AI Collaborative Writing Dataset for Exploring Language Model Capabilities](https://doi.org/10.1145/3491102.3502030) — chi 2022 · `1373` · 3.97
5. [Where to Hide a Stolen Elephant: Leaps in Creative Writing with Multimodal Machine Intelligence](https://doi.org/10.1145/3511599) — tochi-2023 2023 · `17071` · 3.85
6. [Validating AI-Generated Code with Live Programming](https://doi.org/10.1145/3613904.3642495) — chi-2024 2024 · `3068` · 3.45
7. [Wordcraft: Story Writing With Large Language Models](https://doi.org/10.1145/3490099.3511105) — iui-2022 2022 · `10049` · 3.23
8. [Less Redraw, More Explore: Suggestion and Completion for Sketch-to-Image](https://doi.org/10.1145/3772318.3791026) — chi-2026 2026 · `5782` · 3.15
9. [Script&Shift: A Layered Interface Paradigm for Integrating Content Development and Rhetorical Strategy with LLM Writing Assistants](https://doi.org/10.1145/3706598.3714119) — chi-2025 2025 · `3524` · 2.98
10. [Cocoa: Co-Planning and Co-Execution with AI Agents](https://doi.org/10.1145/3772318.3791673) — chi-2026 2026 · `5968` · 2.57

## U03 · Constraints, Guardrails & Reserved Control

*Setting the context* — 168 eligible papers, 168 shortlisted, 5 selected.

**1. [ConstitutionMaker: Interactively Critiquing Large Language Models by Converting Feedback into Principles](https://doi.org/10.1145/3640543.3645144)** — iui-2024 2024 · `10177` · **4.85**

Reacting to an output (kudos, critique, rewrite) is converted into a named principle, and the resulting constitution is what dictates the model's subsequent behavior — the full origin-to-consultation path of a user-authored rule set in one move. It is this dimension's exemplar because the guardrail is neither a hidden system prompt nor a one-shot instruction: it is an inspectable object the user built out of their own dissatisfaction. Anyone building an assistant where users keep re-issuing the same correction can lift it directly.

> Chosen over the next candidate because: Chosen over Policy Maps (13804) because the elicitation-to-principle path is corroborated by a second coded row in the same paper, whereas the Policy Projector if-then quote appears in the full text only in the abstract and an RQ heading.

**2. [ClassMeta: Designing Interactive Virtual Classmate to Promote VR Classroom Participation](https://doi.org/10.1145/3613904.3642947)** — chi-2024 2024 · `3208` · **4.80**

The agent is fully capable of answering and deliberately answers only part, leaving the terminal step of the answer for a student to supply. That is the truncated pipeline at its most literal — the loop cannot close without a human act — which makes it the clearest instance of reserving part of the task for the user. The move transfers to any assistant that would otherwise finish the thought its user was about to have.

> Chosen over the next candidate because: Chosen over rid 3547 because ClassMeta withholds at the level of the answer's construction rather than only its verification, where 3547's withheld value is an ordinary courseware answer key beside a separate predictive-model contribution.

**3. [CreativeConnect: Supporting Reference Recombination for Graphic Design Ideation with Generative AI](https://doi.org/10.1145/3613904.3642794)** — chi-2024 2024 · `2408` · **4.75**

Every generated recombination is emitted uniformly as a line sketch plus a one-line description, so the representation underdetermines the artifact and the designer must supply the specificity by reinterpreting it. It earns its place as the dimension's only instance of restraint imposed at the rendering stage rather than on content or regions — a fidelity ceiling used as a guardrail against fixation. A writing tool emitting outlines instead of prose, or a design tool emitting wireframes instead of mockups, is the same move.

> Chosen over the next candidate because: Chosen over Inkspire (4127) because CreativeConnect's ceiling is uniform ('All system-generated... outputs'), whereas Inkspire shows the high-fidelity render permanently beside the scaffold and so imposes no ceiling at all.

**4. [From Conversation to Human-AI Common Ground: Extracting Cognitive Workflows for Reuse in Sense-making Tasks](https://doi.org/10.1145/3772318.3791669)** — chi-2026 2026 · `5176` · **4.78**

A stored schema requires extracted workflows to take a fixed form — phases linked by dependencies, each phase carrying inputs, activities, decisions and outputs — and the filled schema is then rendered per part on a canvas the user works with. It belongs here rather than in a formatting pattern because the structure is an artifact the user inspects and reuses, satisfying U03's requirement that the constraint be visible in the interface. The phase-and-dependency skeleton is domain-independent and lifts straight into any tool that wants reasoning, not just prose, to come back in a reusable shape.

> Chosen over the next candidate because: Chosen over the narrative-schema system (9312) because that paper is an extended abstract with no evaluation, leaving impact unjudgeable, while this one shows the same pre-declared structure with a working system behind it.

**5. [Style2Fab: Functionality-Aware Segmentation for Fabricating Personalized 3D Models with Generative AI](https://doi.org/10.1145/3586183.3606723)** — uist-2023 2023 · `13551` · **4.45**

The system segments a 3D model, classifies each segment as functional or aesthetic, and then styles only the aesthetic complement — an automatic partition plus enforcement at generation time, the two halves the pattern requires. It is the dimension's sharpest case because crossing the boundary does not merely violate a preference, it breaks the object: a restyled hinge no longer hinges. The generate-around-the-protected-subset structure transplants to text, code, and layout without modification.

> Chosen over the next candidate because: Chosen over CICADA (16164) because the stroke-preservation penalty in that paper is explicitly inherited from prior work by others, while Style2Fab's partition-and-restrict pipeline is the paper's own contribution.

*Curator note:* All five of the dimension's patterns are represented, one exemplar each, so no pattern is stacked and none goes unrepresented. Overrides of pattern-level judgements: (1) rid 623 (IntelliCircos) was ranked second in pat-033 by its curator on structural-signature fidelity, but its grammar is a serialization contract between generator and parser, and pattern-level curation had no reason to test it against U03's boundary, which excludes invisible policies; one reviewer found the token string surfaced to a participant, which is a partial rescue, but not enough to outrank a schema the user demonstrably inspects and reuses. (2) rid 16164 (CICADA) has the most explicit enforcement evidence in the pool, but a reviewer traced the quoted penalty to a background paragraph attributing it to CICADA, ref [24], prior work by others; this paper's own contribution is a study of perceived agency, so it brushes the third disqualifier and yields to Style2Fab. (3) rid 13637 (Semantic Commit) is excluded from both patterns it was seated in: its pat-068 quote is contradicted by its own coded rows, since the Make Change button produces exactly the withheld rewrite, and its pat-067 quote is forward-looking framing prose about AI agents generally rather than evidence about this system. (4) rid 4912 (Quologue) was seated by its own curator at 1.30 after arguing it fails the signature; an exhausted pool is a reason to show fewer exemplars, not to publish a known negative case. What a reader should distrust: no candidate in pat-033 shows nonconforming output being rejected or corrected, so rid 5176 should not be described as validating each generation; rid 10177's evidence shows a principle set dictating behavior but does not establish that principles accumulate across turns or persist across sessions, nor any add/edit/remove/reorder affordance; rid 3208 states an intended participation benefit rather than a measured effect, and nothing proves the interface exposes no reveal control; rid 13551's partition is computed and then user-correctable (segments can be toggled), so it is not purely system-produced; rid 2408's full text in this repo is abstract-only, so the audit CSV is the sole authority for its system-section quote, and it reports design intent rather than measured impact. Two reviewer promotions could not be seated: CodeAid (rid 2978, pat-068) and Roomify (rid 6055, pat-071) are argued convincingly, but the input file carries no bibliographic record for either, and this file may not invent one. Finally, a pipeline fault worth fixing before publication: pat-071 was rated against only two candidate records although the audit CSV reportedly contains six central-role papers, so Protected Region should be re-rated against its full pool.

*Near misses:* `13804` Policy Maps: Tools for Guiding the Unbounded Space of LLM Be, `9312` From Text-First to Structure-First: A Visual Pipeline for Na, `16164` When is a Tool a Tool? User Perceptions of System Agency in , `623` IntelliCircos: A Data-driven and AI-powered Authoring Tool f, `3547` Learning Behaviors Mediate the Effect of AI-powered Support 

### Patterns in U03

#### pat-033 · Output Templates

*30 rated · 3 exemplars*

- **[From Conversation to Human-AI Common Ground: Extracting Cognitive Workflows for Reuse in Sense-making Tasks](https://doi.org/10.1145/3772318.3791669)** — chi-2026 2026 · `5176` · 4.78

  A reusable, independently defined schema requires extracted workflows to take the form of dependency-linked phases with explicit inputs, activities, decisions, and outputs. It is a particularly strong exemplar because the template captures the structure of reasoning itself, not merely the formatting of a response.

- **[IntelliCircos: A Data-driven and AI-powered Authoring Tool for Circos Plots](https://doi.org/10.1111/cgf.70118)** — cgf-2025 2025 · `623` · 4.60

  The system defines a concrete generative grammar with fixed start and end markers, named CIRCOS, RING, and TRACK elements, nesting and cardinality rules, separators, and an outside-to-inside ordering constraint. This is the clearest evidence among the candidates of an output being parseable—and therefore checkable and renderable—against a stored structural contract.

- **[From Text-First to Structure-First: A Visual Pipeline for Narrative Writing](https://doi.org/10.1145/3772363.3799344)** — chiea-2026 2026 · `9312` · 4.52

  Writers visibly choose a reusable narrative schema before generation, and that schema predetermines both the output sections and the function each section must serve. It cleanly demonstrates the section-skeleton form of Output Templates as an interaction-level constraint rather than a hidden prompt convention.

*Also ranked (7 more, by rater consensus):*

2. [Just-In-Time Objectives: A General Approach for Specialized AI Interactions](https://doi.org/10.1145/3772318.3790713) — chi-2026 2026 · `6089` · 4.52
4. [IDEA: Automated Design Space Exploration for Visualization Design](https://doi.org/10.1109/tvcg.2026.3684920) — tvcg-2026 2026 · `13308` · 4.42
6. [GistVis: Automatic Generation of Word-scale Visualizations from Data-rich Documents](https://doi.org/10.1145/3706598.3713881) — chi-2025 2025 · `3405` · 4.23
7. [ToMigo: Interpretable Design Concept Graphs for Aligning Generative AI with Creative Intent](https://doi.org/10.1145/3800645.3813064) — dis-2026 2026 · `16684` · 4.22
8. [Athena: Intermediate Representations for Iterative Scaffolded App Generation with an LLM](https://doi.org/10.1145/3742413.3789133) — iui-2026 2026 · `10198` · 4.12
9. [DashChat: Interactive Authoring of Performance Dashboard Design Prototypes through Conversation with LLM-Powered Agents](https://doi.org/10.1145/3772363.3798634) — chiea-2026 2026 · `9180` · 4.10
10. [Prompt2Task: Automating UI Tasks on Smartphones from Textual Prompts](https://doi.org/10.1145/3716132) — tochi-2025 2025 · `17197` · 4.07

#### pat-067 · User-Authored Rules

*25 rated · 3 exemplars*

- **[ConstitutionMaker: Interactively Critiquing Large Language Models by Converting Feedback into Principles](https://doi.org/10.1145/3640543.3645144)** — iui-2024 2024 · `10177` · 4.85

  ConstitutionMaker turns user feedback into an accumulated, named constitution of principles that governs later model behavior, closely matching the pattern’s user-authored collection and persistent-policy mechanism.

- **[Policy Maps: Tools for Guiding the Unbounded Space of LLM Behaviors](https://doi.org/10.1145/3746059.3747680)** — uist-2025 2025 · `13804` · 4.55

  Policy Projector lets practitioners define custom semantic regions and author explicit if-then rules whose actions are applied to LLM outputs, making the compilation and enforcement of user policy unusually concrete.

- **[Semantic Commit: Helping Users Update Intent Specifications for AI Memory at Scale](https://doi.org/10.1145/3746059.3747778)** — uist-2025 2025 · `13637` · 4.40

  Semantic Commit treats accumulated user intent as project-specific external lists that users update over time, strongly capturing the pattern’s persistent, inspectable collection rather than a one-run instruction.

*Also ranked (7 more, by rater consensus):*

4. [I Want It That Way: Enabling Interactive Decision Support Using Large Language Models and Constraint Programming](https://doi.org/10.1145/3685053) — tiis-2024 2024 · `10383` · 4.13
5. [Surfacing Governing Principles for Chatbots: A Workbench and Comparative Study](https://doi.org/10.1145/3772318.3790612) — chi-2026 2026 · `6238` · 4.05
6. [End User Authoring of Personalized Content Classifiers: Comparing Example Labeling, Rule Writing, and LLM Prompting](https://doi.org/10.1145/3706598.3713691) — chi-2025 2025 · `4067` · 3.93
7. [Editable XAI: Toward Bidirectional Human-AI Alignment with Co-Editable Explanations of Interpretable Attributes](https://doi.org/10.1145/3772318.3791375) — chi-2026 2026 · `5657` · 3.60
8. [PedaCo-Gen: Scaffolding Pedagogical Agency in Human-AI Collaborative Video Authoring](https://doi.org/10.1145/3772363.3798741) — chiea-2026 2026 · `9487` · 3.28
9. [iRULER: Intelligible Rubric-Based User-Defined LLM Evaluation for Revision](https://doi.org/10.1145/3772318.3790539) — chi-2026 2026 · `4889` · 3.07
10. [GenFaceUI: Meta-Design of Generative Personalized Facial Expression Interfaces for Intelligent Agents](https://doi.org/10.1145/3772318.3790653) — chi-2026 2026 · `6307` · 3.05

#### pat-068 · Withheld Answer

*17 rated · 3 exemplars*

- **[ClassMeta: Designing Interactive Virtual Classmate to Promote VR Classroom Participation](https://doi.org/10.1145/3613904.3642947)** — chi-2024 2024 · `3208` · 4.80

  ClassMeta deliberately stops at a partial answer and makes the student supply its completion, directly realizing the truncated-pipeline structure in an observable interaction.

- **[Learning Behaviors Mediate the Effect of AI-powered Support for Metacognitive Calibration on Learning Outcomes](https://doi.org/10.1145/3706598.3713960)** — chi-2025 2025 · `3547` · 4.55

  The system emits the penultimate result—whether the response is correct—but withholds the correct answer after an error, requiring the learner to determine it independently.

- **[Semantic Commit: Helping Users Update Intent Specifications for AI Memory at Scale](https://doi.org/10.1145/3746059.3747778)** — uist-2025 2025 · `13637` · 4.45

  Semantic Commit performs impact analysis but exposes only potential conflicts, reserving the consequential specification changes for the user to formulate and apply.

*Also ranked (7 more, by rater consensus):*

1. [Don't Just Tell Me, Ask Me: AI Systems that Intelligently Frame Explanations as Questions Improve Human Logical Discernment Accuracy over Causal AI explanations](https://doi.org/10.1145/3544548.3580672) — chi-2023 2023 · `2257` · 4.67
5. [From Crafting Text to Crafting Thought: Grounding AI Writing Support to Writing Center Pedagogy](https://doi.org/10.1145/3772318.3790292) — chi-2026 2026 · `4720` · 4.28
6. [CodeAid: Evaluating a Classroom Deployment of an LLM-based Programming Assistant that Balances Student and Educator Needs](https://doi.org/10.1145/3613904.3642773) — chi-2024 2024 · `2978` · 4.10
7. [Actor's Note: Examining the Role of AI-Generated Questions in Character Journaling for Actor Training](https://doi.org/10.1145/3772318.3790370) — chi-2026 2026 · `4880` · 4.08
8. [Interaction Configurations and Prompt Guidance in Conversational AI for Question Answering in Human-AI Teams](https://doi.org/10.1145/3757486) — cscw-2025 2025 · `15684` · 3.85
9. [Designing Human-AI Collaboration to Support Learning in Counterspeech Writing](https://doi.org/10.1109/vl-hcc65237.2025.00052) — vlhcc-2025 2025 · `14026` · 3.80
10. [Belief Explorer: A Preliminary Evaluation of AI-Mediated Socratic Dialogue for Epistemic Reflection](https://doi.org/10.1145/3772363.3799391) — chiea-2026 2026 · `9097` · 3.78

#### pat-071 · Protected Region

*3 rated · 2 exemplars*

- **[Style2Fab: Functionality-Aware Segmentation for Fabricating Personalized 3D Models with Generative AI](https://doi.org/10.1145/3586183.3606723)** — uist-2023 2023 · `13551` · 4.45

  Style2Fab is the cleanest canonical exemplar: functionality-aware segmentation computes a protected set of functional geometry, while generation is restricted to the mutable aesthetic complement so personalization cannot compromise the object’s use.

- **[When is a Tool a Tool? User Perceptions of System Agency in Human-AI Co-Creative Drawing](https://doi.org/10.1145/3563657.3595977)** — dis-2023 2023 · `16164` · 4.42

  CICADA provides exceptionally explicit provenance-based protection: the system treats user-authored strokes as the protected subset and applies a generation-time penalty against moving, overdrawing, or visually occluding them.

#### pat-072 · Low Detail Outlines with User-Filled Specificity

*3 rated · 3 exemplars*

- **[CreativeConnect: Supporting Reference Recombination for Graphic Design Ideation with Generative AI](https://doi.org/10.1145/3613904.3642794)** — chi-2024 2024 · `2408` · 4.75

  This is a near-definitional exemplar: every system-generated recombination is uniformly limited to a line sketch and one-line description, explicitly leaving users to supply specificity through reinterpretation.

- **[Inkspire: Supporting Design Exploration with Generative AI through Analogical Sketching](https://doi.org/10.1145/3706598.3713397)** — chi-2025 2025 · `4127` · 2.90

  Converting AI designs into lower-fidelity sketch scaffolding matches the central move of withholding finish so users can continue elaborating, although the evidence does not establish that this ceiling is uniform or unavoidable.

- **[Dust Off Kindle Highlights With Quologue: Surfacing Personal Data With Generative AI for Reflective Experiences](https://doi.org/10.1145/3772318.3790664)** — chi-2026 2026 · `4912` · 1.30

  This is only a weak boundary case: it deliberately withholds titles, authors, and full quotations so users supply personal meaning, but the mechanism is decontextualization rather than low-fidelity rendering of an artifact awaiting completion.

## U04 · Modality, Embodiment & Rendering

*Taking in the output* — 399 eligible papers, 399 shortlisted, 5 selected.

**1. [Semantic See-through Goggles: Wearing Linguistic Virtual Reality in (Artificial) Intelligence](https://doi.org/10.1145/3742413.3789145)** — iui-2026 2026 · `10281` · **4.80**

A generative chain is spliced between the camera and the head-mounted display: the scene is captured, collapsed into a single line of text, re-generated as an image, and only that mediated image reaches the wearer's eyes. The whole capture-transform-display path is stated verbatim in the abstract, including the absence of a direct-view bypass, which makes this the strongest-evidenced record in the dimension and the only entry where the channel is not augmented but replaced. Any designer wiring a model into a live sensor stream (camera, audio, document feed) can lift the topology directly.

> Chosen over the next candidate because: It beats WebPerceptor because the no-bypass property is stated rather than implied, and beats ShadAR outright because ShadAR's generation happens once at configuration time, leaving ordinary shading in the runtime perceptual path.

**2. [Sonic Stage: Automatically Generating an Interactive Spatial Soundscape to Facilitate Dialogue Video Comprehension for Blind and Low Vision Viewers](https://doi.org/10.1145/3772363.3798425)** — chiea-2026 2026 · `9589` · **4.73**

3D reconstruction resolves where each character is, and their dialogue is then spatialized to those coordinates, so output placement is owned by the moving referent rather than by a fixed panel or channel. Both halves of the signature — a spatial resolution step over referents, and output laid out at the resulting coordinates — appear in one sentence, and the registered surface is audio rather than a rendered overlay, which shows the pattern is about coordinate binding, not about headsets. Lift it for any system where generated commentary must stay attached to a thing that moves.

> Chosen over the next candidate because: It edges Guided Reality because the tracking step makes referent-bound placement explicit rather than static anchoring, and it keeps the dimension from spending a second slot on AR-headset hardware already covered by Semantic See-through Goggles.

**3. [Shape n' Swarm: Hands-on, Shape-aware Generative Authoring with Swarm UI and LLMs](https://doi.org/10.1145/3746059.3747781)** — uist-2025 2025 · `13660` · **4.70**

The user hand-arranges tabletop robots and speaks an instruction; the arrangement is the command, and the same physical robots then perform the generated animation. It is the only complete tangible loop in the file — matter on both the input and the output side — so it demonstrates the physical channel without borrowing a rendered surface anywhere. The move transfers to any actuated-object platform where a spatial configuration can serve as both the prompt and the display.

> Chosen over the next candidate because: It leads its pattern over the refreshable-tactile-display study because the authors built this system, whereas that paper is a Wizard-of-Oz study on commercial hardware the authors neither built nor implemented an agent for.

**4. [Dynamite: Real-Time Debriefing Slide Authoring through AI-Enhanced Multimodal Interaction](https://doi.org/10.1109/vl-hcc65237.2025.00023)** — vlhcc-2025 2025 · `13996` · **4.62**

An instructor circles two chart elements while simultaneously saying "Compare these two keywords", so a drawn referent and a spoken operation are fused into a single request the system must reconcile. This is the only candidate whose evidence shows two channels combined inside one command rather than each channel filling a separate field of a prompt, which is what separates real multimodality from structured prompt composition. Any visual workspace with a pen and a microphone can adopt the referent-by-mark, operation-by-voice split.

> Chosen over the next candidate because: It is chosen over GazePointAR because the fusion happens inside one authored command rather than as query-time disambiguation, and over One Kiss because One Kiss's sketch and emoji channels each own a different property, so nothing is ever arbitrated.

**5. [GeoVisA11y: An AI-based Geovisualization Question-Answering System for Screen-Reader Users](https://doi.org/10.1145/3772318.3790334)** — chi-2026 2026 · `5580` · **3.65**

TAB lands a persistent cursor on a state, and arrow keys then move to the topologically adjacent state — up means Nebraska only because you are currently on Kansas. That state-carrying cursor over a non-linear structure is the load-bearing property of nonvisual traversal, and it is the only candidate in the dimension that demonstrably has one; it is also the dimension's only corner where the whole interface exists without a visual channel. The mechanism generalizes to any graph-shaped artifact a screen-reader user must explore rather than have flattened into a paragraph.

> Chosen over the next candidate because: It stands above SeeChart because SeeChart's coded quote shows N/P pagination between whole charts — a flat list with no position to carry — and above ImageExplorer, whose exploration is continuous finger movement over an image, not a cursor stepped by discrete commands.

*Curator note:* Overrides of pattern-level judgements: (1) pat-061 is led here by Shape n' Swarm rather than the 4.80-rated refreshable-tactile-display paper, because full text shows that paper is a Wizard-of-Oz study on a commercial Graphiti device with a human wizard standing in for the agent — the rubric's third disqualifier is arguably met outright, and the coded quote comes from a participant briefing, not a built mechanism. (2) pat-049 is led by Sonic Stage rather than the curator's third pick (the tangible tea system, rid 9539), whose projected text is the user's own selected phrase, not generated content — it belongs under Tangible Interaction. (3) GeoVisA11y is seated at 3.65, well below fat-pattern third-place candidates, on set-level grounds: pat-064 has only 7 rated papers and a score-ranked cut would leave the dimension with no nonvisual corner at all. Every exemplar leads with a distinct pattern; no pattern is used twice. Unrepresented, and the real cost of this set: pat-043 Embodied Avatar (its best candidate, HAT Swapping, evidences slot occupancy but not that outputs are emitted from the figure, and the corner would otherwise spend a slot restating 'the agent has a body'); pat-062 Voice Interaction (both leading candidates are contested — Rambler's flow is full of pointer and keyboard editing, contradicting the bypass clause, and VoiceAlign inherits its speech channel from the legacy VUI it shims); pat-074, pat-076 and pat-078, the representational-rendering corners, which lost the last slot to spatial registration; and pat-063 and pat-065, each of which has only one surviving credible instance. Distrust: Sonic Stage's movement coupling is entailed by 'track', not stated, and it is an extended abstract; Shape n' Swarm's output half ('the robots perform the authored animation') is entailed by animating tabletop robots rather than separately quoted; GeoVisA11y's quote never shows the spoken response emitted per move — that rests on the paper's screen-reader framing and on pat-074 being coded central on the same record, so do not cite it as evidence of the announcement. None of the five records report user outcomes in the supplied evidence, so every impact claim here is structural.

*Near misses:* `13939` Exploring the impacts of semi-automated storytelling on prog, `9372` Illuminating Memory: Using Ambient Light to Enrich Generativ, `13212` Compendia: Automated Visual Storytelling Generation From Onl, `12692` HAT Swapping: Virtual Agents as Stand-Ins for Absent Human I, `10271` VoiceAlign: A Shimming Layer for Enhancing the Usability of , `9045` AI at your Fingertips: Wearable Ring as a Low-Friction Inter

### Patterns in U04

#### pat-043 · Embodied Avatar

*30 rated · 3 exemplars*

- **[I Felt Bad After We Ignored Her: Understanding How Interface-Driven Social Prominence Shapes Group Discussions with GenAI](https://doi.org/10.1145/3772318.3791881)** — chi-2026 2026 · `5135` · 4.80

  The agent occupies a human seat at the roundtable and speaks from that position, making its rendered body both the locus of its turns and the mechanism that grants it social prominence in group discussion.

- **[HAT Swapping: Virtual Agents as Stand-Ins for Absent Human Instructors in Virtual Training](https://doi.org/10.1109/tvcg.2025.3616749)** — tvcg-2025 2025 · `12692` · 4.65

  The EVA appears in the absent instructor’s place and assumes the instructor’s guidance role, providing an unusually clean example of an agent body occupying a slot ordinarily held by a specific human participant.

- **[Scaffolding Empathy: Training Counselors with Simulated Patients and Utterance-level Performance Visualizations](https://doi.org/10.1145/3706598.3714014)** — chi-2025 2025 · `4423` · 4.55

  The simulated patient receives typed input and emits synthesized speech and animated nonverbal behavior through an embodied conversational figure, clearly making that figure the perceptual source of the agent’s responses.

*Also ranked (7 more, by rater consensus):*

3. [Future You: Designing and Evaluating Multimodal AI-generated Digital Twins for Strengthening Future Self-Continuity](https://doi.org/10.1145/3742413.3789455) — iui-2026 2026 · `10283` · 4.52
5. [Am I Understood?: How the Interplay between Embodiment and Theory of Mind Behavior Affects LLM-Based Conversational Agents on Perceived Trust, Anthropomorphism, Presence, Usability, and User Experience](https://doi.org/10.1145/3774779) — tiis-2026 2026 · `10430` · 4.37
6. [ClassMeta: Designing Interactive Virtual Classmate to Promote VR Classroom Participation](https://doi.org/10.1145/3613904.3642947) — chi-2024 2024 · `3208` · 4.35
7. [FamilyDittos: Reimagining Intergenerational Interaction through Mimetic Agents](https://doi.org/10.1145/3757600) — cscw-2025 2025 · `15764` · 4.33
8. [Design and Evaluation of a Photorealistic AI Virtual Peer in Elementary Collaborative Classroom](https://doi.org/10.1145/3772318.3791450) — chi-2026 2026 · `5784` · 4.32
9. [TeamWise: Exploring Virtually Embodied AI Facilitation for Video-Based Team Onboarding](https://doi.org/10.1145/3772363.3798791) — chiea-2026 2026 · `9621` · 4.32
10. [Building LLM-based AI Agents in Social Virtual Reality](https://doi.org/10.1145/3613905.3651026) — chiea-2024 2024 · `7476` · 4.27

#### pat-049 · Space Registered Overlay

*30 rated · 3 exemplars*

- **[Sonic Stage: Automatically Generating an Interactive Spatial Soundscape to Facilitate Dialogue Video Comprehension for Blind and Low Vision Viewers](https://doi.org/10.1145/3772363.3798425)** — chiea-2026 2026 · `9589` · 4.73

  A particularly complete captured-video instance: 3D reconstruction locates and tracks characters, then positions each character’s dialogue at those scene-derived coordinates, making audio placement depend on the moving referent rather than a fixed channel or panel.

- **[Guided Reality: Generating Visually-Enriched AR Task Guidance with LLMs and Vision Models](https://doi.org/10.1145/3746059.3747784)** — uist-2025 2025 · `13814` · 4.60

  The paper states both halves of the structural signature directly: the system extracts spatial information for real-world interaction points and embeds generated visual guidance at those physical locations.

- **[Reframing Human-AI Interaction through Tangible, Multisensory Interfaces](https://doi.org/10.1145/3772363.3798597)** — chiea-2026 2026 · `9539` · 4.53

  Projected text follows a tracked hand and scales with its proximity, vividly demonstrating that generated language can be laid out as a scene-registered object whose position and appearance continuously follow physical geometry.

*Also ranked (7 more, by rater consensus):*

3. [SocialCue: Exploring the Design Space of Social Wayfinding Assistants for Blind and Low Vision People](https://doi.org/10.1145/3772363.3799011) — chiea-2026 2026 · `9587` · 4.58
5. [Playground+: an AI-MR System for Adaptable Open-Ended Family Physical Activity Play](https://doi.org/10.1145/3772363.3798573) — chiea-2026 2026 · `9504` · 4.52
6. [Visiobo Demo: Augmenting Static Prints with Projection-based Visual Cueing and Concept Mapping via LLM Reasoning](https://doi.org/10.1145/3706599.3721169) — chiea-2025 2025 · `8813` · 4.17
7. [Prop-Chromeleon: Adaptive Haptic Props in Mixed Reality through Generative Artificial Intelligence](https://doi.org/10.1145/3800645.3812978) — dis-2026 2026 · `16821` · 4.08
8. [Prosocial AI Apologies on the Road: Emotional Compensation for Other Drivers' Misbehavior](https://doi.org/10.1145/3772318.3790921) — chi-2026 2026 · `6210` · 3.92
9. [AgentHands: Generating Interactive Hand Gestures for Spatially Grounded Agent Conversations in XR](https://doi.org/10.1145/3772318.3790938) — chi-2026 2026 · `4755` · 3.78
10. [I Am a Blind Seller!: Picture Taking Assistance for Visually Impaired Individuals for Participation as Sellers in Customer to Customer (C2C) Marketplaces](https://doi.org/10.1145/3706599.3720150) — chiea-2025 2025 · `8070` · 3.77

#### pat-050 · Generative Filters

*7 rated · 3 exemplars*

- **[Semantic See-through Goggles: Wearing Linguistic Virtual Reality in (Artificial) Intelligence](https://doi.org/10.1145/3742413.3789145)** — iui-2026 2026 · `10281` · 4.80

  This is the canonical exemplar: live camera imagery crosses from image to text and back to generated image, with only the terminal reconstruction reaching the wearer and no direct-view bypass.

- **[WebPerceptor: An Open Source Chromium Plugin for Real-Time LLM-Based In-Line, In-Browser Re-Writing of Website Content](https://doi.org/10.1145/3772363.3798730)** — chiea-2026 2026 · `9715` · 4.10

  WebPerceptor cleanly transplants the pattern to a text stream: an LLM continuously rewrites web content inline so the generated result occupies the perceptual position of the published page rather than appearing as a separate aid.

- **[ShadAR: LLM-driven shader generation to transform visual perception in Augmented Reality](https://doi.org/10.1145/3772363.3799378)** — chiea-2026 2026 · `9841` · 3.20

  ShadAR places a generated shader directly in the passthrough-video rendering path, making the transformed feed the user's real-time view; it is a valid but less canonical control-flow instance because generation configures the filter rather than reconstructing every frame through a generative model.

*Also ranked (3 more, by rater consensus):*

4. [Don't Detect, Just Correct: Can LLMs Defuse Deceptive Patterns Directly?](https://doi.org/10.1145/3706599.3719683) — chiea-2025 2025 · `8259` · 2.62
5. [From Seeing it to Experiencing it: Interactive Evaluation of Intersectional Voice Bias in Human-AI Speech Interaction](https://doi.org/10.1145/3772363.3798677) — chiea 2026 · `9311` · 2.62
6. [Roomify: Spatially-Grounded Style Transformation for Immersive Virtual Environments](https://doi.org/10.1145/3772318.3791803) — chi-2026 2026 · `6055` · 2.15

#### pat-060 · Multimodal Input

*30 rated · 3 exemplars*

- **[Dynamite: Real-Time Debriefing Slide Authoring through AI-Enhanced Multimodal Interaction](https://doi.org/10.1109/vl-hcc65237.2025.00023)** — vlhcc-2025 2025 · `13996` · 4.62

  This is the clearest structural match: drawn circles or brush marks identify visual referents while simultaneous speech supplies the requested operation, and both channels are fused into one command. The concrete examples make the interaction directly reconstructable and transferable to other visual workspaces.

- **[One Kiss: Emojis as Agents of Genre Flux in Generative Comics](https://doi.org/10.1145/3772363.3798758)** — chiea-2026 2026 · `9476` · 4.50

  One generation request receives two physically distinct input streams with an unusually crisp division of labor: sketched panel frames determine structural pacing, while typed keywords and emojis determine atmosphere. It is a strong example of multimodal input enabling orthogonal control dimensions that either channel alone could not express as effectively.

- **[GazePointAR: A Context-Aware Multimodal Voice Assistant for Pronoun Disambiguation in Wearable Augmented Reality](https://doi.org/10.1145/3613904.3642230)** — chi-2024 2024 · `3217` · 4.43

  GazePointAR fuses speech with gaze, pointing gestures, and conversational context to resolve the referent of a single spoken query. Its channels are load-bearing rather than decorative: embodied signals supply information that the speech request leaves ambiguous, demonstrating multimodal input as an arbitration mechanism.

*Also ranked (7 more, by rater consensus):*

2. [SketchGPT: A Sketch-based Multimodal Interface for Application-Agnostic LLM Interaction](https://doi.org/10.1145/3746059.3747598) — uist-2025 2025 · `13606` · 4.50
5. [SynthScribe: Deep Multimodal Tools for Synthesizer Sound Retrieval and Exploration](https://doi.org/10.1145/3640543.3645158) — iui-2024 2024 · `10124` · 4.35
6. [Using Nonverbal Cues in Empathic Multi-Modal LLM-Driven Chatbots for Mental Health Support MHCI039](https://doi.org/10.1145/3743724) — cscw-2025 2025 · `15386` · 4.28
7. [SketchFlex: Facilitating Spatial-Semantic Coherence in Text-to-Image Generation with Region-Based Sketches](https://doi.org/10.1145/3706598.3713801) — chi-2025 2025 · `4147` · 4.22
8. [JustShape: Exploring Co-Speech Gestures for Multimodal LLM-Powered 3D Parametric Modeling](https://doi.org/10.1145/3772318.3790641) — chi-2026 2026 · `5579` · 4.22
9. [Shape n' Swarm: Hands-on, Shape-aware Generative Authoring with Swarm UI and LLMs](https://doi.org/10.1145/3746059.3747781) — uist-2025 2025 · `13660` · 4.22
10. [DesignPrompt: Using Multimodal Interaction for Design Exploration with Generative AI](https://doi.org/10.1145/3643834.3661588) — dis-2024 2024 · `16260` · 4.22

#### pat-061 · Tangible Interaction

*30 rated · 3 exemplars*

- **[When Refreshable Tactile Displays Meet Conversational Agents: Investigating Accessible Data Presentation and Analysis with Touch and Speech](https://doi.org/10.1109/tvcg.2024.3456358)** — tvcg-2025 2025 · `12008` · 4.80

  A 40-by-60 actuated pin array turns generated graphics into refreshable physical relief that users explore by touch, making material arrangement—not a rendered screen—the load-bearing output channel.

- **[Shape n' Swarm: Hands-on, Shape-aware Generative Authoring with Swarm UI and LLMs](https://doi.org/10.1145/3746059.3747781)** — uist-2025 2025 · `13660` · 4.70

  Users issue spatial commands by physically arranging tabletop robots and supplementing that arrangement with speech, after which the same embodied elements perform the authored animation—a complete tangible input-and-output loop.

- **[Generative Muscle Stimulation: Providing Users with Physical Assistance by Constraining Multimodal-AI with Embodied Knowledge](https://doi.org/10.1145/3772318.3790817)** — chi-2026 2026 · `5322` · 4.50

  The system delivers an AI-generated instruction through EMS-induced finger, wrist, shoulder, and elbow movements, so bodily actuation itself—not a displayed representation—constitutes the output.

*Also ranked (7 more, by rater consensus):*

4. [StoryCube: Tangible Prompt Engineering for Pre-Literate Children](https://doi.org/10.1145/3772363.3799385) — chiea-2026 2026 · `9603` · 4.53
5. [Towards Unobtrusive Physical AI: Augmenting Everyday Objects with Intelligence and Robotic Movement for Proactive Assistance](https://doi.org/10.1145/3746059.3747726) — uist-2025 2025 · `13690` · 4.47
6. [ChatHAP: A Chat-Based Haptic System for Designing Vibrations through Conversation](https://doi.org/10.1145/3706598.3713441) — chi-2025 2025 · `4424` · 4.40
7. [Remembering with Reminiscope: Codesigning with Generative AI for Reminiscence Among Older Adults](https://doi.org/10.1145/3772318.3791390) — chi-2026 2026 · `5385` · 4.32
8. [INDRA: Interactive Deep-dreaming Robotic Artist. Painting with a Real-Time Embodied AI](https://doi.org/10.1145/3706599.3721117) — chiea-2025 2025 · `8793` · 4.12
9. [From Text to Movement: LLM-driven Swarm User Interfaces for Embodied and Interactive Storytelling](https://doi.org/10.1145/3742413.3789128) — iui-2026 2026 · `10240` · 4.12
10. [ChessMate: Intention Disclosure to Support Sense of Agency in Human-Computer Collaboration](https://doi.org/10.1145/3772363.3798799) — chiea-2026 2026 · `9143` · 4.03

#### pat-062 · Voice Interaction

*30 rated · 3 exemplars*

- **[Rambler: Supporting Writing With Speech via LLM-Assisted Gist Manipulation](https://doi.org/10.1145/3613904.3642217)** — chi-2024 2024 · `2940` · 4.93

  Rambler makes speech the entry point for long-form composition, then converts spoken trains of thought into keywords, summaries, and conceptual units that support higher-level revision—an unusually complete and consequential instance of voice replacing typed authoring.

- **[VoiceAlign: A Shimming Layer for Enhancing the Usability of Legacy Voice User Interface Systems](https://doi.org/10.1145/3742413.3789167)** — iui-2026 2026 · `10271` · 4.80

  VoiceAlign is the cleanest match to the structural signature: it captures natural speech, converts it into the command syntax consumed by a legacy system, and forwards the result through a transparent virtual-audio shim.

- **[Orality: A Semantic Canvas for Externalizing and Clarifying Thoughts with Speech](https://doi.org/10.1145/3772318.3791713)** — chi-2026 2026 · `4816` · 4.50

  Orality uses a dedicated speech-input widget to turn iterative spoken thought into a persistent node-link semantic canvas, showing voice as the load-bearing authoring channel rather than merely an auxiliary transcription feature.

*Also ranked (7 more, by rater consensus):*

4. [NaviNote: Enabling In-situ Spatial Annotation Authoring to Support Exploration and Navigation for Blind and Low Vision People](https://doi.org/10.1145/3772318.3790589) — chi-2026 2026 · `5879` · 4.45
5. [Re-Envisioning Instant Photography using Generative AI: An Exploratory Design Probe Using the UnReality Camera](https://doi.org/10.1145/3800645.3812872) — dis-2026 2026 · `16885` · 4.38
6. [StepWrite: Adaptive Planning for Speech-Driven Text Generation](https://doi.org/10.1145/3746059.3747610) — uist-2025 2025 · `13647` · 4.35
7. [SIA: A Framework for Context-Aware Intent Clarification in Speech-Driven Immersive Analytics](https://doi.org/10.1145/3742413.3789063) — iui-2026 2026 · `10270` · 4.07
8. [EnVisionVR: A Scene Interpretation Tool for Visual Accessibility in Virtual Reality](https://doi.org/10.1109/tvcg.2025.3617147) — tvcg-2026 2026 · `12936` · 4.05
9. [Storycaster: An AI System for Immersive Room-based Storytelling](https://doi.org/10.1145/3772318.3791305) — chi-2026 2026 · `5665` · 3.97
10. [DOLLama: Fostering Family Anti-Bullying Learning through AI-Augmented, Toy-Mediated Educational Drama](https://doi.org/10.1145/3772318.3790687) — chi-2026 2026 · `5336` · 3.87

#### pat-063 · Multimodal Output

*26 rated · 3 exemplars*

- **[Language of Zelda: Facilitating Language Learning Practices Using ChatGPT](https://doi.org/10.1145/3613905.3648107)** — chiea-2024 2024 · `8046` · 4.50

  Each NPC dialogue item is immediately rendered in its original form and as an adjacent English translation, cleanly instantiating the pattern’s same-content fan-out across language representations.

- **[Kya family planning after marriage hoti hai?: Integrating Cultural Sensitivity in an LLM Chatbot for Reproductive Health](https://doi.org/10.1145/3706598.3713362)** — chi-2025 2025 · `3456` · 4.40

  A response remains available as text while a text-to-speech button renders that exact response as audio, matching the structural signature with unusually little ambiguity.

- **[Once Upon AI Time: Combining Narrative and Games for Early AI Literacy](https://doi.org/10.1145/3772318.3790471)** — chi-2026 2026 · `6271` · 4.35

  Full voiceover of all displayed text creates systematic, content-preserving duplication across visual and auditory channels while addressing differences in young children’s reading ability.

*Also ranked (7 more, by rater consensus):*

2. [Where to Hide a Stolen Elephant: Leaps in Creative Writing with Multimodal Machine Intelligence](https://doi.org/10.1145/3511599) — tochi-2023 2023 · `17071` · 4.38
4. [AssembleIt: Generating Adaptive On-Demand 3D Animations for Context-Aware Mechanical Assembly Guidance](https://doi.org/10.1145/3800645.3812912) — dis-2026 2026 · `16653` · 4.32
6. [A Home Study of Parent-Child Co-Reading with a Bilingual Conversational Agent](https://doi.org/10.1145/3613905.3650836) — chiea-2024 2024 · `7428` · 4.07
7. [Development of an Adaptive User Support System Based on Multimodal Large Language Models](https://doi.org/10.1109/vl/hcc60511.2024.00044) — vlhcc-2024 2024 · `13958` · 3.90
8. [When Verse Listens Back: Classical Chinese Poetry as a Culturally Grounded Medium for Multimodal AI-Guided Emotional Support](https://doi.org/10.1145/3772363.3798550) — chiea-2026 2026 · `9749` · 3.88
9. [eXplainMR: Generating Real-time Textual and Visual eXplanations to Facilitate UltraSonography Learning in MR](https://doi.org/10.1145/3706598.3714015) — chi-2025 2025 · `3842` · 3.83
10. [What if I Were?: Synthetic Lived Experience based on Generative Models](https://doi.org/10.1145/3772363.3798417) — chiea-2026 2026 · `9725` · 3.80

#### pat-064 · Nonvisual Navigation

*7 rated · 3 exemplars*

- **[GeoVisA11y: An AI-based Geovisualization Question-Answering System for Screen-Reader Users](https://doi.org/10.1145/3772318.3790334)** — chi-2026 2026 · `5580` · 3.65

  GeoVisA11y preserves geographic topology as addressable state nodes and uses a persistent focus cursor with discrete cardinal commands, enabling screen-reader users to traverse the map rather than receive a flattened description.

- **[SeeChart: Enabling Accessible Visualizations Through Interactive Natural Language Interface For People with Visual Impairments](https://doi.org/10.1145/3581641.3584099)** — iui-2023 2023 · `10058` · 2.70

  SeeChart reconstructs multiple charts as addressable items and maintains a cursor that users advance or reverse with dedicated N/P commands in a screen-reader-oriented interface.

- **[ImageExplorer: Multi-Layered Touch Exploration to Encourage Skepticism Towards Imperfect AI-Generated Image Captions](https://doi.org/10.1145/3491102.3501966)** — chi-2022 2022 · `832` · 1.90

  ImageExplorer parses an image into nested object and sub-object nodes and supplies a discrete double-tap command for moving into the hierarchy, giving it part of the pattern's graph-traversal structure.

*Also ranked (1 more, by rater consensus):*

3. [From Struggle to Success: Context-Aware Guidance for Screen Reader Users in Computer Use](https://doi.org/10.1145/3772318.3790661) — chi-2026 2026 · `5950` · 2.05

#### pat-065 · Nonvisual Task Delegation

*1 rated · 1 exemplars*

- **[AI at your Fingertips: Wearable Ring as a Low-Friction Interface for Agentic AI](https://doi.org/10.1145/3772363.3798736)** — chiea-2026 2026 · `9045` · 3.40

  The paper explicitly centers a screenless, “fire-and-forget” handoff, directly supporting the pattern’s complete nonvisual delegation and subsequent disengagement; however, the excerpt does not establish the full initiation–specification–termination sequence or prove that monitoring and mid-flight correction are impossible.

#### pat-074 · Non-Readable to Natural Language Conversion

*30 rated · 3 exemplars*

- **[Exploring the impacts of semi-automated storytelling on programmers' comprehension of software histories](https://doi.org/10.1109/vl/hcc60511.2024.00025)** — vlhcc-2024 2024 · `13939` · 4.55

  This is the most literal realization of the pattern: an existing non-prose list view is explicitly converted by GPT-4 into a narrative paragraph that serves as the readable output.

- **[ViSTAR: Virtual Skill Training with Augmented Reality with 3D Avatars and LLM coaching agent](https://doi.org/10.1145/3772318.3790634)** — chi-2026 2026 · `4727` · 4.50

  ViSTAR maps spatio-temporal joint features—machine-readable measurements of physical movement—into concise natural-language coaching cues that users can immediately act upon.

- **[EchoScriptor: Automatic Lifelogging Narratives via Activity-Based Audio-Language Model](https://doi.org/10.1145/3772318.3791528)** — chi 2026 · `6267` · 4.46

  EchoScriptor supplies an unusually concrete conversion pipeline: each ten-second audio segment becomes a short natural-language account of the activities and environmental sounds it contains.

*Also ranked (7 more, by rater consensus):*

3. [RAVEN: Realtime Accessibility in Virtual ENvironments for Blind and Low-Vision People](https://doi.org/10.1145/3772318.3791616) — chi-2026 2026 · `5807` · 4.40
5. [PANDALens: Towards AI-Assisted In-Context Writing on OHMD During Travels](https://doi.org/10.1145/3613904.3642320) — chi-2024 2024 · `2508` · 4.32
6. [TableNarrator: Making Image Tables Accessible to Blind and Low Vision People](https://doi.org/10.1145/3706598.3714329) — chi-2025 2025 · `4200` · 4.32
7. [MIND: Empowering Mental Health Clinicians with Multimodal Data Insights through a Narrative Dashboard](https://doi.org/10.1145/3772318.3790529) — chi-2026 2026 · `5222` · 4.28
8. [SeeChart: Enabling Accessible Visualizations Through Interactive Natural Language Interface For People with Visual Impairments](https://doi.org/10.1145/3581641.3584099) — iui-2023 2023 · `10058` · 4.28
9. [Look Here, Click Me: Improving Older Adults' Perception of Manipulable User Interface Components through AI-Based Perceptual Guidance](https://doi.org/10.1145/3772363.3798878) — chiea-2026 2026 · `9421` · 4.22
10. [EnVisionVR: A Scene Interpretation Tool for Visual Accessibility in Virtual Reality](https://doi.org/10.1109/tvcg.2025.3617147) — tvcg-2026 2026 · `12936` · 4.20

#### pat-076 · Perceptible Rendering

*20 rated · 3 exemplars*

- **[Keyframer: A Design Probe for Exploring LLM Assistance in 2D Animation Design](https://doi.org/10.1109/vl-hcc65237.2025.00014)** — vlhcc-2025 2025 · `13987` · 4.55

  Keyframer cleanly separates an imperceptible generated representation from its display layer: completed LLM-generated CSS is combined with the fixed source SVG and rendered as an inline animation that users can directly judge. The evidence identifies the representation, rendering operation, fixed asset, and displayed result.

- **[AgentHands: Generating Interactive Hand Gestures for Spatially Grounded Agent Conversations in XR](https://doi.org/10.1145/3772318.3790938)** — chi-2026 2026 · `4755` · 4.45

  AgentHands exposes the full temporal rendering pipeline: symbolic events are parsed into time-stamped poses and motions, then a distinct animation system renders synchronized, perceptible hands. It is a particularly strong exemplar of the pattern’s time-varying case and transfers readily to avatars, trajectories, and embodied agents.

- **[Illuminating Memory: Using Ambient Light to Enrich Generative Representations of Daily Life](https://doi.org/10.1145/3772363.3798359)** — chiea-2026 2026 · `9372` · 4.35

  The system maps model-produced RGB parameters and duration into perceptible ambient light through a fixed application-and-fade routine. This is an unusually pure physical-display instance: numeric output remains inaccessible as the intended experience until the designer-chosen lighting renderer embodies it.

*Also ranked (7 more, by rater consensus):*

2. [From Embeddings to Exploration: Engineering Interactive Latent Space Visualizations for AI Model Sensemaking EICS012](https://doi.org/10.1145/3816764) — cscw-2026 2026 · `15884` · 4.43
5. [Usable and Fast Interactive Mental Face Reconstruction](https://doi.org/10.1145/3586183.3606795) — uist-2023 2023 · `13524` · 4.23
6. [ViSTAR: Virtual Skill Training with Augmented Reality with 3D Avatars and LLM coaching agent](https://doi.org/10.1145/3772318.3790634) — chi-2026 2026 · `4727` · 4.02
7. [IKIWISI: An Interactive Visual Pattern Generator for Evaluating the Reliability of Vision-Language Models Without Ground Truth](https://doi.org/10.1145/3715336.3735754) — dis-2025 2025 · `16494` · 3.97
8. [GazeFlow: Personalized Ambient Soundscape Generation for Passive Strabismus Self-Monitoring](https://doi.org/10.1145/3772363.3798882) — chiea-2026 2026 · `9321` · 3.78
9. [Narrative Player: Reviving Data Narratives With Visuals](https://doi.org/10.1109/tvcg.2025.3530512) — tvcg-2025 2025 · `12458` · 3.42
10. [VidTune: Creating Video Soundtracks with Generative Music and Video-Based Thumbnails](https://doi.org/10.1145/3772318.3791572) — chi-2026 2026 · `5828` · 3.32

#### pat-078 · Composite Glyph

*9 rated · 3 exemplars*

- **[Compendia: Automated Visual Storytelling Generation From Online Article Collection](https://doi.org/10.1109/tvcg.2026.3663204)** — tvcg-2026 2026 · `13212` · 4.15

  The cluster glyph has an explicit, enumerable mapping: one radial bar encodes fact count and another encodes contributing-article count, making it the only candidate whose evidence directly establishes both named components and their geometric channels.

- **[MetaGlyph: Automatic Generation of Metaphoric Glyph-based Visualization](https://doi.org/10.1109/tvcg.2022.3209447)** — tvcg-2023 2023 · `10886` · 3.90

  MetaGlyph makes the design of purpose-built glyphs with explicit data mappings and encoding channels the system’s central contribution, and its automatic generation approach strongly demonstrates the pattern’s transferability.

- **[FlowForge: Guiding the Creation of Multi-Agent Workflows with Design Space Visualization as a Thinking Scaffold](https://doi.org/10.1109/tvcg.2025.3634627)** — tvcg-2026 2026 · `12859` · 3.45

  FlowForge explicitly contributes a novel per-solution glyph designed to jointly encode two named properties—abstraction level and computational cost—making the mark itself a meaningful comparison mechanism.

*Also ranked (3 more, by rater consensus):*

4. [Conch: Competitive Debate Analysis via Visualizing Clash Points and Hierarchical Strategies](https://doi.org/10.1109/tvcg.2025.3634629) — tvcg-2026 2026 · `12851` · 3.22
5. [NonbAInary: How Does AI Depict Gender?](https://doi.org/10.1145/3772363.3799150) — chiea-2026 2026 · `9837` · 3.00
6. [MAICO: A Visualization Design Study on AI-Assisted Music Composition](https://doi.org/10.1109/tvcg.2025.3539779) — tvcg-2025 2025 · `12275` · 3.00

## U07 · Explanation, Inspection & Verification

*Taking in the output* — 361 eligible papers, 361 shortlisted, 5 selected.

**1. [NeuroSync: Intent-Aware Code-Based Problem Solving via Direct LLM Understanding Modification](https://doi.org/10.1145/3746059.3747668)** — uist-2025 2025 · `13743` · **4.95**

Before it writes any code, the system externalizes what it thinks the user asked for - the coding tasks and their inferred relationships - as a directly manipulable object, and the user corrects that readback rather than re-wording the prompt. This is the dimension's sharpest case of a representation whose whole purpose is letting a person check the machine's construal at the point where a misreading is still cheap to fix. Any system that infers structure from an underspecified request (spec drafting, data cleaning, task delegation) can lift the emit-then-correct-the-readback channel unchanged.

> Chosen over the next candidate because: IntentFlow makes the same move with a different artifact shape, but only NeuroSync's evidence states in one sentence that the corrected understanding is what conditions generation ('prior to code generation').

**2. [AI Chains: Transparent and Controllable Human-AI Interaction by Chaining Large Language Model Prompts](https://doi.org/10.1145/3491102.3517582)** — chi-2022 2022 · `1322` · **4.90**

The steps of an LLM pipeline and their intermediate results are materialized as readable, editable modules, so inspection happens on the execution architecture itself rather than on a finished answer. It earns its place because it is the dimension's general case - the intermediate is not one stage of a domain pipeline but the way the system runs - and it anchors the pre-2023 end of an otherwise 2024-2026 set. Any multi-step agent or pipeline builder can adopt the step-as-inspectable-object structure directly.

> Chosen over the next candidate because: DesignPrompt shows the same materialized intermediate but only inside one prompt-construction step, and its figure caption implies rather than states that the edited prompt is what generation consumes.

**3. [An AI-Resilient Text Rendering Technique for Reading and Skimming Documents](https://doi.org/10.1145/3613904.3642699)** — chi-2024 2024 · `3246` · **4.85**

Every word is rendered in a lightness that encodes the stage at which recursive compression would have cut it, so a model's judgment about importance is laid over the artifact without removing a single word of it. It is the one candidate that satisfies the pattern's strict clause - marks equal content units, and stripping the encoding restores the document exactly - which makes it the dimension's model for showing an AI assessment while leaving the evidence intact for the reader to overrule. Directly transferable to any per-unit model score over text: uncertainty, provenance, relevance, risk.

> Chosen over the next candidate because: HaLLMark encodes a rarer property (authorship provenance) but only as a two-category span highlight; on the quote's face its human-authored text carries no value, so the exhaustive per-unit map is only 3246's.

**4. [How Does Attention Work in Vision Transformers? A Visual Analytics Attempt](https://doi.org/10.1109/tvcg.2023.3261935)** — tvcg-2023 2023 · `11111` · **4.70**

The Head Importance View shows every attention head under selectable importance metrics and lets the user dissect a head by partially pruning it, so the internals are manipulated rather than merely projected. It represents the 'internals' half of the dimension that nothing else in this set touches, and it is the only candidate where the inspection view carries its own controls - metric choice, per-unit comparison, an ablation - instead of being a static scatterplot. The metric-selector-plus-ablation structure transfers to any inspection UI over computed internals, from retrieval scoring to feature attribution.

> Chosen over the next candidate because: AttentionViz is the better-known system, but its evidence is a one-sentence tool introduction that names a joint embedding and enumerates no controls, comparison, or ablation - the exact half of the signature that separates this pattern from a generic projection.

**5. [ReaLJam: Real-Time Human-AI Music Jamming with Reinforcement Learning-Tuned Transformers](https://doi.org/10.1145/3706599.3720227)** — chiea-2025 2025 · `8513` · **4.58**

The agent continually predicts how the performance will unfold and shows that plan on a waterfall of upcoming chords, so the user reads what the system is about to do while it is doing it. It covers the 'planned actions' branch of the dimension and is its only real-time, non-textual case: verification here has to happen inside a few hundred milliseconds, which is the hardest version of the problem the dimension poses. The lookahead display generalizes to any agent whose next actions matter before they land - driving, live translation, autocomplete, task agents about to act.

> Chosen over the next candidate because: DreamGarden's node-based tree shows plan editing but not execution advancing through the displayed plan, which is the persistence clause that distinguishes this pattern from the editable-intermediate patterns already represented by AI Chains.

*Curator note:* Five patterns of thirteen are represented; one exemplar per pattern, no pattern taken twice, no repeated system. Overrides of pattern-level judgements: (1) pat-051's leader rid 4085 was set aside - the first reviewer showed its ranking sentence ('the supplied evidence also indicates improved decision-making skills') is absent from the coded evidence, and both reviewers note the paper is a Prolific vignette study whose own record codes pat-054 central, so it sits between two patterns; rid 17234 is the better pat-051 instance but its token-level uncertainty highlighting is the same inline per-unit encoding move as 3246, so pat-051 went unrepresented rather than duplicating it. (2) pat-036's Automatic Histograms (rid 7464) has the cleanest evidence in the whole dimension and was still dropped: aggregate-select-filter-detail is the default thing a designer builds first (criterion 5 floor) and is documented far outside this cookbook, whereas the internals and plan-preview branches are named in the dimension's own description and had no other route in. (3) pat-001 goes unrepresented on set grounds: the reviewers between them show its lead candidate rid 8598 is the pattern's flagged source-link extension and the fourth mark-then-hover paper in the pool, and rid 2553's three-region mapping rests on a figure caption alone. Unrepresented patterns: pat-001, pat-031, pat-036, pat-037, pat-051, pat-053, pat-054, pat-055. Distrust list for writeups: 1322's rendering evidence comes from a quote coded to a different pattern (pat-086) in the same paper, so its 4.9 is not wholly earned inside pat-020; 8513's coded quote establishes only the persistence clause - ordering, editability and provisional-versus-committed encoding come from a reviewer's full-text reading, not from the coded record, so do not describe the waterfall's controls; 11111 does not prove the strict cached-state clause (that a control re-derives the view without rerunning the task); no candidate in this dimension has a verified outcome magnitude, so impact claims are plausible, not measured. Three candidates should be treated as disqualified rather than merely low: rid 3579 (coded quote is a textbook definition with citations, and the paper has no LLM component), rid 5199 (the Cognitive Bias Index is a user-set generation parameter and an offline evaluation metric, never a displayed readout), rid 13808 (the coded pat-031 quote only names the system; the mechanism its writeup describes is assembled from quotes coded to other patterns).

*Near misses:* `7464` Automatic Histograms: Leveraging Language Models for Text Da, `17234` Generation Probabilities Are Not Enough: Uncertainty Highlig, `9410` Learning to Delegate and Act with DELEGACT: Multimodal Langu, `9215` Disclose with Care: AI Scaffolds for Privacy in Chatbot Inte, `8356` GPTFootprint: Increasing Consumer Awareness of the Environme, `2553` Generating Automatic Feedback on UI Mockups with Large Langu

### Patterns in U07

#### pat-001 · Linked Views

*30 rated · 3 exemplars*

- **[Traceable Texts and Their Effects: A Study of Summary-Source Links in AI-Generated Summaries](https://doi.org/10.1145/3706599.3719830)** — chiea-2025 2025 · `8598` · 4.72

  Hovering a summary phrase highlights its mapped source passages, exposing a stable output-to-evidence correspondence at the exact moment a reader may want to verify the generated claim. It is a particularly clear exemplar of the catalogue’s source-output extension of Linked Views.

- **[Generating Automatic Feedback on UI Mockups with Large Language Models](https://doi.org/10.1145/3613904.3642782)** — chi-2024 2024 · `2553` · 4.63

  Clicking a link in textual feedback selects the same UI object in both the visual mockup and the Layers panel. This gives a complete trigger–identity mapping–coordinated response across three differently encoded regions and turns abstract critique into inspectable context.

- **[CodeVoyager: Integrating Interactive Visual Aids with LLMs for Code Comprehension](https://doi.org/10.1145/3742413.3789057)** — iui-2026 2026 · `10239` · 4.60

  A code entity appears simultaneously as a call-graph node and a source segment, and selecting the node highlights the mapped code automatically. The quote supplies the complete structural signature in a canonical, highly transferable form.

*Also ranked (7 more, by rater consensus):*

2. [GenTune: Toward Traceable Prompts to Improve Controllability of Image Refinement in Environment Design](https://doi.org/10.1145/3746059.3747774) — uist-2025 2025 · `13643` · 4.58
5. [InsightChaser: Enhancing Visual Reasoning of Sports Tactical Visualization with Visual-Text Linking](https://doi.org/10.1109/tvcg.2025.3634639) — tvcg-2026 2026 · `12837` · 4.42
6. [LayerFlow : Layer-wise Exploration of LLM Embeddings using Uncertainty-aware Interlinked Projections](https://doi.org/10.1111/cgf.70123) — cgf-2025 2025 · `627` · 4.37
7. [Inspo: Writing with Crowds Alongside AI](https://doi.org/10.1145/3706599.3720193) — chiea-2025 2025 · `8404` · 4.32
8. [AgentLens: Visual Analysis for Agent Behaviors in LLM-Based Autonomous Systems](https://doi.org/10.1109/tvcg.2024.3394053) — tvcg-2025 2025 · `12281` · 4.28
9. [The HaLLMark Effect: Supporting Provenance and Transparent Use of Large Language Models in Writing with Interactive Visualization](https://doi.org/10.1145/3613904.3641895) — chi-2024 2024 · `2937` · 4.22
10. [From Conversation to Human-AI Common Ground: Extracting Cognitive Workflows for Reuse in Sense-making Tasks](https://doi.org/10.1145/3772318.3791669) — chi-2026 2026 · `5176` · 4.20

#### pat-020 · Inspectable Intermediate Steps

*30 rated · 3 exemplars*

- **[AI Chains: Transparent and Controllable Human-AI Interaction by Chaining Large Language Model Prompts](https://doi.org/10.1145/3491102.3517582)** — chi-2022 2022 · `1322` · 4.90

  LLM intermediate results are materialized as readable, modifiable modules within an executable prompt chain, so user changes propagate structurally into later stages rather than merely annotating a finished output.

- **[DesignPrompt: Using Multimodal Interaction for Design Exploration with Generative AI](https://doi.org/10.1145/3643834.3661588)** — dis-2024 2024 · `16260` · 4.70

  The system converts multimodal input into a visible model-facing prompt whose segments users can edit and reorder, making the intermediate representation concrete, legible, and consequential for generation.

- **[SimStep: Human-in-the-Loop Authoring of Interactive Educational Simulations Through Task-Level Abstractions](https://doi.org/10.1145/3772318.3791514)** — chi-2026 2026 · `5855` · 4.60

  SimStep surfaces three named task-level graph abstractions as intermediate objects that teachers inspect, edit, and verify while authoring the eventual simulation, replacing opaque generation with reviewable semantic stages.

*Also ranked (7 more, by rater consensus):*

3. [Athena: Intermediate Representations for Iterative Scaffolded App Generation with an LLM](https://doi.org/10.1145/3742413.3789133) — iui-2026 2026 · `10198` · 4.58
5. [PedaCo-Gen: Scaffolding Pedagogical Agency in Human-AI Collaborative Video Authoring](https://doi.org/10.1145/3772363.3798741) — chiea-2026 2026 · `9487` · 4.47
6. [ORCA: ORchestrating Causal Agent](https://doi.org/10.1145/3772363.3798444) — chiea-2026 2026 · `9472` · 4.38
7. [BISCUIT: Scaffolding LLM-Generated Code with Ephemeral UIs in Computational Notebooks](https://doi.org/10.1109/vl/hcc60511.2024.00012) — vlhcc-2024 2024 · `13926` · 4.33
8. [DeckFlow: Specification Decomposition on a Multimodal Generative Canvas](https://doi.org/10.1109/vl-hcc65237.2025.00027) — vlhcc-2025 2025 · `14001` · 4.30
9. [RAG Without the Lag: Enabling "What-If" Analysis for Retrieval-Augmented Generation Pipelines](https://doi.org/10.1145/3772318.3790874) — chi-2026 2026 · `4820` · 4.27
10. [ARify: Leveraging Narrated Instructional Videos to Create Augmented Reality Tutorials for Procedural Tasks](https://doi.org/10.1145/3772318.3790715) — chi-2026 2026 · `5489` · 4.27

#### pat-025 · Interpretation Readback

*37 rated · 3 exemplars*

- **[NeuroSync: Intent-Aware Code-Based Problem Solving via Direct LLM Understanding Modification](https://doi.org/10.1145/3746059.3747668)** — uist-2025 2025 · `13743` · 4.95

  NeuroSync is the clearest complete instance: it infers coding tasks and relationships from user intent, externalizes them before code generation, and lets users correct that intermediate understanding directly so the corrected artifact governs downstream generation.

- **[IntentFlow: Investigating Fluid Dynamics of Intent Communication in Generative AI](https://doi.org/10.1145/3800645.3812999)** — dis-2026 2026 · `16862` · 4.78

  IntentFlow turns vague user input into a named, structured interpretation—a high-level goal and low-level intents—and renders that interpretation as editable components, cleanly locating correction at the inferred-representation layer.

- **[PlayWrite: A Multimodal System for AI Supported Narrative Co-Authoring Through Play in XR](https://doi.org/10.1145/3772318.3791159)** — chi-2026 2026 · `5558` · 4.68

  PlayWrite supplies an unusually complete and legible mechanism: embodied actions are interpreted into named Intent Frames, visualized persistently as story marbles, and rearranged at the interpretation layer before shaping the narrative.

*Also ranked (7 more, by rater consensus):*

2. [Just-In-Time Objectives: A General Approach for Specialized AI Interactions](https://doi.org/10.1145/3772318.3790713) — chi-2026 2026 · `6089` · 4.82
4. [Semantic Commit: Helping Users Update Intent Specifications for AI Memory at Scale](https://doi.org/10.1145/3746059.3747778) — uist-2025 2025 · `13637` · 4.72
5. [What It Wants Me To Say: Bridging the Abstraction Gap Between End-User Programmers and Code-Generating Large Language Models](https://doi.org/10.1145/3544548.3580817) — chi-2023 2023 · `1457` · 4.70
6. [ToMigo: Interpretable Design Concept Graphs for Aligning Generative AI with Creative Intent](https://doi.org/10.1145/3800645.3813064) — dis-2026 2026 · `16684` · 4.68
7. [ExpressEdit: Video Editing with Natural Language and Sketching](https://doi.org/10.1145/3640543.3645164) — iui-2024 2024 · `10153` · 4.58
9. [GlassMail: Towards Personalised Wearable Assistant for On-the-Go Email Creation on Smart Glasses](https://doi.org/10.1145/3643834.3660683) — dis-2024 2024 · `16234` · 4.28
10. [IntentPrism: Human-AI Intent Manifestation for Web Information Foraging](https://doi.org/10.1145/3706599.3719744) — chiea-2025 2025 · `8405` · 4.15

#### pat-028 · Plan Preview

*16 rated · 3 exemplars*

- **[ReaLJam: Real-Time Human-AI Music Jamming with Reinforcement Learning-Tuned Transformers](https://doi.org/10.1145/3706599.3720227)** — chiea-2025 2025 · `8513` · 4.58

  The continually refreshed visual anticipation is the clearest evidence that a forthcoming plan remains visible and relevant while execution unfolds, directly satisfying the pattern’s distinctive persistence requirement.

- **[Demonstrating DreamGarden: A Designer Assistant for Growing Games from a Single Prompt](https://doi.org/10.1145/3706599.3721282)** — chiea-2025 2025 · `8770` · 4.48

  Its node-based action-plan tree is a concrete, persistent planning object that users can prune and expand, making planned operations inspectable and consequentially editable rather than merely announced.

- **[Learning to Delegate and Act with DELEGACT: Multimodal Language Models for Task-Level Human Cobot Planning in Industrial Assembly](https://doi.org/10.1145/3772363.3798803)** — chiea-2026 2026 · `9410` · 4.32

  Editable atomic-task allocations, explicit validation, step-by-step instructions, and individually triggered cobot actions form the strongest evidenced preview-to-commit sequence, with unusually meaningful consequences for what physically executes.

*Also ranked (7 more, by rater consensus):*

1. [SketchGPT: A Sketch-based Multimodal Interface for Application-Agnostic LLM Interaction](https://doi.org/10.1145/3746059.3747598) — uist-2025 2025 · `13606` · 4.42
5. [Cocoa: Co-Planning and Co-Execution with AI Agents](https://doi.org/10.1145/3772318.3791673) — chi-2026 2026 · `5968` · 4.28
6. [LightVA: Lightweight Visual Analytics With LLM Agent-Based Task Planning and Execution](https://doi.org/10.1109/tvcg.2024.3496112) — tvcg-2025 2025 · `12415` · 4.25
7. [From Operation to Cognition: Automatic Modeling Cognitive Dependencies from User Demonstrations for GUI Task Automation](https://doi.org/10.1145/3706598.3713356) — chi-2025 2025 · `3512` · 4.10
8. [What Are You Doing?: Effects of Intermediate Feedback from Agentic LLM In-Car Assistants During Multi-Step Processing](https://doi.org/10.1145/3772318.3790997) — chi-2026 2026 · `6148` · 3.83
9. [DynEx: Dynamic Code Synthesis with Structured Design Exploration for Accelerated Exploratory Programming](https://doi.org/10.1145/3706598.3714115) — chi-2025 2025 · `3392` · 3.70
10. [DreamGarden: A Designer Assistant for Growing Games from a Single Prompt](https://doi.org/10.1145/3706598.3714233) — chi-2025 2025 · `4190` · 2.78

#### pat-031 · Pre-Send Inspection

*10 rated · 3 exemplars*

- **[Disclose with Care: AI Scaffolds for Privacy in Chatbot Interviews](https://doi.org/10.1145/3772363.3798850)** — chiea-2026 2026 · `9215` · 3.60

  The system inserts a user-side review checkpoint after composition but before sharing, where post-editing directly determines the transmitted interview material. It strongly demonstrates gating and payload-changing control, although the evidence does not show system-computed annotations or scores.

- **[Imago Obscura: An Image Privacy AI Co-pilot to Enable Identification and Mitigation of Risks](https://doi.org/10.1145/3746059.3747633)** — uist-2025 2025 · `13808` · 3.70

  The system assesses an intended outgoing image for privacy risks and enables the user to mitigate those risks by editing the payload before sharing. This captures the pattern’s assess-inspect-edit sequence, though the evidence does not prove that sharing is technically gated by the inspection state.

- **[Raising Awareness of Location Information Vulnerabilities in Social Media Photos using LLMs](https://doi.org/10.1145/3706598.3714074)** — chi-2025 2025 · `4036` · 3.60

  The app identifies system-detectable location disclosures in photos, presents those risks for reflection, and provides concealment actions that can alter the outgoing image. The inspection-and-repair loop is clear, but the quote does not establish a mandatory review state or send action originating from it.

*Also ranked (3 more, by rater consensus):*

4. [Standardized Soul: A Mixed-Methods Study on the Efficacy and User Perception of AI-Augmented Peer Support (AAPS) in College Mental Health Support](https://doi.org/10.1145/3772363.3798796) — chiea-2026 2026 · `9597` · 3.27
5. [Rescriber: Smaller-LLM-Powered User-Led Data Minimization for LLM-Based Chatbots](https://doi.org/10.1145/3706598.3713701) — chi-2025 2025 · `3606` · 3.10
6. [CareJournal: A Voice-Based Conversational Agent for Supporting Care Communications](https://doi.org/10.1145/3613904.3642163) — chi-2024 2024 · `2685` · 2.43

#### pat-036 · Overview-plus-Detail

*30 rated · 3 exemplars*

- **[Automatic Histograms: Leveraging Language Models for Text Dataset Exploration](https://doi.org/10.1145/3613905.3650798)** — chiea-2024 2024 · `7464` · 4.60

  A distribution summarizes many text examples, and selecting an entity directly filters the linked table to the individual examples containing it. This is the clearest complete match to the aggregate-selection-detail signature.

- **[Compendia: Automated Visual Storytelling Generation From Online Article Collection](https://doi.org/10.1109/tvcg.2026.3663204)** — tvcg-2026 2026 · `13212` · 4.50

  The Thematic Overview aggregates all extracted facts into clusters, while selecting a cluster opens the Story View for detailed exploration of precisely that cluster's facts.

- **[Malleable Overview-Detail Interfaces](https://doi.org/10.1145/3706598.3714164)** — chi-2025 2025 · `3579` · 4.10

  The excerpt explicitly establishes asymmetric levels over one collection: an overview of items and key attributes, followed by an in-depth view of the selected individual item.

*Also ranked (7 more, by rater consensus):*

4. [Meridian: A Design Framework for Malleable Overview-Detail Interfaces](https://doi.org/10.1145/3746059.3747654) — uist-2025 2025 · `13793` · 4.28
5. [StoryCrafter: A Graph-Based Co-Creative AI System Supporting Parental Story Re-Authoring](https://doi.org/10.1145/3772363.3798778) — chiea-2026 2026 · `9602` · 4.12
6. [LLM Comparator: Visual Analytics for Side-by-Side Evaluation of Large Language Models](https://doi.org/10.1145/3613905.3650755) — chiea-2024 2024 · `7627` · 4.05
7. [JailbreakHunter: A Visual Analytics Approach for Jailbreak Prompts Discovery From Large-Scale Human-LLM Conversational Datasets](https://doi.org/10.1109/tvcg.2025.3557568) — tvcg-2025 2025 · `12537` · 3.88
8. [MIND: Empowering Mental Health Clinicians with Multimodal Data Insights through a Narrative Dashboard](https://doi.org/10.1145/3772318.3790529) — chi-2026 2026 · `5222` · 3.87
9. [AttentionViz: A Global View of Transformer Attention](https://doi.org/10.1109/tvcg.2023.3327163) — tvcg-2024 2024 · `11339` · 3.80
10. [LLM Comparator: Interactive Analysis of Side-by-Side Evaluation of Large Language Models](https://doi.org/10.1109/tvcg.2024.3456354) — tvcg-2025 2025 · `11975` · 3.80

#### pat-037 · Unit Visualization Views

*31 rated · 3 exemplars*

- **[VITALITY: Promoting Serendipitous Discovery of Academic Literature with Transformers & Visual Analytics](https://doi.org/10.1109/tvcg.2021.3114820)** — tvcg-2022 2022 · `10481` · 4.30

  VITALITY is the cleanest structural match: an interactive visualization canvas directly renders a two-dimensional UMAP projection of literature embeddings, making the computed spatial arrangement an explicit exploratory surface for discovery.

- **[MAICO: A Visualization Design Study on AI-Assisted Music Composition](https://doi.org/10.1109/tvcg.2025.3539779)** — tvcg-2025 2025 · `12275` · 4.20

  MAICO shows the collection-level mechanism unusually well: every music sample appears simultaneously as a dot in a similarity-based space, and the user explores that space to obtain an overview rather than navigating a list of samples.

- **[Anthology: AI-Augmented Sensemaking Interface to Reduce Radicalization in Conversations](https://doi.org/10.1145/3772363.3799062)** — chiea-2026 2026 · `9072` · 4.10

  Anthology places all topical utterances into one semantic landscape where proximity has an explicit meaning— thematic similarity—and overlays shapes and colors to expose narrative clusters, making neighborhoods directly useful for inspecting a complex conversation.

*Also ranked (7 more, by rater consensus):*

2. [PromptMagician: Interactive Prompt Engineering for Text-to-Image Creation](https://doi.org/10.1109/tvcg.2023.3327168) — tvcg-2024 2024 · `11342` · 4.13
5. [DKMap: Interactive Exploration of Vision-Language Alignment in Multimodal Embeddings via Dynamic Kernel Enhanced Projection](https://doi.org/10.1109/tvcg.2025.3642641) — tvcg-2026 2026 · `12805` · 3.95
6. [ConvoMap: Interactive Visualizations for Exploring Complex Conversations in Multi-Agent Systems](https://doi.org/10.1109/vl-hcc65237.2025.00043) — vlhcc-2025 2025 · `14017` · 3.93
7. [ModalChorus: Visual Probing and Alignment of Multi-Modal Embeddings via Modal Fusion Map](https://doi.org/10.1109/tvcg.2024.3456387) — tvcg-2025 2025 · `11956` · 3.92
8. [Latent Space Map for Visual Utilization of Generated Data](https://doi.org/10.1109/tvcg.2025.3614247) — tvcg-2025 2025 · `12750` · 3.88
9. [ConceptViz: A Visual Analytics Approach for Exploring Concepts in Large Language Models](https://doi.org/10.1109/tvcg.2025.3634806) — tvcg-2026 2026 · `12770` · 3.85
10. [Metaphorian: Leveraging Large Language Models to Support Extended Metaphor Creation for Science Writing](https://doi.org/10.1145/3563657.3595996) — dis-2023 2023 · `16043` · 3.83

#### pat-038 · Model Internals View

*26 rated · 3 exemplars*

- **[How Does Attention Work in Vision Transformers? A Visual Analytics Attempt](https://doi.org/10.1109/tvcg.2023.3261935)** — tvcg-2023 2023 · `11111` · 4.70

  This is the strongest structural match: it exposes attention heads as internal units, supports comparison through selectable importance metrics, and lets users probe those quantities through partial pruning.

- **[AttentionViz: A Global View of Transformer Attention](https://doi.org/10.1109/tvcg.2023.3327163)** — tvcg-2024 2024 · `11339` · 4.40

  It turns transformer queries and keys into a scalable joint embedding where users can interactively explore self-attention as an analytical object rather than inspect only model outputs.

- **[Interactive and Visual Prompt Engineering for Ad-hoc Task Adaptation with Large Language Models](https://doi.org/10.1109/tvcg.2022.3209479)** — tvcg-2023 2023 · `10953` · 4.20

  PromptIDE directly surfaces and compares the ranks of defined answer choices, a non-emitted inference quantity explicitly covered by the pattern and readily transferable to constrained-generation and classification workflows.

*Also ranked (7 more, by rater consensus):*

4. [HiLDE: Intentional Code Generation via Human-in-the-Loop Decoding](https://doi.org/10.1109/vl-hcc65237.2025.00032) — vlhcc-2025 2025 · `14006` · 4.10
5. [-generAItor: Tree-in-the-loop Text Generation for Language Model Explainability and Adaptation](https://doi.org/10.1145/3652028) — tiis-2024 2024 · `10375` · 4.00
6. [KEditVis: A Visual Analytics System for Knowledge Editing of Large Language Models](https://doi.org/10.1109/tvcg.2026.3694436) — tvcg-2026 2026 · `13184` · 4.00
7. [VisQA: X-raying Vision and Language Reasoning in Transformers](https://doi.org/10.1109/tvcg.2021.3114683) — tvcg-2022 2022 · `10527` · 3.88
8. [Visual Explanation for Open-Domain Question Answering With BERT](https://doi.org/10.1109/tvcg.2023.3243676) — tvcg-2024 2024 · `11632` · 3.87
9. [TELL-ME: Toward Personalized Explanations of Large Language Models](https://doi.org/10.1145/3706599.3719982) — chiea-2025 2025 · `8558` · 3.53
10. [Exploring the Hidden Layers of Image Synthesis through Material-Driven Design Workshops with Fashion and Textile Practitioners](https://doi.org/10.1145/3800645.3813012) — dis-2026 2026 · `16818` · 3.40

#### pat-051 · Elements for Process Disclosure

*30 rated · 3 exemplars*

- **[Contrastive Explanations That Anticipate Human Misconceptions Can Improve Human Decision-Making Skills](https://doi.org/10.1145/3706598.3713229)** — chi-2025 2025 · `4085` · 4.88

  The system pairs each AI decision with removable process metadata—either its contributing features or a contrast against the likely human response—while leaving the underlying recommendation intact.

- **[Generation Probabilities Are Not Enough: Uncertainty Highlighting in AI Code Completions](https://doi.org/10.1145/3702320)** — tochi-2025 2025 · `17234` · 4.72

  Token-level highlighting binds pipeline-derived uncertainty directly to the relevant parts of a code completion, with distinct encodings for low generation likelihood and predicted human editing.

- **[iRULER: Intelligible Rubric-Based User-Defined LLM Evaluation for Revision](https://doi.org/10.1145/3772318.3790539)** — chi-2026 2026 · `4889` · 4.60

  Clickable Why and Why Not controls reveal complementary justification for an evaluation result without changing the evaluated output, making disclosure optional and tightly bound to that result.

*Also ranked (7 more, by rater consensus):*

2. [Cognitive Forcing for Better Decision-Making: Reducing Overreliance on AI Systems Through Partial Explanations](https://doi.org/10.1145/3710946) — cscw-2025 2025 · `15305` · 4.58
5. [Making the Making Visible: How Process Evidence and Individual Differences Affect People's Creativity Judgments of Text-to-Image Generative AI](https://doi.org/10.1145/3742413.3789101) — iui 2026 · `10291` · 4.28
6. [Are You Really Sure? Understanding the Effects of Human Self-Confidence Calibration in AI-Assisted Decision Making](https://doi.org/10.1145/3613904.3642671) — chi-2024 2024 · `2711` · 4.18
7. [Diegetic Explanations for Uncertain Sensing: Materializing Confidence and Jitter in Generative Visual Feedback](https://doi.org/10.1145/3772363.3798809) — chiea-2026 2026 · `9211` · 4.18
8. [OnGoal: Tracking and Visualizing Conversational Goals in Multi-Turn Dialogue with Large Language Models](https://doi.org/10.1145/3746059.3747746) — uist-2025 2025 · `13702` · 4.18
9. [Who Did What? Designing Avatars for Explainable Multi-Agent Systems in Knowledge Work](https://doi.org/10.1145/3800645.3812981) — dis-2026 2026 · `16711` · 4.17
10. [Phraselette: A Poet's Procedural Palette](https://doi.org/10.1145/3715336.3735832) — dis-2025 2025 · `16593` · 4.10

#### pat-052 · Color Coded Content

*26 rated · 3 exemplars*

- **[An AI-Resilient Text Rendering Technique for Reading and Skimming Documents](https://doi.org/10.1145/3613904.3642699)** — chi-2024 2024 · `3246` · 4.85

  Each word carries its recursive-compression stage through text lightness, producing an unusually exact one-to-one encoding that preserves the document’s wording, order, and layout while revealing a continuous importance hierarchy.

- **[The HaLLMark Effect: Supporting Provenance and Transparent Use of Large Language Models in Writing with Interactive Visualization](https://doi.org/10.1145/3613904.3641895)** — chi-2024 2024 · `2937` · 4.40

  Orange and green styling encodes AI-written and AI-influenced spans directly in the intact document, making authorship provenance inspectable without a separate annotation region.

- **[Generation Probabilities Are Not Enough: Uncertainty Highlighting in AI Code Completions](https://doi.org/10.1145/3702320)** — tochi-2025 2025 · `17234` · 4.30

  Uncertainty is attached to individual code tokens and rendered on those tokens in place, closely matching the pattern while helping programmers locate potentially consequential completion errors.

*Also ranked (7 more, by rater consensus):*

4. [Annota: Peer-based AI Hints Towards Learning Qualitative Coding at Scale](https://doi.org/10.1145/3640543.3645168) — iui-2024 2024 · `10149` · 4.30
5. [FinFlier: Automating Graphical Overlays for Financial Visualizations With Knowledge-Grounding Large Language Model](https://doi.org/10.1109/tvcg.2024.3514138) — tvcg-2025 2025 · `12428` · 4.20
6. [InterFlow: Designing Unobtrusive AI to Empower Interviewers in Semi-Structured Interviews](https://doi.org/10.1145/3772318.3790866) — chi-2026 2026 · `5284` · 4.18
7. [Every Persona Has Their Palette: Persona-Based Color Highlighting for Emotional Expression in Text Chat](https://doi.org/10.1145/3772363.3799029) — chiea-2026 2026 · `9244` · 4.17
8. [Affective Typography: The Effect of AI-Driven Font Design on Empathetic Story Reading](https://doi.org/10.1145/3544549.3585625) — chiea-2023 2023 · `6838` · 4.12
9. [Leveraging Large Language Models to Enhance Domain Expert Inclusion in Data Science Workflows](https://doi.org/10.1145/3613905.3651115) — chiea-2024 2024 · `7634` · 4.00
10. [Leveraging Learner Errors in Digital Argumentation Learning: How ALure Helps Students Learn from their Mistakes and Write Better Arguments](https://doi.org/10.1145/3711023) — cscw 2025 · `15232` · 3.97

#### pat-053 · Artifact Flagging and Annotations

*17 rated · 3 exemplars*

- **[Iffy-or-Not: Critically Evaluating Potential Misinformation Using Fallacy Detection and Socratic Questioning with LLMs](https://doi.org/10.1145/3771935)** — tochi-2026 2026 · `17256` · 4.53

  Fallacious spans are persistently highlighted in the source text, while hovering over an individual highlight reveals attached detail, giving a direct and consequential example of the complete mark-trigger-detail structure.

- **[Paper Plain: Making Medical Research Papers Approachable to Healthcare Consumers with Natural Language Processing](https://doi.org/10.1145/3589955)** — tochi-2023 2023 · `17002` · 4.40

  Underlined technical terms provide lightweight source-localized flags, and clicking one opens a tooltip containing both its definition and provenance reference, making the interaction unusually explicit and reconstructable.

- **[Marvista: Exploring the Design of a Human-AI Collaborative News Reading Tool](https://doi.org/10.1145/3609331)** — tochi-2023 2023 · `17083` · 4.28

  Answer-bearing sentences are highlighted inline, and hovering over each marked sentence discloses its corresponding question, cleanly staging a per-unit relationship that supports question-guided reading.

*Also ranked (7 more, by rater consensus):*

4. [DevTales: A Tool for Providing Narrative Code Histories into Developer Workflows](https://doi.org/10.1109/vl-hcc65237.2025.00013) — vlhcc-2025 2025 · `13986` · 4.08
5. [ReviewFlow: Intelligent Scaffolding to Support Academic Peer Reviewing](https://doi.org/10.1145/3640543.3645159) — iui-2024 2024 · `10129` · 4.07
6. [DataDive: Supporting Readers' Contextualization of Statistical Statements with Data Exploration](https://doi.org/10.1145/3640543.3645155) — iui-2024 2024 · `10160` · 3.93
7. [Explainable Notes: Examining How to Unlock Meaning in Medical Notes with Interactivity and Artificial Intelligence](https://doi.org/10.1145/3613904.3642573) — chi-2024 2024 · `2867` · 3.75
8. [SenseMate: An Accessible and Beginner-Friendly Human-AI Platform for Qualitative Data Analysis](https://doi.org/10.1145/3640543.3645194) — iui-2024 2024 · `10181` · 3.20
9. [Skeptik: A Hybrid Framework for Combating Potential Misinformation in Journalism](https://doi.org/10.1145/3766891) — tiis-2026 2026 · `10419` · 2.58
10. [Rescriber: Smaller-LLM-Powered User-Led Data Minimization for LLM-Based Chatbots](https://doi.org/10.1145/3706598.3713701) — chi-2025 2025 · `3606` · 1.90

#### pat-054 · Paired (Human-AI) Assessment

*22 rated · 3 exemplars*

- **[Designing Human-AI Collaboration to Support Learning in Counterspeech Writing](https://doi.org/10.1109/vl-hcc65237.2025.00052)** — vlhcc-2025 2025 · `14026` · 4.45

  The user commits selections before the system evaluates them, and the interface then computes correctness and provides a side-by-side view that makes differences in interpretation directly inspectable.

- **[Are You Really Sure? Understanding the Effects of Human Self-Confidence Calibration in AI-Assisted Decision Making](https://doi.org/10.1145/3613904.3642671)** — chi-2024 2024 · `2711` · 4.30

  It provides an especially clean commit-reveal-redecide sequence: the user records an initial judgment and confidence, receives the AI recommendation and potentially its confidence, and then makes a final judgment.

- **[Adjust for Trust: Mitigating Trust-Induced Inappropriate Reliance on AI Assistance](https://doi.org/10.1145/3742413.3789136)** — iui-2026 2026 · `10282` · 4.20

  The interface preserves an independent human decision, reveals AI advice for the same problem, solicits a revised decision, and then connects observed accuracy to an explicit trust update.

*Also ranked (7 more, by rater consensus):*

4. [More Isn't Always Better: Balancing Decision Accuracy and Conformity Pressures in Multi-AI Advice](https://doi.org/10.1145/3772318.3791648) — chi-2026 2026 · `5765` · 4.20
5. [To Rely or Not to Rely? Evaluating Interventions for Appropriate Reliance on Large Language Models](https://doi.org/10.1145/3706598.3714097) — chi-2025 2025 · `4139` · 4.17
6. [ConvScale: Conversational Interviews for Scale-Aligned Measurement](https://doi.org/10.1145/3772363.3798684) — chiea-2026 2026 · `9169` · 4.13
7. [Designing for Appropriate Reliance: The Roles of AI Uncertainty Presentation, Initial User Decision, and User Demographics in AI-Assisted Decision-Making](https://doi.org/10.1145/3637318) — cscw-2024 2024 · `14746` · 4.12
8. [Understanding the Effects of AI-Assisted Critical Thinking on Human-AI Decision Making](https://doi.org/10.1145/3772318.3790785) — chi-2026 2026 · `4733` · 3.85
9. [Towards Human-AI Deliberation: Design and Evaluation of LLM-Empowered Deliberative AI for AI-Assisted Decision-Making](https://doi.org/10.1145/3706598.3713423) — chi-2025 2025 · `3661` · 3.62
10. [Redefining Research Crowdsourcing: Incorporating Human Feedback with LLM-Powered Digital Twins: Incorporating Human Feedback with LLM-Powered Digital Twins](https://doi.org/10.1145/3706599.3720269) — chiea-2025 2025 · `8514` · 3.52

#### pat-055 · Aggregated Summary Score

*5 rated · 3 exemplars*

- **[GPTFootprint: Increasing Consumer Awareness of the Environmental Impacts of LLMs](https://doi.org/10.1145/3706599.3719708)** — chiea-2025 2025 · `8356` · 2.80

  The Eco Score is explicitly presented as one scalar on a fixed 0–100 scale, directly establishing the pattern’s bounded summary-score readout, though the evidence does not reveal its inputs, accumulation rule, update behavior, or visual prominence.

- **[CoBRA: Programming Cognitive Bias in Social Agents Using Classic Social Science Experiments](https://doi.org/10.1145/3772318.3790804)** — chi-2026 2026 · `5199` · 2.50

  The Cognitive Bias Index clearly performs the pattern’s defining many-to-one reduction by quantifying an agent’s reactions across a set of experiments, but the evidence does not establish a bounded scale, persistent UI display, headline prominence, or streaming updates.

- **[NeuroWise: A Multi-Agent LLM "Glass-Box" System for Practicing Double-Empathy Communication with Autistic Partners](https://doi.org/10.1145/3772363.3798437)** — chiea-2026 2026 · `9465` · 2.10

  The Stress Bar supplies a prominent-looking single 0–100% value that updates after each message, but the excerpt identifies it as current stress and never demonstrates an accumulator over message history, making it a borderline neighboring state-gauge example.

## U05 · Alternatives & Comparative Exploration

*Acting on the output* — 215 eligible papers, 215 shortlisted, 5 selected.

**1. [DataDive: Supporting Readers' Contextualization of Statistical Statements with Data Exploration](https://doi.org/10.1145/3640543.3645155)** — iui-2024 2024 · `10160` · **4.78**

For one statistical statement the system forks into several LLM-generated guiding questions, shows them together in a side panel, and selecting one commits: it drives the data match and the visualization that follows. This is the dimension's cleanest single-decision-point gallery because the choice is not cosmetic, it determines what is explored next. Anyone whose system produces several equally plausible framings of the same request can lift the shape: emit the framings as questions, show them as a set, let the selection be the branch commit.

> Chosen over the next candidate because: Over AnnotateGPT (6169), whose four options are guesses at what the user's own annotation meant rather than alternative outputs held before commitment, so the generated artifact is never actually forked.

**2. [Visual Analysis of Prediction Uncertainty in Neural Networks for Deep Image Synthesis](https://doi.org/10.1109/tvcg.2024.3406959)** — tvcg-2025 2025 · `12304` · **4.35**

The user assigns two uncertainty-estimation methods to slots from a drop-down, their heatmaps are placed in parallel regions, and the views are linked so selecting a region in one highlights the same region in the others. That linkage is the part most side-by-side designs omit: parallel placement alone makes differences visible, corresponding-part alignment makes them readable. The mechanism is domain-free — selected pair, parallel slots, brushed correspondence — and transplants to any two comparable renderings of the same underlying object.

> Chosen over the next candidate because: Over VideoDiff (4474), which scores higher but whose alignment-and-diff claim rests on an abstract sentence with simultaneous display unconfirmed and a toggle coded on the same record, while 12304's slot assignment, parallel placement and alignment are each stated outright in the full text.

**3. [Spellburst: A Node-based Interface for Exploratory Creative Coding with Natural Language Prompts](https://doi.org/10.1145/3586183.3606719)** — uist-2023 2023 · `13588` · **4.95**

Alternatives are the interface: a node graph in which branching and merging are first-class operations, so variations coexist as visible lineages instead of overwriting one another, and the exploration history is preserved. It is the only candidate in the pool where alternatives recombine rather than merely accumulate, which is the non-obvious half of branching and the reason it beats a plain undo tree. Any tool whose users iterate by 'try this instead' can adopt the move: keep prior generations as addressable parents, make forking and merging explicit acts rather than version-control chores.

> Chosen over the next candidate because: Over Branchat (9118), which names the fork control more precisely but only lets branches coexist, where Spellburst also lets them rejoin without destroying their separate histories.

**4. [From Text to Pixels: Enhancing User Understanding through Text-to-Image Model Explanations](https://doi.org/10.1145/3640543.3645173)** — iui-2024 2024 · `10126` · **4.60**

Keywords are redacted from a prompt the model has already run, the model is rerun on the altered prompt, and the altered image is scored and displayed against the original with a keyword heat map keyed to what was removed. This is the only candidate that closes the whole loop — transformation, rerun, joined original-versus-variant display — so the comparison set is manufactured by the interface rather than found, and the manipulated dimension organizes the display. The signature carries far past image generation: a spreadsheet what-if sweep, a compiler flag sweep, or an injected-decoy retrieval audit is the same machine.

> Chosen over the next candidate because: Over the counterfactual-generation system (12842), which evidences richer user-authored perturbation rules but neither the rerun nor the paired display, i.e. the comparison half of Perturb-and-Compare.

**5. [Investigating Semantically-enhanced Exploration of GAN Latent Space via a Digital Mood Board](https://doi.org/10.1145/3544549.3585740)** — chiea-2023 2023 · `7000` · **4.70**

On a mood board the user draws a selection around one group of images, clicks a pop-up 'mix' icon, selects a second group, clicks again, and gets a style mixture of the two — operand selection and operator invocation are visibly separate acts, twice over, with the operator named in the UI. This is the dimension's fusion move rather than its choice move: alternatives are combined instead of one being picked and the rest discarded. Any system holding a set of retained generations can add it — make the items selectable, put the combining operation on the canvas next to them, return the result into the same space.

> Chosen over the next candidate because: Over VoiceForge (8644), whose weight sliders expose continuous position between operands but whose operands are reference recordings and product a synthesized voice, so 'same space as the arguments' is inferred from modality rather than shown.

*Curator note:* Five slots, six patterns, so the set covers five patterns one apiece and leaves pat-006 Multi-Model Output Comparison unrepresented. That is the deliberate override. Both reviewers argued pat-006 must hold a slot because it is the thinnest pattern (10 rated) and its one surviving candidate, DSCode Comparator (10200), is fully evidenced — but on screen 10200 makes the same move as 12304: an input is held, several generators or methods produce comparable outputs, and the outputs are read side by side. The only difference is that 10200's slot occupants are LLMs and 12304's are uncertainty-estimation methods. Given 'no two exemplars making the same design move in different words', one had to go, and 12304 additionally evidences brushed corresponding-part alignment and user slot assignment, which 10200 does not. A reader who wants the held-input fan-out framing specifically should go to 10200 first.

Other pattern-level judgements overridden: pat-004's curator ranked 4474 (4.70) and 10955 (4.40) above 12304 (4.35); I took the lowest-scored of the three because it is the only one whose full signature was confirmed against full text, 10955's supposed comparison-mode control turned out to be inherited juxtaposition/superposition vocabulary rather than a user-facing mechanism, and 4474's simultaneity is curator inference from an abstract. pat-002's curator promoted 6169 into its top three; a reviewer reading the full text found its four options are intent classification of the user's annotation, not forked outputs, so nothing from pat-002 beyond DataDive was considered. 7136 (Tip-Pong) and 4519 (MoWa) were treated as disqualified on reviewer full-text checks — the first is a Wizard-of-Oz probe with scripted conversational stimuli, the second's three-model fan-out belongs to a formative-study stimulus set with different prompts per model, not to the tool.

Distrust list. 12304's slot-assignment claim comes from a pat-006 row on the same record at medium confidence, not from its pat-004 quote. Spellburst's non-destructiveness is corroborated by a second coded row rather than quoted, and no evidence anywhere on the record shows a control for switching which path is active — treat that clause as unverified. 10126's transformation reads as system-driven ('systematically redacts'); nothing shows the user authoring or parameterizing the redaction, so the 'user-specified transformation rule' half of the pattern is unevidenced here. 7000 shows no continuous control between operands and, like every pat-041 candidate, no evidence that a fused result can become a later operand. None of the five supplies measured user outcomes for the comparison mechanism itself.

ChainForge (2325) appeared twice, under pat-006 and pat-007; it is absent from the final set entirely, which incidentally resolves the repeated-system violation, but its coded workflow varies model and prompt template together and so evidences neither pattern cleanly.

*Near misses:* `10200` DSCode Comparator: An Interactive Interface for Comparing Mo, `4474` VideoDiff: Human-AI Video Co-Creation with Alternatives, `9118` Branchat: A Tree-Structured Interface for Efficient Revisita, `12842` Understanding Large Language Model Behaviors Through Interac, `8644` VoiceForge: A Text-Driven Character Voice Generation System , `16267` DanceGen: Supporting Choreography Ideation and Prototyping w

### Patterns in U05

#### pat-002 · Candidate Gallery

*30 rated · 3 exemplars*

- **[DataDive: Supporting Readers' Contextualization of Statistical Statements with Data Exploration](https://doi.org/10.1145/3640543.3645155)** — iui-2024 2024 · `10160` · 4.78

  DataDive generates multiple contextual questions for one statistical statement, presents them as alternatives, and lets the user select one to initiate the corresponding visualization and data exploration. The evidence captures the candidate fork, visible choice, single selection, and downstream commitment with unusual completeness.

- **[AnnotateGPT: Designing Human-AI Collaboration in Pen-Based Document Annotation](https://doi.org/10.1145/3772318.3790867)** — chi-2026 2026 · `6169` · 4.50

  AnnotateGPT proposes four same-type annotation purposes, the user selects one, and that choice triggers a second agent to generate feedback. This is a particularly clean account of multiplicity being resolved through one selection that commits the workflow downstream.

- **[You Know What I'm Saying: Designing Conversational Strategies of AI Agent for Tip of the Tongue Phenomenon](https://doi.org/10.1145/3544549.3585670)** — chiea-2023 2023 · `7136` · 4.52

  The agent presents three potentially relevant answers together in a conversational turn, and the participant chooses among them to resolve the current uncertainty. The fixed candidate count, same-type alternatives, and direct selection make the gallery structure readily reconstructable from the evidence.

*Also ranked (7 more, by rater consensus):*

2. [Preference-Guided Prompt Optimization for Text-to-Image Generation](https://doi.org/10.1145/3772318.3791443) — chi-2026 2026 · `5922` · 4.60
5. [Marvista: Exploring the Design of a Human-AI Collaborative News Reading Tool](https://doi.org/10.1145/3609331) — tochi-2023 2023 · `17083` · 4.37
6. [I Thought It Through, I Built It Whole!': An AI-Powered Tool to Support Children's Engineering Thinking Activities in the Family Context](https://doi.org/10.1145/3772363.3798952) — chiea-2026 2026 · `9368` · 4.30
7. [MineVRA: Exploring the Role of Generative AI-Driven Content Development in XR Environments through a Context-Aware Approach](https://doi.org/10.1109/tvcg.2025.3549160) — tvcg-2025 2025 · `12236` · 4.13
8. [3DALL-E: Integrating Text-to-Image AI in 3D Design Workflows](https://doi.org/10.1145/3563657.3596098) — dis-2023 2023 · `16163` · 4.08
9. [Choice Over Control: How Users Write with Large Language Models using Diegetic and Non-Diegetic Prompting](https://doi.org/10.1145/3544548.3580969) — chi-2023 2023 · `2002` · 4.05
10. [Grounding with Structure: Exploring Design Variations of Grounded Human-AI Collaboration in a Natural Language Interface](https://doi.org/10.1145/3686902) — cscw-2024 2024 · `14978` · 4.00

#### pat-004 · Side-by-Side Comparison

*23 rated · 3 exemplars*

- **[VideoDiff: Human-AI Video Co-Creation with Alternatives](https://doi.org/10.1145/3706598.3713417)** — chi-2025 2025 · `4474` · 4.70

  The strongest structural match: comparable videos are explicitly aligned and shown together, with differences exposed across synchronized timelines, transcripts, and previews. It demonstrates both the canonical parallel layout and an unusually rich diff encoding for time-based, multimodal artifacts.

- **[Visual Comparison of Language Model Adaptation](https://doi.org/10.1109/tvcg.2022.3209458)** — tvcg-2023 2023 · `10955` · 4.40

  The figure evidence directly defines juxtaposition as two comparable model visualizations displayed next to each other. Its contrast with superposition makes the layout mechanism especially legible and offers a transferable design choice between separated and overlaid comparison.

- **[Visual Analysis of Prediction Uncertainty in Neural Networks for Deep Image Synthesis](https://doi.org/10.1109/tvcg.2024.3406959)** — tvcg-2025 2025 · `12304` · 4.35

  This is the cleanest canonical selected-pair exemplar: users choose two uncertainty-estimation methods, whose comparable heatmaps are placed side by side so spatial differences in uncertainty and error can be read directly.

*Also ranked (7 more, by rater consensus):*

3. [AnimationDiff: A Visual Comparison Tool for Generated 3D Character Animations](https://doi.org/10.1145/3800645.3812971) — dis-2026 2026 · `16920` · 4.28
4. [LLM Comparator: Interactive Analysis of Side-by-Side Evaluation of Large Language Models](https://doi.org/10.1109/tvcg.2024.3456354) — tvcg-2025 2025 · `11975` · 4.27
6. [EcoAssist: Embedding Sustainability into AI-Assisted Frontend Development](https://doi.org/10.1145/3772318.3791330) — chi-2026 2026 · `6099` · 4.20
7. [AbstractExplorer: Leveraging Structure-Mapping Theory to Enhance Comparative Close Reading at Scale](https://doi.org/10.1145/3746059.3747773) — uist-2025 2025 · `13684` · 4.18
8. [LLM Comparator: Visual Analytics for Side-by-Side Evaluation of Large Language Models](https://doi.org/10.1145/3613905.3650755) — chiea-2024 2024 · `7627` · 4.02
9. [From Toil to Thought: Designing for Strategic Exploration and Responsible AI in Systematic Literature Reviews](https://doi.org/10.1145/3742413.3789079) — iui-2026 2026 · `10184` · 3.77
10. [MisVisFix: An Interactive Dashboard for Detecting, Explaining, and Correcting Misleading Visualizations using Large Language Models](https://doi.org/10.1109/tvcg.2025.3633884) — tvcg-2026 2026 · `12777` · 3.65

#### pat-005 · Branching Exploration

*39 rated · 3 exemplars*

- **[Spellburst: A Node-based Interface for Exploratory Creative Coding with Natural Language Prompts](https://doi.org/10.1145/3586183.3606719)** — uist-2023 2023 · `13588` · 4.95

  Spellburst makes persistent alternatives the interface itself: artists create variation branches in a node graph and can merge paths without destroying their separate histories.

- **[Branchat: A Tree-Structured Interface for Efficient Revisitation in Long-Horizon LLM Conversations](https://doi.org/10.1145/3772363.3798792)** — chiea-2026 2026 · `9118` · 4.70

  Branchat provides an unusually precise fork operation: users can select any retained conversation node as a parent and spawn a divergent branch within a tree designed for later revisitation.

- **[ImaginationVellum: Generative-AI Ideation Canvas with Spatial Prompts, Generative Strokes, and Ideation History](https://doi.org/10.1145/3746059.3747631)** — uist-2025 2025 · `13801` · 4.60

  ImaginationVellum lets users return to different previously generated designs and grow new variation branches from each, preserving multiple visual lineages as live source material on an ideation canvas.

*Also ranked (7 more, by rater consensus):*

2. [-generAItor: Tree-in-the-loop Text Generation for Language Model Explainability and Adaptation](https://doi.org/10.1145/3652028) — tiis-2024 2024 · `10375` · 4.62
5. [Spatial Balancing: Designing an LLM-Powered Spatial Externalization Interface for Iterative Science Communication Writing](https://doi.org/10.1145/3800645.3812998) — dis-2026 2026 · `16813` · 4.55
6. [Narrative Scaffolding: A Narrative-First Framework for Data-Driven Sensemaking](https://doi.org/10.1145/3742413.3789062) — iui-2026 2026 · `10242` · 4.42
7. [SPROUT: An Interactive Authoring Tool for Generating Programming Tutorials With the Visualization of Large Language Models](https://doi.org/10.1109/tvcg.2024.3410523) — tvcg-2025 2025 · `12319` · 4.42
8. [InspirationGraph for Progressive Design Space Exploration](https://doi.org/10.1145/3772318.3790779) — chi-2026 2026 · `5098` · 4.40
9. [Visualizing Tree-of-Analysis: Facilitating Conversational Visual Analytics for Novices](https://doi.org/10.1145/3772318.3791690) — chi-2026 2026 · `6239` · 4.40
10. [AmbigChat: Interactive Hierarchical Clarification for Ambiguous Open-Domain Question Answering](https://doi.org/10.1145/3746059.3747686) — uist-2025 2025 · `13800` · 4.40

#### pat-006 · Multi-Model Output Comparison

*10 rated · 3 exemplars*

- **[DSCode Comparator: An Interactive Interface for Comparing Models and Evaluating Code for Data Science Tasks](https://doi.org/10.1145/3742413.3789088)** — iui-2026 2026 · `10200` · 4.35

  The evidence directly establishes one shared prompt—and optionally one shared dataset—being dispatched to multiple LLMs, while the system’s explicit purpose supplies the common comparison frame for their code outputs.

- **[MoWa: An Authoring Tool for Refining AI-Generated Human Avatar Motions Through Latent Waveform Manipulation](https://doi.org/10.1145/3706598.3714253)** — chi-2025 2025 · `4519` · 4.25

  Its quote closely matches the structural signature: three distinct text-to-motion generators process the same prompt and return three model-derived motion alternatives for the user’s authoring workflow.

- **[ChainForge: A Visual Toolkit for Prompt Engineering and LLM Hypothesis Testing](https://doi.org/10.1145/3613904.3642016)** — chi-2024 2024 · `2325` · 4.10

  Cross-model responses are visibly compared in a shared graphical environment, making the pattern a central, highly transferable interaction despite incomplete evidence about unchanged-input dispatch.

*Also ranked (2 more, by rater consensus):*

4. [LLM Comparator: Interactive Analysis of Side-by-Side Evaluation of Large Language Models](https://doi.org/10.1109/tvcg.2024.3456354) — tvcg-2025 2025 · `11975` · 4.05
5. [Machine-Assisted Error Discovery in Conversational AI Systems](https://doi.org/10.1145/3613905.3651120) — chiea-2024 2024 · `7645` · 3.03

#### pat-007 · Perturb-and-Compare

*17 rated · 3 exemplars*

- **[From Text to Pixels: Enhancing User Understanding through Text-to-Image Model Explanations](https://doi.org/10.1145/3640543.3645173)** — iui-2024 2024 · `10126` · 4.60

  The system performs the complete perturb-and-compare loop: it applies a known keyword-removal transformation to an existing prompt, regenerates the image, and evaluates the altered result against the original, making the induced difference legible.

- **[Understanding Large Language Model Behaviors Through Interactive Counterfactual Generation and Analysis](https://doi.org/10.1109/tvcg.2025.3634646)** — tvcg-2026 2026 · `12842` · 4.30

  Users directly parameterize the transformation by choosing granularity, preserving selected content, and specifying replacement rules, providing the clearest and most reusable control scheme for constructing interpretable counterfactual variants.

- **[ChainForge: A Visual Toolkit for Prompt Engineering and LLM Hypothesis Testing](https://doi.org/10.1145/3613904.3642016)** — chi-2024 2024 · `2325` · 4.15

  ChainForge turns user-authored prompt-template variation into a batched model experiment while holding the input variable constant, so the template change becomes the organizing axis for comparing outputs.

*Also ranked (7 more, by rater consensus):*

4. [KnowledgeVIS: Interpreting Language Models by Comparing Fill-in-the-Blank Prompts](https://doi.org/10.1109/tvcg.2023.3346713) — tvcg-2024 2024 · `11819` · 4.13
5. [Interactive and Visual Prompt Engineering for Ad-hoc Task Adaptation with Large Language Models](https://doi.org/10.1109/tvcg.2022.3209479) — tvcg-2023 2023 · `10953` · 4.03
6. [Social Simulacra: Creating Populated Prototypes for Social Computing Systems](https://doi.org/10.1145/3526113.3545616) — uist-2022 2022 · `13413` · 3.92
7. [VisMoDAI: Visual Analytics for Evaluating and Improving Corruption Robustness of Vision-Language Models](https://doi.org/10.1109/tvcg.2025.3634257) — tvcg-2026 2026 · `12821` · 3.78
8. [IKIWISI: An Interactive Visual Pattern Generator for Evaluating the Reliability of Vision-Language Models Without Ground Truth](https://doi.org/10.1145/3715336.3735754) — dis-2025 2025 · `16494` · 3.42
9. [JailbreakLens: Visual Analysis of Jailbreak Attacks Against Large Language Models](https://doi.org/10.1109/tvcg.2025.3575694) — tvcg-2025 2025 · `12590` · 3.32
10. [PCGEF: A Framework for Diagnosing Subjective Alignment in Human-Centered Persona-Conditioned Generation](https://doi.org/10.1145/3772318.3791402) — chi 2026 · `5582` · 2.90

#### pat-041 · Pick and Combine

*23 rated · 3 exemplars*

- **[Investigating Semantically-enhanced Exploration of GAN Latent Space via a Digital Mood Board](https://doi.org/10.1145/3544549.3585740)** — chiea-2023 2023 · `7000` · 4.70

  The interaction nearly reproduces the structural signature step by step: the user separately selects two existing groups, invokes a named Mix operation for each, and receives a synthesized style mixture between the identifiable operands.

- **[VoiceForge: A Text-Driven Character Voice Generation System for Narrative Content Creation](https://doi.org/10.1145/3706599.3720140)** — chiea-2025 2025 · `8644` · 4.65

  Users choose one to three existing audio references and fuse them through a visible mixing panel whose adjustable weights expose continuous movement among the operands, making the system's interpolative contribution directly controllable.

- **[DanceGen: Supporting Choreography Ideation and Prototyping with Generative AI](https://doi.org/10.1145/3643834.3661594)** — dis-2024 2024 · `16267` · 4.35

  The gallery establishes retained dance sequences as existing operands, after which users select multiple sequences and apply blending to synthesize another sequence in the same choreographic space.

*Also ranked (7 more, by rater consensus):*

4. [Fashioning Creative Expertise with Generative AI: Graphical Interfaces for Design Space Exploration Better Support Ideation Than Text Prompts](https://doi.org/10.1145/3613904.3642908) — chi-2024 2024 · `2658` · 4.22
5. [PromptPaint: Steering Text-to-Image Generation Through Paint Medium-like Interactions](https://doi.org/10.1145/3586183.3606777) — uist-2023 2023 · `13492` · 4.15
6. [SynthScribe: Deep Multimodal Tools for Synthesizer Sound Retrieval and Exploration](https://doi.org/10.1145/3640543.3645158) — iui-2024 2024 · `10124` · 4.10
7. [From Embeddings to Exploration: Engineering Interactive Latent Space Visualizations for AI Model Sensemaking EICS012](https://doi.org/10.1145/3816764) — cscw-2026 2026 · `15884` · 3.95
8. [ShoeGenAI: A Creativity Support Tool Bridging Design Intention and Feasibility in Shoe Design](https://doi.org/10.1145/3746059.3747691) — uist-2025 2025 · `13630` · 3.80
9. [ShoeGenAI: A Creativity Support Tool for High-Feasible Shoe Product Design](https://doi.org/10.1145/3706599.3721204) — chiea-2025 2025 · `8538` · 3.68
10. [FusAIn: Composing Generative AI Visual Prompts Using Pen-based Interaction](https://doi.org/10.1145/3706598.3714027) — chi-2025 2025 · `3590` · 3.15

## U06 · Artifact Editing & Revision

*Acting on the output* — 328 eligible papers, 328 shortlisted, 5 selected.

**1. [PromptPaint: Steering Text-to-Image Generation Through Paint Medium-like Interactions](https://doi.org/10.1145/3586183.3606777)** — uist-2023 2023 · `13492` · **4.93**

The user changes prompts while the denoising run is still in progress, with intermediate results shown live, so the control channel lands on the run in flight rather than queueing a next attempt. Both reviewers corroborated this against the fulltext, and it is the only mid-run instance in the dimension that is not an agent pause button, which is what keeps the pattern from reading as a debugger feature. Any system with a visible incremental generative process -- diffusion, streaming decode, simulation -- can expose the same steering handle.

> Chosen over the next candidate because: Morae and the multi-agent debugger both realise mid-run intervention as stop-inject-resume on a discrete agent loop; PromptPaint shows the mechanism on a continuous process, where there is no natural breakpoint to hide behind.

**2. [DirectGPT: A Direct Manipulation Interface to Interact with Large Language Models](https://doi.org/10.1145/3613904.3642462)** — chi-2024 2024 · `2680` · **4.80**

Selecting an object such as a word before prompting forces the prompt to apply to that object only, so designation precedes invocation and bounds the write. It is the one candidate whose evidence states the confinement itself rather than leaving the write boundary to be inferred, which is the clause the whole pattern turns on. The gesture is medium-independent: any editor with a selection model can scope a generative call the way it already scopes a formatting command.

> Chosen over the next candidate because: Wordcraft's select-then-replace is the same gesture in the same medium but is the first thing any designer builds, and it never states that the rest of the artifact is left untouched.

**3. [Beyond Text Generation: Supporting Writers with Continuous Automatic Text Summaries](https://doi.org/10.1145/3526113.3545672)** — uist-2022 2022 · `13462` · **4.80**

Each paragraph is represented by exactly one card, and the cards can be reordered, deleted or merged -- an exhaustive one-to-one partition of the artifact plus named per-unit operations, the two halves the signature demands and the only candidate supplying both. It turns continuous generated prose into a set of handles, which is the precondition for every finer-grained revision move in this dimension. Readers should note the cards are a derived side-panel view mapped 1:1 onto the source text, not the prose itself, which is arguably the more transferable form: the addressable layer can be generated over material that has no structure of its own.

> Chosen over the next candidate because: Compositional Structures partitions prose into typed section and paragraph blocks at two granularities, but by its own curator's account never names the block-level handles, so it is this entry minus the operations.

**4. [DataWink: Reusing and Adapting SVG-Based Visualization Examples with Large Multimodal Models](https://doi.org/10.1109/tvcg.2025.3634635)** — tvcg-2026 2026 · `12840` · **4.60**

A flat SVG is decomposed backwards into semantic layers, the inferred visual encoding scheme, the recovered data and a parameterised generator, all strictly richer than the surface they came from; the user then manipulates those parameters and the visualization is regenerated. This is the dimension's boundary clause -- editable intermediate representations -- in its strongest form, and the reviewers found it the best-evidenced quote in its pattern. The move generalises to any opaque artifact a model can be asked to explain into typed parts: a slide, a page layout, a chart someone else made.

> Chosen over the next candidate because: Rewriting Video recovers an editable text prompt from footage, which is a lossy description rather than a decomposition, and so inverts the signature's requirement that the recovered representation be richer than the surface.

**5. [I Want It That Way: Enabling Interactive Decision Support Using Large Language Models and Constraint Programming](https://doi.org/10.1145/3685053)** — tiis-2024 2024 · `10383` · **4.53**

The system opens with a concrete proposal, the user evaluates that specific proposal, and the expressed preference is fed back to improve the given suggestion -- all three stages of the loop stated in the evidence rather than inferred, with the carryover clause explicit. It is the dimension's most elementary revision cycle, and without it the set would teach only the exotic moves. It is also the only entry outside creative and writing tooling: critique-driven refinement over a constraint-solved schedule shows the loop works where the artifact is a decision, not a document.

> Chosen over the next candidate because: Metaphorian iterates within a persistent structure but, as its own curator concedes, never shows the opening system proposal, so it demonstrates scoped revision rather than the cycle that names the pattern.

*Curator note:* Overrides. (1) I kept DataWink at pat-029 rather than pat-024. The evidence reviewer preferred to route it to pat-024 and fill pat-029 with rid 13731, but 13731 is not in this dimension's candidate file, so its bibliographic fields could not be taken verbatim and it was not selectable; both reviewers independently call the pat-029 quote the best in that pattern, and the set-level reviewer's fulltext check (regeneration after direct parameter manipulation) closes the loop the pattern curator doubted. (2) I did not carry over any of the four cross-file promotions (rids 5579, 13731, 14009, 13996) for the same reason -- none appear as candidates here. (3) PromptPaint appears twice in the input, at pat-021 and pat-097; under the no-repeated-system rule its single entry is spent on pat-097, where it scores higher and is the pattern's only non-agentic instance, and pat-021 loses nothing because DirectGPT documents the designation act more exactly.

Unrepresented patterns: pat-010 (Prefilled Editable Templates), pat-024 (Program-as-Output), pat-030 (Two-Way Sync View), pat-095 (Manual Fallback Editing), pat-096 (Accept/Reject Controls). With five slots against ten patterns this is unavoidable; I chose one entry per pattern with no doubling, preferring range over depth. The costliest omissions are pat-010, the dimension's most elementary move (the artifact is non-empty at first contact), and pat-030, which the dimension description most directly names -- both are first back in if the set expands, in the order given under near misses.

Distrust list. pat-096 and pat-095 are the weakest-evidenced patterns in the file: the evidence reviewer found the promoted pat-096 entry (rid 9674) contradicted -- the coded control label 'acknowledge' does not appear in the paper, and the disposed items are alerts about the author's own prose rather than generated content -- and found the third pat-095 entry (rid 16923) topical rather than structural. Two further coded quotes could not be located in the fulltext at all: rid 11931 (pat-019) and rid 2288 (pat-030). None of those five sit in this set, but a reader consulting the candidate file directly should treat those rows as unverified. Within the set itself, two caveats: DirectGPT's evidence is a figure caption, and DataWink's regeneration loop is established by the reviewer's fulltext check rather than by the coded quote.

*Near misses:* `14026` Designing Human-AI Collaboration to Support Learning in Coun, `13599` VISAR: A Human-AI Argumentative Writing Assistant with Visua, `13987` Keyframer: A Design Probe for Exploring LLM Assistance in 2D, `4884` DesignTrace: Exploring, Iterating and Tracking Design Altern, `10078` ScatterShot: Interactive In-context Example Curation for Tex

### Patterns in U06

#### pat-010 · Prefilled Editable Templates

*30 rated · 3 exemplars*

- **[Designing Human-AI Collaboration to Support Learning in Counterspeech Writing](https://doi.org/10.1109/vl-hcc65237.2025.00052)** — vlhcc-2025 2025 · `14026` · 4.55

  CounterQuill converts the user’s earlier reflections into a draft already occupying the writing artifact, then exposes ordinary add, edit, and delete operations on that content. This is the cleanest evidence of all three defining properties: a non-empty starting state, generated material in its final working location, and direct revision without an intervening acceptance step.

- **[Synergi: A Mixed-Initiative System for Scholarly Synthesis and Sensemaking](https://doi.org/10.1145/3586183.3606759)** — uist-2023 2023 · `13556` · 4.45

  Synergi begins scholarly synthesis with an entire generated hierarchy of threads and subthreads that users iteratively customize as their working structure. It is a particularly valuable exemplar because the prefilled artifact is structural rather than merely prose, demonstrating that the pattern can overcome cold starts in complex sensemaking work.

- **[ChainBuddy: An AI-assisted Agent System for Generating LLM Pipelines](https://doi.org/10.1145/3706598.3714085)** — chi-2025 2025 · `4144` · 4.42

  ChainBuddy supplies a use-case-specific starter pipeline as the editable working flow, which users can modify and extend directly. The example broadens the pattern from generated copy to executable artifacts: the template is not advice about a pipeline but the non-empty pipeline from which construction begins.

*Also ranked (7 more, by rater consensus):*

4. [Standardized Soul: A Mixed-Methods Study on the Efficacy and User Perception of AI-Augmented Peer Support (AAPS) in College Mental Health Support](https://doi.org/10.1145/3772363.3798796) — chiea-2026 2026 · `9597` · 4.32
5. [Intent Tagging: Exploring Micro-Prompting Interactions for Supporting Granular Human-GenAI Co-Creation Workflows](https://doi.org/10.1145/3706598.3713861) — chi-2025 2025 · `3429` · 4.30
6. [ADCanvas: Accessible and Conversational Audio Description Authoring for Blind and Low Vision Creators](https://doi.org/10.1145/3772318.3791158) — chi-2026 2026 · `4729` · 4.28
7. [Promptimizer: User-Led Prompt Optimization for Personal Content Classification](https://doi.org/10.1145/3772318.3790923) — chi-2026 2026 · `4668` · 4.25
8. [FigurA11y: AI Assistance for Writing Scientific Alt Text](https://doi.org/10.1145/3640543.3645212) — iui-2024 2024 · `10179` · 4.15
9. [PrivacyAkinator: Articulating Key Privacy Design Decisions by Answering LLM-Generated Multiple-choice Questions](https://doi.org/10.1145/3772318.3790408) — chi-2026 2026 · `5574` · 4.08
10. [Homeroom: A Value-Aligned and Community-Centered Homeschooling Platform](https://doi.org/10.1145/3772318.3791698) — chi-2026 2026 · `6309` · 4.08

#### pat-018 · Addressable Segments

*30 rated · 3 exemplars*

- **[Beyond Text Generation: Supporting Writers with Continuous Automatic Text Summaries](https://doi.org/10.1145/3526113.3545672)** — uist-2022 2022 · `13462` · 4.80

  This is the most complete match to the structural signature: every paragraph in one continuous text becomes a persistent card, and reorder, delete, and merge operations are explicitly scoped to those cards.

- **[Compositional Structures as Substrates for Human-AI Co-creation Environment: A Design Approach and A Case Study](https://doi.org/10.1145/3706598.3713401)** — chi-2025 2025 · `4266` · 4.60

  The narrative remains visibly and persistently structured as a linear sequence of typed section and paragraph blocks, providing addressable units at two useful granularities and making the mechanism broadly transferable.

- **[IntentFlow: Investigating Fluid Dynamics of Intent Communication in Generative AI](https://doi.org/10.1145/3800645.3812999)** — dis-2026 2026 · `16862` · 4.48

  IntentFlow converts a monolithic prompt into persistent, named goal and intent components that can be edited independently, demonstrating that addressable segmentation can apply to intent structure as well as document layout.

*Also ranked (7 more, by rater consensus):*

1. [Cells, Generators, and Lenses: Design Framework for Object-Oriented Interaction with Large Language Models](https://doi.org/10.1145/3586183.3606833) — uist-2023 2023 · `13585` · 4.83
4. [XCreation: A Graph-based Crossmodal Generative Creativity Support Tool](https://doi.org/10.1145/3586183.3606826) — uist-2023 2023 · `13536` · 4.50
5. [Narrative Motion Blocks: Combining Direct Manipulation and Natural Language Interactions for Animation Creation](https://doi.org/10.1145/3715336.3735766) — dis-2025 2025 · `16514` · 4.45
7. [Mapping Movies: A Mind-Map Approach to Aphasia-Friendly Video](https://doi.org/10.1145/3772363.3798702) — chiea-2026 2026 · `9433` · 4.38
8. [PodReels: Human-AI Co-Creation of Video Podcast Teasers](https://doi.org/10.1145/3643834.3661591) — dis-2024 2024 · `16269` · 4.32
9. [ResonantLoom: From Prompting to Repair in Object-Centric Generative Sound Design](https://doi.org/10.1145/3772363.3799166) — chiea-2026 2026 · `9984` · 4.27
10. [ELMI: Interactive and Intelligent Sign Language Translation of Lyrics for Song Signing](https://doi.org/10.1145/3706598.3713973) — chi-2025 2025 · `4426` · 4.25

#### pat-019 · Propose-Critique-Revise Iterative Refinement

*30 rated · 3 exemplars*

- **[I Want It That Way: Enabling Interactive Decision Support Using Large Language Models and Constraint Programming](https://doi.org/10.1145/3685053)** — tiis-2024 2024 · `10383` · 4.53

  This is the cleanest complete instance: the system begins with a time suggestion, the user evaluates that concrete proposal, and a newly expressed preference is used to improve it in the next iteration.

- **[Metaphorian: Leveraging Large Language Models to Support Extended Metaphor Creation for Science Writing](https://doi.org/10.1145/3563657.3595996)** — dis-2023 2023 · `16043` · 4.20

  Users iteratively revise an individual sub-metaphor by referencing alternatives while retaining the surrounding metaphor chain, demonstrating cumulative, identity-preserving refinement of a structured artifact.

- **[Smartboard: Visual Exploration of Team Tactics with LLM Agent](https://doi.org/10.1109/tvcg.2024.3456200)** — tvcg-2025 2025 · `11931` · 4.15

  The interface submits user comments together with the current response, directly encoding the pattern’s defining state transition: critique and the existing artifact jointly produce its refinement.

*Also ranked (7 more, by rater consensus):*

2. [Code Shaping: Iterative Code Editing with Free-form AI-Interpreted Sketching](https://doi.org/10.1145/3706598.3713822) — chi-2025 2025 · `3895` · 4.38
4. [Un-default Behavior Tuning: Specifying Model Behavior outside the Norm with LLM Self-Playing and Self-Improving](https://doi.org/10.1145/3742413.3789119) — iui-2026 2026 · `10219` · 4.02
5. [Ask, Verify, Refine: A Question-Aware Multimodal XUI with Feedback-Guided Refinement for Clinical Verification](https://doi.org/10.1145/3772363.3798745) — chiea-2026 2026 · `9078` · 4.00
6. [WorldSmith: Iterative and Expressive Prompting for World Building with a Generative AI](https://doi.org/10.1145/3586183.3606772) — uist-2023 2023 · `13573` · 4.00
7. [Personalizing Kanji Memorization: Designing Adaptive Mnemonics Based on Learner Preferences Using Large Language Models](https://doi.org/10.1145/3772363.3798551) — chiea-2026 2026 · `9494` · 3.97
9. [Introducing 3D Sketching to Overcome Challenges of View-Consistency and Progressive Development in 2D Generative AI-Based Car Exterior Design](https://doi.org/10.1145/3706599.3719731) — chiea-2025 2025 · `8412` · 3.90
10. [Notational Animating: An Interactive Approach to Creating and Editing Animation Keyframes](https://doi.org/10.1145/3772318.3790707) — chi-2026 2026 · `5632` · 3.83

#### pat-021 · Localized Tweaking Support

*30 rated · 3 exemplars*

- **[DirectGPT: A Direct Manipulation Interface to Interact with Large Language Models](https://doi.org/10.1145/3613904.3642462)** — chi-2024 2024 · `2680` · 4.80

  Selecting an addressable object before prompting explicitly confines the otherwise ordinary generative operation to that object, directly realizing designation followed by a bounded write.

- **[PromptPaint: Steering Text-to-Image Generation Through Paint Medium-like Interactions](https://doi.org/10.1145/3586183.3606777)** — uist-2023 2023 · `13492` · 4.45

  Its prompt stencil is a content-free spatial designation that determines exactly where generated image results are applied while leaving the requested transformation conceptually separate.

- **[Wordcraft: Story Writing With Large Language Models](https://doi.org/10.1145/3490099.3511105)** — iui-2022 2022 · `10049` · 4.40

  The select–replace–suggest sequence exposes the complete user-facing mechanism: designate a proper text extent, invoke generation for that extent, and return alternatives for insertion at the same position.

*Also ranked (7 more, by rater consensus):*

2. [SQUIRE: Interactive UI Authoring via Slot QUery Intermediate REpresentations](https://doi.org/10.1145/3746059.3747672) — uist-2025 2025 · `13715` · 4.47
5. [Vistoria: A Multimodal System to Support Fictional Story Writing through Instrumental Image-Text Co-Editing](https://doi.org/10.1145/3772318.3790400) — chi-2026 2026 · `5916` · 4.23
6. [ExpressEdit: Video Editing with Natural Language and Sketching](https://doi.org/10.1145/3640543.3645164) — iui-2024 2024 · `10153` · 4.23
7. [Orchestrating Generative AI Paradigms With Human-in-the-Loop for 3D Generation](https://doi.org/10.1109/tvcg.2026.3695993) — tvcg-2026 2026 · `13354` · 4.18
8. [Sketch2Topo: Diffusion-Model-Based Topology Optimization Using Hand-Drawn Inputs as Condition Constraints](https://doi.org/10.1145/3772363.3798434) — chiea-2026 2026 · `9580` · 4.12
9. [Dynamite: Real-Time Debriefing Slide Authoring through AI-Enhanced Multimodal Interaction](https://doi.org/10.1109/vl-hcc65237.2025.00023) — vlhcc-2025 2025 · `13996` · 4.10
10. [DesignTrace: Exploring, Iterating and Tracking Design Alternatives with GenAI](https://doi.org/10.1145/3772318.3791036) — chi-2026 2026 · `4884` · 4.02

#### pat-024 · Program-as-Output

*30 rated · 3 exemplars*

- **[DataWink: Reusing and Adapting SVG-Based Visualization Examples with Large Multimodal Models](https://doi.org/10.1109/tvcg.2025.3634635)** — tvcg-2026 2026 · `12840` · 4.82

  The clearest structural match: the model produces a functional visualization generator with named inputs for datasets, palettes, and chart configurations, so rebinding parameters yields a family of rendered visualizations.

- **[Keyframer: A Design Probe for Exploring LLM Assistance in 2D Animation Design](https://doi.org/10.1109/vl-hcc65237.2025.00014)** — vlhcc-2025 2025 · `13987` · 4.68

  Keyframer exposes the complete prompt → animation code → rendered preview pipeline and lets users directly edit the intermediate producer, making the program a user-addressable object rather than hidden implementation machinery.

- **[A Solver-Aided Hierarchical Language for LLM-Driven CAD Design](https://doi.org/10.1111/cgf.70250)** — cgf 2025 · `743` · 4.50

  The paper states the defining distinction directly: the model generates hierarchical CAD programs rather than geometry, and executing those programs produces the requested geometric artifacts.

*Also ranked (7 more, by rater consensus):*

3. [InstructPipe: Generating Visual Blocks Pipelines with Human Instructions and LLMs](https://doi.org/10.1145/3706598.3713905) — chi-2025 2025 · `4270` · 4.48
5. [AgentPbD: Interactive Agentic Workflow Generation from User Demonstration on Web Browsers](https://doi.org/10.1109/vl-hcc65237.2025.00064) — vlhcc-2025 2025 · `14038` · 4.33
6. [Flowco: Mixed-Initiative Authoring of Reliable End-to-End Data Analyses via Dataflow Graphs and LLMs](https://doi.org/10.1145/3746059.3747636) — uist-2025 2025 · `13726` · 4.32
7. [SketchDynamics: Exploring Free-Form Sketches for Dynamic Intent Expression in Animation Generation](https://doi.org/10.1145/3772318.3791071) — chi-2026 2026 · `5326` · 4.17
8. [ReUseIt: Synthesizing Reusable AI Agent Workflows for Web Automation](https://doi.org/10.1145/3742413.3789083) — iui-2026 2026 · `10229` · 4.17
9. [JustShape: Exploring Co-Speech Gestures for Multimodal LLM-Powered 3D Parametric Modeling](https://doi.org/10.1145/3772318.3790641) — chi-2026 2026 · `5579` · 4.13
10. [Spellburst: A Node-based Interface for Exploratory Creative Coding with Natural Language Prompts](https://doi.org/10.1145/3586183.3606719) — uist-2023 2023 · `13588` · 4.13

#### pat-029 · Reverse Engineered Representation

*10 rated · 3 exemplars*

- **[Rewriting Video: Text-Driven Reauthoring of Video Footage](https://doi.org/10.1145/3742413.3789098)** — iui-2026 2026 · `10269` · 4.65

  The system explicitly reverse-engineers finished video into an editable text prompt, reconstructing a source-like generator that becomes the object of reauthoring rather than asking users to manipulate footage directly.

- **[DataWink: Reusing and Adapting SVG-Based Visualization Examples with Large Multimodal Models](https://doi.org/10.1109/tvcg.2025.3634635)** — tvcg-2026 2026 · `12840` · 4.60

  DataWink decomposes an existing SVG into semantic layers and reconstructs both its visual-encoding specification and underlying data, closely matching the pattern’s requirement for a recovered representation richer than the rendered surface.

- **[Interactive Authoring of Terrain using Diffusion Models](https://doi.org/10.1111/cgf.14941)** — cgf-2023 2023 · `196` · 4.15

  The system extracts a terrain signature, generates a structural replica from it, and explicitly lets the user edit that recovered replica to add or remove features, demonstrating both inverse reconstruction and structure-level manipulation.

*Also ranked (6 more, by rater consensus):*

3. [LogoMotion: Visually-Grounded Code Synthesis for Creating and Editing Animation](https://doi.org/10.1145/3706598.3714155) — chi-2025 2025 · `4497` · 3.97
5. [ReSpark: Leveraging Previous Data Reports as References to Generate New Reports with LLMs](https://doi.org/10.1145/3746059.3747644) — uist-2025 2025 · `13794` · 3.85
6. [Proteus: Shapeshifting Desktop Visualizations for Mobile via Multi-level Intelligent Adaptation](https://doi.org/10.1145/3800645.3813097) — dis-2026 2026 · `16922` · 3.85
7. [DepthScape: Authoring 2.5D Designs via Depth Estimation, Semantic Understanding, and Geometry Extraction](https://doi.org/10.1145/3800645.3813038) — dis-2026 2026 · `16651` · 3.35
8. [GlyphCreator: Towards Example-based Automatic Generation of Circular Glyphs](https://doi.org/10.1109/tvcg.2021.3114877) — tvcg-2022 2022 · `10473` · 2.97
9. [PerforMagic: Coordinating Bodily Performance and Camera Movement in AI Video Creation](https://doi.org/10.1145/3772363.3798782) — chiea-2026 2026 · `9489` · 1.80

#### pat-030 · Two-Way Sync View

*14 rated · 3 exemplars*

- **[VISAR: A Human-AI Argumentative Writing Assistant with Visual Programming and Rapid Draft Prototyping](https://doi.org/10.1145/3586183.3606800)** — uist-2023 2023 · `13599` · 4.65

  VISAR is the clearest canonical exemplar: a text editor and visual canvas concurrently expose the same argumentative outline, both permit editing, and the system explicitly synchronizes changes between them.

- **[The Command Line GUIde: Graphical Interfaces from Man Pages via AI](https://doi.org/10.1109/vl-hcc65237.2025.00026)** — vlhcc-2025 2025 · `14000` · 4.60

  GUI DE provides unusually complete evidence of the closed loop: typing a command updates the graphical option state live, while manipulating those graphical controls edits the command.

- **[Charagraph: Interactive Generation of Charts for Realtime Annotation of Data-Rich Paragraphs](https://doi.org/10.1145/3544548.3581091)** — chi-2023 2023 · `2288` · 4.47

  Charagraph directly matches the structural signature: text annotations and a chart are simultaneously interactive representations, and modifications made in either are reflected in the other.

*Also ranked (7 more, by rater consensus):*

4. [CrossLit: Connecting Visual and Textual Sensemaking for Literature Review](https://doi.org/10.1145/3772318.3791418) — chi-2026 2026 · `5384` · 4.38
5. [Keyframer: A Design Probe for Exploring LLM Assistance in 2D Animation Design](https://doi.org/10.1109/vl-hcc65237.2025.00014) — vlhcc-2025 2025 · `13987` · 4.27
6. [Bridging Natural Language and SQL with an LLM-Powered Visual Interface](https://doi.org/10.1109/vl-hcc65237.2025.00055) — vlhcc-2025 2025 · `14029` · 4.25
7. [From Idea to Co-Creation: A Planner-Actor-Critic Framework for Agent Augmented 3D Modeling](https://doi.org/10.1145/3772363.3798904) — chiea-2026 2026 · `9301` · 3.67
8. [StepMIND: A Visual Framework for Stepwise, Multimodal, and Bidirectional Explanations of AI-Generated Data Analysis Pipeline](https://doi.org/10.1145/3742413.3789070) — iui-2026 2026 · `10210` · 3.32
9. [Vistoria: A Multimodal System to Support Fictional Story Writing through Instrumental Image-Text Co-Editing](https://doi.org/10.1145/3772318.3790400) — chi-2026 2026 · `5916` · 3.30
10. [Elemental Alchemist: A Generative Interface for Semantic Control of Particle Systems Across Dynamic Levels of Abstraction](https://doi.org/10.1145/3800645.3812946) — dis-2026 2026 · `16921` · 1.80

#### pat-095 · Manual Fallback Editing

*31 rated · 3 exemplars*

- **[DesignTrace: Exploring, Iterating and Tracking Design Alternatives with GenAI](https://doi.org/10.1145/3772318.3791036)** — chi-2026 2026 · `4884` · 4.70

  DesignTrace is the clearest structural match: manual typing, suggested tags, and image-based extraction are concurrently available routes into the identical attribute slot. Because all three routes share one schema, the artifact can mix contributions freely and remains fully operable without generation.

- **[Synthetic Conversation: How Computing Researchers Engage Multi-Perspective Dialogues to Brainstorm Societal Impacts](https://doi.org/10.1145/3706599.3719747)** — chiea-2025 2025 · `8557` · 4.60

  Generated stakeholders and manually added stakeholders occupy the same collection, while generated entries remain editable and removable. This establishes a shared artifact that can retain both generated and user-authored contributions without making manual authorship a separate fallback mode.

- **[MindTrellis: Co-Creating Knowledge Structures with AI through Interactive Visual Exploration](https://doi.org/10.1145/3800645.3813045)** — dis-2026 2026 · `16923` · 4.30

  MindTrellis explicitly combines document-derived AI knowledge and user-contributed knowledge in one collaboratively built graph. The persistent graph is therefore a mixed-provenance artifact whose node-and-edge structure accepts contributions from either route.

*Also ranked (7 more, by rater consensus):*

4. [ExpressEdit: Video Editing with Natural Language and Sketching](https://doi.org/10.1145/3640543.3645164) — iui-2024 2024 · `10153` · 4.38
5. [Co-Creating Question-and-Answer Style Articles with Large Language Models for Research Promotion](https://doi.org/10.1145/3643834.3660705) — dis-2024 2024 · `16270` · 4.38
6. [AI of Oz: Enhancing Wizard of Oz Studies in HCI with AI Assistance for Human Moderation](https://doi.org/10.1145/3772318.3791324) — chi-2026 2026 · `4871` · 4.28
7. [A Hybrid GUI-LLM Interface Paradigm for 3D Scene Customisation](https://doi.org/10.1145/3800645.3812986) — dis-2026 2026 · `16654` · 4.05
8. [Sparks: Inspiration for Science Writing using Language Models](https://doi.org/10.1145/3532106.3533533) — dis-2022 2022 · `15972` · 4.03
9. [Spellburst: A Node-based Interface for Exploratory Creative Coding with Natural Language Prompts](https://doi.org/10.1145/3586183.3606719) — uist-2023 2023 · `13588` · 4.00
10. [Curompt: A Spatially Situated Interface for Generative AI in 3D Design Software](https://doi.org/10.1109/vl-hcc65237.2025.00065) — vlhcc-2025 2025 · `14039` · 3.98

#### pat-096 · Accept/Reject Controls

*18 rated · 3 exemplars*

- **[ScatterShot: Interactive In-context Example Curation for Text Transformation](https://doi.org/10.1145/3581641.3584059)** — iui-2023 2023 · `10078` · 4.70

  Each LLM-output candidate is individually assigned through the same explicit three-way vocabulary—positive example, negative example, or excluded—making this the cleanest evidence of a fixed, repeated per-item disposition mechanism; the resulting choices also become demonstrations that shape subsequent model behavior.

- **[EchoLadder: Progressive AI-Assisted Design of Immersive VR Scenes](https://doi.org/10.1145/3746059.3747659)** — uist-2025 2025 · `13665` · 4.40

  Every suggestion can individually be previewed, applied, undone, or regenerated, directly establishing a stable action vocabulary and item-level scope while supporting incremental construction of a complex VR environment.

- **[Tracking, Retrieving, and Auditing for Coherent Epics in Online Narratives](https://doi.org/10.1145/3772363.3798905)** — chiea-2026 2026 · `9674` · 3.90

  The conflict panel presents multiple system-flagged issues with the same acknowledge-or-dismiss actions, providing stronger evidence of a repeated, co-located per-item control group than candidates describing only one active suggestion or patch.

*Also ranked (7 more, by rater consensus):*

3. [TraceMate: Collaborating with AI in Test-Driven Programming](https://doi.org/10.1109/vl-hcc65237.2025.00035) — vlhcc-2025 2025 · `14009` · 3.98
5. [EcoAssist: Embedding Sustainability into AI-Assisted Frontend Development](https://doi.org/10.1145/3772318.3791330) — chi-2026 2026 · `6099` · 3.67
6. [Choice Over Control: How Users Write with Large Language Models using Diegetic and Non-Diegetic Prompting](https://doi.org/10.1145/3544548.3580969) — chi-2023 2023 · `2002` · 3.65
7. [DiaryMate: Understanding User Perceptions and Experience in Human-AI Collaboration for Personal Journaling](https://doi.org/10.1145/3613904.3642693) — chi-2024 2024 · `2439` · 3.63
8. [AI of Oz: Enhancing Wizard of Oz Studies in HCI with AI Assistance for Human Moderation](https://doi.org/10.1145/3772318.3791324) — chi-2026 2026 · `4871` · 3.57
9. [AI-Mediated Feedback Improves Student Revisions: A Randomized Trial with FeedbackWriter in a Large Undergraduate Course](https://doi.org/10.1145/3772318.3791121) — chi-2026 2026 · `5024` · 3.47
10. [ReelFramer: Human-AI Co-Creation for News-to-Video Translation](https://doi.org/10.1145/3613904.3642868) — chi-2024 2024 · `2423` · 3.38

#### pat-097 · Mid-Run Intervention

*17 rated · 3 exemplars*

- **[PromptPaint: Steering Text-to-Image Generation Through Paint Medium-like Interactions](https://doi.org/10.1145/3586183.3606777)** — uist-2023 2023 · `13492` · 4.93

  PromptPaint directly exposes a live parameter channel: users change guiding prompts during image generation, and those changes steer the in-flight process rather than a later run.

- **[Interactive Debugging and Steering of Multi-Agent AI Systems](https://doi.org/10.1145/3706598.3713581)** — chi-2025 2025 · `3704` · 4.85

  Users pause an executing multi-agent system and inject new messages into the same run, clearly establishing a live control channel, preserved partial state, and consequential mid-execution steering.

- **[Morae: Proactively Pausing UI Agents for User Choices](https://doi.org/10.1145/3746059.3747797)** — uist-2025 2025 · `13756` · 4.80

  Morae detects decision points during task execution, pauses the active UI-agent run, and hands control to the user before execution proceeds, turning autonomous action into inspectable and revisable segments.

*Also ranked (7 more, by rater consensus):*

2. [Interactive Reasoning: Visualizing and Controlling Chain-of-Thought Reasoning in Large Language Models](https://doi.org/10.1145/3742413.3789091) — iui-2026 2026 · `10227` · 4.85
5. [PrivWeb: Unobtrusive and Content-aware Privacy Protection For Web Agents](https://doi.org/10.1145/3772318.3790919) — chi-2026 2026 · `5071` · 4.53
6. [DroidRetriever: A Transparent and Steerable Automation System for Collaborative Mobile Information Seeking](https://doi.org/10.1145/3772318.3790396) — chi-2026 2026 · `6060` · 4.20
7. [Social Simulation for Everyday Self-Care: Design Insights from Leveraging VR, AR, and LLMs for Practicing Stress Relief](https://doi.org/10.1145/3706598.3713115) — chi-2025 2025 · `4509` · 4.03
8. [Generative Muscle Stimulation: Providing Users with Physical Assistance by Constraining Multimodal-AI with Embodied Knowledge](https://doi.org/10.1145/3772318.3790817) — chi-2026 2026 · `5322` · 4.02
9. [Toward Enabling Natural Conversation with Older Adults via the Design of LLM-Powered Voice Agents that Support Interruptions and Backchannels](https://doi.org/10.1145/3706598.3714228) — chi-2025 2025 · `3885` · 3.92
10. [When Objects Gossip: Exploring Object-to-Object Conversation with GAI](https://doi.org/10.1145/3772363.3798919) — chiea-2026 2026 · `9743` · 3.87

## U08 · Workflow, History & Session Structure

*Fitting into the work* — 342 eligible papers, 342 shortlisted, 5 selected.

**1. [ChaCha: Leveraging Large Language Models to Prompt Children to Share Their Emotions about Personal Events](https://doi.org/10.1145/3613904.3642152)** — chi-2024 2024 · `3185` · **4.65**

An authored phase graph with transition rules governs the dialogue: the system holds the current phase as persistent state, applies a phase-specific test to the conversation after every message, and makes an explicit stay-or-advance decision. It is the only candidate in U08 whose evidence shows the control structure operating at runtime rather than sitting in a static diagram, and the only one with a deployed study population, so it is where criterion 2 has anything to stand on. Any designer building a protocol-driven agent — intake, tutoring, screening — can lift the per-turn transition test directly.

> Chosen over the next candidate because: It beats Orchid-Creator because Orchid-Creator evidences only the authoring representation, while ChaCha evidences the representation actually running a conversation.

**2. [Criticmate: Stagewise Human-AI Co-Critique in Single-Screen UI Evaluation](https://doi.org/10.1145/3772318.3790929)** — chi-2026 2026 · `5353` · **4.95**

Three designer-fixed stages — Perception, Comprehension, Projection — are constant across runs and each carries a distinct epistemic role, with sibling coded rows confirming they are separately instantiated. It is the one staging rationale in the dimension that is not task chunking: the boundaries exist to stop the model and the designer from critiquing before they have observed, which is the non-obvious move criterion 5 asks for. Any workflow where premature judgement is the failure mode can copy the discipline of making observation its own stage.

> Chosen over the next candidate because: It beats the analysis-edit-review pipeline in rid 4036 because that sequence is the default anyone would build for find-a-problem-and-fix-it, whereas separating observation from interpretation is a deliberate constraint on the AI's reasoning order.

**3. [CoAutoML: User Interface Framework for Machine Learning Novices using LLM-based AutoML and Test-Driven Machine Teaching](https://doi.org/10.1145/3742413.3789153)** — iui-2026 2026 · `10222` · **4.48**

A visual workflow panel displays step-by-step progress across five constant, designer-fixed stages (data upload, domain knowledge, test-cases, ML task formulation, AutoML process). This is the dimension's most literal evidence for the signature clause 'the surface encodes the order', and the only candidate that plainly satisfies U08's classification boundary that the process structure be exposed to users rather than held internally. The panel is a lift-anywhere device for any multi-step AI pipeline aimed at non-experts.

> Chosen over the next candidate because: It beats rid 4036 because its stages are evidenced as a surface the user sees, while rid 4036's three phases are the mechanics of a pre-send privacy inspection loop that is coded as a different pattern.

**4. [ProDec: Automated Prompt Decomposition](https://doi.org/10.1109/vl-hcc65237.2025.00070)** — vlhcc-2025 2025 · `14044` · **4.20**

Each prompt is decomposed at runtime into its own dependency-linked subtasks, rendered as discrete interface steps that the user can inspect, modify, and execute individually before the whole runs. It is the only decomposition candidate covering the signature's 'by the system, the user, or both' clause, and its per-portion execution is corroborated by the same paper's separately coded evidence. Screen-native and hardware-free, it transfers to any prompt-driven tool.

> Chosen over the next candidate because: It beats the higher-scoring Spark because the half of Spark's mechanism that distinguishes it — enactment through a physical robot — is exactly the half that does not transfer off that hardware, while ProDec's editable subtask graph does.

**5. [Data Has Entered the Chat: How Data Workers Conduct Exploratory Visual Analytic Conversations with GenAI Agents](https://doi.org/10.1145/3744750)** — tiis-2025 2025 · `10412` · **4.80**

The Thread panel retains a history of modifications that the user can return to and further refine at any time, making superseded states addressable records rather than discarded ones. It is the only evidence in the dimension for the signature's defining operation — returning to a past state and continuing from there, not merely reverting — so without it U08 cannot illustrate that half of the pattern at all. The panel generalizes to any AI tool where exploration branches and dead ends are normal.

> Chosen over the next candidate because: It beats Curompt's global revert timeline because reverting restores a past state while the Thread panel resumes work from it, which is the operation the pattern is named for.

*Curator note:* Five slots, four patterns, so one pattern carries two. I gave the pair to pat-017 Staged Pipeline and say so deliberately: neither entry alone represents it. Criticmate supplies the only non-obvious staging rationale in the dimension but its evidence is abstract-only and never shows a user seeing the stages; CoAutoML supplies the visible ordered progress panel that is what U08's classification boundary ('the process structure must be exposed to users') actually requires. They also sit in unrelated domains (UI critique vs. ML tooling for novices), so they are not the same move twice. Overrides of pattern-level judgement: (1) I dropped Spark (rid 10246, 4.30) for ProDec (rid 14044, 4.20) against the pat-023 curator's ordering — Spark's distinguishing clause is robot enactment, which fails criterion 3 (weight 0.20) off that hardware, and ProDec restores user-editable control structure to a set that would otherwise be entirely designer-fixed and system-held. (2) I dropped Orchid-Creator (rid 6216, 4.60) even though it is the dimension's only directly authored, editable control graph; with one pat-016 slot, ChaCha's runtime evidence and deployed population win, and ProDec partially covers the user-editable half. (3) I dropped Curompt (rid 14039, 4.75) despite it being the strongest transferability case, because its timeline evidences rollback but not resumption, and 10412 covers the operation the pattern is defined by. All three reviewer DEMOTE calls (4906, 4036, 7490, 14005) are accepted and none of those papers appear. Distrust: every exemplar here is design description only — no outcome evidence anywhere in U08 except ChaCha's deployment. Criticmate's writeup claim that it 'preserves editability without letting users author the sequence' is not supportable from an abstract and should not be printed. 10412's evidence comes from figure text, so 'the Thread panel' is described from a figure label. ChaCha's phase structure is shown in a system-architecture figure aimed at readers, not demonstrably at the child user, so its satisfaction of the exposure boundary is inferred from the authored-protocol framing. CoAutoML evidences visible staging, not enforced staging. ProDec's serial handling comes from a sibling coded row rather than the headline quote. Two signature clauses go uncovered across the whole dimension and the cookbook should say so rather than paper over them: chronological playback of a history (the only candidate offering it, rid 14005, records other people's activity for an instructor and has no return-and-continue at all), and final-artifact assembly from decomposed parts.

*Near misses:* `6216` Orchid-Creator: An Authoring Tool Supporting LLM-Driven Inte, `14039` Curompt: A Spatially Situated Interface for Generative AI in, `10246` From Visual to Multimodal Programming: Designing an Interfac, `4036` Raising Awareness of Location Information Vulnerabilities in, `4906` Designing a Generative AI-Assisted Music Psychotherapy Tool , `7490` CoExplorer: Generative AI Powered 2D and 3D Adaptive Interfa, `14005` Towards Human-AI Collaboration for Misapplication Detection 

### Patterns in U08

#### pat-016 · Structured Dialogue Flow

*30 rated · 3 exemplars*

- **[ChaCha: Leveraging Large Language Models to Prompt Children to Share Their Emotions about Personal Events](https://doi.org/10.1145/3613904.3642152)** — chi-2024 2024 · `3185` · 4.65

  ChaCha provides the most complete runtime realization of the pattern: it maintains a current conversational phase, applies a phase-specific test to dialogue history after every message, and explicitly decides whether to remain or transition.

- **[Orchid-Creator: An Authoring Tool Supporting LLM-Driven Interactive Narrative Creation](https://doi.org/10.1145/3772318.3791426)** — chi-2026 2026 · `6216` · 4.60

  Orchid-Creator turns conversational control into a directly authorable object: authors arrange content into graph nodes and define the conditions governing transitions between them.

- **[Designing a Generative AI-Assisted Music Psychotherapy Tool for Deaf and Hard-of-Hearing Individuals](https://doi.org/10.1145/3772318.3791385)** — chi-2026 2026 · `4906` · 4.50

  The tool defines four named states whose internal steps and required variables serve as explicit advancement criteria, closely matching a condition-governed finite-state workflow.

*Also ranked (7 more, by rater consensus):*

3. [TeamWise: Exploring Virtually Embodied AI Facilitation for Video-Based Team Onboarding](https://doi.org/10.1145/3772363.3798791) — chiea-2026 2026 · `9621` · 4.40
5. [TeachTune: Reviewing Pedagogical Agents Against Diverse Student Profiles with Simulated Students](https://doi.org/10.1145/3706598.3714054) — chi-2025 2025 · `4264` · 4.37
6. [A Piece of Theatre: Investigating How Teachers Design LLM Chatbots to Assist Adolescent Cyberbullying Education](https://doi.org/10.1145/3613904.3642379) — chi-2024 2024 · `2642` · 4.32
7. [DAPIE: Interactive Step-by-Step Explanatory Dialogues to Answer Children's Why and How Questions](https://doi.org/10.1145/3544548.3581369) — chi-2023 2023 · `1642` · 4.27
8. [DialogLab: Authoring, Simulating, and Testing Dynamic Human-AI Group Conversations](https://doi.org/10.1145/3746059.3747696) — uist-2025 2025 · `13652` · 4.25
9. [Hybrid LLM-Embedded Dialogue Agents for Learner Reflection: Designing Responsive and Theory-Driven Interactions](https://doi.org/10.1145/3772318.3791582) — chi-2026 2026 · `4674` · 3.95
10. [Bridging the Treatment Gap: A Novel LLM-Driven System for Scalable Initial Patient Assessments in Mental Healthcare](https://doi.org/10.1145/3706599.3720043) — chiea-2025 2025 · `8176` · 3.92

#### pat-017 · Staged Pipeline

*30 rated · 3 exemplars*

- **[Criticmate: Stagewise Human-AI Co-Critique in Single-Screen UI Evaluation](https://doi.org/10.1145/3772318.3790929)** — chi-2026 2026 · `5353` · 4.95

  Criticmate makes a fixed Perception–Comprehension–Projection sequence its central interaction structure, gives each stage a distinct epistemic role, and preserves editability without letting users author the sequence.

- **[Raising Awareness of Location Information Vulnerabilities in Social Media Photos using LLMs](https://doi.org/10.1145/3706598.3714074)** — chi-2025 2025 · `4036` · 4.62

  The interface exposes three fixed, functionally dependent phases—analysis, editing, and review—that take users from detecting privacy leaks through mitigation to verification.

- **[CoAutoML: User Interface Framework for Machine Learning Novices using LLM-based AutoML and Test-Driven Machine Teaching](https://doi.org/10.1145/3742413.3789153)** — iui-2026 2026 · `10222` · 4.48

  CoAutoML provides the clearest literal match to the structural signature: a visible workflow panel exposes five constant stages in order and displays the user's step-by-step progress through them.

*Also ranked (7 more, by rater consensus):*

4. [Athena: Intermediate Representations for Iterative Scaffolded App Generation with an LLM](https://doi.org/10.1145/3742413.3789133) — iui-2026 2026 · `10198` · 4.38
5. [Designing Human-AI Collaboration to Support Learning in Counterspeech Writing](https://doi.org/10.1109/vl-hcc65237.2025.00052) — vlhcc-2025 2025 · `14026` · 4.28
6. [Component-Wise Sketching and Generation for Car Interior Design](https://doi.org/10.1145/3772318.3790912) — chi-2026 2026 · `5715` · 4.27
7. [DesignBridge: Bridging Designer Expertise and User Preferences through AI-Enhanced Co-Design for Fashion](https://doi.org/10.1145/3742413.3789081) — iui-2026 2026 · `10257` · 4.27
8. [CityCure: Walk, Capture, and Reimagine Street Micro-Interventions with In-Situ MR and GenAI](https://doi.org/10.1145/3772363.3799077) — chiea-2026 2026 · `9144` · 4.23
9. [Privy: Envisioning and Mitigating Privacy Risks for Consumer-facing AI Product Concepts](https://doi.org/10.1145/3772318.3791279) — chi-2026 2026 · `5018` · 4.20
10. [Bridging Pedagogy and Play: Introducing a Language Mapping Interface for Human-AI Co-Creation in Educational Game Design](https://doi.org/10.1145/3772363.3798862) — chiea-2026 2026 · `9122` · 4.15

#### pat-023 · Goal Decomposition

*30 rated · 3 exemplars*

- **[From Visual to Multimodal Programming: Designing an Interface to Externalize Decomposition Thinking for Novice Learners](https://doi.org/10.1145/3742413.3789131)** — iui-2026 2026 · `10246` · 4.30

  Spark turns a runtime, user-articulated goal into visible, structured steps and then enacts those steps through a robot, providing the clearest evidence of both input-specific decomposition and separate handling.

- **[ProDec: Automated Prompt Decomposition](https://doi.org/10.1109/vl-hcc65237.2025.00070)** — vlhcc-2025 2025 · `14044` · 4.20

  ProDec converts each programming prompt into its own set of dependency-linked subtasks and exposes those reasoning steps for visual inspection and modification, closely matching the pattern’s variable decomposition and editability requirements.

- **[CoExplorer: Generative AI Powered 2D and 3D Adaptive Interfaces to Support Intentionality in Video Meetings](https://doi.org/10.1145/3613905.3650797)** — chiea-2024 2024 · `7490` · 4.05

  CoExplorer derives meeting-specific phases from a supplied description and lets attendees refine those phases before they organize the meeting, demonstrating visible, collaborative, runtime-dependent decomposition.

*Also ranked (7 more, by rater consensus):*

4. [Cocoa: Co-Planning and Co-Execution with AI Agents](https://doi.org/10.1145/3772318.3791673) — chi-2026 2026 · `5968` · 4.10
5. [DBox: Scaffolding Algorithmic Programming Learning through Learner-LLM Co-Decomposition](https://doi.org/10.1145/3706598.3713748) — chi-2025 2025 · `4436` · 4.05
6. [AgentPbD: Interactive Agentic Workflow Generation from User Demonstration on Web Browsers](https://doi.org/10.1109/vl-hcc65237.2025.00064) — vlhcc-2025 2025 · `14038` · 3.98
7. [Robo-Blocks: Generative Scaffolding in End-User Design and Programming of Social Robots](https://doi.org/10.1145/3800645.3812997) — dis-2026 2026 · `16860` · 3.93
8. [Guided Reality: Generating Visually-Enriched AR Task Guidance with LLMs and Vision Models](https://doi.org/10.1145/3746059.3747784) — uist-2025 2025 · `13814` · 3.85
9. [StepWrite: Adaptive Planning for Speech-Driven Text Generation](https://doi.org/10.1145/3746059.3747610) — uist-2025 2025 · `13647` · 3.78
10. [MapStory: Prototyping Editable Map Animations with LLM Agents](https://doi.org/10.1145/3746059.3747664) — uist-2025 2025 · `13705` · 3.65

#### pat-080 · Revisitable History

*33 rated · 3 exemplars*

- **[Data Has Entered the Chat: How Data Workers Conduct Exploratory Visual Analytic Conversations with GenAI Agents](https://doi.org/10.1145/3744750)** — tiis-2025 2025 · `10412` · 4.80

  The Thread panel turns modifications into a navigable history whose prior entries can be reopened and refined, providing the clearest evidence of the pattern’s defining return-and-continue operation.

- **[Curompt: A Spatially Situated Interface for Generative AI in 3D Design Software](https://doi.org/10.1109/vl-hcc65237.2025.00065)** — vlhcc-2025 2025 · `14039` · 4.75

  Per-object chat logs retain local change provenance while a global timeline makes every AI action revertible, combining addressable records with consequential workspace restoration.

- **[Towards Human-AI Collaboration for Misapplication Detection in Programming Exercises](https://doi.org/10.1109/vl-hcc65237.2025.00031)** — vlhcc-2025 2025 · `14005` · 4.65

  Its class-wide timeline supports inspection at any recorded point and variable-speed replay, offering the strongest direct realization of the pattern’s temporal-traversal operation.

*Also ranked (7 more, by rater consensus):*

3. [Smartboard: Visual Exploration of Team Tactics with LLM Agent](https://doi.org/10.1109/tvcg.2024.3456200) — tvcg-2025 2025 · `11931` · 4.65
5. [DesignTrace: Exploring, Iterating and Tracking Design Alternatives with GenAI](https://doi.org/10.1145/3772318.3791036) — chi-2026 2026 · `4884` · 4.47
6. [Orality: A Semantic Canvas for Externalizing and Clarifying Thoughts with Speech](https://doi.org/10.1145/3772318.3791713) — chi-2026 2026 · `4816` · 4.38
7. [Meta-Manager: A Tool for Collecting and Exploring Meta Information about Code](https://doi.org/10.1145/3613904.3642676) — chi-2024 2024 · `2881` · 4.33
8. [AgentLens: Visual Analysis for Agent Behaviors in LLM-Based Autonomous Systems](https://doi.org/10.1109/tvcg.2024.3394053) — tvcg-2025 2025 · `12281` · 4.32
9. [Leveraging Large Language Models to Enhance Domain Expert Inclusion in Data Science Workflows](https://doi.org/10.1145/3613905.3651115) — chiea-2024 2024 · `7634` · 4.28
10. [Data Formulator 2: Iterative Creation of Data Visualizations, with AI Transforming Data Along the Way](https://doi.org/10.1145/3706598.3713296) — chi-2025 2025 · `3857` · 4.13

## U09 · Workspace Layout & Tool Integration

*Fitting into the work* — 410 eligible papers, 410 shortlisted, 5 selected.

**1. [StoryEnsemble: Enabling Dynamic Exploration & Iteration in the Design Process with AI and Forward-Backward Propagation](https://doi.org/10.1145/3746059.3747772)** — uist-2025 2025 · `13741` · **4.95**

Four lettered stage regions - personas (A), problems (B), solutions (C), scenarios (D) - sit in one environment, and edits propagate forward and backward across them, so the output of any stage stays directly addressable in the others with no export step. It is the only candidate in the dimension whose coded quote names both the regions and the state mechanism that binds them; every other Unified Workspace candidate asserts integration by using the word 'unified'. Any tool whose stages are currently separate files or tabs can lift the propagation rule: name the stages, bind them to one object, and make edits travel in both directions.

> Chosen over the next candidate because: SnapClass names the consolidated stages and even the prior tool-switching problem, but 'all in one interface' is co-location; StoryEnsemble is the one quote that shows the shared state rather than claiming it.

**2. [PolicyPad: Collaborative Prototyping of LLM Policies](https://doi.org/10.1145/3772318.3791689)** — chi-2026 2026 · `4643` · **4.90**

Three fixed positions carry three functions: collaboration on the left, a collaborative policy editor in the middle, a private model-behavior sidebar on the right. What earns the slot is that the arrangement encodes a social boundary rather than a technical one - shared drafting against private testing of unfinished model behavior - which is the signature's optional 'the layout means something further' clause satisfied verbatim. Any team tool that needs people to coordinate on a common artifact while rehearsing risky changes unseen can copy the shared-middle / private-edge split directly.

> Chosen over the next candidate because: DynaVis names four regions just as explicitly, but its panels partition tools by technical function; PolicyPad's positions answer 'why this arrangement and not another'.

**3. [Selenite: Scaffolding Online Sensemaking with Comprehensive Overviews Elicited from Large Language Models](https://doi.org/10.1145/3613904.3642149)** — chi-2024 2024 · `2436` · **4.83**

An unauthored third-party page the user found by search is left intact while a generated layer attaches at two granularities: global grounding with a set of common criteria beside the page, and local grounding as in-situ annotations of criteria per paragraph. The pattern's signature says the anchoring, not the generation, is what must be specified, and paragraph-level attachment plus a page-level companion is the most reconstructable attachment scheme in the pool. Anyone building an extension over documents they do not own can lift the two-level anchor: one persistent overview, one per-span annotation, both detachable.

> Chosen over the next candidate because: IntentPrism makes the same plug-in-over-webpages move with a 0.25 gap and adds only cross-page aggregation, which is a sensemaking contribution rather than a layout one; Selenite states the identical claim in strictly richer form.

**4. [GeoVisA11y: An AI-based Geovisualization Question-Answering System for Screen-Reader Users](https://doi.org/10.1145/3772318.3790334)** — chi-2026 2026 · `5580` · **4.70**

Two concurrently live regions with the right asymmetry: an interactive map component that stays usable on its own, and a chat component taking unbounded text-or-voice questions that are meaningless without it. The screen-reader use case makes the companion channel consequential rather than decorative - the dialogue is how a non-visual user gets at a visual artifact - which is the strongest available answer to 'why attach a chat to this thing at all'. Transfers to any dense artifact (dashboard, map, model output) whose structure resists linear reading.

> Chosen over the next candidate because: Proxona scopes its turns to the artifact more explicitly ('thoughts on the storyline'), but GeoVisA11y scores 0.2 higher, shows the same two live regions, and avoids duplicating StoryEnsemble's LLM-persona ideation domain.

**5. [Talk to the Hand: an LLM-powered Chatbot with Visual Pointer as Proactive Companion for On-Screen Tasks](https://doi.org/10.1145/3706598.3715579)** — chi-2025 2025 · `4105` · **4.70**

The agent takes the form of a second mouse cursor alongside the user's, with its chat bubble attached to that cursor instead of a dedicated chat log area - agent drawn in the user's own coordinate space, anchored to the pointer, and explicitly owned by no container. That last negative clause is the hardest part of the signature to evidence and this quote states it outright, making it the best-evidenced candidate in the dimension. It is also the dimension's counter-move: the exemplar that shows assistance can have no panel at all, which any desktop or canvas tool can borrow.

> Chosen over the next candidate because: Fairy Cursor is the same cursor-ornament idea from an intro sentence that shows the form but neither the assistance nor the absence of a separate container; Talk to the Hand evidences all three clauses in one line.

*Curator note:* Five slots, seven patterns, so this set leads with five distinct pattern_ids rather than stacking any one - no pattern appears twice and no two entries make the same move. Overrides of pattern-level judgements: (1) rid 2440 Memoro carries the dimension's only 5.0 and is excluded anyway. Its 'modes' are voiced query versus queryless prediction on a screenless in-ear wearable; U09's own boundary is 'visible surface placement and integration, not sensory modality', so leading a layout dimension with a paper that has no visible surface would let a reader define the dimension wrongly from the exemplar alone. (2) pat-087 Dual Artifact Presentation Modes goes unrepresented as a consequence: with Memoro out, rid 10337 is a between-subjects comparison of two interface types with no selector and no single shell, and rid 6070 SceneScout offers two navigation policies over the same imagery with switching behavior nowhere in the quote. None of the three shows a spatial composition, so the pattern as coded in U09 is its weakest-fitting member and buying coverage with any of them would cost a confirmed entry. (3) pat-089 Chat Panels also goes unrepresented. Its best candidate (rid 9215, 3.9) is a full point below the rest of the set, its interestingness is at floor by the curator's own account ('conventional' in one paper's own words), and the papers' contributions lie elsewhere - the ordinary transcript-plus-composer panel is the dimension's baseline, not one of its five best illustrations. Things to distrust in what is kept: every entry rests on a single figure caption or system-section excerpt, so persistence across a session is inferred rather than observed for PolicyPad (and for every pat-086 candidate equally); Selenite's detachment clause is entailed by the host being a third-party page, not stated; GeoVisA11y's quote does not verbatim scope the chat turns to the map, which is the one clause Proxona has and it lacks; and none of the five quotes demonstrates measured outcome impact.

*Near misses:* `2977` DynaVis: Dynamically Synthesized UI Widgets for Visualizatio, `4354` Proxona: Supporting Creators' Sensemaking and Ideation with , `14046` SnapClass: An AI-Enhanced Classroom Management System for Bl, `3465` CreepyCoCreator? Investigating AI Representation Modes for 3, `6070` SceneScout: Towards AI-Driven Access to Street Level Imagery, `8454` Meta-evaluating the Effects of Social Preferences on NPC-eva

### Patterns in U09

#### pat-026 · Unified Workspace

*19 rated · 3 exemplars*

- **[StoryEnsemble: Enabling Dynamic Exploration & Iteration in the Design Process with AI and Forward-Backward Propagation](https://doi.org/10.1145/3746059.3747772)** — uist-2025 2025 · `13741` · 4.95

  Four workflow stages—personas, problems, solutions, and scenarios—occupy one interconnected environment, with forward and backward propagation making their shared state and cross-stage consistency mechanism explicit.

- **[SnapClass: An AI-Enhanced Classroom Management System for Block-Based Programming](https://doi.org/10.1109/vl-hcc65237.2025.00072)** — vlhcc-2025 2025 · `14046` · 4.55

  The evidence explicitly replaces platform switching with one interface for viewing code, tracking progress, grading, and giving feedback, all naturally anchored to the same student-work state.

- **[Dynamite: Real-Time Debriefing Slide Authoring through AI-Enhanced Multimodal Interaction](https://doi.org/10.1109/vl-hcc65237.2025.00023)** — vlhcc-2025 2025 · `13996` · 4.30

  A single real-time workspace couples classroom analytics with slide authoring, allowing interpretation and instructional intervention to occur within one application shell.

*Also ranked (7 more, by rater consensus):*

4. [When Systems Take Initiative: A Design Framework for Adaptive, Mixed-initiative Database Querying](https://doi.org/10.1145/3800645.3812906) — dis-2026 2026 · `16714` · 4.37
5. [AIdeation: Designing a Human-AI Collaborative Ideation System for Concept Designers](https://doi.org/10.1145/3706598.3714148) — chi-2025 2025 · `4455` · 4.28
6. [Script2Screen: Supporting Dialogue-Centric Scriptwriting with Interactive Audiovisual Generation](https://doi.org/10.1145/3742413.3789075) — iui-2026 2026 · `10261` · 4.23
7. [WonderFlow: Narration-Centric Design of Animated Data Videos](https://doi.org/10.1109/tvcg.2024.3411575) — tvcg-2025 2025 · `12311` · 4.03
8. [Protosampling: Enabling Free-Form Convergence of Sampling and Prototyping through Canvas-Driven Visual AI Generation](https://doi.org/10.1145/3772318.3791884) — chi-2026 2026 · `5486` · 3.78
9. [Introducing 3D Sketching to Overcome Challenges of View-Consistency and Progressive Development in 2D Generative AI-Based Car Exterior Design](https://doi.org/10.1145/3706599.3719731) — chiea-2025 2025 · `8412` · 3.77
10. [VideoCraft: A Mixed Reality-empowered Video Generation Workflow with Spatial Layer Editing for Concept Video Creation](https://doi.org/10.1145/3746059.3747606) — uist-2025 2025 · `13651` · 3.73

#### pat-057 · Companion Chat Panel

*30 rated · 3 exemplars*

- **[GeoVisA11y: An AI-based Geovisualization Question-Answering System for Screen-Reader Users](https://doi.org/10.1145/3772318.3790334)** — chi-2026 2026 · `5580` · 4.70

  The persistent interactive map and separate text-or-voice question-answering chat make both live regions explicit. The accessibility use case also demonstrates why a companion channel can materially expand access to a visual artifact without replacing it.

- **[Debate Chatbots to Facilitate Critical Thinking on YouTube: Social Identity and Conversational Style Make A Difference](https://doi.org/10.1145/3613904.3642513)** — chi-2024 2024 · `2446` · 4.50

  A video remains visible on the left while an adjacent chat window supports conversation about it, closely matching the two-region structural signature. The debate-chatbot framing turns the panel into an instrument for critical engagement with otherwise passive media.

- **[Proxona: Supporting Creators' Sensemaking and Ideation with LLM-Powered Audience Personas](https://doi.org/10.1145/3706598.3714034)** — chi-2025 2025 · `4354` · 4.50

  The evidence explicitly pairs a persistent storyline editor with a conversation space where creators ask audience personas about that storyline. It is a clean, transferable example of grounding open-ended dialogue in an independently usable creative artifact.

*Also ranked (7 more, by rater consensus):*

4. [Collaboration with Conversational AI Assistants for UX Evaluation: Questions and How to Ask them (Voice vs. Text)](https://doi.org/10.1145/3544548.3581247) — chi-2023 2023 · `1524` · 4.48
5. [TraceMate: Collaborating with AI in Test-Driven Programming](https://doi.org/10.1109/vl-hcc65237.2025.00035) — vlhcc-2025 2025 · `14009` · 4.37
6. [Helping Johnny Make Sense of Privacy Policies with LLMs](https://doi.org/10.1145/3772318.3791465) — chi-2026 2026 · `5902` · 4.32
7. [LLM-based In-situ Thought Exchanges for Critical Paper Reading](https://doi.org/10.1145/3742413.3789069) — iui-2026 2026 · `10185` · 4.23
8. [Student Interaction with NewtBot: An LLM-as-tutor Chatbot for Secondary Physics Education](https://doi.org/10.1145/3613905.3647957) — chiea-2024 2024 · `8025` · 4.22
9. [VizTA: Enhancing Comprehension of Distributional Visualization with Visual-Lexical Fused Conversational Interface](https://doi.org/10.1111/cgf.70110) — cgf-2025 2025 · `621` · 4.18
10. [Development of an LLM-Based Chatbot to Support Learnability in Stardew Valley: A Diary Study Approach](https://doi.org/10.1145/3706598.3713310) — chi-2025 2025 · `3910` · 4.03

#### pat-086 · Fixed Functional Panel Layout

*30 rated · 3 exemplars*

- **[PolicyPad: Collaborative Prototyping of LLM Policies](https://doi.org/10.1145/3772318.3791689)** — chi-2026 2026 · `4643` · 4.90

  PolicyPad gives collaboration, shared policy authoring, and private model experimentation persistent left–middle–right homes. The layout encodes a consequential shared/private asymmetry, allowing collaborators to coordinate around a common artifact while testing unfinished behavior privately.

- **[DynaVis: Dynamically Synthesized UI Widgets for Visualization Editing](https://doi.org/10.1145/3613904.3642639)** — chi-2024 2024 · `2977` · 4.80

  DynaVis separates data, command entry, the working visualization, and synthesized editing widgets into four named functional regions. It is especially instructive because the stable panel framework gives dynamically generated controls a predictable home while their contents change.

- **[LLM-box vs. Thinking-box: Designing for Deliberate User Engagement with Distorted Information in Conversational Search](https://doi.org/10.1145/3772318.3790271)** — chi-2026 2026 · `5895` · 4.60

  The interface assigns stable regions to task framing, conversational search, and a repository for user-selected material requiring verification. Moving questionable content into a dedicated panel externalizes an epistemic workflow that would otherwise remain buried in the conversation transcript.

*Also ranked (7 more, by rater consensus):*

4. [EvAlignUX: Advancing UX Evaluation through LLM-Supported Metrics Exploration](https://doi.org/10.1145/3706598.3714045) — chi-2025 2025 · `3508` · 4.42
5. [Metaphorian: Leveraging Large Language Models to Support Extended Metaphor Creation for Science Writing](https://doi.org/10.1145/3563657.3595996) — dis-2023 2023 · `16043` · 4.38
6. [Marco: Supporting Business Document Workflows via Collection-Centric Information Foraging with Large Language Models](https://doi.org/10.1145/3613904.3641969) — chi-2024 2024 · `3171` · 4.35
7. [StyleMe: Towards Intelligent Fashion Generation with Designer Style](https://doi.org/10.1145/3544548.3581377) — chi-2023 2023 · `2074` · 4.33
8. [Flowco: Mixed-Initiative Authoring of Reliable End-to-End Data Analyses via Dataflow Graphs and LLMs](https://doi.org/10.1145/3746059.3747636) — uist-2025 2025 · `13726` · 4.32
9. [ReaLJam: Real-Time Human-AI Music Jamming with Reinforcement Learning-Tuned Transformers](https://doi.org/10.1145/3706599.3720227) — chiea-2025 2025 · `8513` · 4.25
10. [Supporting Novices Author Audio Descriptions via Automatic Feedback](https://doi.org/10.1145/3544548.3581023) — chi-2023 2023 · `2170` · 4.22

#### pat-087 · Dual Artifact Presentation Modes

*30 rated · 3 exemplars*

- **[Memoro: Using Large Language Models to Realize a Concise Interface for Real-Time Memory Augmentation](https://doi.org/10.1145/3613904.3642450)** — chi-2024 2024 · `2440` · 5.00

  Memoro is the clearest push-versus-pull instance: one memory-assistance capability operates either through explicit voiced queries or queryless predictive assistance, with only the interaction discipline changing.

- **[SceneScout: Towards AI-Driven Access to Street Level Imagery for Blind Users](https://doi.org/10.1145/3772318.3790449)** — chi-2026 2026 · `6070` · 4.70

  SceneScout exposes the same street-level imagery through either predetermined route traversal or free, user-directed exploration, providing unusually concrete alternative navigation disciplines for the same accessibility need.

- **[Explaining Recommendations through Conversations: Dialog Model and the Effects of Interface Type and Degree of Interactivity](https://doi.org/10.1145/3579541)** — tiis-2023 2023 · `10337` · 4.60

  The study presents recommendation explanations either as a predetermined sequence of graphical steps or through a chatbot-like natural-language interface, with experimental interface assignment acting as the selector.

*Also ranked (7 more, by rater consensus):*

4. [PromptMaker: Prompt-based Prototyping with Large Language Models](https://doi.org/10.1145/3491101.3503564) — chiea-2022 2022 · `6355` · 4.50
5. [AiCommentator: A Multimodal Conversational Agent for Embedded Visualization in Football Viewing](https://doi.org/10.1145/3640543.3645197) — iui-2024 2024 · `10122` · 4.47
6. [Exploring Direct Instruction and Summary-Mediated Prompting in LLM-Assisted Code Modification](https://doi.org/10.1109/vl-hcc65237.2025.00017) — vlhcc-2025 2025 · `13990` · 4.40
7. [Synoptic: Query-Driven Multimodal Product Review Summarization System](https://doi.org/10.1145/3706599.3719820) — chiea-2025 2025 · `8556` · 4.20
8. [Sensecape: Enabling Multilevel Exploration and Sensemaking with Large Language Models](https://doi.org/10.1145/3586183.3606756) — uist-2023 2023 · `13484` · 4.12
9. [MentalImager: Exploring Generative Images for Assisting Support-Seekers' Self-Disclosure in Online Mental Health Communities](https://doi.org/10.1145/3711031) — cscw-2025 2025 · `15177` · 4.00
10. [DevTales: A Tool for Providing Narrative Code Histories into Developer Workflows](https://doi.org/10.1109/vl-hcc65237.2025.00013) — vlhcc-2025 2025 · `13986` · 3.85

#### pat-088 · AI Panels for Host Application

*30 rated · 3 exemplars*

- **[Selenite: Scaffolding Online Sensemaking with Comprehensive Overviews Elicited from Large Language Models](https://doi.org/10.1145/3613904.3642149)** — chi-2024 2024 · `2436` · 4.83

  Selenite leaves the webpage intact while attaching AI-generated support at two identifiable host locations: a global overview beside the page and local, paragraph-level annotations within it. This global/local anchoring makes the insertion architecture unusually explicit, rich, and transferable to other reading and inspection workflows.

- **[IntentPrism: Human-AI Intent Manifestation for Web Information Foraging](https://doi.org/10.1145/3706599.3719744)** — chiea-2025 2025 · `8405` · 4.58

  IntentPrism is explicitly implemented as a browser plug-in that adds an intent-tree visualization and highlights relevant content on otherwise independent webpages. It demonstrates both a separable panel-like layer and content-level anchoring, while connecting information gathered across multiple host pages.

- **[Supporting Novice Researchers to Write Literature Review using Language Models](https://doi.org/10.1145/3613905.3650787)** — chiea-2024 2024 · `7718` · 4.40

  LitWeaver preserves Notion as the document-authoring host and adds a detachable Chrome-extension widget at its side. Detecting the host document and the user's current focus establishes how the added surface is contextually anchored, making the integration reconstructable even though its spatial form is conventional.

*Also ranked (7 more, by rater consensus):*

3. [Toward Personalizable AI Node Graph Creative Writing Support: Insights on Preferences for Generative AI Features and Information Presentation Across Story Writing Processes](https://doi.org/10.1145/3706598.3713569) — chi-2025 2025 · `4124` · 4.37
4. [PromptInfuser: Bringing User Interface Mock-ups to Life with Large Language Models](https://doi.org/10.1145/3544549.3585628) — chiea-2023 2023 · `7049` · 4.32
5. [DevTales: A Tool for Providing Narrative Code Histories into Developer Workflows](https://doi.org/10.1109/vl-hcc65237.2025.00013) — vlhcc-2025 2025 · `13986` · 4.28
6. [Generating Automatic Feedback on UI Mockups with Large Language Models](https://doi.org/10.1145/3613904.3642782) — chi-2024 2024 · `2553` · 4.27
8. [Aptly: Making Mobile Apps from Natural Language](https://doi.org/10.1145/3706599.3720081) — chiea-2025 2025 · `8133` · 4.13
9. [INLAY: Preemptive, In-Context Intelligence for Casual Web Browsing](https://doi.org/10.1145/3772363.3799065) — chiea-2026 2026 · `9370` · 4.13
10. [WePilot: Integrating Younger Family Members and Chatbot to Support Older Adults Learning Smartphone Usage](https://doi.org/10.1145/3757703) — cscw-2025 2025 · `15726` · 4.03

#### pat-089 · Chat Panels

*19 rated · 3 exemplars*

- **[Disclose with Care: AI Scaffolds for Privacy in Chatbot Interviews](https://doi.org/10.1145/3772363.3798850)** — chiea-2026 2026 · `9215` · 3.90

  The evidence directly identifies both defining regions: scrollable user–chatbot logs and a composition area containing a text box and send affordance.

- **[Chatbots for Data Collection in Surveys: A Comparison of Four Theory-Based Interview Probes](https://doi.org/10.1145/3706598.3714128)** — chi-2025 2025 · `3645` · 3.80

  Its message-bubble list plus bottom input area and submit button provides an unusually direct, reconstruction-ready description of the two-region layout.

- **[Meta-evaluating the Effects of Social Preferences on NPC-evaluators in an Energy Community Game](https://doi.org/10.1145/3706599.3720218)** — chiea-2025 2025 · `8454` · 3.10

  The main surface is explicitly a chat interface, and free-form replies are entered through a box anchored at the bottom, substantially supporting the two-region structure.

*Also ranked (7 more, by rater consensus):*

4. [Data Has Entered the Chat: How Data Workers Conduct Exploratory Visual Analytic Conversations with GenAI Agents](https://doi.org/10.1145/3744750) — tiis-2025 2025 · `10412` · 3.02
5. [CASEbot: A Conversational Agent for Structuring and Personalizing the Design of Self-Experiments in Personal Health](https://doi.org/10.1145/3772318.3791551) — chi-2026 2026 · `6141` · 2.87
6. [ChatHAP: A Chat-Based Haptic System for Designing Vibrations through Conversation](https://doi.org/10.1145/3706598.3713441) — chi-2025 2025 · `4424` · 2.72
7. [OnGoal: Tracking and Visualizing Conversational Goals in Multi-Turn Dialogue with Large Language Models](https://doi.org/10.1145/3746059.3747746) — uist-2025 2025 · `13702` · 2.47
8. [SciConv: A Conversational Tool for Reproducibility](https://doi.org/10.1109/vl-hcc65237.2025.00071) — vlhcc-2025 2025 · `14045` · 2.47
9. [PDFChatAnnotator: A Human-LLM Collaborative Multi-Modal Data Annotation Tool for PDF-Format Catalogs](https://doi.org/10.1145/3640543.3645174) — iui-2024 2024 · `10146` · 2.38
10. [When Systems Take Initiative: A Design Framework for Adaptive, Mixed-initiative Database Querying](https://doi.org/10.1145/3800645.3812906) — dis-2026 2026 · `16714` · 2.33

#### pat-091 · In-Situ Agent Presence

*11 rated · 3 exemplars*

- **[Talk to the Hand: an LLM-powered Chatbot with Visual Pointer as Proactive Companion for On-Screen Tasks](https://doi.org/10.1145/3706598.3715579)** — chi-2025 2025 · `4105` · 4.70

  The agent is rendered as a second mouse cursor inside the active screen surface, with communication attached directly to that cursor and no dedicated chat-log area. This is an unusually complete match for the pattern: the agent has a persistent, pointer-relative visible form in the user's coordinate space, and its location identifies where assistance is focused.

- **[Exploring Fairy Cursor as a Form of AI Agent for In-the-Flow Assistance: Design Opportunities and Challenges](https://doi.org/10.1145/3800645.3813082)** — dis-2026 2026 · `16713` · 4.20

  Fairy Cursor turns the assistive agent into a lightweight visual companion that follows the mouse pointer, keeping its presence attached to the user's locus of action. The pointer anchoring is a direct, portable implementation of in-situ presence and makes the agent part of the work surface rather than a detached conversational destination.

- **[CreepyCoCreator? Investigating AI Representation Modes for 3D Object Co-Creation in Virtual Reality](https://doi.org/10.1145/3706598.3713720)** — chi-2025 2025 · `3465` · 4.10

  The AI incrementally adds and modifies highlighted elements at selected positions within the shared 3D artifact while the user continues painting. Its actions are spatially anchored, visibly attributable, and interleaved with the user's work, demonstrating the pattern through live artifact manipulation rather than a pointer companion.

*Also ranked (6 more, by rater consensus):*

4. [PointAloud: An Interaction Suite for AI-Supported Pointer-Centric Think-Aloud Computing](https://doi.org/10.1145/3772318.3790797) — chi-2026 2026 · `6167` · 4.00
5. [StoryDrawer: A Child-AI Collaborative Drawing System to Support Children's Creative Visual Storytelling](https://doi.org/10.1145/3491102.3501914) — chi-2022 2022 · `965` · 3.60
6. [When is a Tool a Tool? User Perceptions of System Agency in Human-AI Co-Creative Drawing](https://doi.org/10.1145/3563657.3595977) — dis-2023 2023 · `16164` · 3.60
7. [AI See, You See: Human-AI Musical Collaboration in Augmented Reality](https://doi.org/10.1145/3706599.3720052) — chiea-2025 2025 · `8115` · 3.32
8. [Colorbo: Envisioned Mandala Coloringthrough Human-AI Collaboration](https://doi.org/10.1145/3490099.3511135) — iui-2022 2022 · `9992` · 2.70
9. [Cocoa: Co-Planning and Co-Execution with AI Agents](https://doi.org/10.1145/3772318.3791673) — chi-2026 2026 · `5968` · 1.90

## U10 · Agent Identity & Multi-Party Roles

*Fitting into the work* — 343 eligible papers, 343 shortlisted, 5 selected.

**1. [When AI Gets It Wrong: Scaffolding AI Hallucination Detection for Children Through Chatbot Creation](https://doi.org/10.1145/3772318.3791480)** — chi-2026 2026 · `5396` · **4.55**

A dedicated bot-prompt editor exposes the agent's specification as editable fields — bot name, role and purpose, personality and tone, rules and constraints — held in a panel distinct from the knowledge base and the testing panel. It is U10's cleanest case of identity itself being the user-facing surface: a non-expert authors the persona, then talks to what they authored. Any chatbot-authoring or assistant-configuration product can lift the field set and the editor/knowledge/test three-panel split directly.

> Chosen over the next candidate because: Chosen over rid 8121, whose two-stage pipeline varies register (Authoritative, Concise, Talkative) applied downstream as an output rewrite — architecturally tidy, but a repaint stage is neither a visible role nor a party, which U10's boundary requires.

**2. [Rehearsal: Simulating Conflict to Teach Conflict Resolution](https://doi.org/10.1145/3613904.3642159)** — chi-2024 2024 · `3062` · **4.93**

The user enters a conflict as themselves, rehearses against a believable simulated interlocutor, and can rerun the encounter counterfactually with 'what if?' variations. It is the only candidate in the dimension whose evidence covers the restart clause that separates a role-play scenario from ordinary simulated dialogue: re-entry re-runs the world rather than continuing the transcript. Any training, negotiation, or interviewing tool can adopt the enact-then-rerun loop without the conflict-resolution framing.

> Chosen over the next candidate because: Chosen over rid 3944 because 3944's quote lists an avatar and an authoring interface side by side without showing the switch into role or any restart, and its setup surface belongs to a coach rather than the participant.

**3. [ChoiceMates: Supporting Unfamiliar Online Decision-Making with Multi-Agent Conversational Interactions](https://doi.org/10.1145/3742413.3789107)** — iui-2026 2026 · `10263` · **4.93**

The user holds a visible hub role with differentiated addressing rights — broadcast to all agents, tag a subset, or recruit new agents into the space — so the multi-party topology is exposed as controls rather than implied by a scenario. Hovering an agent reveals its profile and the criteria it values, individuating the spokes on screen. The control vocabulary is domain-independent: any tool with more than one assistant can copy broadcast / subset / recruit.

> Chosen over the next candidate because: Chosen over rid 4623, whose actual structural content is two role-specific surfaces over one backend with a dashboard private to the instructor — the role-asymmetric-views move, already led here by rid 7634.

**4. [Leveraging Large Language Models to Enhance Domain Expert Inclusion in Data Science Workflows](https://doi.org/10.1145/3613905.3651115)** — chiea-2024 2024 · `7634` · **4.90**

One tracked dataframe state is rendered through two professional surfaces: a notebook extension for the data scientist and a dashboard for the domain expert, where code operations arrive as text summaries and SnapGrid version cards. The difference between views is by construction, not by permission toggles, which is what makes it teachable. The expert-plus-practitioner split transplants to clinical, legal, or operations tooling unchanged.

> Chosen over the next candidate because: Chosen over rid 3414, whose own separately coded evidence puts parent and child on one shared tablet screen — affirmatively contrary to the pattern's requirement of role-specific front-ends with a private channel.

**5. [Wisdom of the Crowd, Without the Crowd: A Socratic LLM for Asynchronous Deliberation on Perspectivist Data](https://doi.org/10.1145/3757707)** — cscw-2025 2025 · `15643` · **4.75**

An established crowd-deliberation procedure is kept intact while the other crowdworkers are replaced by a Socratic LLM partner, leaving one human inside an otherwise unchanged multi-role process. Every clause of the substitution is named in the evidence: the procedure, the displaced role, and the phrase 'in place of'. It shows the move where the point is epistemic rather than interpersonal rehearsal, which is where it generalizes — any panel, review, or deliberation workflow can be collapsed to one participant this way.

> Chosen over the next candidate because: Chosen over rid 4052, which is a fourth instance of 'the model plays the difficult counterpart while you practise' — the same lesson rid 3062 already carries more completely.

*Curator note:* Both reviewers' evidence checks overrode the pattern-level ranking in three places. pat-042: the curator's first place, rid 8121, was dropped — its varying slot is communication register applied as a post-hoc rewrite of finished text, which is an output transform rather than a user-facing identity, and U10's classification boundary excludes it; its stated reason for beating rid 5396 (persistence shown vs. implied) also fails, since neither quote states persistence. pat-045: rid 4623 (ClassAid) was set aside because both reviewers found its quote describes role-specific front-ends over shared state with an instructor-only channel — the pat-047 signature, already led by rid 7634 — and because leading it under pat-045 would double-book that move. pat-047: rid 5432 was set aside on the same boundary ground as 8121; a Wizard-of-Oz console is constitutively hidden from the end user, so its asymmetry is between experimenter and participant, not between parties in the system's social organization. One exemplar per pattern; no pattern is doubled and no liberty was taken. pat-094 (Artifact as Interlocutor) is unrepresented: its only candidate, rid 3352 CharacterMeet, scores 2.9 (1.6 below the rest of the field) and one reviewer found the record affirmatively contradicts the signature — the same paper's other coded evidence names editable Character Description fields alongside the conversation, which is the arrangement pat-094 is defined against. The pattern has 7 edges corpus-wide and only 2 rated candidates, so this is a corpus coverage gap rather than a curation error; it should be re-mined rather than filled. Reviewers proposed three promotions from outside the candidate list — rid 13413 (Social Simulacra) for pat-042, rid 16983 (PairBuddy) for pat-048, rid 5108 (Moodialogue) for pat-094. None could be executed here: the input file carries no title, venue, year, or URL for those records, and bibliographic fields must come verbatim from it. They are worth auditioning on a pass that includes their records, particularly rid 13413, since 'simulated' population is named in the dimension definition and no surviving exemplar covers identity at population scale. What to distrust: (1) rid 7634's evidence shows state flowing notebook-to-dashboard only, so the signature's bidirectional visibility is confirmed in one direction. (2) rid 5396's persistence across turns is inferred from the specification's placement in the bot prompt, not stated; U10 is also a secondary aspect of that paper, whose other central codings are process disclosure and model comparison. (3) rid 10263 and rid 15643 rest on abstract-level quotes, so simultaneity and outcomes cannot be audited from what is coded. (4) The surviving set skews toward practice/training and education domains, and no exemplar comes from software engineering or any production work setting.

*Near misses:* `8121` Adapting Communication Styles in Health Chatbot using Large , `4623` ClassAid: A Real-time Instructor-AI-Student Orchestration Sy, `5619` ScamPilot: Simulating Conversations with LLMs to Protect Aga, `5432` Prototyping Multimodal GenAI Real-Time Agents with Counterfa, `3544` Beyond the Dialogue: Multi-chatbot Group Motivational Interv, `3352` CharacterMeet: Supporting Creative Writers' Entire Story Cha

### Patterns in U10

#### pat-042 · Persona Assigned to Agents

*30 rated · 3 exemplars*

- **[Adapting Communication Styles in Health Chatbot using Large Language Models to Support Family Caregivers from Multicultural Backgrounds](https://doi.org/10.1145/3706599.3719711)** — chiea-2025 2025 · `8121` · 4.60

  The system cleanly separates task generation from a reusable persona-style slot: a therapist produces the substantive response, then a modifier consistently applies one of six selected communication styles. This is the clearest evidence that identity presentation can vary while the task and content pipeline remain fixed.

- **[When AI Gets It Wrong: Scaffolding AI Hallucination Detection for Children Through Chatbot Creation](https://doi.org/10.1145/3772318.3791480)** — chi-2026 2026 · `5396` · 4.55

  A dedicated bot-prompt editor exposes name, role, purpose, personality, and tone independently from the knowledge base and turn-level conversation. The controls make the persona specification unusually visible, editable, and transferable to other chatbot-authoring interfaces.

- **[Towards AI as Colleagues: Multi-Agent System Improves Structured Ideation Processes](https://doi.org/10.1145/3772318.3790375)** — chi-2026 2026 · `6206` · 4.45

  Users first select persona experts and then interact with agents that continue contributing from their assigned perspectives, establishing a visible select-once, apply-through-discussion relationship. It is a strong user-facing example of stable agent roles shaping subsequent output.

*Also ranked (7 more, by rater consensus):*

1. [Social Simulacra: Creating Populated Prototypes for Social Computing Systems](https://doi.org/10.1145/3526113.3545616) — uist-2022 2022 · `13413` · 4.65
3. [CloChat: Understanding How People Customize, Interact, and Experience Personas in Large Language Models](https://doi.org/10.1145/3613904.3642472) — chi-2024 2024 · `2592` · 4.40
6. [PCGEF: A Framework for Diagnosing Subjective Alignment in Human-Centered Persona-Conditioned Generation](https://doi.org/10.1145/3772318.3791402) — chi 2026 · `5582` · 4.32
7. [Customizable AI for Depression Care: Improving the User Experience of Large Language Model-Driven Chatbots](https://doi.org/10.1145/3715336.3735795) — dis-2025 2025 · `16541` · 4.32
8. [PersonaFlow: Designing LLM-Simulated Expert Perspectives for Enhanced Research Ideation](https://doi.org/10.1145/3715336.3735789) — dis-2025 2025 · `16465` · 4.27
9. [Who You Explain To Matters: Learning by Explaining to Conversational Agents with Different Pedagogical Roles](https://doi.org/10.1145/3772318.3790298) — chi-2026 2026 · `5443` · 4.18
10. [Language of Zelda: Facilitating Language Learning Practices Using ChatGPT](https://doi.org/10.1145/3613905.3648107) — chiea-2024 2024 · `8046` · 4.17

#### pat-044 · Role-Play Scenario

*30 rated · 3 exemplars*

- **[Rehearsal: Simulating Conflict to Teach Conflict Resolution](https://doi.org/10.1145/3613904.3642159)** — chi-2024 2024 · `3062` · 4.93

  The user enters a conflict as a participant, interacts with a believable simulated counterpart, and can rerun counterfactual versions to explore different conversational behavior—the most complete evidence of enactment, world response, and restart among the candidates.

- **[Generative Role-Play Communication Training in Virtual Reality for Autistic Individuals: A Study on Job Coach Experiences in Vocational Training Programs](https://doi.org/10.1145/3706598.3713507)** — chi-2025 2025 · `3944` · 4.67

  Its separation between coach-authored scenario setup and trainee enactment with an LLM-powered avatar makes the transition from configuration to in-role participation unusually visible.

- **[CareerSim: Gamification Design Leveraging LLMs For Career Development Reflection](https://doi.org/10.1145/3613905.3650928)** — chiea-2024 2024 · `7482` · 4.58

  Players configure an in-world identity before entry, after which attribute-conditioned career events turn their inputs into consequential choices inside the simulation rather than instructions to a tool.

*Also ranked (7 more, by rater consensus):*

3. [Social Simulation for Everyday Self-Care: Design Insights from Leveraging VR, AR, and LLMs for Practicing Stress Relief](https://doi.org/10.1145/3706598.3713115) — chi-2025 2025 · `4509` · 4.53
4. [Conversate: Supporting Reflective Learning in Interview Practice Through Interactive Simulation and Dialogic Feedback](https://doi.org/10.1145/3701188) — cscw-2025 2025 · `15126` · 4.47
6. [Social Life Simulation for Non-Cognitive Skills Learning](https://doi.org/10.1145/3711068) — cscw-2025 2025 · `15162` · 4.35
7. [DOLLama: Fostering Family Anti-Bullying Learning through AI-Augmented, Toy-Mediated Educational Drama](https://doi.org/10.1145/3772318.3790687) — chi-2026 2026 · `5336` · 4.32
8. [TutorUp: What If Your Students Were Simulated? Training Tutors to Address Engagement Challenges in Online Learning](https://doi.org/10.1145/3706598.3713589) — chi-2025 2025 · `4052` · 4.15
9. [CoEmpaTeam: Enhancing Cognitive Empathy using LLM-based Avatars and Dynamic Role Play in Virtual Reality](https://doi.org/10.1145/3772318.3790389) — chi-2026 2026 · `6191` · 4.15
10. [Unlocking the Power of Speech: Game-Based Accent and Oral Communication Training for Immigrant English Language Learners via Large Language Models](https://doi.org/10.1145/3706598.3713945) — chi-2025 2025 · `3746` · 4.05

#### pat-045 · Multiparty Hub and Spoke

*30 rated · 3 exemplars*

- **[ChoiceMates: Supporting Unfamiliar Online Decision-Making with Multi-Agent Conversational Interactions](https://doi.org/10.1145/3742413.3789107)** — iui-2026 2026 · `10263` · 4.93

  The user occupies a visible hub role with unique controls to broadcast to all agents, address selected spokes, or recruit new ones; agent participation and system behavior therefore depend directly on role and population composition.

- **[ClassAid: A Real-time Instructor-AI-Student Orchestration System for Classroom Programming Activities](https://doi.org/10.1145/3772318.3790824)** — chi-2026 2026 · `4623` · 4.90

  Students interact with personalized TA agents while an instructor observes those interactions through a separate dashboard and alone can change agent modes, creating concurrent and operationally interdependent student, instructor, and agent roles.

- **[ScamPilot: Simulating Conversations with LLMs to Protect Against Online Scams](https://doi.org/10.1145/3772318.3791313)** — chi-2026 2026 · `5619` · 4.67

  A scammer agent attacks, a target agent responds, and the human supplies real-time advice specifically to the target, making all three role slots, their unequal input rights, and their structural dependency unusually explicit.

*Also ranked (7 more, by rater consensus):*

3. [GraftMind: Facilitating Group Ideation with AI-Mediated Idea Sharing](https://doi.org/10.1145/3772318.3791388) — chi-2026 2026 · `4672` · 4.65
5. [ConversAR: Exploring Embodied LLM-Powered Group Conversations in Augmented Reality for Second Language Learners](https://doi.org/10.1145/3706599.3720162) — chiea-2025 2025 · `8213` · 4.45
6. [To Err is AI: Imperfect Interventions and Repair in a Conversational Agent Facilitating Group Chat Discussions](https://doi.org/10.1145/3579532) — cscw-2023 2023 · `14541` · 4.43
7. [Virtual Triplets: A Mixed Modal Synchronous and Asynchronous Collaboration with Human-Agent Interaction in Virtual Reality](https://doi.org/10.1145/3613905.3650766) — chiea-2024 2024 · `7777` · 4.40
8. [Exploring a Collaborative Gamified Approach to Vision-Language Model Evaluation](https://doi.org/10.1145/3772363.3799410) — chiea-2026 2026 · `9260` · 4.38
9. [CharacterCritique: Supporting Children's Development of Critical Thinking through Multi-Agent Interaction in Story Reading](https://doi.org/10.1145/3706598.3713602) — chi-2025 2025 · `4425` · 3.85
10. [Time Travel Tours: An Accessible Social VR Storytelling Tool for Older Adults](https://doi.org/10.1145/3706599.3721196) — chiea-2025 2025 · `8812` · 3.82

#### pat-047 · Role Asymmetric Views

*30 rated · 3 exemplars*

- **[Leveraging Large Language Models to Enhance Domain Expert Inclusion in Data Science Workflows](https://doi.org/10.1145/3613905.3651115)** — chiea-2024 2024 · `7634` · 4.90

  Data scientists manipulate data in notebooks while domain experts receive a dedicated dashboard that translates the same tracked dataframe state into summaries and SnapGrid version cards, clearly demonstrating two role-specific surfaces connected through shared state.

- **[AACessTalk: Fostering Communication between Minimally Verbal Autistic Children and Parents with Contextual Guidance and Card Recommendation](https://doi.org/10.1145/3706598.3713792)** — chi-2025 2025 · `3414` · 4.70

  Within one shared conversation, the parent receives real-time engagement guidance while the child receives contextual vocabulary cards, giving the two participants complementary role-specific assistance rather than a common interface.

- **[Prototyping Multimodal GenAI Real-Time Agents with Counterfactual Replays and Hybrid Wizard-of-Oz](https://doi.org/10.1145/3772318.3790800)** — chi-2026 2026 · `5432` · 4.65

  The wizard privately triggers model operations and chooses whether generated messages cross into the user’s separate SocraBot interface, exposing both the role-gated control channel and the controlled propagation of shared interaction state.

*Also ranked (7 more, by rater consensus):*

4. [Accompany Sleep: Using GenAI to Create Bedtime Stories for Mediating Parent-Child Relationships in LBC Families](https://doi.org/10.1145/3706598.3713192) — chi-2025 2025 · `3623` · 4.45
5. [SnapClass: An AI-Enhanced Classroom Management System for Block-Based Programming](https://doi.org/10.1109/vl-hcc65237.2025.00072) — vlhcc-2025 2025 · `14046` · 4.18
6. [C-A2Meet: Malleable, Role-Aware AI Interfaces for Video Conferencing](https://doi.org/10.1145/3772363.3798532) — chiea-2026 2026 · `9128` · 4.17
7. [Collaborative School Mental Health System: Leveraging a Conversational Agent for Enhancing Children's Executive Function](https://doi.org/10.1145/3613904.3642593) — chi-2024 2024 · `2485` · 4.13
8. [CHOIR: A Chatbot-mediated Organizational Memory Leveraging Communication in University Research Labs](https://doi.org/10.1145/3772318.3791314) — chi-2026 2026 · `6023` · 4.13
9. [Customizing Generated Signs and Voices of AI Avatars: Deaf-Centric Mixed-Reality Design for Deaf-Hearing Communication](https://doi.org/10.1145/3710953) — cscw-2025 2025 · `15127` · 4.03
10. [MindfulDiary: Harnessing Large Language Model to Support Psychiatric Patients' Journaling](https://doi.org/10.1145/3613904.3642937) — chi-2024 2024 · `3164` · 3.97

#### pat-048 · Simulated Counterparts

*30 rated · 3 exemplars*

- **[Wisdom of the Crowd, Without the Crowd: A Socratic LLM for Asynchronous Deliberation on Perspectivist Data](https://doi.org/10.1145/3757707)** — cscw-2025 2025 · `15643` · 4.75

  The clearest structural match: an established crowd-deliberation procedure remains intact while one person participates asynchronously and the LLM explicitly takes the place of the other crowdworkers.

- **[TutorUp: What If Your Students Were Simulated? Training Tutors to Address Engagement Challenges in Online Learning](https://doi.org/10.1145/3706598.3713589)** — chi-2025 2025 · `4052` · 4.50

  TutorUp converts tutor–student practice into a solo training loop by assigning the student role to GPT-4o, including recognizable engagement-challenge scenarios that preserve the interpersonal procedure's purpose.

- **[Beyond the Dialogue: Multi-chatbot Group Motivational Interviewing for Premenstrual Syndrome (PMS) Management](https://doi.org/10.1145/3706598.3713918)** — chi-2025 2025 · `3544` · 4.50

  This is the strongest n>2 example: it transplants the social form of group motivational interviewing into an experience where multiple chatbots fill the surrounding group roles for one participant.

*Also ranked (7 more, by rater consensus):*

3. [Exploring Learners' Expectations and Engagement When Collaborating with Constructively Controversial Peer Agents](https://doi.org/10.1145/3772318.3790796) — chi-2026 2026 · `5603` · 4.35
4. [Designing PairBuddy - A Conversational Agent for Pair Programming](https://doi.org/10.1145/3498326) — tochi-2022 2022 · `16983` · 4.35
5. [Agentic Audio Moderator vs Human Moderator in Think-Aloud Usability Testing: Results from a Randomized Controlled Trial: Results from a Randomized Controlled Trial](https://doi.org/10.1145/3772318.3791653) — chi-2026 2026 · `6058` · 4.33
6. [HAT Swapping: Virtual Agents as Stand-Ins for Absent Human Instructors in Virtual Training](https://doi.org/10.1109/tvcg.2025.3616749) — tvcg-2025 2025 · `12692` · 4.33
8. [PosterMate: Audience-driven Collaborative Persona Agents for Poster Design](https://doi.org/10.1145/3746059.3747769) — uist-2025 2025 · `13788` · 4.27
9. [It Talks Like a Patient, But Feels Different: Co-Designing AI Standardized Patients with Medical Learners](https://doi.org/10.1145/3772363.3798336) — chiea-2026 2026 · `9001` · 4.23
10. [Rehearsal: Simulating Conflict to Teach Conflict Resolution](https://doi.org/10.1145/3613904.3642159) — chi-2024 2024 · `3062` · 4.17

#### pat-094 · Artifact as Interlocutor

*2 rated · 1 exemplars*

- **[CharacterMeet: Supporting Creative Writers' Entire Story Character Construction Processes Through Conversation with LLM-Powered Chatbot Avatars](https://doi.org/10.1145/3613904.3642105)** — chi-2024 2024 · `3352` · 2.90

  CharacterMeet directly instantiates an artifact under construction—the story character—as an in-character chatbot avatar and uses conversation to support constructing that character, although the evidence does not confirm that replies update its specification or that dialogue is the only authoring surface.

*Also ranked (1 more, by rater consensus):*

2. [AI-Driven Co-Construction of Synthetic Personas for Early-Stage B2B User Research: An Exploratory Study](https://doi.org/10.1145/3772363.3798319) — chiea-2026 2026 · `9046` · 2.52
