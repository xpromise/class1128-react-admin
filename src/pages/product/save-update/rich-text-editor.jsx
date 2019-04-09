import React from 'react';
import PropTypes from 'prop-types';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

export default class RichTextEditor extends React.Component {
  static propTypes = {
    detail: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      // 创建一个空的editorState作为初始值
      editorState: BraftEditor.createEditorState(this.props.detail)
    }
  }

  // 一旦内容发生变化，触发的回调
  handleEditorChange = (editorState) => {
    this.setState({ editorState })
  }

  render () {

    const { editorState } = this.state;

    return (
      <div style={{border: '1px solid #d9d9d9', height: 300, borderRadius: 4}}>
        <BraftEditor
          value={editorState}
          onChange={this.handleEditorChange}
        />
      </div>
    )

  }

}