/*
 * This file is part of ORY Editor.
 *
 * ORY Editor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ORY Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with ORY Editor.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @license LGPL-3.0
 * @copyright 2016-2018 Aeneas Rekkas
 * @author Aeneas Rekkas <aeneas+oss@aeneas.io>
 *
 */

import React from 'react'
import ReactDOM from 'react-dom'

// The editor core
import Editor, { Editable, createEmptyState } from '@favish/ory-editor-core'
import '@favish/ory-editor-core/lib/index.css' // we also want to load the stylesheets

// The default ui components
import { Trash, DisplayModeToggle, Toolbar } from '@favish/ory-editor-ui'
import '@favish/ory-editor-ui/lib/index.css'

// The rich text area plugin
import slate from '@favish/ory-editor-plugins-slate'
import '@favish/ory-editor-plugins-slate/lib/index.css'

// The spacer plugin
import spacer from '@favish/ory-editor-plugins-spacer'
import '@favish/ory-editor-plugins-spacer/lib/index.css'

// The image plugin
import { imagePlugin } from '@favish/ory-editor-plugins-image'
import '@favish/ory-editor-plugins-image/lib/index.css'

// The video plugin
import video from '@favish/ory-editor-plugins-video'
import '@favish/ory-editor-plugins-video/lib/index.css'

// The parallax plugin
import parallax from '@favish/ory-editor-plugins-parallax-background'
import '@favish/ory-editor-plugins-parallax-background/lib/index.css'

// The background plugin
import background, { COLOR_MODE_FLAG, IMAGE_MODE_FLAG, GRADIENT_MODE_FLAG } from '@favish/ory-editor-plugins-background'
import '@favish/ory-editor-plugins-background/lib/index.css'

// The html5-video plugin
import html5video from '@favish/ory-editor-plugins-html5-video'
import '@favish/ory-editor-plugins-html5-video/lib/index.css'

// The native handler plugin
import native from '@favish/ory-editor-plugins-default-native'

// The divider plugin
import divider from '@favish/ory-editor-plugins-divider'

// Renders json state to html, can be used on server and client side
import { HTMLRenderer } from '@favish/ory-editor-renderer'

// The content state
import content from './content.js'
import './styles.css'

const fakeImageUploadService = (defaultUrl) => (file, reportProgress) => {
  return new Promise((resolve, reject) => {
    let counter = 0
    const interval = setInterval(() => {
      counter++
      reportProgress(counter * 10);
      if (counter > 9) {
        clearInterval(interval)
        alert('This is a fake image upload service, please provide actual implementation via plugin properties')
        resolve({ url: defaultUrl })
      }
    }, 500)
  })
}

if (process.env.NODE_ENV !== 'production' && process.env.REACT_APP_TRACE_UPDATES) {
  const { whyDidYouUpdate } = require('why-did-you-update')
  whyDidYouUpdate(React)
}

// Define which plugins we want to use (all of the above)
const plugins = {
  content: [slate(), spacer, imagePlugin({ imageUpload: fakeImageUploadService('/images/react.png') }), video, divider, html5video],
  layout: [
    background({
      defaultPlugin: slate(),
      imageUpload: fakeImageUploadService('/images/sea-bg.jpg'),
      enabledModes: COLOR_MODE_FLAG | IMAGE_MODE_FLAG | GRADIENT_MODE_FLAG
    }),
    parallax({ defaultPlugin: slate() }),
  ],

  // If you pass the native key the editor will be able to handle native drag and drop events (such as links, text, etc).
  // The native plugin will then be responsible to properly display the data which was dropped onto the editor.
  native
}

const editor = new Editor({
  plugins: plugins,
  // pass the content states
  editables: [
    ...content,
    // creates an empty state, basically like the line above
    createEmptyState()
  ],
})

window.editor = editor;

editor.trigger.mode.edit()

// Render the editables - the areas that are editable
const elements = document.querySelectorAll('.editable')
for (const element of elements) {
  ReactDOM.render((
    <Editable
      editor={editor}
      id={element.dataset.id}
      onChange={(state) => {
        if (element.dataset.id === '1') {
          // console.log(state)
        }
      }}
    />
  ), element)
}

// Render the ui controls, you could implement your own here, of course.
ReactDOM.render((
  <div>
    <Trash editor={editor} />
    <DisplayModeToggle editor={editor} />
    <Toolbar editor={editor} />
  </div>
), document.getElementById('controls'))

// Render as beautified mark up (html)
ReactDOM.render(<HTMLRenderer state={content[0]} plugins={plugins} />, document.getElementById('editable-static'))

editor.trigger.editable.add({ id: '10', cells: [] })
