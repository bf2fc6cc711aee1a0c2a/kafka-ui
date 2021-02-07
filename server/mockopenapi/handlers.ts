import {Request} from 'express'
import {Topic, TopicsList} from './data/topic.types'

let topics: Array<Topic> = [
  {
    name: 'ExampleTopic',
    config: [
      {
        key: 'min.insync.replicas',
        value: "1"
      },
      {
        key: 'max.message.bytes',
        value: "1050000"
      }
    ],
    partitions: [
      {
        id: 28,
        replicas: [
          {
            id: 35
          },
          {
            id: 5
          }
        ],
        isr: [
          {
            id: 44
          },
          {
            id: 83
          }
        ],
        leader: {
          id: 22
        }
      }
    ]
  }]

export const handlers = {
  getTopicsList: async (c, req, res) => {
    const topicList: TopicsList = {
      count:topics.length,
      limit: topics.length,
      offset:0,
      topics: topics
    }
    res.status(202).json(topicList);
  },

  deleteTopic: async (c, req: Request, res) =>{
      
      let newTopics: Topic[] = topics.filter((topic)=>{return topic.name !== req.params.topicName})
      if (topics.length === newTopics.length) {
        res.status(404).json({status: 404, err: "Topic not found."})
      } else {
        topics = newTopics;
        res.status(200).json({status: 200, msg: "Topic deleted successfully"})
      }
  },

  getTopic: async (c, req, res) => {
    let currentTopic = topics.find((topic)=>{return topic.name === req.params.topicName})
    if (currentTopic === undefined) {
      res.status(404).json({status: 404, err: "Topic not found."})
    } else {
      res.status(200).json(currentTopic);
    }
  },

  updateTopic: async (c, req:Request, res) => {
    let topicUpdated = false;
    topics.forEach((topic, index:number, topics: Topic[])=>{
      if (topic.name === req.params.topicName) {
        topics[index] = req.body
      } 
      })
    if (topicUpdated) {
      res.status(200).json({status: 200, msg: "Updated topic"});
    } else {
      res.status(404).json({status: 404, err: "Topic not found."});
    }
  },
  
  // Handling auth
  notFound: async (c, req, res) => res.status(404).json({status: 404, err: "not found" }),
  unauthorizedHandler: async (c, req, res) =>
    res.status(401).json({ err: "unauthorized" }),
};

export default handlers;