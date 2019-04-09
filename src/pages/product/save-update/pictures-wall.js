import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { Upload, Icon, Modal } from 'antd';

export default class PicturesWall extends Component {
  static propTypes = {
    _id: Proptypes.string.isRequired,
    imgs: Proptypes.array.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: this.props.imgs.map((img, index) => {
        return {
          uid: -index,
          name: img,
          status: 'done',
          url: 'http://localhost:5000/upload/' + img,
        }
      })
    };

  }

  // 取消
  handleCancel = () => this.setState({ previewVisible: false })

  // 预览
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  // 变化
  handleChange = ({ fileList }) => this.setState({ fileList })

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { _id } = this.props;

    // 上传按钮
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          name="image"
          data={{id: _id}}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}