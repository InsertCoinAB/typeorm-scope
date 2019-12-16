import { Connection } from "typeorm"
import { patchSelectQueryBuilder } from "../src"
import { Company } from "./entities/company"
import { User } from "./entities/user"
import { getCompanies } from "./util/get-companies"
import { closeTestingConnections, createTestingConnections } from "./util/test-utils"

describe("query using manager", () => {
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
	beforeEach(() => {
		return Promise.all(
			connections.map(async (connection) => {
				await connection.getRepository(User).query(`DELETE FROM "${User.getRepository().metadata.tableName}"`)
				await connection.getRepository(Company).query(`DELETE FROM "${Company.getRepository().metadata.tableName}"`)
			}),
		)
	})

	afterAll(() => closeTestingConnections(connections))

	it("adds the global scope to find", () =>
		Promise.all(
			connections.map(async (connection) => {
				await connection.manager.save(getCompanies())
				const company = await connection.manager.find(Company)
				expect(company.length).toEqual(1)
				expect(company[0].name).toEqual("Pumba")
			}),
		))
})
