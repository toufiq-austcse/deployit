import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AppBaseEntity } from '@common/database/entity/base.entity';

@Entity({
  name: 'users'
})
export class User extends AppBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: true
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true
  })
  email: string;

  @Column({
    type: 'varchar'
  })
  password: string;
}