import {useCallback} from 'react';
import {Alert} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  type ImagePickerResponse,
  type CameraOptions,
  type ImageLibraryOptions,
} from 'react-native-image-picker';
import type {OcrScanRequest} from '../types/ocr';

export type CapturedImage = {
  uri: string;
  request: OcrScanRequest;
};

const SHARED_OPTIONS = {
  mediaType: 'photo' as const,
  includeBase64: true,
  maxWidth: 2048,
  maxHeight: 2048,
  quality: 0.8 as const,
};

function handleResponse(response: ImagePickerResponse): CapturedImage | null {
  if (response.didCancel) {
    return null;
  }

  if (response.errorCode === 'permission') {
    Alert.alert(
      'Brak uprawnień',
      'Udziel dostępu w ustawieniach urządzenia, aby korzystać z tej funkcji.',
    );
    return null;
  }

  if (response.errorCode) {
    Alert.alert('Błąd', 'Nie udało się pobrać zdjęcia. Spróbuj ponownie.');
    return null;
  }

  const asset = response.assets?.[0];
  if (!asset?.base64 || !asset.uri) {
    return null;
  }

  return {
    uri: asset.uri,
    request: {
      image: asset.base64,
      mimeType: asset.type ?? 'image/jpeg',
    },
  };
}

export default function useImagePicker() {
  const pickFromCamera = useCallback(async (): Promise<CapturedImage | null> => {
    const options: CameraOptions = {...SHARED_OPTIONS};
    const response = await launchCamera(options);
    return handleResponse(response);
  }, []);

  const pickFromGallery = useCallback(async (): Promise<CapturedImage | null> => {
    const options: ImageLibraryOptions = {...SHARED_OPTIONS, selectionLimit: 1};
    const response = await launchImageLibrary(options);
    return handleResponse(response);
  }, []);

  return {pickFromCamera, pickFromGallery};
}
