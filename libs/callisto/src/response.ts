export interface ThreadIdResponse {
  type: "thread-id",
  data: string;
}

export interface TextResponse {
  type: "text";
  data: string;
}

export interface DataResponse {
  type: "data";
  data: any;
}

export interface StepCompletedResponse {
  type: "step-completed";
}

export interface StopResponse {
  type: "stop";
}

export type ContentResponse = TextResponse | DataResponse | StepCompletedResponse;

export type Response = ThreadIdResponse | ContentResponse | StopResponse;

