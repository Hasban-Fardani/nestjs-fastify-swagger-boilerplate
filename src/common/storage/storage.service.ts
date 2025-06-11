import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { Readable } from 'node:stream';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly minioClient: Minio.Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.getOrThrow('S3_ENDPOINT'),
      port: this.configService.getOrThrow('S3_PORT'),
      useSSL: this.configService.getOrThrow('S3_USE_SSL'),
      accessKey: this.configService.getOrThrow('S3_ACCESS_KEY'),
      secretKey: this.configService.getOrThrow('S3_SECRET_KEY'),
    });

    this.bucketName = this.configService.getOrThrow('S3_BUCKET');
    this.initializeBucket();
  }

  private async initializeBucket(): Promise<void> {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName);
        this.logger.log(`Created bucket: ${this.bucketName}`);
      }
    } catch (error) {
      this.logger.error(`Bucket initialization error: ${error.message}`);
    }
  }

  async uploadFile(
    fileName: string,
    fileStream: Readable,
    contentType: string,
    metadata?: Record<string, string>,
  ): Promise<{ url: string; etag: string }> {
    try {
      const result = await this.minioClient.putObject(
        this.bucketName,
        fileName,
        fileStream,
        undefined,
        {
          'Content-Type': contentType,
          ...metadata,
        },
      );

      const url = await this.minioClient.presignedGetObject(
        this.bucketName,
        fileName,
        24 * 60 * 60, // 24 hours
      );

      return {
        url,
        etag: result.etag,
      };
    } catch (error) {
      this.logger.error(`File upload error: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, fileName);
      this.logger.log(`Deleted file: ${fileName}`);
    } catch (error) {
      this.logger.error(`File deletion error: ${error.message}`);
      throw error;
    }
  }

  async getPresignedUrl(fileName: string, expiry: number = 3600): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(
        this.bucketName,
        fileName,
        expiry,
      );
    } catch (error) {
      this.logger.error(`Presigned URL error: ${error.message}`);
      throw error;
    }
  }

  async getPresignedUploadUrl(
    fileName: string,
    expiry: number = 3600,
  ): Promise<string> {
    try {
      return await this.minioClient.presignedPutObject(
        this.bucketName,
        fileName,
        expiry,
      );
    } catch (error) {
      this.logger.error(`Presigned upload URL error: ${error.message}`);
      throw error;
    }
  }

  async listFiles(prefix?: string): Promise<Minio.BucketItem[]> {
    try {
      const objects: Minio.BucketItem[] = [];
      const stream = this.minioClient.listObjects(this.bucketName, prefix);

      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => {
          if (obj.name !== undefined) {
            objects.push(obj as Minio.BucketItem);
          }
        });
        stream.on('end', () => resolve(objects));
        stream.on('error', reject);
      });
    } catch (error) {
      this.logger.error(`List files error: ${error.message}`);
      throw error;
    }
  }

  async getFileInfo(fileName: string): Promise<Minio.BucketItemStat> {
    try {
      return await this.minioClient.statObject(this.bucketName, fileName);
    } catch (error) {
      this.logger.error(`Get file info error: ${error.message}`);
      throw error;
    }
  }
}