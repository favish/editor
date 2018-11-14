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

// @flow
/* eslint-disable no-use-before-define, no-underscore-dangle */
import { v4 } from 'uuid'
import Editable from './components/Editable'
import createStore from './store'
import { actions } from './actions'
import { selectors } from './selector'
import PluginService from './service/plugin'
import pluginDefault from './service/plugin/default'
import type { Editable as EditableType } from './types/editable'
import type Store from './types/redux'
import forEach from 'ramda/src/forEach'
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend'
import { DragDropContext as dragDropContext } from 'react-dnd'

let instance: Editor

const initialState = () => ({
  editables: {
    past: [],
    present: [],
    future: []
  }
})

const nativeTypes = (editor: Editor) =>
  editor.plugins.hasNativePlugin()
    ? [NativeTypes.URL, NativeTypes.FILE, NativeTypes.TEXT]
    : []

const update = (editor: Editor) => (editable: EditableType) => {
  const state = editor.plugins.unserialize(editable)
  actions(editor.store.dispatch).editable.update({
    ...state,
    config: {
      plugins: editor.plugins,
      whitelist: [
        ...editor.plugins.getRegisteredNames(),
        ...nativeTypes(editor)
      ]
    }
  })
}

const dndBackend = HTML5Backend

/**
 * Editor is the core interface for dealing with the editor.
 */
class Editor {
  store: Store
  plugins: PluginService
  middleware: []

  dragDropContext: any
  defaultPlugin: any

  constructor({
    plugins,
    middleware = [],
    editables = [],
    defaultPlugin = pluginDefault,
    dragDropBackend
  }: {
    plugins: { content: [], layout: [], native?: any },
    middleware: [],
    editables: EditableType[],
    defaultPlugin: any,
    dragDropBackend: any
  } = {}) {
    if (instance) {
      console.warn(
        'You defined multiple instances of the Editor class, this can cause problems.'
      )
    }

    instance = this
    this.store = createStore(initialState(), middleware)
    this.plugins = new PluginService(plugins)
    this.middleware = middleware
    this.trigger = actions(this.store.dispatch)
    this.query = selectors(this.store)
    this.defaultPlugin = defaultPlugin
    this.dragDropContext = dragDropContext(dragDropBackend || dndBackend)

    this.trigger.editable.add = update(this)
    this.trigger.editable.update = update(this)

    editables.forEach(this.trigger.editable.add)
  }

  refreshEditables = () => {
    forEach((editable: any) => {
      console.log(this.plugins.serialize(editable))
      this.trigger.editable.update(this.plugins.serialize(editable))
    }, this.store.getState().editables.present)
  }

  setLayoutPlugins = (plugins: Array<any> = []) => {
    this.plugins.setLayoutPlugins(plugins)
    this.refreshEditables()
  }

  addLayoutPlugin = (config: any) => {
    this.plugins.addLayoutPlugin(config)
    this.refreshEditables()
  }

  removeLayoutPlugin = (name: string) => {
    this.plugins.removeLayoutPlugin(name)
    this.refreshEditables()
  }

  setContentPlugins = (plugins: Array<any> = []) => {
    this.plugins.setContentPlugins(plugins)
    console.log(this.store.getState())
    this.refreshEditables()
  }

  addContentPlugin = (config: any) => {
    this.plugins.addContentPlugin(config)
    this.refreshEditables()
  }

  removeContentPlugin = (name: string) => {
    this.plugins.removeContentPlugin(name)
    this.refreshEditables()
  }

  trigger = {}
  query = {}

  isTopLevelRow = (editable, ancestors, numBaseAncestors = 1) => {
    let isTopLevelRow = false;

    // Check if the row only has the base ancestors as parents.
    if (ancestors.length === numBaseAncestors) {
      isTopLevelRow = true;
    }

    // Check if the nearest ancestor is a layout plugin instance. If so, the context is reset and the row is
    // considered a top level row.
    const storeState = window.editor.store.getState();
    const editableState = storeState.editables.present.find(e => e.id === editable);
    const parentId = ancestors[ancestors.length - 1];

    const match = this.getCellById(parentId, editableState);

    if (
      match !== null &&
      typeof match.layout !== 'undefined'
    ) {
      isTopLevelRow = true;
    }

    return isTopLevelRow;
  }

  getCellById = (id, state) => {
    let match = null;

    recursiveLookup(id, state);

    return match;

    function recursiveLookup(id, state) {
      if (state.id === id) {
        match = state;
      }

      const childrenProp = Object.keys(state)
        .find(prop => ['cells', 'rows'].includes(prop));

      if (
        typeof childrenProp !== 'undefined' &&
        state[childrenProp].length
      ) {
        for (let i = 0; i < state[childrenProp].length; i++) {
          const newState = state[childrenProp][i];
          recursiveLookup(id, newState);
        }
      }
    }
  }
}

export { PluginService, Editable, Editor }

export const createEmptyState = () => ({ id: v4(), cells: [] })

export default Editor
