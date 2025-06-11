import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import bcrypt from 'bcrypt';

@Entity('users')
export class User {
    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
    
    @ApiProperty({ description: 'id', example: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'name', example: 'John Doe' })
    @Column({ unique: true })
    name: string;

    @ApiProperty({ description: 'email', example: 'JohnDoe@email.com' })
    @Column({ unique: true })
    email: string;

    @ApiProperty({ description: 'password', example: 'password' })
    @Exclude()
    @Column()
    password: string;

    @ApiProperty({ description: 'created_at', example: '2021-01-01T00:00:00.000Z' })
    @CreateDateColumn({ name: 'created_at' })
    @Exclude()
    createdAt: Date;

    @ApiProperty({ description: 'updated_at', example: '2021-01-01T00:00:00.000Z' })
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    @Exclude()
    updatedAt: Date;

    @ApiProperty({ description: 'deleted_at', example: '2021-01-01T00:00:00.000Z' })
    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
    @Exclude()
    deletedAt?: Date;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}