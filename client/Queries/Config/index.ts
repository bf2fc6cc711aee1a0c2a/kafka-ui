import gql from 'graphql-tag';

export const GET_CONFIG = gql`
  query {
    client {
      about {
        version
      }
    }
    featureFlags {
      client {
        Home {
          showVersion
        }
        Pages {
          PlaceholderHome
        }
      }
    }
  }
`;
