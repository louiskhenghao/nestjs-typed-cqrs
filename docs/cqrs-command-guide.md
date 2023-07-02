# CQRS Command

Define command & command handler that interact with service for module.

## Table of contents

- [Options](#options)
- [Example](#example)
  - [Input](#input)
  - [Handler](#handler)
  - [Service](#service)

---

## Options

Generic Type explanation for `AbstractCqrsCommandInput<Entity, Input, Filter, Options, Response>` abstract class

| Option   | Type       | Description                                                                                |
| -------- | ---------- | ------------------------------------------------------------------------------------------ |
| Entity   | `Required` | main entity the command interact with                                                      |
| Input    | `Required` | the input for the command                                                                  |
| Filter   | `Optional` | custom filter options, default to `undefined`.                                             |
|          |            | **NOTE**: Passing `true` shows nestjs-query `filter`,`sorting`,`paging` options in `query` |
| Options  | `Optional` | custom command options, default to `RecordMutateOptions`                                   |
| Response | `Optional` | custom command response, default to `Entity`                                               |

> NOTE
>
> Passing `undefined` to `optional` generic type will fallback to predefined type

---

## Example

### Input

```ts
import { AbstractCqrsCommandInput } from "nestjs-typed-cqrs";

// for cqrs query input
// file path: src/modules/xxx/cqrs/xxx.cqrs.input.ts
export class CreateOneXxxCommand extends AbstractCqrsCommandInput<
  XxxEntity,
  CreateXxxInput // input for this command
> {}
```

---

### Handler

Query handler for defined query (eg: `src/modules/xxx/cqrs/xxx.cqrs.handler.ts`)

```ts
import { CommandHandler, IInferredCommandHandler } from "@nestjs/cqrs";
import { CommandResult } from "@nestjs-architects/typed-cqrs";
import { CreateOneXxxCommand } from "./xxx.cqrs.input";
import { XxxService } from "../xxx.service";

@CommandHandler(CreateOneXxxCommand)
export class CreateOneXxxCommandHandler
  implements IInferredCommandHandler<CreateOneXxxCommand> {
  constructor(readonly service: XxxService) {}
  async execute(
    command: CreateOneXxxCommand
  ): Promise<CommandResult<CreateOneXxxCommand>> {
    return this.service.createOne(command.args);
  }
}
```

---

### Service

Define module service (eg: `src/modules/xxx/xxx.service.ts`)

```ts
import { InjectQueryService, QueryService } from "@ptc-org/nestjs-query-core";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { BadRequestException, Injectable } from "@nestjs/common";
import { FilterQueryBuilder } from "@ptc-org/nestjs-query-typeorm/src/query";
import { CqrsCommandFunc } from "nestjs-typed-cqrs";
import { XxxEntity } from "./xxx.entity";
import { CreateOneXxxCommand } from "./cqrs/xxx.cqrs.input";

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
   * Create one record
   */
  createOne: CqrsCommandFunc<
    CreateOneXxxCommand,
    CreateOneXxxCommand["args"]
  > = async ({ input, options }) => {
    const silence = options?.silence ?? false;
    try {
      // create record
      const record = await this.repo.save(input);
      return {
        success: true,
        data: record
      };
    } catch (error) {
      if (!silence) throw new BadRequestException(error);
      throw new BadRequestException(error.message);
    }
  };
}
```
