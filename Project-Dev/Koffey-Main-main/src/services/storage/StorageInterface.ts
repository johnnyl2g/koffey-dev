import { StorageConfig, StorageService, ConversationData, MEDDPICData, StorageResponse } from '../../types';

export abstract class S3StorageInterface implements StorageService {
  protected config: StorageConfig;
  
  constructor(config: StorageConfig) {
    this.validateConfig(config);
    this.config = config;
  }
  
  private validateConfig(config: StorageConfig) {
    const required = ['endpoint', 'accessKeyId', 'secretAccessKey', 'bucket'];
    const missing = required.filter(key => !config[key as keyof StorageConfig]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required config: ${missing.join(', ')}`);
    }
  }
  
  abstract saveConversation(data: ConversationData): Promise<StorageResponse>;
  abstract getConversation(id: string): Promise<ConversationData>;
  abstract saveMEDDPICAnalysis(data: MEDDPICData): Promise<StorageResponse>;
  abstract getMEDDPICAnalysis(id: string): Promise<MEDDPICData>;
}