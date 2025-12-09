import ApiSlice from "./ApiSlice";

export const deleteTodoApiSlice = ApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        deleteTodo: builder.mutation({
            query: (id) => ({
                url: `/todos/${id}`,
                method: "DELETE",
            }),

            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                // Optimistic update
                const patchResult = dispatch(
                    ApiSlice.util.updateQueryData(
                        "getAllTodos",
                        undefined,
                        (draft) => {
                            if (!draft?.todos) return;

                            console.log("Before delete:", draft.todos.length);

                            // mutate in place
                            draft.todos = draft.todos.filter(
                                (todo) => todo.id !== id
                            );

                            console.log("After delete:", draft.todos.length);
                        }
                    )
                );

                try {
                    await queryFulfilled;  // wait for server
                } catch (err) {
                    console.log("❌ Delete failed! Rolling back...");
                    patchResult.undo(); // rollback optimistic update
                }
            },

            invalidatesTags: ["getAllTodosTag"], 
        }),
    }),
    overrideExisting: false,
});

export const { useDeleteTodoMutation } = deleteTodoApiSlice;
