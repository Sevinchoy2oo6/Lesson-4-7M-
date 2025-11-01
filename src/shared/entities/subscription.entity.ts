import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
  Unique,
} from 'typeorm';
import { User } from '../../shared/entities/user.entity';
import { Publication } from '../../shared/entities/publication.entity';

@Entity('subscriptions')
@Unique(['subscriber', 'targetUser', 'publication'])
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //Kim obuna bo‘lyapti
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  subscriber: User;

  //Kimga obuna bo‘lyapti (foydalanuvchi)
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  targetUser: User;

  //Qaysi publication’ga obuna bo‘lyapti
  @ManyToOne(() => Publication, { onDelete: 'CASCADE', nullable: true })
  publication: Publication;

  //Obuna turi: USER yoki PUBLICATION
  @Column({ type: 'varchar', default: 'USER' })
  type: 'USER' | 'PUBLICATION';

  @CreateDateColumn()
  createdAt: Date;
}
