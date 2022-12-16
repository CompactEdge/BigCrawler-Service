import { createAction, handleActions } from "redux-actions";

const ONLOAD = "is_load/ONLOAD";
const OFFLOAD = "is_load/OFFLOAD";
const ONLOGIN = "is_login/ONLOGIN";
const OFFLOGIN = "is_login/OFFLOGIN";

export const onLoad = createAction(ONLOAD);
export const offLoad = createAction(OFFLOAD);
export const onLogin = createAction(ONLOGIN);
export const offLogin = createAction(OFFLOGIN);

const initialState = {
  is_load: false,
  is_login: false,
};

export default handleActions(
  {
    [ONLOAD]: () => ({ is_load: true }),
    [OFFLOAD]: () => ({ is_load: false }),
  },
  {
    [ONLOGIN]: () => ({ is_login: true }),
    [OFFLOGIN]: () => ({ is_login: false }),
  },
  initialState
);
