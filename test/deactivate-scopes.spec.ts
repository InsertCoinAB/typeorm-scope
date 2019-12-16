import { Connection, In } from "typeorm"
import { patchSelectQueryBuilder, unscoped } from "../src"
import { Company } from "./entities/company"
import { User } from "./entities/user"
import { getCompanies } from "./util/get-companies"
import { closeTestingConnections, createTestingConnections } from "./util/test-utils"

describe("deactivates global scope", () => {
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

	it("gets deactivated for one query call", () =>
		Promise.all(
			connections.map(async (connection) => {
				await connection.manager.save(getCompanies())
				let company = await connection.manager.find(unscoped(connection, Company), {
					where: { name: In(["Name", "Name 2"]) },
				})
				expect(company.length).toEqual(2)
				company = await connection.manager.find(Company)
				expect(company.length).toEqual(1)
			}),
		))
})
