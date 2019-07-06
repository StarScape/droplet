## Roadmap

# Sprint 1 - Basics
- Italics ✔️, bold ✔️, underline ✔️
- Headings ✔️
- Split into paragraphs based on indentation ✔️
- Alignment ✔️
- Move pell code into Editor component ✔️
- Nice interface for keyboard shortcuts ✔️
- 💎 Save ✔️ / load markdown ✔️
  - Set up Redux store ✔️
  - Replace editor component when loading new file ❗

# Sprint 2 - Advanced Text Editing
- Automatic list formatting
- Persist editing state after hitting enter (e.g. while typing a header)
- Word count
- Spellcheck
- 💎 Don't spellcheck capitalized words

# Sprint 3 - Meta Features
- Pagination (with on/off)
  - Page breaks
- Projects with chapters
  - Project specific dictionaries
- Dashboard
- 💎 Footnotes

# Sprint 4 - Aesthetics
- Make it pretty!
  - Font
  - Colors
- Bottom toolbar
  - Break into separate component
  - Make buttons for everything
  - Light up buttons when italics/bold/whatever is on
- 💎 Distraction-free (fullscreen) mode

# Sprint 5 - Really Super Duper Fancy Text Editing
- Links (mostly down here because I don't care that much)
- Autocomplete certain chars (-- to em dash)
- Press ", (, ' etc on selection automatically encapsulates it
- Pressings enter at the end of a paragraph automatically enter-tabs you down into next one (POSSIBLY depending on whether you are using that paragraph style. Check MS/GDocs behavior for guidance.)
- Smallcaps
- Subscript/superscript?
- Fix paste (try pasting from the Lorem ipsum generator - it copys a span in)
- Find and replace
- Control+Enter goes to new line

# Sprint 6 - Program Behavior
- Export/import as .docx (could be a beast...)
- Settings screen
  - Text justification
  - Font size
- 💎 Themes (or maybe just option for light/dark mode?)

# Future (out of scope of fall semester)
- Optimizations
- Auto-sync between devices
- Version control
- Drafts (split screen maybe, or highlight and press a button to see the differences between )
- Mobile apps
- Reading mode

## Key
✔️ = done
❌ = cancelled
❗= delayed (don't forget)
💎 = milestone :)

## Reminders to self

Make it **work** first. Focus on the most naive solution, and improvements can be tacked on later.
