import { SelectQueryBuilder } from "typeorm"
import { TableMetadataArgs } from "typeorm/metadata-args/TableMetadataArgs"

export type ScopeQB<Entity> = (qb: SelectQueryBuilder<Entity>, alias: string) => SelectQueryBuilder<Entity>

export interface ScopedTableMetadata<Entity> extends TableMetadataArgs {
	scopes: Array<ScopeQB<Entity>>
	scopesEnabled: boolean
}
