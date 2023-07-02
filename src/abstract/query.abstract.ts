import { Query as TypeQuery } from "@nestjs-architects/typed-cqrs";
import {
  CqrsQueryConstructorParams,
  RecordQueryOptions,
  RecordResponseProps
} from "../types";

/**
 * ==================================================================================================================================
 * CQRS QUERY
 * ==================================================================================================================================
 */
/**
 * -----------------------------
 * Abstract CQRS Query
 * -----------------------------
 * @param Entity main entity query interact with
 * @param Input custom input for the query, default to `Query<Entity>` (Note: you can pass false to eliminate this field)
 * @param Options custom query options, default to `RecordQueryOptions`
 * @param Response custom query response, default to `Entity`
 *
 * @example
```
// simple usage
export class FindOneXxxQuery extends AbstractCqrsQueryInput<XxxxEntity> {}

// custom query
export class FindOneXxxQuery extends AbstractCqrsQueryInput<XxxxEntity, { someParams: boolean }> {}
```
 */
export abstract class AbstractCqrsQueryInput<
  Entity,
  Input = undefined,
  Options = RecordQueryOptions,
  Response = undefined
> extends TypeQuery<
  RecordResponseProps<Response extends undefined ? Entity : Response>
> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(
    readonly args: CqrsQueryConstructorParams<Entity, Input, Options>
  ) {
    super();
  }
}

export default AbstractCqrsQueryInput;
