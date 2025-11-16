// Import React library and the useState hook for managing component state
import React, { useState } from 'react';
// Import v1 function from uuid library to generate unique IDs
import { v1 } from 'uuid';
// Import TypeScript types for Category and Topic from the types file
import { Category as CategoryType, Topic as TopicType } from '../types';
// Import the Topic component to display individual topics
import { Topic } from './Topic';

// Define the Props type for this component
// It expects a category object of type CategoryType
type Props = {
  category: CategoryType;
};

// Export the Category component as a functional component that receives category as a prop
export const Category: React.FC<Props> = ({ category }) => {
  // State for storing the list of topics, initialized with topics from the category prop
  const [topics, setTopics] = useState<TopicType[]>(category.topics);
  // State for storing the input value when creating a new topic
  const [newTopicName, setNewTopicName] = useState('');
  // State for storing the filter text to search topics by name
  const [filter, setFilter] = useState('');

  // Handler function to create a new topic
  const handleCreateTopic = () => {
    // Check if the new topic name is not empty (after removing whitespace)
    if (newTopicName.trim() !== '') {
      // Create a new topic object with a unique ID and trimmed name
      const newTopic: TopicType = {
        id: v1(), // Generate a unique ID using uuid v1
        name: newTopicName.trim(), // Remove extra whitespace from the name
      };
      // Add the new topic to the beginning of the topics array
      setTopics([newTopic, ...topics]);
      // Clear the input field by resetting newTopicName to empty string
      setNewTopicName('');
    }
  };

  // Handler function to delete a topic by its ID
  const handleDeleteTopic = (id: string) => {
    // Filter out the topic with the matching ID from the topics array
    setTopics(topics.filter((topic) => topic.id !== id));
  };

  // Handler function to update a topic's name
  const handleUpdateTopic = (id: string, newName: string) => {
    // Map through topics array and update the topic with matching ID
    setTopics(
      topics.map((topic) => (topic.id === id ? { ...topic, name: newName } : topic))
    );
  };

  // Filter topics based on the filter text (case-insensitive search)
  const filteredTopics = topics.filter((topic) =>
    // Convert both topic name and filter to lowercase for case-insensitive comparison
    topic.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      {/* Display the category name as a heading */}
      <h2>{category.name}</h2>

      {/* Input section for adding new topics */}
      <div>
        {/* Text input for entering new topic name */}
        <input
          type="text"
          value={newTopicName} // Controlled input bound to newTopicName state
          onChange={(e) => setNewTopicName(e.target.value)} // Update state when user types
          placeholder="New topic name"
        />
        {/* Button to trigger topic creation */}
        <button onClick={handleCreateTopic}>Add Topic</button>
      </div>

      {/* Filter section for searching topics */}
      <div>
        {/* Text input for filtering topics by name */}
        <input
          type="text"
          value={filter} // Controlled input bound to filter state
          onChange={(e) => setFilter(e.target.value)} // Update filter state when user types
          placeholder="Filter by name"
        />
      </div>

      {/* Unordered list to display filtered topics */}
      <ul>
        {/* Map through filtered topics and render a Topic component for each */}
        {filteredTopics.map((topic) => (
          <Topic
            key={topic.id} // Unique key prop required by React for list items
            topic={topic} // Pass the topic object as a prop
            onDelete={handleDeleteTopic} // Pass delete handler function
            onUpdate={handleUpdateTopic} // Pass update handler function
          />
        ))}
      </ul>
    </div>
  );
};
