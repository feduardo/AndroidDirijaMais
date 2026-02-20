import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';

export type PickedImage = {
  uri: string;
  fileName?: string;
  type?: string;
};

import { ImageLibraryOptions, CameraOptions } from 'react-native-image-picker';

const OPTIONS: ImageLibraryOptions | CameraOptions = {
  mediaType: 'photo',
  quality: 0.8,
  selectionLimit: 1,
};

export async function pickImageFromGallery(): Promise<PickedImage | null> {
  return new Promise((resolve, reject) => {
    launchImageLibrary(OPTIONS, (response: ImagePickerResponse) => {
      if (response.didCancel) return resolve(null);
      if (response.errorCode) return reject(response.errorMessage);

      const asset = response.assets?.[0];
      if (!asset?.uri) return resolve(null);

      resolve({
        uri: asset.uri,
        fileName: asset.fileName,
        type: asset.type,
      });
    });
  });
}

export async function takePhoto(): Promise<PickedImage | null> {
  return new Promise((resolve, reject) => {
    launchCamera(OPTIONS, (response: ImagePickerResponse) => {
      if (response.didCancel) return resolve(null);
      if (response.errorCode) return reject(response.errorMessage);

      const asset = response.assets?.[0];
      if (!asset?.uri) return resolve(null);

      resolve({
        uri: asset.uri,
        fileName: asset.fileName,
        type: asset.type,
      });
    });
  });
}
