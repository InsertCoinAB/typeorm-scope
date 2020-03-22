import { Connection } from "typeorm"
import { patchSelectQueryBuilder } from "../src"
import { Company } from "./entities/company"
import { User } from "./entities/user"
import { getCompanies } from "./util/get-companies"
import { closeTestingConnections, createTestingConnections } from "./util/test-utils"

describe("query using query builder", () => {
	patchSelectQueryBuilder()
	let connections: Connection[]
	beforeAll(
		async () =>
			(connections = await createTestingConnections({
				entities: [__dirname + "/entities/*{.js,.ts}"],
				schemaCreate: true,
				dropSchema: true,
			})),
	)

	afterAll(() => closeTestingConnections(connections))
	beforeEach(() => {
		return Promise.all(
			connections.map(async (connection) => {
				await connection.getRepository(User).query(`DELETE FROM "${User.getRepository().metadata.tableName}"`)
				await connection.getRepository(Company).query(`DELETE FROM "${Company.getRepository().metadata.tableName}"`)
			}),
		)
	})

	it("adds the global scope to query builder", () =>
		Promise.all(
			connections.map(async (connection) => {
				await connection.manager.save(getCompanies())
				const company = await connection.manager
					.createQueryBuilder()
					.select("company")
					.from(Company, "company")
					.where("company.name = :name", { name: "Pumba" })
					.getMany()
				expect(company.length).toEqual(1)
				expect(company[0].name).toEqual("Pumba")
			}),
		))

	it("adds the global scope to subquierie", () =>
		Promise.all(
			connections.map(async (connection) => {
				const company = new Company()
				company.name = "Pumba"
				const company2 = new Company()
				company2.name = "Pumba"
				await connection.manager.save([company, company2])
				const user1 = new User()
				user1.name = "Pat"
				user1.deletedAt = new Date()
				user1.company = company
				const user2 = new User()
				user2.name = "Jhon"
				user2.deletedAt = undefined
				user2.company = company2
				await connection.manager.save([user1, user2])
				const companyWithUsers = await connection.manager
					.createQueryBuilder()
					.select("company")
					.from(Company, "company")
					.where((qb) => {
						const subQuery = qb.subQuery().from(User, "user").select("user.companyId").getQuery()
						return "company.id IN " + subQuery
					})
					.getMany()
				expect(companyWithUsers.length).toEqual(1)
			}),
		))
})
