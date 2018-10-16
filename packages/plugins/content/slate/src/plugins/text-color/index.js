import React, { Component } from 'react';
import FormatColorText from '@material-ui/icons/FormatColorText';

import { ToolbarButton } from '../../helpers'
import Plugin from '../Plugin'

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ThemeProvider from 'ory-editor-ui/lib/ThemeProvider';
import classNames from 'classnames'

class TextColorComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showSelect: false
    };
  }

  _handleClickButton(e) {
    e.preventDefault()
    this.setState({ showSelect: true })
  }

  _handleChangeSelect(e) {
    this.props.onChange(e);
  }

  _handleCloseSelect() {
    this.setState({ showSelect: false })
  }

  render() {
    return (
      <div className="slate-plugin-text-color">
        <ToolbarButton onClick={this._handleClickButton.bind(this)} icon={this.props.icon} />
        <div className={classNames(
          'slate-plugin-text-color-select',
          { 'slate-plugin-text-color-select--show': this.state.showSelect })
        }>
          <Select
            value={this.props.color || '#ff0000'}
            onChange={this._handleChangeSelect.bind(this)}
            open={this.state.showSelect}
            onClose={this._handleCloseSelect.bind(this)}
          >
            <MenuItem value={'#ff0000'}>#ff0000</MenuItem>
            <MenuItem value={'#ff00ff'}>#ff00ff</MenuItem>
          </Select>
        </div>
      </div>
    )
  }
}

export default class TextColorPlugin extends Plugin {
  createButton = (icon) => ({ editorState, onChange }: Props) => {
    const onClick = e => {
      const data = editorState.blocks.toJS().reduce((result, currentValue) => {
        return {
          ...result,
          ...currentValue.data
        };
      }, {});

      onChange({
        value: editorState
          .change()
          .setBlocks({
            data: {
              ...data,
              color: e.target.value
            }
          }).value
      })
    }

    const data = editorState.blocks.toJS().reduce((result, currentValue) => {
      return {
        ...result,
        ...currentValue.data
      };
    }, {});

    return (
      <ThemeProvider>
        <TextColorComponent onChange={onClick} color={data.color} icon={icon} />
      </ThemeProvider>
    )
  }

  name = 'text-color'

  toolbarButtons = [
    this.createButton(<FormatColorText />),
  ]
}