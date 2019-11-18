import React, { useState } from 'react'
import DocumentTitle from 'react-document-title'
import globalActions from '../globalActions'
const { Menu } = require('electron').remote
const isDev = require('electron-is-dev')

// Wrapper for screens in the app. Used to easily set application menu and doc title.
export default function AppScreen({ title, menu, children }) {
  const [menuSet, setMenuSet] = useState(false)

  const newMenu = [...menu]

  // Prevent menu from being set twice
  if (!menuSet) {
    newMenu.push({
      label: "View",
      submenu: [
        {
          label: 'Fullscreen',
          accelerator: 'f11',
          click: globalActions.fullscreen,
        },
      ],
    })

    if (isDev) {
      newMenu.push({
        label: "Dev",
        submenu: [
          { role: 'reload' },
          { role: 'forcereload' },
          { role: 'toggledevtools' },
        ],
      })
    }

    const appMenu = Menu.buildFromTemplate(newMenu)
    Menu.setApplicationMenu(appMenu)
    setMenuSet(true)
  }

  return (
    <DocumentTitle title={title}>
      {children}
    </DocumentTitle>
  )
}