// import { createApi } from "@reduxjs/toolkit/query/react";

// const ApiSlice = createApi({
//     endpoints:function(builder){
//         return {
//             getAllTodos: builder.query({
//                 queryFn: () => {
//                     // url: "https://dummyjson.com/todos",
//                     // method: "GET",
//                     return {data: "Data from getAllTodos endpoint"}
//                 },
//             }),
//         };

//     }
// });
// export default ApiSlice;
// export const { useGetAllTodosQuery } = ApiSlice;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ApiSlice = createApi({
    reducerPath: "api",
    refetchOnFocus: true,
    refetchOnReconnect: true,
    baseQuery: fetchBaseQuery({ baseUrl: "https://dummyjson.com" }),
    tagTypes: ["Todos","getAllTodosTag","TodoStatus"],
    prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    headers.set("key", "value");
    return headers;
    },
    endpoints: (builder) => ({
        getAllTodos: builder.query({
            headers: {
                Authorization: "bhagyesh",
            },
            keepUnusedDataFor:60,
            query: ({ limit = 10, skip = 0 } = {}) =>
            `/todos?limit=${limit}&skip=${skip}`,
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (currentCache, newItems) => {
                // currentCache.todos.push(...newItems.todos);
                if(!newItems?.todos) return;
                const seen = new Set(currentCache.todos.map(item => item.id));
                const fresh= newItems.todos.filter(item => !seen.has(item.id));
                currentCache.todos.push(...fresh);
            },
            forceRefetch({ currentArg, previousArg }) {
            return currentArg?.skip !== previousArg?.skip;
            },
            providesTags: ["getAllTodosTag"],
        }),
        getTodoStatus: builder.query({
            query: (id) => `/todos/${id}`,
            providesTags: (result, error, id) => [{ type: "TodoStatus", id }],
        }),
        addTodo: builder.mutation({
         query: (todoText) => ({
          url: "/todos/add",
          method: "POST",
           body: {
            todo: todoText,
            completed: false,
            userId: 1,
        },
        }),
        invalidatesTags: ["getAllTodosTag"],
        }),
        updateTodoStatus: builder.mutation({
        query: ({ id, ...patch }) => ({
        url: `/todos/${id}`,
        method: "PUT",
        body: patch,
        }),
        invalidatesTags: (result, error, { id }) => [
        { type: "TodoStatus", id }, // 🔥 REFRESH ONLY THIS TODO
        ],
        }),
    }),
});

export const { useGetAllTodosQuery,useLazyGetTodoStatusQuery,useAddTodoMutation ,usePrefetch,useUpdateTodoStatusMutation} = ApiSlice;
export default ApiSlice;
