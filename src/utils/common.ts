export interface FederatedProps {
  onError: (errorCode: number, message: string) => void;
}

export enum KafkaActions {
  ViewTopics = "ViewTopics",
  CreateTopic = "CreateTopic",
  DetailsTopic = "DetailsTopic",
  UpdateTopic = "UpdateTopic"
}