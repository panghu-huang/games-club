export enum Time {
  Second = 1000,
  Minute = Second * 60,
  Hour = Minute * 60,
  Day = Hour * 24,
}

export * from './models'
export * from './blockchain'