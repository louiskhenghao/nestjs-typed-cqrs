/**
 * ==================================================================================================================================
 * CQRS EVENT
 * ==================================================================================================================================
 */
/**
 * -----------------------------
 * Abstract CQRS Event
 * -----------------------------
 * @param Input the input for the command
 *
 * @example
```
// simple usage
type SampleInput = { firstName: string; lastName: string; }
export class UpdateXxxEvent extends AbstractCqrsEventInput<
  SampleInput
> {}

export class UpdateXxxEvent extends AbstractCqrsEventInput<
  number
> {}
```
 */
export abstract class AbstractCqrsEventInput<Input> {
  constructor(readonly args: Input) {}
}

export default AbstractCqrsEventInput;
