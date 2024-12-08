import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { S3StorageInterface } from '../StorageInterface';
import { ConversationData, MEDDPICData, StorageResponse, StorageConfig } from '../../../types';

export class GenericS3Provider extends S3StorageInterface {
  private s3Client: S3Client;

  constructor(config: StorageConfig) {
    super(config);
    this.s3Client = new S3Client({
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
      },
      region: config.region,
      forcePathStyle: true // Enables compatibility with any S3-compatible service
    });
  }

  async saveConversation(data: ConversationData): Promise<StorageResponse> {
    const key = `training-data/conversations/${data.opportunityId}/${data.timestamp}.json`;
    
    try {
      await this.s3Client.send(new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: JSON.stringify(data),
        ContentType: 'application/json',
        // Make object readable by anyone with bucket access
        ACL: 'bucket-owner-full-control',
        // Add metadata for easier querying
        Metadata: {
          opportunityId: data.opportunityId,
          customerName: data.customerName,
          timestamp: data.timestamp
        }
      }));
      
      return { 
        success: true, 
        key,
        // Return URL for direct access if needed
        url: `${this.config.endpoint}/${this.config.bucket}/${key}`
      };
    } catch (error) {
      console.error('Error saving conversation:', error);
      return { 
        success: false, 
        key, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getConversation(id: string): Promise<ConversationData> {
    const key = `training-data/conversations/${id}.json`;
    
    try {
      const response = await this.s3Client.send(new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: key
      }));
      
      if (!response.Body) {
        throw new Error('No data found');
      }

      // Convert the readable stream to string
      const bodyContents = await response.Body.transformToString();
      
      // Parse and validate the data
      const data = JSON.parse(bodyContents) as ConversationData;
      
      // Basic validation to ensure the data has required fields
      if (!data.opportunityId || !data.conversation) {
        throw new Error('Invalid conversation data format');
      }
      
      return data;
    } catch (error) {
      console.error('Error retrieving conversation:', error);
      throw new Error(
        error instanceof Error 
          ? `Failed to retrieve conversation: ${error.message}`
          : 'Failed to retrieve conversation'
      );
    }
  }

  async saveMEDDPICAnalysis(data: MEDDPICData): Promise<StorageResponse> {
    const key = `training-data/meddpic/${data.opportunityId}/${data.timestamp}.json`;
    
    try {
      await this.s3Client.send(new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: JSON.stringify(data),
        ContentType: 'application/json',
        ACL: 'bucket-owner-full-control',
        // Add metadata for easier querying
        Metadata: {
          opportunityId: data.opportunityId,
          timestamp: data.timestamp,
          // Add summary metrics for quick reference
          hasMetrics: !!data.analysis.metrics,
          hasEconomicBuyer: !!data.analysis.economicBuyer,
          hasDecisionCriteria: !!data.analysis.decisionCriteria,
          hasChampion: !!data.analysis.champion
        }
      }));
      
      return { 
        success: true, 
        key,
        url: `${this.config.endpoint}/${this.config.bucket}/${key}`
      };
    } catch (error) {
      console.error('Error saving MEDDPIC analysis:', error);
      return { 
        success: false, 
        key, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getMEDDPICAnalysis(id: string): Promise<MEDDPICData> {
    const key = `training-data/meddpic/${id}.json`;
    
    try {
      const response = await this.s3Client.send(new GetObjectCommand({
        Bucket: this.config.bucket,
        Key: key
      }));
      
      if (!response.Body) {
        throw new Error('No data found');
      }

      const bodyContents = await response.Body.transformToString();
      
      // Parse and validate the data
      const data = JSON.parse(bodyContents) as MEDDPICData;
      
      // Validate the MEDDPIC data structure
      if (!data.analysis || !data.opportunityId) {
        throw new Error('Invalid MEDDPIC data format');
      }
      
      return data;
    } catch (error) {
      console.error('Error retrieving MEDDPIC analysis:', error);
      throw new Error(
        error instanceof Error 
          ? `Failed to retrieve MEDDPIC analysis: ${error.message}`
          : 'Failed to retrieve MEDDPIC analysis'
      );
    }
  }
}