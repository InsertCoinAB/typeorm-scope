import { Company } from "../entities/company"

export function getCompanies() {
	const company0 = new Company()
	company0.name = "Name"
	company0.deletedAt = new Date()
	const company1 = new Company()
	company1.name = "Pumba"
	const company2 = new Company()
	company2.name = "Name 2"
	company2.deletedAt = new Date()
	return [company0, company1, company2]
}
