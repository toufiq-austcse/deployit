import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AppBaseEntity } from '@common/database/entity/base.entity';
import { DeploymentType } from './deployment-type.entity';

@Entity({
  name: 'deployments'
})
export class Deployment extends AppBaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true
  })
  short_id: string;

  @Column({
    type: 'varchar'
  })
  deployment_type_id: number;

  @ManyToOne(() => DeploymentType)
  @JoinColumn({ name: 'deployment_type_id' })
  deployment_type: DeploymentType;

  @Column({
    type: 'varchar'
  })
  name: string;

  @Column({
    type: 'varchar'
  })
  sub_domain_name: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  mapped_port: string;

  @Column({
    type: 'varchar'
  })
  status: string;

  @Column({
    nullable: true
  })
  last_deployed_at: Date;

  @Column({
    nullable: true
  })
  repository_full_name: string;

  @Column({
    type: 'text'
  })
  repository_link: string;

  @Column({
    type: 'varchar'
  })
  branch_name: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  root_dir: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  docker_img_tag: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  container_id: string;

  @Column()
  user_id: number;

}