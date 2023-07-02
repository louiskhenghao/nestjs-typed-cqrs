# CQRS Query

Define query & query handler that interact with service for module.

## Table of contents

- [Options](#options)
- [Example](#example)
  - [Input](#input)
  - [Handler](#handler)
  - [Service](#service)

---

## Options

Generic Type explanation for `AbstractCqrsQueryInput<Entity, Input, Options, Response>` abstract class

| Options  | Type       | Description                                            |
| -------- | ---------- | ------------------------------------------------------ |
| Entity   | `Required` | main entity the query interact with                    |
| Input    | `Optional` | custom input for the query, default to `Query<Entity>` |
| Options  | `Optional` | custom query options, default to `RecordQueryOptions`  |
| Response | `Optional` | custom query response, default to `Entity`             |

> NOTE
>
> Passing `undefined` to `optional` generic type will fallback to predefined type

---

## Example

### Input

Define query at module (eg: `src/modules/xxx/cqrs/xxx.cqrs.input.ts`)

```ts
import { AbstractCqrsQueryInput } from "nestjs-typed-cqrs";

export class FindOneXxxQuery extends AbstractCqrsQueryInput<XxxsEntity> {}
```

---

### Handler

Query handler for defined query (eg: `src/modules/xxx/cqrs/xxx.cqrs.handler.ts`)

```ts
@QueryHandler(FindOneXxxQuery)
export class FindOneXxxQueryHandler
  implements IInferredQueryHandler<FindOneXxxQuery> {
  constructor(readonly service: XxxService) {}
  async execute(query: FindOneXxxQuery): Promise<QueryResult<FindOneXxxQuery>> {
    return this.service.findOne(query.args);
  }
}
```

---

### Service

Define module service (eg: `src/modules/xxx/xxx.service.ts`)

```ts
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectQueryService, QueryService } from "@ptc-org/nestjs-query-core";
import { FilterQueryBuilder } from "@ptc-org/nestjs-query-typeorm/src/query";
import { CqrsQueryFunc } from "nestjs-typed-cqrs";
import { XxxEntity } from "./xxx.entity";
import { FindOneXxxQuery } from "./cqrs/xxx.cqrs.input";

@Injectable()
export class XxxService {
  readonly filterQueryBuilder: FilterQueryBuilder<XxxEntity>;

  constructor(
    @InjectRepository(XxxEntity)
    readonly repo: Repository<XxxEntity>,
    @InjectQueryService(XxxEntity)
    readonly service: QueryService<XxxEntity>,
    readonly queryBus: QueryBus,
    readonly commandBus: CommandBus
  ) {
    this.filterQueryBuilder = new FilterQueryBuilder<XxxEntity>(this.repo);
  }

  /**
   * Find one record
   */
  findOne: CqrsQueryFunc<FindOneXxxQuery, FindOneXxxQuery["args"]> = async ({
    query,
    options
  }) => {
    const { meta, ...restFilter } = query;
    const nullable = options?.nullable ?? true;
    const silence = options?.silence ?? false;

    try {
      // query builder
      const builder = this.filterQueryBuilder.select({
        filter: restFilter
      });

      // actual query
      const result = await builder.getOne();

      // check record
      if (!nullable && !result) {
        throw new Error("Xxx record is not found!");
      }

      // result
      return { success: true, data: result };
    } catch (e) {
      if (!silence) throw new BadRequestException(e);
      return { success: false, message: e.message };
    }
  };
}
```
