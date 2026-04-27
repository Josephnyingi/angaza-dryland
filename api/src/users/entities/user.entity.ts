import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  HARVESTER = 'harvester',
  BUYER = 'buyer',
  ADMIN = 'admin',
}

export enum UserLanguage {
  EN = 'en',
  SW = 'sw',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.HARVESTER,
  })
  role: UserRole;

  @Column({ length: 100, nullable: true })
  county: string;

  @Column({
    type: 'enum',
    enum: UserLanguage,
    default: UserLanguage.EN,
  })
  language: UserLanguage;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Virtual setter — provide plaintext password, entity stores the hash
  set password(plaintext: string) {
    if (plaintext) {
      const salt = bcrypt.genSaltSync(10);
      this.passwordHash = bcrypt.hashSync(plaintext, salt);
    }
  }

  async validatePassword(plaintext: string): Promise<boolean> {
    return bcrypt.compare(plaintext, this.passwordHash);
  }
}
