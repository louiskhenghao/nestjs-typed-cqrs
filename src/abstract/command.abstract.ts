import { Command as TypedCommand } from "@nestjs-architects/typed-cqrs";
import {
  CqrsCommandConstructorParams,
  RecordMutateOptions,
  RecordResponseProps
} from "../types";

/**
 * ==================================================================================================================================
 * CQRS COMMAND
 * ==================================================================================================================================
 */
/**
 * -----------------------------
 * Abstract CQRS Command
 * -----------------------------
 * @param Entity main entity command interact with
 * @param Input the input for the command
 * @param Filter custom filter options, default to `undefined` (which has no filter query)
 * @param Options custom command options, default to `RecordMutateOptions`
 * @param Response custom command response, default to `Entity`
 *
 * @example
```
// simple usage
type SampleInput = { firstName: string; lastName: string; }
export class UpdateXxxCommand extends AbstractCqrsCommandInput<
  XxxxEntity,
  SampleInput
> {}

export class UpdateXxxCommand extends AbstractCqrsCommandInput<
  XxxxEntity,
  number, // the input is a number
  false // doesn't wants to have filter
> {}
```
 */
export abstract class AbstractCqrsCommandInput<
  Entity,
  Input,
  Filter = undefined,
  Options = RecordMutateOptions,
  Response = undefined
> extends TypedCommand<
  RecordResponseProps<Response extends undefined ? Entity : Response>
> {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    readonly args: CqrsCommandConstructorParams<Entity, Input, Filter, Options>
  ) {
    super();
  }
}

export default AbstractCqrsCommandInput;
