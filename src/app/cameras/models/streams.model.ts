export interface SingleStream {
  id: number;
  name: string;
}

export interface StreamsResponse {
// Only including the fields we need
  streams: SingleStream[];
}


