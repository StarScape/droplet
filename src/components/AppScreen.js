import React, { useState } from 'react'
import DocumentTitle from 'react-document-title'
const { Menu } = require('electron').remote
const isDev = require('electron-is-dev')

// Wrapper for screens in the app. Used to easily set application menu and doc title.
export default function AppScreen({ title, menu, children }) {
  const [menuSet, setMenuSet] = useState(false)

  // Prevent menu from being set twice
  if (!menuSet) {
    if (isDev) {
      menu.push({
        label: "Dev",
        submenu: [
          { role: 'reload' },
          { role: 'forcereload' },
          { role: 'toggledevtools' },
        ],
      })
    }

    const appMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(appMenu)
    setMenuSet(true)
  }

  return (
    <DocumentTitle title={title}>
      {children}
    </DocumentTitle>
  )
}