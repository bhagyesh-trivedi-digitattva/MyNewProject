import TodoRow from '../screen/TodoRow';
import { useGetAllTodosQuery } from '../slices/ApiSlice';
export default function TodoList({todos}) {
    const {data, error, isLoading} = useGetAllTodosQuery();
    console.log("API Data:", data);
    console.log("API Error:", error);
    console.log("API Loading State:", isLoading);
    return (
        <view>
            {todos.map((todo)=><TodoRow key={todo?.id} todo={todo} />)}
        </view>
    )}