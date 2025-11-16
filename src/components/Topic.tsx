// Import React library
import React from 'react';
// Import the Topic type definition from the types file
import { Topic as TopicType } from '../types';

// Define the Props type for this component
type Props = {
  topic: TopicType; // The topic object to display
  onDelete: (id: string) => void; // Callback function to handle topic deletion
  onUpdate: (id: string, newName: string) => void; // Callback function to handle topic updates
};

// Export the Topic component as a functional component
export const Topic: React.FC<Props> = ({ topic, onDelete, onUpdate }) => {
  // State to track whether the topic is in edit mode (true) or view mode (false)
  const [isEditing, setIsEditing] = React.useState(false);
  // State to store the current name value when editing (initialized with topic's name)
  const [name, setName] = React.useState(topic.name);

  // Handler function to delete this topic
  const handleDelete = () => {
    // Call the parent's onDelete callback with this topic's ID
    onDelete(topic.id);
  };

  // Handler function to save the updated topic name
  const handleUpdate = () => {
    // Call the parent's onUpdate callback with the topic ID and new name
    onUpdate(topic.id, name);
    // Exit edit mode after saving
    setIsEditing(false);
  };

  return (
    <li>
      {/* Conditional rendering: show input field if editing, otherwise show text */}
      {isEditing ? (
        // Edit mode: display text input with current name value
        <input
          type="text"
          value={name} // Controlled input bound to name state
          onChange={(e) => setName(e.target.value)} // Update name state when user types
        />
      ) : (
        // View mode: display topic name as text
        <span>{topic.name}</span>
      )}

      {/* Conditional rendering: show Save button if editing, otherwise show Edit button */}
      {isEditing ? (
        // Edit mode: show Save button to commit changes
        <button onClick={handleUpdate}>Save</button>
      ) : (
        // View mode: show Edit button to enter edit mode
        <button onClick={() => setIsEditing(true)}>Edit</button>
      )}

      {/* Delete button is always visible regardless of edit mode */}
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
};
