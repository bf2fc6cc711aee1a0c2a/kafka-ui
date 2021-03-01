import gql from 'graphql-tag';

export const GET_TOPICS = gql`
  query Topics($filter: String) {
    topicList(search: $filter) {
      items {
        name
        partitions {
          partition
          replicas {
            id
          }
        }
      }
    }
  }
`;

export const CREATE_TOPIC = gql`
  mutation CreateTopic($topic: NewTopic!) {
    createTopic(input: $topic) {
      name
      partitions {
        partition
      }
    }
  }
`;
