export const LIST_ACTIONS_STATE_DEF = {
  apply: { disabled: true, hidden: false },
  cancel: { disabled: false, hidden: false },
  clear: { disabled: false, hidden: true },
  reset: { disabled: false, hidden: true },
};

export const LIST_ACTIONS_DEF = {
  apply: true,
  cancel: true,
  clear: true,
  reset: false,
};

export const SINGLE_LIST_LIST_ACTIONS_DEF = {
  apply: false,
  cancel: false,
  clear: false,
  reset: false,
};

export const MULTI_LIST_LIST_ACTIONS_DEF = {
  apply: false,
  cancel: false,
  clear: true,
  reset: false,
};
