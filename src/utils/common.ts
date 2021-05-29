export interface FederatedProps {
  onError: (errorCode: number, message: string) => void;
}

export const getParams = () => {
  const pathRegex = /^.*\/kafkas\/(?<id>[a-zA-Z0-9]+)(\/topics\/(?<topicName>[a-zA-Z0-9-_]+))?$/gm
  const matches = pathRegex.exec(window.location.pathname)
  if (matches === null || matches.groups === undefined) {
    throw new Error("matches is null or groups are undefined")
  }
  const { id, topicName } = matches.groups;
  if (id === undefined) {
    throw new Error("id cannot be null")
  }
  return { id, topicName };
}

export enum kafkaActions {
  TOPICS_VIEW = "topics-list",
  TOPIC_CREATE = "topic-create",
  TOPIC_DETAILS = "topic-details",
  TOPIC_UPDATE = "topic-update"
}