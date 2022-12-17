import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {AppBaseEntity} from "@common/database/entity/base.entity";

@Entity({
    name: 'environment_variables'
})
export class EnvironmentVariable extends AppBaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    deployment_id: number;

    @Column({type: 'text'})
    key: string;

    @Column({type: 'text', nullable: true})
    value: string

}