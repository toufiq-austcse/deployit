import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({
    name: 'deployment_types'
})
export class DeploymentType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar'
    })
    name: string;

    @Column({
        type: 'varchar'
    })
    status: string;

}