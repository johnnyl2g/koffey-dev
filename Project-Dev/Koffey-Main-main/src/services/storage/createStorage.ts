// services/storage/createStorage.ts
import { StorageConfig } from '../../types';
import { GenericS3Provider } from './GenericS3Provider';

export function createStorageProvider() {
  const config: StorageConfig = {
    endpoint: process.env.S3_ENDPOINT || '',
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    bucket: process.env.S3_BUCKET_NAME || '',
    region: process.env.S3_REGION
  };

  // Validate required configuration
  const requiredFields = ['endpoint', 'accessKeyId', 'secretAccessKey', 'bucket'];
  const missingFields = requiredFields.filter(field => !config[field as keyof StorageConfig]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required S3 configuration: ${missingFields.join(', ')}`);
  }

  return new GenericS3Provider(config);
}