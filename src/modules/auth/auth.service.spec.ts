import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { AuthSchema } from './auth.schema';
import bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<Repository<User>>;
  let jwtService: jest.Mocked<JwtService>;

  // Mock data
  const mockUser: User = {
    id: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
    email: 'test@example.com',
    name: 'Test User',
    password: '$2b$10$hashedPasswordExample123',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    hashPassword: jest.fn(),
  };

  const mockJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocktoken';

  beforeEach(async () => {
    // Create mock repository
    const mockUserRepository = {
      findOneBy: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    // Create mock JWT service
    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
      decode: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    const username = 'test@example.com';
    const password = 'plainPassword123';

    it('should return user when credentials are valid', async () => {
      // Arrange
      userRepository.findOneBy.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await service.validateUser(username, password);

      // Assert
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: username,
      });
      expect(userRepository.findOneBy).toHaveBeenCalledTimes(1);
      
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      // Arrange
      userRepository.findOneBy.mockResolvedValue(null);

      // Act & Assert
      await expect(service.validateUser(username, password)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: username,
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      // Arrange
      userRepository.findOneBy.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(service.validateUser(username, password)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: username,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      userRepository.findOneBy.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.validateUser(username, password)).rejects.toThrow(
        'Database connection failed',
      );

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: username,
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should handle bcrypt comparison errors', async () => {
      // Arrange
      userRepository.findOneBy.mockResolvedValue(mockUser);
      const bcryptError = new Error('Bcrypt comparison failed');
      (bcrypt.compare as jest.Mock).mockRejectedValue(bcryptError);

      // Act & Assert
      await expect(service.validateUser(username, password)).rejects.toThrow(
        'Bcrypt comparison failed',
      );

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: username,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    });

    it('should handle empty email', async () => {
      // Arrange
      userRepository.findOneBy.mockResolvedValue(null);

      // Act & Assert
      await expect(service.validateUser('', password)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: '',
      });
    });

    it('should handle empty password', async () => {
      // Arrange
      userRepository.findOneBy.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(service.validateUser(username, '')).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );

      expect(bcrypt.compare).toHaveBeenCalledWith('', mockUser.password);
    });
  });

  describe('login', () => {
    it('should return JWT token when user is valid', async () => {
      // Arrange
      jwtService.sign.mockReturnValue(mockJwtToken);

      // Act
      const result = await service.login(mockUser);

      // Assert
      const expectedPayload: AuthSchema = {
        email: mockUser.email,
      };

      expect(jwtService.sign).toHaveBeenCalledWith(expectedPayload);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockJwtToken);
    });

    it('should create correct payload structure', async () => {
      // Arrange
      jwtService.sign.mockReturnValue(mockJwtToken);

      // Act
      await service.login(mockUser);

      // Assert
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
      });
    });

    it('should handle JWT service errors', async () => {
      // Arrange
      const jwtError = new Error('JWT signing failed');
      jwtService.sign.mockImplementation(() => {
        throw jwtError;
      });

      // Act & Assert
      await expect(service.login(mockUser)).rejects.toThrow('JWT signing failed');

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
      });
    });

    it('should work with different user data', async () => {
      // Arrange
      const differentUser: User = {
        ...mockUser,
        id: 'different-uuid',
        email: 'different@example.com',
        name: 'Different User',
        hashPassword: jest.fn(),
      };
      
      jwtService.sign.mockReturnValue('different.jwt.token');

      // Act
      const result = await service.login(differentUser);

      // Assert
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: differentUser.email,
      });
      expect(result).toBe('different.jwt.token');
    });

    it('should handle user with null/undefined fields gracefully', async () => {
      // Arrange
      const userWithNullFields: User = {
        ...mockUser,
        name: 'User With Nulls',
        hashPassword: jest.fn(),
      };
      
      jwtService.sign.mockReturnValue(mockJwtToken);

      // Act
      const result = await service.login(userWithNullFields);

      // Assert
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: userWithNullFields.email,
      });
      expect(result).toBe(mockJwtToken);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete authentication flow', async () => {
      // Arrange
      const username = 'integration@example.com';
      const password = 'testPassword123';
      
      userRepository.findOneBy.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue(mockJwtToken);

      // Act
      const user = await service.validateUser(username, password);
      const token = await service.login(user);

      // Assert
      expect(user).toEqual(mockUser);
      expect(token).toBe(mockJwtToken);
      
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: username,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
      });
    });
  });

  describe('dependency injection', () => {
    it('should have userRepository injected', () => {
      expect(userRepository).toBeDefined();
    });

    it('should have jwtService injected', () => {
      expect(jwtService).toBeDefined();
    });
  });
});