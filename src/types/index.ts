import {
  Block,
  Language,
  MemoryOptions,
  CPUOptions,
  TimeoutOptions,
  AutoScalingOptions,
} from 'types/proto/kkc_models_pb';
import { LanguageType } from 'types/service';

// This is a shorthand method for the enum
export type BlockType = Block.TypeMap[keyof Block.TypeMap];

export type KintoConfig = {
  languages: Partial<{ [lang in LanguageType]: Language.AsObject }>;
  memoryOptions?: MemoryOptions.AsObject;
  cpuOptions?: CPUOptions.AsObject;
  timeoutOptions?: TimeoutOptions.AsObject;
  autoScalingOptions?: AutoScalingOptions.AsObject;
  jobTimeoutOptions?: TimeoutOptions.AsObject;
};
