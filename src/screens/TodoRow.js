export default function TodoRow({todo}) {
     const{todo:name,id} = todo || {};
    return (
        <view style={{padding:10, marginVertical:5, backgroundColor:"grey", borderRadius:5}}>
          <Text style={{color:"white", fontWeight:"bold"}} >
              {id}
          </Text>
          <Text style={{color:"white"}} >
              {name}
          </Text>
        </view>
    )
}