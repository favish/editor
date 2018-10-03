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
import React, { Component } from 'react'
import Avatar from '@material-ui/core/Avatar'
import draggable from '../Draggable'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Plugin } from 'ory-editor-core'
import classNames from 'classnames'
import withStyles from '@material-ui/core/styles/withStyles'

class Item extends Component {
  state = { tooltipVisible: false }
  props: { plugin: Plugin, insert: any }

  render() {
    const { plugin, insert } = this.props
    if (!plugin.IconComponent && !plugin.text) {
      // logger.warn('Plugin text or plugin icon missing', plugin)
      return null
    }

    const Draggable = draggable(plugin.name)

    // not using css modules here because they don't work with svg icons
    return (
      <ListItem
        className={classNames('ory-toolbar-item', this.props.classes.root)}
      >
        <Draggable insert={insert}>
          <Avatar children={plugin.IconComponent} />
          <ListItemText
            primary={plugin.text}
            classes={{ root: 'ory-toolbar-item-name' }}
          />
        </Draggable>
      </ListItem>
    )
  }
}

const styles = {
  root: {
    width: '50%',
    justifyContent: 'center'
  }
}

export default withStyles(styles, { name: 'ToolbarItem' })(Item)
