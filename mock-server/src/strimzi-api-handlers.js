var topics = require('../_data_/topics.json');
var consumerGroups = require('../_data_/consumer-groups.json');

module.exports = {
  getConsumerGroupList: async (c, req, res) => {

    let consumerGroupList = consumerGroups;  
    let count = consumerGroups !== undefined ? consumerGroups.length : 0

    const filterConsumerGroups = (topicName) => {
      return consumerGroupList.filter(consumerGroup => {
        return consumerGroup.consumers.some(consumer => consumer.topic === topicName)
      });
    }

    if(consumerGroups && req?.query?.topic && req?.query?.topic?.trim() !== "") {
      consumerGroupList = filterConsumerGroups(req?.query?.topic);
      count = consumerGroupList.length;
    }

    return res.status(200).json({
      limit: parseInt(req.query.limit, 10) || 100,
      offset: 0,
      count,
      items: consumerGroupList
    })
  },
  getConsumerGroupById: async (c, req, res) => {
    const group = getConsumerGroup(c.request.params.consumerGroupId);
    if (!group) {
      return res.status(404).json({ err: 'not found' });
    }
    return res.status(200).json(group);
  },
  deleteConsumerGroupById: async (c, req, res) => {
    const id = c.request.params.consumerGroupId;

    const group = getConsumerGroup(id);
    if (!group) {
      return res.status(404).json({ err: 'not found' });
    }
    consumerGroups = consumerGroups.filter((t) => t.id !== id);

    return res.status(204).json({ message: 'deleted' });
  },
  resetConsumerGroupOffset: async (c, req, res) => {
    const id = c.request.params.consumerGroupId;

    const group = getConsumerGroup(id);
    if (!group) {
      return res.status(404).json({ err: 'not found' });
    }
    if (group.consumers && group.consumers.length) {
      for (let i = 0; i < group.consumers.length; i++) {
        group.consumers[i] = {
          ...group.consumers[i],
          offset: 0,
          lag: 0,
          logEndOffset: 0,
        };
      }
    }
    consumerGroups = consumerGroups.filter((t) => t.id !== id);
    consumerGroups.push(group);

    return res.status(200).json(group);
  },
  createTopic: async (c, req, res) => {
    const topicBody = c.request.body;

    if (!topicBody) {
      return res.status(400).json({ err: 'Bad request' });
    }

    let topic = getTopic(topicBody.name);

    if (topic) {
      return res.status(409).json({ err: 'topic exists' });
    }

    topic = {
      name: topicBody.name,
      config: topicBody.settings.config,
      partitions: createPartitions(
        topicBody.settings.numPartitions,
        topicBody.settings.replicationFactor
      ),
    };
    topics.push(topic);
    return res.status(200).json(topic);
  },

  getTopicsList: async (c, req, res) => {
    let count = topics ? topics.length : 0,
      topicList = topics;

    const filterTopics = () => {
      let regexp = new RegExp(`${req.query.filter.trim()}`);
      return topics.filter((topic) => regexp.test(topic.name));
    };

    if (topics && req.query.filter && req.query.filter.trim() !== '') {
      topicList = filterTopics();
      count = topicList.length;
    }

    return res.status(200).json({
      limit: parseInt(req.query.limit, 10) || 100,
      offset: 0,
      count,
      items: topicList,
    });
  },

  getTopic: async (c, req, res) => {
    const topic = getTopic(c.request.params.topicName);
    if (!topic) {
      return res.status(404).json({ err: 'not found' });
    }
    return res.status(200).json(topic);
  },

  deleteTopic: async (c, _, res) => {
    const topicName = c.request.params.topicName;

    const topic = getTopic(topicName);
    if (!topic) {
      return res.status(404).json({ err: 'not found' });
    }
    topics = topics.filter((t) => t.name !== topicName);

    return res.status(200).json({ message: 'deleted' });
  },

  updateTopic: async (c, _, res) => {
    const topicName = c.request.params.topicName;
    const topicBody = c.request.body;

    if (!topicBody) {
      return res.status(400).json({ err: 'Bad request' });
    }

    const topic = getTopic(topicName);
    if (topicBody.numPartitions) {
      topic.partitions = createPartitions(topicBody.numPartitions, 2);
    }

    if (topicBody.config) {
      topic.config = topicBody.config;
    }

    if (!topic) {
      return res.status(404).json({ err: 'not found' });
    }

    if (
      topicBody &&
      topic.settings &&
      topic.settings ** topic.settings.config
    ) {
      topic.config = topicBody.settings.config;
    }

    return res.status(200).json(topic);
  },

  // Handling auth
  notFound: async (c, req, res) => {
    debug(res);
    return res.status(404).json({ err: 'not found' });
  },
  unauthorizedHandler: async (c, req, res) => {
    return res.status(401).json({ err: 'unauthorized' });
  },
};

function getConsumerGroup(id) {
  return consumerGroups.find(c => c.id === id);
}

function getTopic(name) {
  const topic = topics.find((t) => t.name === name);

  return topic;
}

const createPartitions = (numberOfPartitions, numberOfReplicas) => {
  const partitions = [];
  for (let i = 0; i < numberOfPartitions; i++) {
    const id = i + 1;
    partitions.push(createPartition(id, numberOfReplicas));
  }

  return partitions;
};

const createPartition = (id, numberOfReplicas) => {
  const replicas = [];
  for (let i = 0; i < numberOfReplicas; i++) {
    replicas.push({ id: i + 1 });
  }
  return {
    id,
    leader: {
      id: 1,
    },
    replicas,
  };
};
