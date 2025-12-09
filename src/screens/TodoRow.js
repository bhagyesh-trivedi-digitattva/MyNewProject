    import { Button, View, Text, Alert,TouchableOpacity } from "react-native";
    import { useLazyGetTodoStatusQuery } from "../slices/ApiSlice";
    import { useDeleteTodoMutation } from "../slices/deleteTodoSlice";
    import { useState } from "react";
    import { useNavigation } from "@react-navigation/native";
    import { addToCart } from "../slices/cartSlice";
    import { useDispatch } from "react-redux";

    export default function TodoRow({ todo }) {
        const { id, todo: name } = todo;
        const navigation = useNavigation();
        const dispatch = useDispatch();
        const [fetchStatus, { data, isFetching }] = useLazyGetTodoStatusQuery();
        const [showStatus, setShowStatus] = useState(false);

        const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();

        const handleAddToCart = () => {
            console.log("Adding todo to cart:", todo);
            dispatch(addToCart(todo));
        }

        const handleOpenDetail = () => {
            console.log("Opening detail of todo:", id);
            navigation.navigate("TodoDetail", { id });
        };

        const handleGetStatus = () => {
            setShowStatus(true);
            fetchStatus(id);
        };

        const handleDelete = () => {
            Alert.alert(
                "Delete Todo",
                `Are you sure you want to delete "${name}"?`,
                [
                    { text: "Cancel" },
                    {
                        text: "Delete",
                        style: "destructive",
                        onPress: async () => {
                            console.log("🗑️ Deleting todo:", id);
                            await deleteTodo(id);
                        },
                    },
                ]
            );
        };

        return (
            <TouchableOpacity onPress={handleOpenDetail}>
            <View
                style={{
                    padding: 10,
                    marginVertical: 5,
                    backgroundColor: "grey",
                    borderRadius: 5,
                }}
            >
                <Text style={{ color: "blue", fontWeight: "bold" }}>{id}</Text>
                <Text style={{ color: "orange" }}>{name}</Text>

                <Button title="GET STATUS" onPress={handleGetStatus} />

                {showStatus && (
                    <>
                        {isFetching && (
                            <Text style={{ color: "yellow", marginTop: 5 }}>
                                Fetching status...
                            </Text>
                        )}

                        {data && (
                            <Text
                                style={{
                                    color: data.completed ? "lightgreen" : "red",
                                    marginTop: 5,
                                }}
                            >
                                Status: {data.completed ? "Completed" : "Pending"}
                            </Text>
                        )}
                    </>
                )}

                <View style={{ marginTop: 10 }}>
                    <Button
                        title={isDeleting ? "Deleting..." : "DELETE"}
                        color="red"
                        onPress={handleDelete}
                    />
                </View>
                    <Button title="Add" onPress={handleAddToCart} />
            </View>
            </TouchableOpacity>
        );
    }
