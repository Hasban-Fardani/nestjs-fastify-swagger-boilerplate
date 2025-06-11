export interface MediaSoupConfig {
    MEDIASOUP_LISTEN_IP: string;
    MEDIASOUP_MIN_PORT: number;
    MEDIASOUP_MAX_PORT: number;
    MEDIASOUP_INITIAL_AVAILABLE_OUTGOING_BITRATE: number;
    MEDIASOUP_ANNOUNCED_IP?: string;
}

export interface MinioConfig {
    S3_ENDPOINT: string;
    S3_PORT: number;
    S3_ACCESS_KEY: string;
    S3_SECRET_KEY: string;
    S3_USE_SSL: boolean;
    S3_BUCKET: string;
}

export interface RecordingConfig {
    RECORDING_TEMP_DIR: string;
    FFMPEG_PATH?: string;
}

export interface FrontendConfig {
    FRONTEND_URL: string;
}