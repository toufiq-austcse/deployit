import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {AppBaseEntity} from "@common/database/entity/base.entity";

@Entity({
    name: 'deployments'
})
export class Deployment extends AppBaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar'
    })
    deployment_type_id: number;

    @Column({
        type: 'varchar'
    })
    name: string;

    @Column({
        type: 'varchar'
    })
    sub_domain_name: string;

    @Column({
        type: 'varchar'
    })
    status: string;

    @Column({
        nullable: true
    })
    last_deployed_at: Date;

    @Column({
        type: 'text'
    })
    repository_link: string;

    @Column({
        type: 'varchar'
    })
    branch_name: string

    @Column({
        type: 'varchar'
    })
    server_dir_name: string;

    @Column({
        type: 'varchar'
    })
    root_dir: string;

    @Column({
        type: 'varchar'
    })
    docker_img_tag: string;

    @Column({
        type: 'varchar',
        nullable: true
    })
    container_id: string;

    @Column()
    user_id: number

}