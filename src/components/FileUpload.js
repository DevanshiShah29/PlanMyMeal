// Library Imports
import { Upload, Button, Space, Typography, Image, message } from 'antd';
import { UploadOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons';

// Reusable Component
import CommonButton from './CommonButton';

const ImageUploader = ({
  file,
  setFile,
  existingImage,
  label = 'Upload Image',
  helpText = 'Recommended size: 60x60px (PNG/SVG)',
  accept = 'image/png,image/jpeg,image/svg+xml',
  maxSizeMB = 2,
  previewWidth = 64,
  previewHeight = 64,
}) => {
  const beforeUpload = (file) => {
    if (!file.type.match('image.*')) {
      message.error('You can only upload image files!');
      return false;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      message.error(`Image must be smaller than ${maxSizeMB}MB!`);
      return false;
    }
    setFile(file);
    return false;
  };

  return (
    <Space direction="vertical" size={12} className="fullWidthContainer">
      <Upload
        beforeUpload={beforeUpload}
        showUploadList={false}
        accept={accept}
        maxCount={1}
        className="fullWidthUpload"
      >
        <CommonButton
          type="dashed"
          icon={<UploadOutlined />}
          className="uploadButton"
          text={file ? 'Change Image' : label}
        />
      </Upload>

      <div className="previewContainer">
        <div className="iconDisplay" style={{ width: previewWidth, height: previewHeight }}>
          {file ? (
            <Image src={URL.createObjectURL(file)} alt="New Image" className="iconImage" preview={false} />
          ) : existingImage ? (
            <Image src={existingImage} alt="Current Image" className="iconImage" preview={false} />
          ) : (
            <PictureOutlined className="placeholderIcon" />
          )}
        </div>

        <div className="fileInfoContainer">
          {file ? (
            <>
              <Typography.Text strong className="fileName">
                {file.name}
              </Typography.Text>
              <Typography.Text className="fileSize">{(file.size / 1024).toFixed(2)} KB</Typography.Text>
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => setFile(null)}
                className="removeButton"
              >
                Remove
              </Button>
            </>
          ) : existingImage ? (
            <Typography.Text type="secondary">
              Current image | {helpText && <span className="helpText">{helpText}</span>}
            </Typography.Text>
          ) : (
            <Typography.Text type="secondary">No image selected</Typography.Text>
          )}
        </div>
      </div>
    </Space>
  );
};

export default ImageUploader;
