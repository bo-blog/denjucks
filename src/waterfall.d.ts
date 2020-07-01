// Type definitions for a-sync-waterfall
// Project: denjucks
// Definitions by: cj <[~A URL FOR YOU~]>

type WaterfallCallback = (err: any, ...results: any[]) => void;

type Task =
  | { (arg1: any, callback: WaterfallCallback): void }
  | { (arg1: any, arg2: any, callback: WaterfallCallback): void }
  | { (arg1: any, arg2: any, arg3: any, callback: WaterfallCallback): void }
  | { (...args: (any | WaterfallCallback)[]): void };

/**
 * Runs an array of functions in series, each passing their results to the next
 * in the array. However, if any of the functions pass an error to the callback,
 * the next function is not executed and the main callback is immediately called
 * with the error.
 *
 * @param tasks An array of functions to run, each function is passed a callback(err, result1, result2, ...) it must call on completion. The first argument is an error (which can be null) and any further arguments will be passed as arguments in order to the next task.
 * @param callback An optional callback to run once all the functions have completed. This will be passed the results of the last task's callback.
 * @param forceAsync An optional flag that force tasks run asynchronously even if they are sync.
 */
declare function waterfall(
  tasks: Task[],
  callback?: WaterfallCallback,
  forceAsync?: boolean
): void;
