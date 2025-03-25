import "./response-state.model.tsp";

model BaseResponse<T> {
  state: ResponseState;
  result?: T;
}
