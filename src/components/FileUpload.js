import React from 'react';
import PropTypes from 'prop-types';
import { apiUrl } from '../util/fetch';

const FileUpload = ({ singleFile, onUpload, accept = 'image/*' }) => {
  const handleOnChange = (e) => {
    const { files } = e.target;
    const data = new FormData();

    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      data.append('files', file, file.name);
    }

    const token = localStorage.getItem('token');

    fetch(`${apiUrl}/file`, {
      headers: { authorization: token },
      method: 'POST',
      body: data,
    })
      .then((response) => response.json())
      .then(onUpload);
  };
  return (
    singleFile
      ? <input type="file" accept={accept} onChange={handleOnChange} className="uploadButton" />
      : <input type="file" accept={accept} onChange={handleOnChange} className="uploadButton" multiple />
  );
};

FileUpload.propTypes = {
  onUpload: PropTypes.func,
  singleFile: PropTypes.bool,
  accept: PropTypes.string,
};

export default FileUpload;
