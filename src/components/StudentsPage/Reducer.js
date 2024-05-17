import {
    ADD_STUDENT,
    UPDATE_STUDENT,
    DELETE_STUDENT,
    DELETE_SELECTED_STUDENTS,
  } from "./Constants";
  
  const initialState = {
    students: [
        {
            Name: "Lokesh",
            Email: "Lokesh@gmail.com",
            Subject: "Math",
            Marks: 95,
          },
          {
            Name: "Sada Shiva",
            Email: "sadashivapurum@gmail.com",
            Subject: "Science",
            Marks: 88,
          },
          {
            Name: "Venkatesh",
            Email: "venkat@gmail.com",
            Subject: "English",
            Marks: 92,
          },
    ],
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case ADD_STUDENT:
        return {
          ...state,
          students: [...state.students, action.payload],
        };
      case UPDATE_STUDENT:
        const { index, student } = action.payload;
        const updatedStudents = [...state.students];
        updatedStudents[index] = student;
        return {
          ...state,
          students: updatedStudents,
        };
      case DELETE_STUDENT:
        return {
          ...state,
          students: state.students.filter((_, i) => i !== action.payload),
        };
      case DELETE_SELECTED_STUDENTS:
        return {
          ...state,
          students: state.students.filter((_, i) => !action.payload.includes(i)),
        };
      default:
        return state;
    }
  };
  
  export default reducer;
  