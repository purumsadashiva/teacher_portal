import {
    ADD_STUDENT,
    UPDATE_STUDENT,
    DELETE_STUDENT,
    DELETE_SELECTED_STUDENTS,
  } from "./Constants";
  
  export const addStudent = (student) => ({
    type: ADD_STUDENT,
    payload: student,
  });
  
  export const updateStudent = (index, student) => ({
    type: UPDATE_STUDENT,
    payload: { index, student },
  });
  
  export const deleteStudent = (index) => ({
    type: DELETE_STUDENT,
    payload: index,
  });
  
  export const deleteSelectedStudents = (indexes) => ({
    type: DELETE_SELECTED_STUDENTS,
    payload: indexes,
  });
  