import { Query } from "@ptc-org/nestjs-query-core";
import {
  Query as TypeQuery,
  Command as TypedCommand,
  QueryResult as TypedQueryResult,
  CommandResult as TypedCommandResult,
  IEvent
} from "@nestjs-architects/typed-cqrs";

/**
 * -----------------------------
 * RECORD QUERY
 * -----------------------------
 */
// Query with options
export type RecordQueryOptions = {
  // indicate whether should allow null for return result
  nullable?: boolean;
  // whether should silence error
  silence?: boolean;
  // whether should join relation
  relation?: boolean;
};

// Query with more advance join relation options
export type RecordQueryWithJoinOptions<
  Joins = any,
  Reference = Record<string, any>
> = RecordQueryOptions & {
  // join relation with options
  joins?: Joins;
  // reference for relation join, eg: { id: 'xxx' }
  relationRef?: Reference;
};

// Options for CQRS command
export type RecordMutateOptions = {
  // whether should silence error
  silence?: boolean;
};

// Standard response structure from CQRS
export type RecordResponseProps<Response = any> = {
  success: boolean;
  data?: Response;
  message?: string;
};

/**
 * -----------------------------
 * CQRS Params utility type
 * -----------------------------
 */
// Utility type to construct constructor params for query
export type CqrsQueryConstructorParams<
  Entity,
  Input,
  Options = RecordQueryOptions
> = Input extends undefined
  ? { query: Query<Entity>; options?: Options }
  : Input extends false
  ? { options?: Options }
  : { query: Input; options?: Options };

// Utility type to construct constructor params for command
export type CqrsCommandConstructorParams<
  Entity,
  Input,
  Filter = undefined,
  Options = RecordMutateOptions
> = Filter extends undefined | false
  ? { input: Input; options?: Options }
  : {
      query: Filter extends true ? Query<Entity> : Filter;
      input: Input;
      options?: Options;
    };

/**
 * -----------------------------
 * Utility type for function consuming CQRS params
 * -----------------------------
 */
export type CqrsQueryFunc<CQRS extends TypeQuery<unknown>, Args> = (
  args: Args
) => Promise<TypedQueryResult<CQRS>>;

export type CqrsCommandFunc<CQRS extends TypedCommand<unknown>, Args> = (
  args: Args
) => Promise<TypedCommandResult<CQRS>>;

export type CqrsEventFunc<CQRS extends IEvent, Args> = (args: Args) => void;
