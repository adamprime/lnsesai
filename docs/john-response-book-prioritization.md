# Response to John -- Book Prioritization & Lens System

**Date:** 2026-02-16

---

## 1. Prioritizing books within lenses (tags)

Yes, the system already supports this. Each book-to-tag assignment has a **weight** (currently 1 or 3, where 3 = high priority). When a lens is assembled, higher-weight books surface first. So you can absolutely designate your top 5-10% as "top tier" (weight 3) and leave the rest at weight 1. We don't need three tiers -- two is exactly right and that's how it's built. Just ignore weight 2 and use 1 or 3.

## 2. Ordering books within a lens for specific topics

*Example: "When the client asks about giving feedback, start with Rock (Your Brain at Work), then go to Stone & Heen (Thanks for the Feedback), then go to Scott (Radical Candor)."*

This is a **new capability we'd need to build**. Right now the weight system controls priority but not strict ordering. What you're describing is essentially a **recommended reading sequence** within a lens -- "when the question is about feedback, present these books in this order."

I could add a `display_order` field to the tag assignments so you can specify exact sequencing for your top-tier books. The rest would sort alphabetically or by weight. This is doable but isn't built yet.

## 3. Books under multiple lenses

**Yes, absolutely. This is already fully supported.** A book like "Larkin & Larkin, Communicating Change" can be tagged with both Communication and Change, and it will appear in both lenses. Same for "Denning, Leader's Guide to Storytelling" appearing in both Influence and Leadership.

The system is designed for this -- each book can have as many tag assignments as needed, each with its own weight per lens.

## 4. Keyword-level routing

*Example: "If the question is about negotiation, send them to a couple of key books on negotiations."*

This is more advanced and not built yet. Right now the system works at the lens/tag level. What you're describing is essentially sub-topic routing within or across lenses. This would be part of the **custom lens generation feature** (the chat interface) that's on the roadmap. When we build that, we can encode rules like "keyword 'negotiation' → prioritize these specific books" as part of the generation logic.

## Bottom line for John's categorization work

Focus on two things:

1. **Assign each book to one or more lens tags** (a book can appear in multiple lenses)
2. **Mark top-tier books** with a priority designation (top tier vs. the rest)

That's all we need from the spreadsheet to get these loaded. The sequencing and keyword routing are future features we'll build when we tackle the customer-facing chat interface.

## Weight system reminder

- **Weight 3** = Top tier (super important, use first)
- **Weight 1** = Standard (important enough to be in the lens, but not the first recommendation)

Higher number = higher priority.

---

## New batch: 22 books processed

I've processed the latest batch of 22 books. They're split into individual files and ready to go. Before we can upload them, there are some items that need your attention.

### Books that need lens/tag assignments

These books came through without any tags assigned. When you get a chance, let me know which lens(es) each of these should go under:

- **How Creativity Works** by Burnstein -- no tags at all
- **Managing Diversity: A Complete Desk Reference and Planning Guide** by Anita Rowe, Lee Gardenswartz -- no tags at all
- **Return of the Mentor** by Caldwell, Carter -- no tags at all

These next ones have one tag but are missing a second (which may be fine -- they just need confirmation):

- **Team Renaissance** by Richard E. Spoon, Jan Risher -- currently only tagged "Teaming"
- **The Art of Thinking** by Debelli -- currently only tagged "Thinking"
- **Selling Vision** by Schachter, Cheatham -- currently only tagged "Selling"
- **Organizational Coaching** by Bianco Mathis -- currently only tagged "Coaching"
- **Change Forces with a Vengeance** by Fullan -- currently only tagged "Managing Change"
- **Connect** by Bradford, Robin -- currently only tagged "Selling"

### Books with possible errors to verify

These had issues in the AI-generated analysis that I caught during processing. John, please confirm whether these need to be re-analyzed:

- **Communicating Change** (Larson & Larson) -- The summary that was generated is actually about a completely different book: "Communicating *for* a Change" by Andy Stanley, which is about preaching. The real book by Larkin & Larkin is about organizational change communication. This one needs to be redone.

- **The Art of Thinking** (Debelli) -- The summary is actually about Vincent Ruggiero's "The Art of Thinking: A Guide to Critical and Creative Thought," not Debelli's "The Art of Thinking Clearly." The AI flagged this mismatch itself in the source file.

- **How Creativity Works** (Burnstein) -- The summary is about Julie Burstein's "Spark: How Creativity Works." The author's last name may be misspelled (Burnstein vs. Burstein). Please confirm which book/author this should be.

- **Connect** (Bradford, Robin) -- The author name is misspelled in the source -- "Braqdford" instead of "Bradford." Also, it's currently tagged as "Selling" but this is a book about building interpersonal relationships (based on the Stanford "Touchy Feely" course). Might belong under a different lens.

- **The Cambridge Handbook of Meeting Sciencwe** -- Typo in the title: "Sciencwe" should be "Science."

- **Change Forces with a Vengence** -- Typo in the title: "Vengence" should be "Vengeance."

---

## Update: Full batch processed (124 books total)

I processed the second export (102 more books from 021626_export.md) along with the original 22. Your corrections from the first batch have been applied:

- How Creativity Works -> tagged "Creativity", author fixed to "Burstein"
- Managing Diversity -> tagged "Teaming"
- Return of the Mentor -> tagged "HR"
- Connect -> author fixed to "Bradford"
- Cambridge Handbook of Meeting Science -> title typo fixed
- Change Forces with a Vengeance -> title typo fixed
- All single-tag books confirmed as OK per John

### Sources to ignore (AI couldn't find them)

These weren't in the original 22-book batch. Some showed up in the new 102-book export but the AI flagged them as not found. We're skipping these per your instructions:

- Sales Teams, Don't Undervalue Face Time -- HBR Editors
- What Makes a Great Negotiator -- Sezer, O.
- To Negotiate Better, Start with Yourself -- Galinsky, A.
- Most Leaders Don't Celebrate Their Wins -- McGregor, L.
- Psychology of Persuasion in Modern Work -- Syal, R.
- Stop Making Unconscious Tradeoffs -- HBR Editors
- Why Smart People Make Bad Decisions -- HBR Editors
- Empowerment Through Coaching -- Stosny, S.
- Coaching Leaders -- O'Donovan, D.
- Coaching in the Flow of Work -- Neely, A.

### Books that need to be redone 

- Communicating Change (Larkin & Larkin) -- wrong book summarized
- The Art of Thinking (Debelli) -- wrong book summarized
- Connect (Bradford, Robin) -- getting redone, will stay under Selling
- The Cambridge Handbook of Meeting Science -- getting redone
- Change Forces with a Vengeance -- getting redone

### New flagged books from the 102-book export

I reviewed all 17 originally flagged items more carefully. Most are fine. Here's the breakdown:

**Articles, not books -- but that's fine (our system handles articles):**

- **3 Ways Our Brains Undermine Our Ability to Be a Good Leader** (Higgins, E. T.) -- HBR article. Summary and themes look good. No action needed.
- **The Most Effective Negotiation Tactic, According to AI** (Park, S.) -- HBR article. Summary and themes look good. No action needed.
- **Being Well Connected Isn't Always Good for Your Career** (Uzzi, B.) -- Academic article. Summary and themes look good. No action needed.

**Content is usable -- AI found the right topic, just slightly different source title:**

- **Fix Your Culture by Starting With Habits** (HBR Editors) -- drawn from HBR's 10 Must Reads on Culture. Content is on-topic. No action needed.
- **The Neuroscience of Influence** (HBR Editors) -- drawn from HBR's influence/persuasion collection. Content is on-topic. No action needed.
- **When Your Leadership Style Doesn't Match Culture** (HBR Editors) -- AI found the right topic area. Content is on-topic. No action needed.
- **Persuasion in High-Stakes Settings** (HBR Editors) -- drawn from HBR's Influence and Persuasion series. Content is on-topic. No action needed.
- **Innovation in Scarcity Environments** (HBR Editors) -- synthesized from HBR's innovation collection. Content is on-topic. No action needed.

**Duplicate entry -- should drop one:**

- **Teams Learning vs Performance** AND **Teams Prioritizing Learning vs Performance** (Harvey, J. F., & Sohn, W.) -- These appear to be the same academic paper entered under two slightly different titles. John, which one should we keep? Or keep both and you'll merge in the admin?

**Genuinely wrong content -- need to be redone (6 total):**

- **How Biases Damage Judgment** (HBR Editors) -- AI summarized Kahneman's "Heuristics and Biases" textbook instead of the actual HBR piece. Needs redo.

- **Leading Change Begins with Changing Yourself** (Beer, M.) -- AI summarized Beer's "Leading Change" book instead of the specific article. Needs redo.

- **How to Manage a Cross-Functional Team** (Mortensen, M., & Haas, M.) -- AI summarized "The Secrets of Great Teamwork" instead of this piece. Needs redo.

- **The Culture Advantage** (Morris, I.) -- AI confused it with Lencioni's "The Advantage." Needs redo.

- **The Culture Puzzle** (Groysberg, B. et al.) -- AI summarized "The Leader's Guide to Corporate Culture" instead. Needs redo.

- **The Power of Agency in Influence** (Rucker, D. & Galinsky, A.) -- AI confused two different works. Needs redo.

**Already on the ignore list:**

- **Sales Teams, Don't Undervalue Face Time** (HBR Editors) -- On the ignore list. Showed up in the export with a confused summary. Will be excluded.

### John's note about levels and lenses

John mentioned he'll handle the priority levels (1 or 3) and lens reassignments directly in the database once everything is loaded. That's the easiest path -- get the books in, then he can adjust weights and multi-lens assignments through the admin interface.
