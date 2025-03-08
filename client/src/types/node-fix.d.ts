// Fix for duplicate index signature errors in @types/node
declare namespace NodeJS {
  // Override the problematic interfaces with compatible versions
  interface Dict<T> {
    // Single index signature
    [key: string]: T | undefined;
  }

  interface ReadOnlyDict<T> {
    // Single index signature
    readonly [key: string]: T | undefined;
  }
} 