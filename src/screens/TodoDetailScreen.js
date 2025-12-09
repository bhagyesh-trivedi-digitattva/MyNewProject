import React, { useEffect ,useState} from "react";
import { View, Text, ActivityIndicator,TouchableOpacity,TextInput, Button } from "react-native";
import { useRoute,useNavigation } from "@react-navigation/native";
import { useLazyGetTodoStatusQuery,useUpdateTodoStatusMutation } from "../slices/ApiSlice";

export default function TodoDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const{id}=route.params;

    console.log("TodoDetailScreen Rendered for ID:", id);

    const[trigger,{
        data,
        isLoading,
        error,
        isUninitialized   
    }] = useLazyGetTodoStatusQuery();

    const [updateTodoStatus, { isLoading: isUpdating }] = useUpdateTodoStatusMutation();

    const [editMode,setEditMode]=useState(false);
    const [todoText,setTodoText]=useState("");

    useEffect(()=>{
        trigger(id);
    },[id]);

    useEffect(()=>{
        if(data){
            setTodoText(data.todo);
        }
    },[data]);

    const handleSave=async()=>{
        try{
            console.log("💾 Saving updated todo:", todoText)
            await updateTodoStatus({id, todo: todoText}).unwrap();
            trigger(id);
            setEditMode(false);
        }catch(err){
            console.error(" Failed to update todo:", err);
            alert("Failed to update todo. See console for details.");
        }
    }

    if (isUninitialized || isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
                <Text>Loading todo status...</Text>
            </View>
        );
    }
    if (error || !data) {
        return <Text>Error loading todo...</Text>;
    }
    return (
        <View style={{ flex: 1, padding: 20  }}>
             <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                    padding: 10,
                    backgroundColor: "#ddd",
                    borderRadius: 8,
                    width: 100,
                    marginTop: 20,
                }}
            >
                <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>
                    ← Back
                </Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Todo Detail</Text>

            <Text style={{ fontSize: 20, fontWeight: "bold",color: "blue" }}>
                Todo ID: {data.id}
            </Text>
            {editMode ? (
                <>
                    <TextInput
                        value={todoText}
                        onChangeText={setTodoText}
                        style={{
                            borderColor: "gray",
                            borderWidth: 1,
                            padding: 10,
                            marginTop: 10,
                            fontSize: 16,
                            color: "blue",
                        }}
                    />
                   <Button title={isUpdating ? "Saving..." : "Save"} onPress={handleSave} disabled={isUpdating} />
                </>
            )  :(
                <>
            <Text style={{ fontSize: 16, marginTop: 10 ,color: "orange"}}>
                  Todo: {data.todo}
            </Text>
            <Text style={{ fontSize: 16, marginTop: 10 ,color: data.completed ? "green" : "red",}}>
                  Status: {data.completed ? "Completed" : "Pending"}
            </Text>
                <Button title="Edit Todo" onPress={()=>setEditMode(true)} />
            </>
            )}
        </View>
       );
}
