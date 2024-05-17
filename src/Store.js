// store.js
import { createStore } from "redux";
import reducer from "./components/StudentsPage/Reducer";

const store = createStore(reducer);

export default store;
