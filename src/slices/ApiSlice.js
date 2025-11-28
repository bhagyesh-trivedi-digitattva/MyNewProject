import { createApi } from "@reduxjs/toolkit/query/react";

const ApiSlice = createApi({
    endpoints:function(builder){
        return {
            getAllTodos: builder.query({
                queryFn: () => {
                    // url: "https://dummyjson.com/todos",
                    // method: "GET",
                    return {data: "Data from getAllTodos endpoint"}
                },
            }),
        };

    }
});
export default ApiSlice;
export const { useGetAllTodosQuery } = ApiSlice;