## Notes

New idea for the whole metadata mess. In the redux store, have an object called `projectData` or something along those lines. Every time the user changes around their projects, we just modify that in the standard redux way. The trick is to save it to the file system every so often (Maybe use redux-persist? Not sure if that will work with only part of the store). To start with, we can JUST save it on app exit. Don't bother with loading the actual text for each chapter into the store, that can be read from the file system every time we open a doc.

On the other hand, maybe we can just use redux-persist for the whole damn thing?

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
- Break actionbar into separate component ✔️
- Cleanup
  - Put commands into Editor.js ✔️, expose in globalActions ✔️
  - Remove dispatch import from Actionbar ✔️
  - Change src/actions.js to globalActions.js ✔️
  - Prevent default for keyboard shortcuts and call editor function ✔️
- Buttons and state for justification ✔️
- Format/edit menu buttons ✔️
- Automatic list formatting
- Persist editing state after hitting enter (e.g. while typing a header) ❌
- Word count
  - Basic functionality ✔️
  - Where to put it? ✔️
  - Word count component, real time ✔️
  - Fix bug where word count won't go back to zero ✔️
  - Use mapDispatchToProps
  - Fix bugginess ❗
- 💎 Spellcheck
  - Basics ✔️
  - Don't spellcheck capitalized words ❗

# Sprint 3 - Meta Features
- Pagination (with on/off) ❗
  - Page breaks
- Projects with chapters
  - Basic functionality ✔️
  - Create/delete projects
  - Create/delete chapters
  - Ordered/unordered chapters
  - Cache project data on exit and reload on open
  - Project specific dictionaries
  - Delete `files.js`
- Dashboard
- Autosave
- 💎 Footnotes

# Sprint 4 - Aesthetics
- Make it pretty!
  - Typography
  - Colors
- Bottom toolbar
  - Make buttons for everything
  - Light up buttons when italics/bold/whatever is on
  - Maybe make the justification buttons *underline* instead of highlighting

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
- Remember the size and location user left window at
- 💎 Themes (or maybe just option for light/dark mode?)

# Future (out of scope of fall semester)
- Optimizations
- Auto-sync between devices
- Version control
- Drafts (split screen maybe, or highlight and press a button to see the differences between )
- Mobile apps
- Reading mode

## Todos (independent of the roadmap, but need to get done at some point)

# Architecture
- Make an interface for global actions ✔️
- Better interface for opening/closing files
- Throw out contenteditable and write your own

## Key
✔️ = done
❌ = cancelled
❗= delayed (don't forget)
💎 = milestone :)

## Reminders to self

Make it **work** first. Focus on the most naive solution, and improvements can be tacked on later.
