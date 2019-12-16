import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Scope } from "../../src"
import { User } from "./user"

@Scope<Company>([(qb, alias) => qb.andWhere(`${alias}.deletedAt IS NULL`)])
@Entity()
export class Company extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@OneToMany(
		() => User,
		(user) => user.company,
	)
	users?: User[]

	@Column({ nullable: true })
	deletedAt?: Date
}
