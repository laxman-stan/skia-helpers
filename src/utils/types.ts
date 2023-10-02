export const isNum = (value: unknown): value is number =>
  typeof value === 'number';

export const isFn = (value: unknown): value is Function =>
  typeof value === 'function';

export const is = <T>(value: T): value is Exclude<T, null | undefined> =>
  value !== null && value !== undefined;

export type ArgsOf<T> = {
  [K in keyof T]: T[K] extends (...args: infer U) => any ? U : never;
};
