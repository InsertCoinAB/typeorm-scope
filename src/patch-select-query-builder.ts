import { ObjectLiteral, SelectQueryBuilder } from "typeorm"
import { ScopedTableMetadata } from "./table-metadata"

const GET_QUERY_COPY = "___scope_getQuery_copy___"

class SelectQB<Entity extends ObjectLiteral> extends SelectQueryBuilder<Entity> {
	getQuery(): string {
		this.___patchScopes___()
		return this[GET_QUERY_COPY]()
	}

	protected ___patchScopes___(): void {
		this.expressionMap.aliases.forEach((table) => {
			if (!table || !table.hasMetadata) return
			const metadata = table.metadata.tableMetadataArgs as ScopedTableMetadata<Entity>
			if (metadata.scopes && metadata.scopesEnabled) {
				metadata.scopes.forEach((scope) => scope(this, table.name))
			} else if (metadata.scopesEnabled === false) {
				metadata.scopesEnabled = true
			}
		})
	}
}

export const patchSelectQueryBuilder = () => {
	SelectQueryBuilder.prototype[GET_QUERY_COPY] = SelectQueryBuilder.prototype.getQuery
	Object.getOwnPropertyNames(SelectQB.prototype).forEach((property) => {
		Object.defineProperty(SelectQueryBuilder.prototype, property, Object.getOwnPropertyDescriptor(SelectQB.prototype, property) as PropertyDescriptor)
	})
}
