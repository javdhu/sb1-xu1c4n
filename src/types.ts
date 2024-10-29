export interface Factor {
  distribution: string;
  values: number[] | number[][] | number[][][];
  variables: string[];
  role?: 'transition' | 'preference' | 'likelihood' | null;
}

export interface VFGData {
  version: string;
  factors: Factor[];
  variables: Record<string, string[]>;
}

export interface NodeData {
  label: string;
  type: 'variable' | 'factor';
  values?: string[];
  distribution?: string;
  factorValues?: number[] | number[][] | number[][][];
}

export interface InferenceRequest {
  variable_id: string;
  evidence: Record<string, string>;
  library: 'pgmpy';
}

export interface InferenceResponse {
  success: boolean;
  error?: string;
  result?: {
    probabilities: Record<string, number>;
    evidence?: Record<string, string>;
  };
}

export interface LearnRequest {
  observations_csv: string;
  library: 'pgmpy' | 'verses';
  algorithm?: 'maximum_likelihood_estimation' | 'bayesian_estimation' | 'expectation_maximization';
  normalize?: boolean;
  smoothing?: number | Record<string, number | any[]>;
}

export interface LearnResponse {
  success: boolean;
  error?: string;
  result?: {
    updated_model: VFGData;
  };
}