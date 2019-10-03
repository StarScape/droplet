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

# Sprint 2 - Advanced Text Editing
  - Break actionbar into separate component ✔️
  - Cleanup
    - Put commands into Editor.js ✔️, expose in globalActions ✔️
    - Remove dispatch import from Actionbar ✔️
    - Change src/actions.js to globalActions.js ✔️
    - Prevent default for keyboard shortcuts and call editor function ✔️
  - Buttons and state for justification ✔️
  - Format/edit menu buttons ✔️
  - Automatic list formatting ✔️
  - Persist editing state after hitting enter (e.g. while typing a header) ❌
  - Word count ✔️
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
    - Prompt user for new project name when button clicked ✔️
    - Fix layout bug ✔️
  - Create/delete chapters ✔️
  - Open correct file when going from chapter to editor ✔️
  - Create chapters folder if doesn't already exist ✔️
  - Chapter name autofill ✔️
  - Autosave ✔️
  - Save before going back ❗
  - Sort projects by most recently modified ✔️
    - Reducer to set project property ✔️
    - Project Model ✔️
    - Sort on dashboard accordingly ✔️
  - Reorder chapters w/ drag and drop
    - Take a look at Sortable.js ✔️
    - Don't allow dragging of new chapter div ✔️
    - Clean up CSS ✔️
    - Dispatch on re-sort ✔️
    - Focus on text area when creating & enable enter ✔️
    - Can't select textarea after creating >2 chapters? Fix. Might be the Sortable.js filter? ✔️
  - Reorganize dates and any other funcs into utils ✔️
  - Reorganize reducer so that modified date is automatically updated when anything to do with a project is changed
  - Look into bound action creators ✔️
  - Cancel creation of project/chapter ✔️
  - Ordered / unordered chapters? ❗
  - Delete `files.js` ✔️
- Reload where you left off
  - Reload chapter at left off ✔️
  - Add decorator and set location for each screen
- Project specific dictionaries
- Dashboard ✔️
- Autosave ✔️
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
- Autocompletion
  - (-- to em dash) ✔️
  - Auto-close (, ", ' (' when not apostrophe) ✔️
  - Undo autocomplete on backspace ✔️
  - Autocomplete unordered lists on "* " ✔️
  - Autocomplete ordered lists on "1. " ✔️
  - Press ", (, ' with multi-selection automatically encapsulates it
  - Pressings enter at the end of a paragraph automatically enter-tabs you down into next one (POSSIBLY depending on whether you are using that paragraph style. Check MS/GDocs behavior for guidance.)
    - Replace em-space with a specially-styled span (maybe?)

- Smallcaps
- Subscript/superscript
- Links (mostly down here because I don't care that much)
- Control+Enter goes to new line?

# Sprint 6 - Program Behavior
- Fix nasty document layout
  - UL bug ✔️
  - Italics/bold at start bug

- Fix paste (try pasting from the Lorem ipsum generator - it copys a span in)
- Export/import as .docx - PANDOC
- Find and replace
- Settings screen
  - Text justification
  - Font size
  - Items on bar (fullscreen and not)
- Remember the size and location user left window at
- 💎 Themes (or maybe just option for light/dark mode?)

# Future (out of scope of fall semester)
- Optimizations
- Auto-sync between devices
- Version control
- Drafts (split screen maybe, or highlight and press a button to see the differences between )
- Mobile apps
- Reading mode

## Bugs

- Auto-close: currently it relies on input history. Add a mouse click to input history. so that shit isn't fucked

- Pressing tab when italic is active undones italic.

- Opening a file and immediately on the first line hitting ctrl+i and then typing results in a raw `<i>` not wrapped in a paragraph element. POSSIBLE SOLUTION: check for no-enclosing-p on EVERY command. This could be done easily with a lil wrapper function. ANOTHER SOLUTION: the `if (firstChild && firstChild.nodeType === 3)...` line in `handleInput` is calling `formatBlock` if the firstChild is a textNode. Check for italics, bold, etc as well. Either of these should work, you'll have to decide which works better.

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
