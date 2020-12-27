import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false, unique: true })
  title: string;

  @Column({ nullable: false })
  size: string;

  @Column({ nullable: false })
  color: string;

  @Column('bigint', { nullable: false })
  price: number;

  @Column('text', { nullable: false })
  imageUrl: string;

  @Column('text', { nullable: true })
  description: string;

  @ManyToOne(
    type => User,
    user => user.products,
  )
  user: User;

  @ManyToOne(
    type => Category,
    category => category.products,
  )
  category: Category;
}
