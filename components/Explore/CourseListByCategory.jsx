import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constant/Colors";

// Predefined 15 topics per category
const categoryTopics = {
  "Tech & Coding": [
    "Python Basics",
    "React Native",
    "JavaScript ES6",
    "Machine Learning",
    "Data Structures",
    "APIs",
    "Node.js",
    "CSS Flexbox",
    "Django",
    "Git & GitHub",
    "TypeScript",
    "Debugging",
    "SQL Fundamentals",
    "Cloud Computing",
    "Mobile App Development",
  ],
  "Business & Finance": [
    "Startup Basics",
    "Marketing 101",
    "Financial Analysis",
    "Stock Market",
    "Sales Strategies",
    "Budgeting",
    "Entrepreneurship",
    "Investment Basics",
    "Business Models",
    "Negotiation Skills",
    "Project Management",
    "Accounting Principles",
    "E-commerce",
    "Leadership",
    "Risk Management",
  ],
  "Health & Fitness": [
    "Yoga Basics",
    "Nutrition",
    "Meditation",
    "Cardio Workouts",
    "Strength Training",
    "Mental Health",
    "HIIT",
    "Healthy Eating",
    "Stress Management",
    "Flexibility Training",
    "Sleep Hygiene",
    "Bodybuilding",
    "Running Techniques",
    "Weight Loss",
    "Home Workouts",
  ],
  "Science & Engineering": [
    "Physics Fundamentals",
    "Chemistry Basics",
    "Electrical Circuits",
    "Mechanical Engineering",
    "Biology Intro",
    "Thermodynamics",
    "Robotics",
    "Astronomy",
    "Environmental Science",
    "Material Science",
    "Calculus",
    "Civil Engineering",
    "Quantum Mechanics",
    "Lab Safety",
    "Engineering Design",
  ],
  "Arts & Creativity": [
    "Sketching Basics",
    "Photography",
    "Digital Art",
    "Creative Writing",
    "Music Theory",
    "Graphic Design",
    "Painting Techniques",
    "Film Making",
    "Dance Fundamentals",
    "Sculpting",
    "Poetry",
    "Calligraphy",
    "Animation",
    "Art History",
    "Fashion Design",
  ],
};

export default function CourseListByCategory({ category }) {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState(null);

  const topics = categoryTopics[category] || [];

  const onSelectTopic = (topic) => {
    setSelectedTopic(topic);
    // ✅ Push to `/addCourse` with the topic as a route param
    router.push({
      pathname: "/addCourse",
      params: { topic },
    });
  };

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.categoryTitle}>{category}</Text>
      <View style={styles.topicsContainer}>
        {topics.map((topic, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.topicButton,
              selectedTopic === topic && styles.topicButtonSelected,
            ]}
            onPress={() => onSelectTopic(topic)}
          >
            <Text
              style={[
                styles.topicText,
                selectedTopic === topic && styles.topicTextSelected,
              ]}
            >
              {topic}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryTitle: {
    fontFamily: "manropebold",
    fontSize: 20,
    marginBottom: 10,
    color: Colors.BLACK,
  },
  topicsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  topicButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.LANDING,
    marginBottom: 8,
  },
  topicButtonSelected: {
    backgroundColor: Colors.LANDING,
  },
  topicText: {
    color: Colors.LANDING,
    fontFamily: "manrope",
    fontSize: 14,
  },
  topicTextSelected: {
    color: Colors.WHITE,
    fontFamily: "manropebold",
  },
});
