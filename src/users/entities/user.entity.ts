import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Exclusion,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsBase64, IsEmail, IsString } from 'class-validator';
import { Category } from '../../categories/entities/category.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @IsString()
  firstName: string;

  @Column({ nullable: false })
  @IsString()
  lastName: string;

  @Column({ unique: true, nullable: false })
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @Column({ nullable: false })
  @IsString()
  country: string;

  @Column({ nullable: false })
  @IsString()
  state: string;

  @Column('text', { nullable: true })
  @IsBase64()
  imageUrl: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: 'user' })
  role: string;

  @OneToMany(
    type => Category,
    category => category.user,
    { cascade: true, eager: true },
  )
  categories: Category[];

  @OneToMany(
    type => Product,
    product => product.user,
    { cascade: true, eager: true },
  )
  products: Product[];
}
