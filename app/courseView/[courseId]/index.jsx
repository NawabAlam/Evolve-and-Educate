import { FlatList, View } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import Intro from "../../../components/CourseNew/Intro";
import Colors from "../../../constant/Colors";
import Chapters from "../../../components/CourseNew/Chapters";
import { getDoc, doc } from "firebase/firestore";
import {db} from './../../../config/firebaseConfig'
import { useState } from "react";

export default function CourseView() {
  const { courseParams, courseId, enroll} = useLocalSearchParams();
  const [course, setCourse] = useState([]);
 // const course = JSON.parse(courseParams);
 // console.log(courseParams)

 useEffect(()=>{
    if (!courseParams) {
      GetCourseById();
    }
     else{
      setCourse(JSON.parse(courseParams)); 
     }

  },[courseId])

  const GetCourseById=async()=>{
     const docRef=await getDoc(doc(db,'Courses',courseId));
     const courseData=docRef.data();
     setCourse(courseData)
  }

  return course&&(
    <FlatList
      data={[]}
      ListHeaderComponent={
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.WHITE,
          }}
        >
          <Intro course={course} enroll={enroll}/>
          <Chapters course={course} />
        </View>
      }
    />
  );
}
