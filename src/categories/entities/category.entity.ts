import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false, unique: true })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @ManyToOne(
    type => User,
    user => user.categories,
  )
  user: User;

  @OneToMany(
    type => Product,
    product => product.category,
    { cascade: true },
  )
  products: Product[];
}
