import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { URL } from "../App";
import Task from "./Task";
import TaskForm from "./TaskForm";
import loadingImg from "../assets/loader.gif";

// http://localhost:5000/api/tasks


const TaskList = () => {

  // states in the program

  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskID, setTaskID] = useState("");



  const [formData, setFormData] = useState({name: "",completed: false,}); // formdata intial state set
  const { name } = formData; // destructure formdata to name, as we need to use the name everywhere


  const handleInputChange = (e) => { // for setting the name input from user
    const { name, value } = e.target;//e.target have both name and value
    setFormData({ ...formData, [name]: value }); // only changing the name property
  };



  const getTasks = async () => { // get task from database
    setIsLoading(true); // when getting data setloading
    try {

      const { data } = await axios.get(`${URL}/api/tasks`);// not data to pass
      // instead of const responce, we have destructed the result of api to get const {data} from it , which contain all id of tasks
      setTasks(data); // add database data to Tasks
      setIsLoading(false);// when loading data done, setload

    } catch (error) {

      toast.error(error.message);
      setIsLoading(false);

    }
  };



  useEffect(() => {
    getTasks(); // when during intial render get the data once from server, 
  }, []);




  const createTask = async (e) => { // onSubmit input we call this function from component TaskForm.js

    e.preventDefault(); // this will cancel the onclick event , as the function started.

    if (name === "") { // if there is no name entered as input
      return toast.error("Input field cannot be empty"); // modern popup from react , instead of alert
    }

    try {

      await axios.post(`${URL}/api/tasks`, formData); //formData send to server url with post command
      toast.success("Task added successfully");
      setFormData({ ...formData, name: "" }); // reset the formData
      getTasks(); // we need to fetch the data once agin after we post something

    } catch (error) {

      toast.error(error.message);
      console.log(error);

    }

  };




  const deleteTask = async (id) => { // id will passed as prop
    try {

      await axios.delete(`${URL}/api/tasks/${id}`); 

      getTasks();// we need to fetch the data after any operation

    } catch (error) {
      toast.error(error.message);
    }
  };



  useEffect(() => { // check completed tasks

    const cTask = tasks.filter((task) => { // filter through task and return all completed tasks

      return task.completed === true;

    });
    // cTask - contain all completed tasks

    setCompletedTasks(cTask);

  }, [tasks]); // everytime [tasks] changes we need to update completedtasks




  const getSingleTask = async (task) => { // This is the edit button of task

    setFormData({ name: task.name, completed: false }); //this will display the task.name on input form
    setTaskID(task._id);// tsk id get collected for future update after edit
    setIsEditing(true); // set flag true editing

  };



  const updateTask = async (e) => {

    e.preventDefault();

    if (name === "") {
      return toast.error("Input field cannot be empty.");
    }

    try {

      await axios.put(`${URL}/api/tasks/${taskID}`, formData); // taskID updated with selected task, when the edit button is clicked.

      setFormData({ ...formData, name: "" }); // empty form input display
      setIsEditing(false);
      getTasks();// we need to fetch the data once agin after we post something

    } catch (error) {
      toast.error(error.message);
    }

  };


  const setToComplete = async (task) => { // ticking a task as completed

    const newFormData = {
      name: task.name,
      completed: true,
    }; // data we send to server to update it as completed

    try {

      await axios.put(`${URL}/api/tasks/${task._id}`, newFormData); // update completed tasks

      getTasks();// we need to fetch the data once agin after we post something

    } catch (error) {
      toast.error(error.message);
    }

  };




  return (
    <div>

      <h2>Task Manager</h2>

      <TaskForm
        name={name}
        handleInputChange={handleInputChange}
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}
      />
      
      
      {tasks.length > 0 && (

        <div className="--flex-between --pb">

          <p>
            <b>Total Tasks:</b> {tasks.length}
          </p>

          <p>
            <b>Completed Tasks:</b> {completedTasks.length}
          </p>

        </div>

      )}


      <hr />

      {isLoading && (// if loading data from database , show the image
        <div className="--flex-center">
          <img src={loadingImg} alt="Loading" />
        </div>
      )}


      { !isLoading && tasks.length === 0 ? (<p className="--py">No task added. Please add a task</p>) : (
        <>
             {tasks.map((task, index) => { // make a list of tasks, & in each task execute below jsx
            return (

              <Task
                key={task._id}
                task={task}
                index={index}
                deleteTask={deleteTask}
                getSingleTask={getSingleTask}
                setToComplete={setToComplete}
              />

            );

             })}
        </>
      )

      }


    </div>
  );


};


export default TaskList;
