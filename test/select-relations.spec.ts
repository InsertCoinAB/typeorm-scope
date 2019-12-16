import { Connection } from "typeorm"
import { patchSelectQueryBuilder } from "../src"
import { Company } from "./entities/company"
import { User } from "./entities/user"
import { closeTestingConnections, createTestingConnections } from "./util/test-utils"

describe("query with select relations", () => {
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

	it("adds the global scope to subquierie", () =>
		Promise.all(
			connections.map(async (connection) => {
				const company = new Company()
				company.name = "Pumba"
				await connection.manager.save(company)
				const user = new User()
				user.name = "Pat"
				user.deletedAt = new Date()
				user.company = company
				const user2 = new User()
				user2.name = "Jhon"
				user2.deletedAt = undefined
				user2.company = company
				await connection.manager.save([user, user2])

				const companyWithUsers = await connection.manager.getRepository(Company).findOne({ relations: ["users"] })
				expect(companyWithUsers?.users?.length).toEqual(1)

				const companyWithUsers2 = await Company.findOne({ relations: ["users"] })
				expect(companyWithUsers2?.users?.length).toEqual(1)

				const companyWithUsers3 = await Company.createQueryBuilder("company")
					.addSelect(`"user".*`)
					.innerJoin(User.getRepository().metadata.tableName, "user", `"company"."id" = "user"."companyId"`)
					.getRawMany()
				expect(companyWithUsers3.length).toEqual(1)
			}),
		))
})
