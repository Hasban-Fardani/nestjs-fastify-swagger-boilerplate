import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let userService: jest.Mocked<UserService>;

  // Mock data
  const mockUser: User = {
    id: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword123',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    hashPassword: jest.fn(),
  };

  const mockLoginDto: LoginDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  const mockCreateUserDto: CreateUserDto = {
    email: 'newuser@example.com',
    password: 'password123',
    name: 'New User',
  };

  const mockAccessToken = 'jwt.access.token';

  beforeEach(async () => {
    // Create mock services
    const mockAuthService = {
      validateUser: jest.fn(),
      login: jest.fn(),
    };

    const mockUserService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    userService = module.get(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      // Arrange
      authService.validateUser.mockResolvedValue(mockUser);
      authService.login.mockResolvedValue(mockAccessToken);

      // Act
      const result = await controller.login(mockLoginDto);

      // Assert
      expect(authService.validateUser).toHaveBeenCalledWith(
        mockLoginDto.email,
        mockLoginDto.password,
      );
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
      
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(authService.login).toHaveBeenCalledTimes(1);
      
      expect(result).toEqual({
        accessToken: mockAccessToken,
      });
    });

    it('should throw UnauthorizedException when validateUser fails', async () => {
      // Arrange
      authService.validateUser.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      // Act & Assert
      await expect(controller.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      
      expect(authService.validateUser).toHaveBeenCalledWith(
        mockLoginDto.email,
        mockLoginDto.password,
      );
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when login DTO is invalid', async () => {
      // Arrange
      const invalidLoginDto = { email: '', password: '' } as LoginDto;
      authService.validateUser.mockRejectedValue(
        new BadRequestException('Invalid input'),
      );

      // Act & Assert
      await expect(controller.login(invalidLoginDto)).rejects.toThrow(
        BadRequestException,
      );
      
      expect(authService.validateUser).toHaveBeenCalledWith('', '');
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should handle service errors gracefully', async () => {
      // Arrange
      authService.validateUser.mockResolvedValue(mockUser);
      authService.login.mockRejectedValue(new Error('Service error'));

      // Act & Assert
      await expect(controller.login(mockLoginDto)).rejects.toThrow(
        'Service error',
      );
      
      expect(authService.validateUser).toHaveBeenCalledWith(
        mockLoginDto.email,
        mockLoginDto.password,
      );
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      // Arrange
      const expectedResult: User = {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        email: mockCreateUserDto.email,
        name: mockCreateUserDto.name,
        password: 'hashedPassword123',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
        hashPassword: jest.fn(),
      };
      
      userService.create.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.register(mockCreateUserDto);

      // Assert
      expect(userService.create).toHaveBeenCalledWith(mockCreateUserDto);
      expect(userService.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should throw BadRequestException when user already exists', async () => {
      // Arrange
      userService.create.mockRejectedValue(
        new BadRequestException('User already exists'),
      );

      // Act & Assert
      await expect(controller.register(mockCreateUserDto)).rejects.toThrow(
        BadRequestException,
      );
      
      expect(userService.create).toHaveBeenCalledWith(mockCreateUserDto);
    });

    it('should throw BadRequestException when registration data is invalid', async () => {
      // Arrange
      const invalidCreateUserDto = {
        email: 'invalid-email',
        password: '123',
        name: '',
      } as CreateUserDto;
      
      userService.create.mockRejectedValue(
        new BadRequestException('Invalid registration data'),
      );

      // Act & Assert
      await expect(controller.register(invalidCreateUserDto)).rejects.toThrow(
        BadRequestException,
      );
      
      expect(userService.create).toHaveBeenCalledWith(invalidCreateUserDto);
    });

    it('should handle service errors during registration', async () => {
      // Arrange
      userService.create.mockRejectedValue(
        new Error('Database connection failed'),
      );

      // Act & Assert
      await expect(controller.register(mockCreateUserDto)).rejects.toThrow(
        'Database connection failed',
      );
      
      expect(userService.create).toHaveBeenCalledWith(mockCreateUserDto);
    });
  });

  describe('dependency injection', () => {
    it('should have authService injected', () => {
      expect(authService).toBeDefined();
    });

    it('should have userService injected', () => {
      expect(userService).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('should propagate errors from authService.validateUser', async () => {
      // Arrange
      const customError = new Error('Custom validation error');
      authService.validateUser.mockRejectedValue(customError);

      // Act & Assert
      await expect(controller.login(mockLoginDto)).rejects.toThrow(customError);
    });

    it('should propagate errors from authService.login', async () => {
      // Arrange
      authService.validateUser.mockResolvedValue(mockUser);
      const customError = new Error('Custom login error');
      authService.login.mockRejectedValue(customError);

      // Act & Assert
      await expect(controller.login(mockLoginDto)).rejects.toThrow(customError);
    });

    it('should propagate errors from userService.create', async () => {
      // Arrange
      const customError = new Error('Custom user creation error');
      userService.create.mockRejectedValue(customError);

      // Act & Assert
      await expect(controller.register(mockCreateUserDto)).rejects.toThrow(
        customError,
      );
    });
  });
});