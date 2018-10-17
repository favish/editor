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
import ThemeProvider from '../ThemeProvider'
import Dialog from '@material-ui/core/Dialog'
import classNames from 'classnames'

class BottomToolbar extends Component {
  constructor(props) {
    super(props);
    this._enableBodyScroll()
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) {
      this._disableBodyScroll()
    }
  }

  _enableBodyScroll() {
    document.body.style.overflow = 'scroll'
  }

  _disableBodyScroll() {
    document.body.style.overflow = 'hidden'
  }

  _handleBackdropClick() {
    window.editor.trigger.cell.blurAll()
    this._enableBodyScroll()
  }

  render() {
    const { open, children, className, theme } = this.props;
    return (
      <ThemeProvider>
        <Dialog
          open={true}
          className={classNames('BottomToolbar-dialog', { 'BottomToolbar-dialog--show': open })}
          classes={{ paper: 'BottomToolbar-dialog-paper' }}
          onBackdropClick={this._handleBackdropClick.bind(this)}
        >
          {children}
        </Dialog>


      </ThemeProvider>
    )
  }
}

export default BottomToolbar
