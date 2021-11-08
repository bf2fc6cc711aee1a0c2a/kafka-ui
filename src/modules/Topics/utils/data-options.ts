type SelectOptions = {
  key: string;
  value: string;
  isPlaceholder?: boolean;
  isDisabled?: boolean;
};

const retentionTimeSelectOptions: SelectOptions[] = [
  { key: 'days', value: 'days', isPlaceholder: true },
  { key: 'hours', value: 'hours' },
  { key: 'minutes', value: 'minutes' },
  { key: 'seconds', value: 'seconds' },
  { key: 'milliseconds', value: 'milliseconds' },
];

const retentionSizeSelectOptions: SelectOptions[] = [
  { key: 'bytes', value: 'bytes', isPlaceholder: true },
  { key: 'kibibytes', value: 'kibibytes' },
  { key: 'mebibytes', value: 'mebibytes' },
  { key: 'gibibytes', value: 'gibibytes' },
  { key: 'tebibytes', value: 'tebibytes' },
];

export {
  SelectOptions,
  retentionTimeSelectOptions,
  retentionSizeSelectOptions,
};
