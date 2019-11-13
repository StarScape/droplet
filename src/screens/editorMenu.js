import globalActions from '../globalActions'

const menu = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: globalActions.saveFile
      },
      {
        label: 'Export as DOCX',
        click: globalActions.exportDocx,
      },
      // {
      //   label: 'Open',
      //   accelerator: 'CmdOrCtrl+O',
      //   click: () => {/* TODO!!! */}
      // },
      { role: 'Quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        click: globalActions.undo,
      },
      {
        label: 'Redo',
        accelerator: 'CmdOrCtrl+Shift+Z',
        click: globalActions.redo,
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        click: globalActions.copy,
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        click: globalActions.paste,
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        click: globalActions.cut,
      },
      {
        label: 'Delete',
        click: globalActions.del,
      },
    ]
  },
  {
    label: 'Format',
    submenu: [
      {
        label: 'Italic',
        accelerator: 'CmdOrCtrl+I',
        click: globalActions.italic
      },
      {
        label: 'Bold',
        accelerator: 'CmdOrCtrl+B',
        click: globalActions.bold
      },
      {
        label: 'Underline',
        accelerator: 'CmdOrCtrl+U',
        click: globalActions.underline
      },
      {
        label: 'Strikethrough',
        accelerator: 'CmdOrCtrl+T',
        click: globalActions.strikethrough
      },
      
      { type: 'separator' },
      
      {
        label: 'Heading 1',
        accelerator: 'CmdOrCtrl+1',
        click: globalActions.heading1
      },
      {
        label: 'Heading 2',
        accelerator: 'CmdOrCtrl+2',
        click: globalActions.heading2
      },
      
      { type: 'separator' },
      
      {
        label: 'Bulleted List',
        accelerator: 'CmdOrCtrl+Shift+B',
        click: globalActions.ulist
      },
      {
        label: 'Numbered List',
        accelerator: 'CmdOrCtrl+Shift+N',
        click: globalActions.olist
      },

      { type: 'separator' },
      
      {
        accelerator: 'CmdOrCtrl+Shift+L',
        label: 'Align Left',
        click: globalActions.justifyLeft
      },
      {
        accelerator: 'CmdOrCtrl+Shift+E',
        label: 'Center Align',
        click: globalActions.justifyCenter
      },
      {
        accelerator: 'CmdOrCtrl+Shift+R',
        label: 'Right Align',
        click: globalActions.justifyRight
      },
    ]
  },
]

export default menu
