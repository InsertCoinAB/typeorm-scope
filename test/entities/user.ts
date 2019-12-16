import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Scope } from "../../src"
import { Company } from "./company"

@Scope<User>([(qb, alias) => qb.andWhere(`${alias}.deletedAt IS NULL`)])
@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@Column({ nullable: false, update: false })
	readonly companyId: string
	@ManyToOne(
		() => Company,
		(company) => company.users,
	)
	company: Company

	@Column({ nullable: true })
	deletedAt?: Date
}
