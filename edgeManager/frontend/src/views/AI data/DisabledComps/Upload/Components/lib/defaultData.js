export const defaultCsvData = {
  columns: [
    [
      {
        index: 0,
        data_set: "field",
        data_type: "Char",
        value: "Column-1",
      },
      {
        index: 1,
        data_set: "field",
        data_type: "Char",
        value: "Column-2",
      },
      {
        index: 2,
        data_set: "field",
        data_type: "Char",
        value: "Column-3",
      },
      {
        index: 3,
        data_set: "field",
        data_type: "Char",
        value: "Column-4",
      },
      {
        index: 4,
        data_set: "field",
        data_type: "Char",
        value: "Column-5",
      },
    ],
  ],
  rows: [
    ["Sample-1.1", "Sample-1.2", "Sample-1.3", "Sample-1.4", "Sample-1.5"],
    ["Sample-2.1", "Sample-2.2", "Sample-2.3", "Sample-2.4", "Sample-2.5"],
    ["Sample-3.1", "Sample-3.2", "Sample-3.3", "Sample-3.4", "Sample-3.5"],
    ["Sample-4.1", "Sample-4.2", "Sample-4.3", "Sample-4.4", "Sample-4.5"],
    ["Sample-5.1", "Sample-5.2", "Sample-5.3", "Sample-5.4", "Sample-5.5"],
  ],
};
export const defaultMainDomain = [
  { value: "air", label: "air" },
  { value: "farm", label: "farm" },
  { value: "factory", label: "factory" },
  { value: "bio", label: "bio" },
  { value: "life", label: "life" },
  { value: "energy", label: "energy" },
  { value: "weather", label: "weather" },
  { value: "city", label: "city" },
  { value: "traffic", label: "traffic" },
  { value: "culture", label: "culture" },
  { value: "economy", label: "economy" },
];

export const sign = {
  char: [
    { value: "!=", label: "!=" },
    { value: "==", label: "==" },
  ],
  float: [
    { value: "!=", label: "!=" },
    { value: "==", label: "==" },
    { value: ">", label: ">" },
    { value: "<", label: "<" },
  ],
};

export const dataSet = [
  { label: "tag", value: "tag" },
  { label: "field", value: "field" },
];
export const dataType = [
  { label: "Float", value: "Float" },
  { label: "String", value: "String" },
];

export const basicFormInit = {
  domainInit: {
    main_domain: "",
    sub_domain: "",
    target_domain: "",
  },
  timeFormat: [
    {
      format: "%Y/%m/%d-%H:%M:%S",
      value: "",
      data_type: "String",
    },
  ],

  measurementInit: {
    type: "input",
    value: "",
  },
};
