# TypeORM Scope

![](https://github.com/InsertCoinAB/typeorm-scope/workflows/Test/badge.svg) ![](https://codeclimate.com/github/InsertCoinAB/typeorm-scope/badges/coverage.svg) ![](https://codeclimate.com/github/InsertCoinAB/typeorm-scope/badges/gpa.svg) ![](https://img.shields.io/npm/v/typeorm-scope.svg)

A query scope decorator for [TypeORM](https://github.com/typeorm/typeorm) entities. It patches TypeORM's SelectQueryBuilder so that it includes the scopes you define. This package was created to enable a simpler way of implementing a SoftDelete before an official solusion is implemented.

## Installation

```shell
yarn add typeorm-scope
# or
npm install typeorm-scope --save
```

## Usage

### Initialization

Before usage you need to patch TypeORM before calling any database method.

```typescript
import { patchSelectQueryBuilder } from 'typeorm-scope'
...
patchSelectQueryBuilder()
...
const app = new Koa()
```

### Scopes

To define a scope for an entity you need to add the `@Scope([...scopes])` decorator before the `@Entity()`. You can pass an array of query scopes to execute.

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { Scope } from "typeorm-scope"

@Scope<User>([(qb, alias) => qb.andWhere(`${alias}.deletedAt IS NULL`)])
@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@Column()
	deletedAt?: Date
}
```

### Querying

There shouldn't be any changes in your services or repositories. You can use the `EntityManager` or any `Repository` or `CustomRepository` and the scopes will automatically be added to the resulting query. It will also work with queries created using the `QueryBuilder`. For example, the following snippet

```typescript
getManager().find(User, { where: { name: Equal("OnePunchMan") } })
```

will produce an SQL query like

```sql
SELECT "User"."id" AS "User_id", "User"."name" AS "User_name" FROM "user" "User" WHERE "User"."name" = ? AND "User"."deletedAt" IS NULL
-- PARAMETERS: ["OnePunchMan"]
```

### Disabling scopes

You are able to disable scopes by calling a helper function `unscoped`.

```typescript
import { unscoped } from "typeorm-scope"

getManager().find(unscoped(connection, User), { where: { name: Equal("OnePunchMan") } })
```
