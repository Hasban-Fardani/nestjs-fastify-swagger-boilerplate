import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

// Kita bisa membuat sebuah mock object untuk repository dan entity manager.
// Ini adalah praktik yang umum untuk mengisolasi service dari database layer.
const mockUserRepository = {
  // Tambahkan mock function lain jika ada metode repository lain yang digunakan
};

const mockEntityManager = {
  save: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository, // Menyediakan mock repository
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager, // Menyediakan mock entity manager
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  // Reset semua mock setelah setiap test untuk memastikan tidak ada state yang bocor antar test.
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new user successfully', async () => {
      // Arrange
      const createUserDto = CreateUserDto.example();
      
      const expectedUser = new User({
        ...createUserDto,
        id: 'a-uuid-string', // Simulasi ID yang digenerate oleh database
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Konfigurasi mock `entityManager.save` untuk mengembalikan `expectedUser`
      // saat dipanggil. Kita menggunakan `mockResolvedValue` karena method ini async.
      jest.spyOn(entityManager, 'save').mockResolvedValue(expectedUser);

      // Act
      const result = await service.create(createUserDto);

      // Assert
      // 1. Pastikan entityManager.save dipanggil sekali
      expect(entityManager.save).toHaveBeenCalledTimes(1);

      // 2. Pastikan entityManager.save dipanggil dengan argumen yang benar
      //    Yaitu sebuah instance dari User yang propertinya cocok dengan DTO.
      expect(entityManager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: createUserDto.name,
          email: createUserDto.email,
          password: createUserDto.password,
        }),
      );
      // Pastikan argumennya adalah instance dari class User, bukan plain object.
      expect(entityManager.save).toHaveBeenCalledWith(expect.any(User));

      // 3. Pastikan hasil yang dikembalikan oleh service adalah user yang telah disimpan
      expect(result).toEqual(expectedUser);
    });

    it('should throw an error if entity manager fails to save', async () => {
      // Arrange
      const createUserDto = CreateUserDto.example();
      const dbError = new Error('Database constraint violation');

      // Konfigurasi mock `entityManager.save` untuk melempar error.
      // Kita menggunakan `mockRejectedValue` untuk promise yang gagal.
      jest.spyOn(entityManager, 'save').mockRejectedValue(dbError);

      // Act & Assert
      // Kita harapkan pemanggilan service.create akan menghasilkan sebuah promise yang ditolak (rejected)
      // dan error yang dilempar adalah `dbError`.
      await expect(service.create(createUserDto)).rejects.toThrow(dbError);

      // Verifikasi bahwa entityManager.save tetap dipanggil
      expect(entityManager.save).toHaveBeenCalledTimes(1);
    });
  });

});