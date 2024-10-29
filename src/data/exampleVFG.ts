export const exampleVFG = {
  "version": "0.2.0",
  "factors": [
    {
      "distribution": "categorical",
      "values": [0.5, 0.5],
      "variables": ["cloudy"]
    },
    {
      "distribution": "categorical_conditional",
      "values": [[0.8, 0.2], [0.2, 0.8]],
      "variables": ["rain", "cloudy"]
    },
    {
      "distribution": "categorical_conditional",
      "values": [[0.5, 0.5], [0.9, 0.1]],
      "variables": ["sprinkler", "cloudy"]
    },
    {
      "distribution": "categorical_conditional",
      "values": [[[1.0, 0.0], [0.1, 0.9]], [[0.1, 0.9], [0.01, 0.99]]],
      "variables": ["wet_grass", "sprinkler", "rain"]
    }
  ],
  "variables": {
    "cloudy": ["no", "yes"],
    "rain": ["no", "yes"],
    "sprinkler": ["off", "on"],
    "wet_grass": ["no", "yes"]
  }
} as const;