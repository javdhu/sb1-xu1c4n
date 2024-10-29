export interface Factor {
  variables: string[];
  distribution: 'categorical' | 'categorical_conditional';
  values: number | number[] | number[][] | number[][][];
  role?: 'transition' | 'preference' | 'likelihood' | null;
}

export interface VFGData {
  version: string;
  factors: Factor[];
  variables: Record<string, string[]>;
}

export interface InferenceRequest {
  variable_id: string;
  evidence: Record<string, string | number[]>;
  library: 'pgmpy';
}

export interface LearnRequest {
  observations_csv: string;
  library: 'pgmpy' | 'verses';
  algorithm?: 'maximum_likelihood_estimation' | 'bayesian_estimation' | 'expectation_maximization';
  normalize?: boolean;
  smoothing?: number | Record<string, number | any[]>;
}